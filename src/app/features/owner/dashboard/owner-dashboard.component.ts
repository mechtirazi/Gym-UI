import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart';
import { RecentCheckinsComponent } from './components/recent-checkins/recent-checkins';
import { AddMemberModalComponent } from './components/add-member-modal/add-member-modal';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardStatsComponent, 
    RevenueChartComponent, 
    RecentCheckinsComponent, 
    AddMemberModalComponent
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.scss'
})
export class OwnerDashboardComponent {
  private authService = inject(AuthService);
  
  ownerName = (this.authService.currentUser() as any)?.name || 'Owner';
  showMemberModal = signal<boolean>(false);
}
