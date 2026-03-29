import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-impersonation-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="authService.isImpersonating()" class="fixed top-0 left-0 w-full z-[9999] bg-amber-500 text-slate-900 px-4 py-3 flex items-center justify-center shadow-md font-medium text-sm gap-4">
      <span>You are currently viewing the dashboard as <strong>{{ userName }}</strong></span>
      <button (click)="authService.stopImpersonating()" class="px-4 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-sm font-semibold">
        Stop Impersonating
      </button>
    </div>
  `
})
export class ImpersonationBannerComponent {
  authService = inject(AuthService);
  
  get userName(): string {
    return localStorage.getItem('impersonated_user_name') || 'Owner';
  }
}
