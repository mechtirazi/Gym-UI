import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerDashboardService } from '../../../services/owner-dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss'
})
export class DashboardStatsComponent implements OnInit {
  private dashboardService = inject(OwnerDashboardService);
  
  isLoadingStats = signal<boolean>(true);
  stats = signal<any[]>([]);

  ngOnInit() {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    this.isLoadingStats.set(true);
    this.dashboardService.getDashboardData()
      .pipe(finalize(() => this.isLoadingStats.set(false)))
      .subscribe({
        next: (data) => {
          this.stats.set([
            { label: 'Total Revenue', value: `$${data.stats.totalRevenue.toLocaleString()}`, trend: `${data.stats.revenueTrend > 0 ? '+' : ''}${data.stats.revenueTrend}%`, isPositive: data.stats.revenueTrend >= 0 },
            { label: 'Active Members', value: data.stats.activeMembers.toLocaleString(), trend: `${data.stats.membersTrend > 0 ? '+' : ''}${data.stats.membersTrend}%`, isPositive: data.stats.membersTrend >= 0 },
            { label: 'New Memberships', value: data.stats.newMemberships.toString(), trend: `${data.stats.membershipsTrend > 0 ? '+' : ''}${data.stats.membershipsTrend}%`, isPositive: data.stats.membershipsTrend >= 0 },
            { label: 'Active Trainers', value: data.stats.activeTrainers.toString(), trend: `${data.stats.trainersTrend > 0 ? '+' : ''}${data.stats.trainersTrend}`, isPositive: data.stats.trainersTrend >= 0 }
          ]);
        }
      });
  }
}
