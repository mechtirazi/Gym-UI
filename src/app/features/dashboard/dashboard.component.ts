import { Component, OnInit, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { catchError, map, of, forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AdminOwnersService } from '../../core/services/admin-owners.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { AuthService } from '../../core/services/auth.service';
import { OwnerDashboardService } from '../owner/services/owner-dashboard.service';
import { AdminAnalyticsService, PlatformMetrics } from '../../core/services/admin-analytics.service';
import { NotificationDto, UserVm } from '../../core/models/api.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private ownersService = inject(AdminOwnersService);
  private notificationsService = inject(NotificationsService);
  private analyticsService = inject(AdminAnalyticsService);
  private dashboardService = inject(OwnerDashboardService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  loadingHealth = signal(true);
  isLoadingStats = signal<boolean>(true);
  stats = signal<any[]>([]);

  totalOwners = signal(0);
  verifiedOwners = signal(0);
  unverifiedOwners = signal(0);
  verifiedTrend = signal(0);

  notifications = signal<NotificationDto[]>([]);
  apiHealth = signal<'Reachable' | 'Unreachable' | 'Checking'>('Checking');
  healthDetail = signal('');

  // God View Platform Metrics
  loadingMetrics = signal(true);
  errorMetrics = signal<string | null>(null);
  mrr = signal(0);
  activeGyms = signal(0);
  activeMembers = signal(0);
  recentChurn = signal(0);

  owners = signal<UserVm[]>([]);
  broadcasting = signal(false);
  sendingTargeted = signal(false);

  broadcastForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  targetedForm = this.fb.group({
    ownerId: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor() {
    afterNextRender(() => {
      this.refreshData();
      this.checkHealth();
    });
  }

  ngOnInit() {
    this.loadPlatformMetrics();
    // Also fetch context-aware stats if user is not super_admin
    if (this.authService.userRole() !== 'super_admin') {
      this.fetchDashboardStats();
    }
  }

  fetchDashboardStats() {
    this.isLoadingStats.set(true);
    this.dashboardService.getDashboardData()
      .pipe(finalize(() => this.isLoadingStats.set(false)))
      .subscribe({
        next: (data) => {
          const userRole = this.authService.userRole();
          if (userRole === 'owner') {
             this.stats.set([
              { label: 'Total Revenue', value: `${data.stats.totalRevenue.toLocaleString()} DT`, trend: `${data.stats.revenueTrend > 0 ? '+' : ''}${data.stats.revenueTrend}%`, isPositive: data.stats.revenueTrend >= 0, color: 'indigo' },
              { label: 'Active Members', value: data.stats.activeMembers.toLocaleString(), trend: `${data.stats.membersTrend > 0 ? '+' : ''}${data.stats.membersTrend}%`, isPositive: data.stats.membersTrend >= 0, color: 'blue' },
              { label: 'New Memberships', value: data.stats.newMemberships.toString(), trend: `${data.stats.membershipsTrend > 0 ? '+' : ''}${data.stats.membershipsTrend}%`, isPositive: data.stats.membershipsTrend >= 0, color: 'emerald' },
              { label: 'Active Trainers', value: data.stats.activeTrainers.toString(), trend: `${data.stats.trainersTrend > 0 ? '+' : ''}${data.stats.trainersTrend}`, isPositive: data.stats.trainersTrend >= 0, color: 'amber' }
            ]);
          } else if (data.stats) {
            // Member stats
            this.stats.set([
              { label: 'Total Attendance', value: (data.stats.totalAttendance ?? 0).toString(), icon: 'calendar', color: 'blue' },
              { label: 'Wallet Balance', value: `${(data.stats.walletBalance ?? 0).toLocaleString()} DT`, icon: 'wallet', color: 'emerald' },
              { label: 'Active Subscriptions', value: (data.stats.activeSubscriptions ?? 0).toString(), icon: 'check-circle', color: 'indigo' },
              { label: 'Courses Enrolled', value: (data.stats.enrollments ?? 0).toString(), icon: 'book', color: 'rose' }
            ]);
          }
        },
        error: (err) => {
          console.error('Failed to load dashboard stats', err);
        }
      });
  }

  processData({ owners, notifications }: any) {
    // Owners
    const verified = owners.filter((o: any) => !!o.email_verified_at);
    this.totalOwners.set(owners.length);
    this.verifiedOwners.set(verified.length);
    this.unverifiedOwners.set(owners.length - verified.length);
    this.verifiedTrend.set(owners.length ? Math.round((verified.length / owners.length) * 100) / 10 : 0);

    // Notifications
    this.notifications.set(notifications.slice(0, 5));
    this.owners.set(owners);
    this.loading.set(false);
  }

  refreshData() {
    this.loading.set(true);
    forkJoin({
      owners: this.ownersService.getOwners().pipe(catchError(() => of([] as UserVm[]))),
      notifications: this.notificationsService.getNotifications().pipe(catchError(() => of([] as NotificationDto[])))
    }).subscribe({
      next: (data) => this.processData(data),
      error: () => this.loading.set(false)
    });
  }

  loadPlatformMetrics() {
    this.loadingMetrics.set(true);
    this.errorMetrics.set(null);
    this.analyticsService.getPlatformMetrics().pipe(
      catchError((err) => {
        console.error('[GodView] Metrics fetch failed:', err);
        this.errorMetrics.set('Failed to load platform metrics.');
        return of({ total_active_gyms: 0, total_active_members: 0, mrr: 0, recent_churn: 0 } as PlatformMetrics);
      })
    ).subscribe(metrics => {
      this.mrr.set(metrics.mrr);
      this.activeGyms.set(metrics.total_active_gyms);
      this.activeMembers.set(metrics.total_active_members);
      this.recentChurn.set(metrics.recent_churn);
      this.loadingMetrics.set(false);
    });
  }

  checkHealth() {
    this.loadingHealth.set(true);
    this.http.get(environment.healthUrl, { observe: 'response', responseType: 'text' }).pipe(
      map(res => ({ ok: res.status >= 200 && res.status < 300, detail: res.status === 200 ? 'Systems online (200 OK)' : `Status ${res.status}` })),
      catchError(() => of({ ok: false, detail: 'Connection timeout' }))
    ).subscribe(result => {
      this.apiHealth.set(result.ok ? 'Reachable' : 'Unreachable');
      this.healthDetail.set(result.detail);
      this.loadingHealth.set(false);
    });
  }

  async openCreateOwner() {
    const { OwnerDialogComponent } = await import('../owners/owner-dialog/owner-dialog.component');
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { user: undefined }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.refreshData();
    });
  }

  sendBroadcast() {
    if (this.broadcastForm.invalid) return;
    this.broadcasting.set(true);
    this.notificationsService.sendToAllUsers(this.broadcastForm.value.message!).subscribe({
      next: () => {
        this.snackBar.open('Announcement broadcasted.', 'Dismiss', { duration: 3000 });
        this.broadcastForm.reset();
        this.broadcasting.set(false);
        this.refreshData();
      },
      error: () => {
        this.snackBar.open('Failed to send broadcast.', 'Dismiss', { duration: 4000 });
        this.broadcasting.set(false);
      }
    });
  }

  sendTargeted() {
    if (this.targetedForm.invalid) return;
    this.sendingTargeted.set(true);
    const { ownerId, message } = this.targetedForm.value;
    this.notificationsService.sendToOwner(ownerId!, message!).subscribe({
      next: () => {
        this.snackBar.open('Direct alert sent.', 'Dismiss', { duration: 3000 });
        this.targetedForm.reset();
        this.sendingTargeted.set(false);
        this.refreshData();
      },
      error: () => {
        this.snackBar.open('Failed to send targeted message.', 'Dismiss', { duration: 4000 });
        this.sendingTargeted.set(false);
      }
    });
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  logout() {
    this.authService.logout();
  }
}
