import { Component, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './core/services/loading.service';
import { environment } from '../environments/environment';
import { ImpersonationBannerComponent } from './shared/components/impersonation-banner/impersonation-banner.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ImpersonationBannerComponent],
  template: `
    <app-impersonation-banner></app-impersonation-banner>
    <div *ngIf="loadingService.isLoading()" class="fixed top-0 left-0 right-0 h-1 z-50 bg-blue-100 overflow-hidden">
       <div class="h-full bg-blue-600 animate-[indeterminate_1.5s_infinite_linear] origin-left w-full absolute"></div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
    @keyframes indeterminate {
       0% { transform: translateX(-100%) scaleX(0.2); }
       50% { transform: translateX(0%) scaleX(0.5); }
       100% { transform: translateX(100%) scaleX(0.2); }
    }
    `
  ]
})
export class AppComponent {
  title = 'Gym Super Admin Dashboard';
  loadingService = inject(LoadingService);
  themeService = inject(ThemeService);

  constructor() {
    // Defer non-critical config read off the critical render path
    afterNextRender(() => {
      const threshold = localStorage.getItem('lowStockThreshold');
      if (threshold) {
        (environment as any).lowStockThreshold = parseInt(threshold, 10);
      }
    });
  }
}
