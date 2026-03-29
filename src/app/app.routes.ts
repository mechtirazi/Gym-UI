import { Routes } from '@angular/router';
import { superAdminGuard, capabilityGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'suspended',
    loadComponent: () => import('./features/auth/pages/suspended-account.component').then((c) => c.SuspendedAccountComponent),
  },
  {
    path: 'subscription-expired',
    loadComponent: () => import('./features/auth/pages/subscription-expired.component').then((c) => c.SubscriptionExpiredComponent),
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [superAdminGuard], // Only super_admin can access the main app shell
    children: [
      { 
        path: 'settings', 
        loadComponent: () => import('./features/shared/settings/settings.component').then(m => m.SettingsComponent) 
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'owner',
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/owner/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
          { path: 'gym-profile', loadComponent: () => import('./features/owner/gym-profile/gym-profile').then(m => m.GymProfileComponent) },
          { path: 'trainers', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'members', loadComponent: () => import('./features/owner/member/member.component').then(m => m.MemberManagementComponent) },
          { path: 'memberships', loadComponent: () => import('./features/owner/membership/membership.component').then(m => m.MembershipManagementComponent) },
          { path: 'revenue', loadComponent: () => import('./features/owner/revenue/revenue.component').then(m => m.OwnerRevenueComponent) },
          { path: 'attendance', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'courses', loadComponent: () => import('./features/owner/courses/courses.component').then(m => m.CourseManagementComponent) },
          { path: 'events', loadComponent: () => import('./features/owner/events/events.component').then(m => m.EventManagementComponent) },
          { path: 'staff', loadComponent: () => import('./features/owner/staff/staff.component').then(m => m.StaffManagementComponent) },
          { path: 'equipment', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'products', loadComponent: () => import('./features/owner/products/products.component').then(m => m.ProductManagementComponent) },
          { path: 'subscriptions', loadComponent: () => import('./features/owner/subscriptions/subscriptions.component').then(m => m.SubscriptionManagementComponent) },
          { path: 'community', loadComponent: () => import('./features/owner/community/community.component').then(m => m.CommunityComponent) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'nutrition', loadComponent: () => import('./features/owner/nutrition/nutrition.component').then(m => m.NutritionManagementComponent) },
        ]
      },
      {
        path: 'owners',
        canActivate: [capabilityGuard],
        data: { capability: 'users.ownerCrud' },
        loadChildren: () => import('./features/owners/owners.routes').then((m) => m.OWNER_ROUTES),
      },


      {
        path: 'notifications',
        canActivate: [capabilityGuard],
        data: { capability: 'notifications.self' },
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(
            (c) => c.NotificationsComponent,
          ),
      },
      {
        path: 'operations',
        canActivate: [capabilityGuard],
        data: { capability: 'operations.gated' },
        loadComponent: () =>
          import('./features/operations/operations.component').then((c) => c.OperationsComponent),
      },
      {
        path: 'access-matrix',
        loadComponent: () =>
          import('./features/access-matrix/access-matrix.component').then(
            (c) => c.AccessMatrixComponent,
          ),
      },
      {
        path: 'monitoring',
        canActivate: [capabilityGuard],
        data: { capability: 'monitoring.health' },
        loadComponent: () =>
          import('./features/monitoring/monitoring.component').then((c) => c.MonitoringComponent),
      },
      {
        path: 'activity',
        canActivate: [capabilityGuard],
        data: { capability: 'activity.read' },
        loadComponent: () =>
          import('./features/activity/activity.component').then((c) => c.ActivityComponent),
      },
      {
        path: 'revenue',
        loadComponent: () =>
          import('./features/dashboard/components/revenue-analytics/revenue-analytics.component').then(
            (c) => c.RevenueAnalyticsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((c) => c.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
