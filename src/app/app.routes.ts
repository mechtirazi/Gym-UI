import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { socialCallbackGuard } from './core/guards/social-callback.guard';
import { roleRedirectGuard } from './core/guards/role-redirect.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'callback',
        canActivate: [socialCallbackGuard],
        loadComponent: () => import('./features/auth/social-callback/social-callback').then(m => m.SocialCallback)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  // The Smart Redirecting Root Route for dashboards
  {
    path: 'dashboard',
    canActivate: [roleRedirectGuard],
    // The component won't actually render if the guard redirects immediately,
    // but Angular requires a valid layout mapping.
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  // The Main Authenticated App wrapper for segregated feature domains
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    // canActivate: [authGuard],
    children: [
      {
        path: 'owner',
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/owner/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
          { path: 'gym-profile', loadComponent: () => import('./features/owner/gym-profile/gym-profile').then(m => m.GymProfileComponent) },
          { path: 'trainers', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'members', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'memberships', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'revenue', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'staff', loadComponent: () => import('./features/owner/staff/staff.component').then(m => m.StaffManagementComponent) },
          { path: 'equipment', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      {
        path: 'member',
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
