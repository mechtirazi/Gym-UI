import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, catchError, of } from 'rxjs';
import { AdminOwnersService } from '../../core/services/admin-owners.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { UserVm, NotificationDto } from '../../core/models/api.models';

interface LogEntry {
  id: string;
  type: 'auth' | 'system' | 'user_management' | 'product_sync' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="mb-8 flex justify-between items-start">
      <div>
         <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Activity Logs</h1>
         <p class="text-sm text-slate-500 dark:text-slate-400">Aggregated adapter-based timeline of platform administrative actions.</p>
      </div>
      <button mat-button (click)="loadActivity()" [disabled]="loading()"
              class="!bg-slate-100 dark:!bg-slate-800 !text-slate-700 dark:!text-slate-300 !rounded-xl !px-6 hover:!bg-slate-200 dark:hover:!bg-slate-700 hover:shadow-sm transition">
         <mat-icon [class.animate-spin]="loading()">refresh</mat-icon> Refresh
      </button>
    </div>

    <!-- Alert Note -->
    <div class="mb-8 p-4 bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex gap-4 items-start shadow-sm">
       <mat-icon class="text-red-500">warning</mat-icon>
       <div class="flex flex-col">
          <span class="font-bold text-red-900 dark:text-red-100 uppercase tracking-widest text-xs mb-1">Simulated Data Warning</span>
          <span class="font-bold text-red-800 dark:text-red-200 text-lg mb-1">No Real Audit Log Exists</span>
          <span class="text-sm text-red-700 dark:text-red-300 max-w-4xl leading-relaxed">Please note that this is a <strong>simulated activity log</strong>. The backend API does not expose a unified audit log endpoint. The timeline below is pseudo-generated client-side from available resources for demonstration purposes only.</span>
       </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading()" class="flex items-center justify-center py-16">
       <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <!-- Timeline -->
    <div *ngIf="!loading()" class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl relative">
       
       <div class="absolute left-14 top-14 bottom-14 w-px bg-slate-200 dark:bg-slate-700 z-0 hidden md:block"></div>

       <div class="relative z-10 flex flex-col gap-8">
          <div *ngFor="let log of logs()" class="flex flex-col md:flex-row gap-6 relative group">
             
             <!-- Time Marker -->
             <div class="w-32 pt-2 shrink-0 md:text-right text-left text-slate-400 font-medium text-xs uppercase tracking-widest hidden md:block">
                {{ log.timestamp | date:'MMM d, HH:mm' }}
             </div>

             <!-- Icon Node -->
             <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-800 z-10 transition-transform group-hover:scale-110 shadow-sm"
                  [ngClass]="getIconClasses(log.type, log.status)">
                <mat-icon class="scale-90 text-white">{{ getIcon(log.type) }}</mat-icon>
             </div>

             <!-- Content Card -->
             <div class="flex-grow bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                   <h4 class="text-base font-bold text-slate-900 dark:text-white">{{ log.title }}</h4>
                   <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 md:hidden uppercase tracking-widest">{{ log.timestamp | date:'MMM d, HH:mm' }}</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ log.description }}</p>
             </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="logs().length === 0" class="text-center py-12">
             <mat-icon class="text-slate-300 dark:text-slate-500 scale-150 mb-4">event_busy</mat-icon>
             <p class="text-slate-500 font-medium">No activity data available.</p>
          </div>
       </div>

    </div>
  `
})
export class ActivityComponent implements OnInit {
  private ownersService = inject(AdminOwnersService);
  private notificationsService = inject(NotificationsService);

  loading = signal(true);
  logs = signal<LogEntry[]>([]);

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    this.loading.set(true);

    forkJoin({
      users: this.ownersService.getOwners().pipe(catchError(() => of([] as UserVm[]))),
      notifications: this.notificationsService.getNotifications().pipe(catchError(() => of([] as NotificationDto[])))
    }).subscribe({
      next: ({ users, notifications }) => {
        const entries: LogEntry[] = [];

        // Session entry
        entries.push({
          id: 'session-1',
          type: 'auth',
          title: 'Session Authenticated',
          description: 'Super Admin JWT validated. Dashboard adapter aggregation initiated.',
          timestamp: new Date(),
          status: 'success'
        });

        // User-derived entries
        if (users.length > 0) {
          entries.push({
            id: 'users-summary',
            type: 'user_management',
            title: `${users.length} Owner Accounts Loaded`,
            description: `${users.filter(u => !!u.email_verified_at).length} verified, ${users.filter(u => !u.email_verified_at).length} pending verification.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 2),
            status: 'success'
          });

          // Latest user
          const sorted = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          if (sorted[0]) {
            entries.push({
              id: 'users-latest',
              type: 'user_management',
              title: `Latest Owner: ${sorted[0].name} ${sorted[0].last_name}`,
              description: `Registered on ${new Date(sorted[0].created_at).toLocaleDateString()}. Status: ${sorted[0].email_verified_at ? 'Verified' : 'Pending'}.`,
              timestamp: new Date(sorted[0].created_at),
              status: 'info'
            });
          }
        }



        // Notification-derived entries
        if (notifications.length > 0) {
          entries.push({
            id: 'notif-summary',
            type: 'notification',
            title: `${notifications.length} Notification(s) Active`,
            description: `Latest: "${notifications[0].text}"`,
            timestamp: new Date(notifications[0].created_at),
            status: 'info'
          });
        }

        // System entry
        entries.push({
          id: 'system-probe',
          type: 'system',
          title: 'Adapter Aggregation Complete',
          description: 'All accessible resources have been fetched and merged into the activity timeline.',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          status: 'success'
        });

        // Sort by timestamp desc
        entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        this.logs.set(entries);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getIcon(type: string) {
    switch (type) {
      case 'auth': return 'vpn_key';
      case 'system': return 'memory';
      case 'user_management': return 'manage_accounts';
      case 'product_sync': return 'sync';
      case 'notification': return 'notifications';
      default: return 'event';
    }
  }

  getIconClasses(type: string, status: string) {
    if (status === 'error') return 'bg-rose-500';
    if (status === 'warning') return 'bg-amber-500';

    switch (type) {
      case 'auth': return 'bg-blue-500';
      case 'system': return 'bg-slate-700 dark:bg-slate-600';
      case 'user_management': return 'bg-indigo-500';
      case 'product_sync': return 'bg-teal-500';
      case 'notification': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  }
}
