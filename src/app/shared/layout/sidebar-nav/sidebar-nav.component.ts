import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { CapabilityService } from '../../../core/services/capability.service';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  capability?: string;
  role?: string;
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatRippleModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss'
})
export class SidebarNavComponent {
  private capabilityService = inject(CapabilityService);
  private authService = inject(AuthService);

  role() { return this.authService.userRole(); }

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', role: 'super_admin' },
    { label: 'Owners and Gym', icon: 'admin_panel_settings', route: '/owners', capability: 'users.ownerCrud', role: 'super_admin' },
    { label: 'Revenue', icon: 'payments', route: '/revenue', role: 'super_admin' },
    { label: 'Notifications', icon: 'notifications', route: '/notifications', capability: 'notifications.self', role: 'super_admin' },
    { label: 'Operations', icon: 'business_center', route: '/operations', capability: 'operations.gated', role: 'super_admin' },
    { label: 'Access Matrix', icon: 'security', route: '/access-matrix', role: 'super_admin' }, 
    { label: 'Monitoring', icon: 'monitor_heart', route: '/monitoring', capability: 'monitoring.health', role: 'super_admin' },
    { label: 'Activity Logs', icon: 'manage_search', route: '/activity', capability: 'activity.read', role: 'super_admin' },

    { label: 'Owner Dashboard', icon: 'dashboard', route: '/owner/dashboard', role: 'owner' }
  ];

  canAccess(cap: string): boolean {
    return this.capabilityService.can(cap);
  }
}
