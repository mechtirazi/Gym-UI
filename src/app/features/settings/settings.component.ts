import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  template: `
    <div class="max-w-3xl">
      <div class="mb-8">
         <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Platform Settings</h1>
         <p class="text-sm text-slate-500 dark:text-slate-400">Manage UI preferences, session, and local configuration.</p>
      </div>
      
      <!-- Session & Developer -->
      <div class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
         <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Session & Developer</h3>
         
         <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 mb-4">
            <div class="flex flex-col">
               <span class="font-bold text-slate-800 dark:text-white text-sm">API Base URL</span>
               <span class="text-xs text-slate-400 font-mono mt-1">{{ apiBaseUrl }}</span>
            </div>
            <mat-icon class="text-emerald-500">link</mat-icon>
         </div>
         
         <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 mb-4">
            <div class="flex flex-col">
               <span class="font-bold text-slate-800 dark:text-white text-sm">Environment</span>
               <span class="text-xs text-slate-400 mt-1">{{ isProduction ? 'Production' : 'Development' }}</span>
            </div>
            <mat-icon [class.text-emerald-500]="isProduction" [class.text-amber-500]="!isProduction">
              {{ isProduction ? 'verified' : 'science' }}
            </mat-icon>
         </div>

         <div class="flex gap-3 mt-6">
            <button (click)="refreshToken()" [disabled]="refreshing()"
                    class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50">
               <mat-icon class="!text-[18px] !w-[18px] !h-[18px]" [class.animate-spin]="refreshing()">refresh</mat-icon>
               {{ refreshing() ? 'Refreshing…' : 'Refresh Token' }}
            </button>
            <button (click)="logout()"
                    class="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition border border-red-200 dark:border-red-500/20">
               <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">logout</mat-icon>
               Logout
            </button>
         </div>
         
         <div *ngIf="sessionMsg()" class="mt-4 p-3 rounded-xl text-sm font-medium"
              [class.bg-emerald-50]="sessionMsg()!.startsWith('Token')"
              [class.text-emerald-700]="sessionMsg()!.startsWith('Token')"
              [class.bg-red-50]="!sessionMsg()!.startsWith('Token')"
              [class.text-red-700]="!sessionMsg()!.startsWith('Token')">
           {{ sessionMsg() }}
         </div>
      </div>

      <!-- Local Preferences removed -->
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);

  apiBaseUrl = environment.apiBaseUrl;
  isProduction = environment.production;

  refreshing = signal(false);
  sessionMsg = signal<string | null>(null);

  ngOnInit() {}

  refreshToken() {
    this.refreshing.set(true);
    this.sessionMsg.set(null);
    this.authService.refresh().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.sessionMsg.set('Token refreshed successfully.');
      },
      error: () => {
        this.refreshing.set(false);
        this.sessionMsg.set('Failed to refresh token.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
