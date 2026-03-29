import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'verify/:id/:hash',
    loadComponent: () => import('./verify-email/verify-email.component').then(c => c.VerifyEmailComponent)
  },
  {
    path: 'verify',
    loadComponent: () => import('./verify-email/verify-email.component').then(c => c.VerifyEmailComponent)
  },
  {
    path: 'resend-verification',
    loadComponent: () => import('./resend-verification/resend-verification.component').then(c => c.ResendVerificationComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
