import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-owner-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './owner-sidebar.component.html',
  styleUrl: './owner-sidebar.component.scss'
})
export class OwnerSidebarComponent {
  private authService = inject(AuthService);

  navItems = [
    { label: 'Management', isHeader: true },
    { label: 'Dashboard', icon: 'dashboard', route: '/owner/dashboard' },
    { label: 'Gym Profile', icon: 'gym', route: '/owner/gym-profile' },

    { label: 'Team', isHeader: true },
    { label: 'Trainers', icon: 'fitness', route: '/owner/trainers' },
    { label: 'Staff', icon: 'users', route: '/owner/staff' },

    { label: 'Operations', isHeader: true },
    { label: 'Members', icon: 'users', route: '/owner/members' },
    { label: 'Memberships', icon: 'card', route: '/owner/memberships' },
    { label: 'Equipment', icon: 'settings', route: '/owner/equipment' },

    { label: 'Financials', isHeader: true },
    { label: 'Revenue', icon: 'revenue', route: '/owner/revenue' },
    { label: 'Subscriptions', icon: 'card', route: '/owner/subscriptions' },

    { label: 'App', isHeader: true },
    { label: 'Community', icon: 'users', route: '/community' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  getIcon(name: string): string {
    const icons: { [key: string]: string } = {
      dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      fitness: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h4"></path><path d="M14 18h4"></path><path d="M15 22v-4"></path><path d="M9 22v-4"></path><path d="M15 14v-4"></path><path d="M9 14v-4"></path><path d="M11 6v-2h2v2"></path><path d="M5 10v4h14v-4H5z"></path></svg>`,
      gym: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3"></path><path d="M3 11h3a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1z"></path><path d="M7 11h10"></path><path d="M7 16h10"></path><path d="M17 11v5"></path><path d="M7 11v5"></path></svg>`,
      users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
      revenue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
      settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
    };
    return icons[name] || '';
  }
}
