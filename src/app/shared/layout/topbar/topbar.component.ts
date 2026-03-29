import { Component, OnInit, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { ThemeService } from '../../../core/services/theme.service';

import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, RouterModule, ThemeToggleComponent],
  template: `
    <mat-toolbar class="!bg-white/80 dark:!bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm z-10 sticky top-0 px-6 h-16 flex justify-between items-center transition-colors">
      <!-- Search or Path Context Placeholder -->
      <div class="flex items-center text-slate-400">
        <!-- Could place global search here if backend supported it -->
      </div>
      
      <!-- Right Actions -->
      <div class="flex items-center gap-2 lg:gap-4">
        <!-- Standalone Theme Toggle Component -->
        <app-theme-toggle></app-theme-toggle>
        
        <button mat-icon-button routerLink="/notifications" class="!text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-800 transition-colors">
          <mat-icon [matBadge]="notifCount() > 0 ? notifCount() : null" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
        </button>
        
        <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
        
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="!text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-800 transition-colors">
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" class="!rounded-xl !mt-2 custom-mat-menu">
          <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 sm:hidden">
            <p class="text-sm font-medium text-slate-900 dark:text-white">{{ user()?.name }} {{ user()?.last_name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ user()?.email }}</p>
          </div>
          <button mat-menu-item>
            <mat-icon>account_circle</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon class="text-red-500">logout</mat-icon>
            <span class="text-red-500 font-medium">Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    /* Target the container wrapping the badge content (or create a custom badge class) */
    ::ng-deep .mat-badge-content {
      font-size: 10px;
      font-weight: 600;
    }
  `]
})
export class TopbarComponent {
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);
  public themeService = inject(ThemeService);
  
  user = this.authService.currentUser;
  notifCount = signal(0);

  constructor() {
    // Defer notification fetch until after the initial paint
    afterNextRender(() => {
      this.notificationsService.getNotifications().subscribe({
        next: (data) => this.notifCount.set(data.length),
        error: () => this.notifCount.set(0)
      });
    });
  }

  getInitials(): string {
    const u = this.user();
    if (!u || !u.name) return 'U';
    return (u.name.charAt(0) + (u.last_name?.charAt(0) || '')).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
