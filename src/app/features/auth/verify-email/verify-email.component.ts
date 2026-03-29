import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>

      <div class="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/50 dark:border-slate-700/50 relative z-10 transition-all duration-500 transform translate-y-0 opacity-100">
        <ng-container *ngIf="status() === 'verifying'">
          <mat-spinner diameter="60" class="mx-auto mb-6 opacity-80" color="primary"></mat-spinner>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying your email</h2>
          <p class="text-slate-500 dark:text-slate-400">Please wait while we confirm your email address securely...</p>
        </ng-container>

        <ng-container *ngIf="status() === 'success'">
          <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-emerald-500 !w-10 !h-10 text-[40px]">check_circle</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h2>
          <p class="text-slate-500 dark:text-slate-400 mb-8">Thank you for verifying your email address. Your account is now fully active.</p>
          <button routerLink="/auth/login" class="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Go to Login
          </button>
        </ng-container>

        <ng-container *ngIf="status() === 'error'">
          <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-red-500 !w-10 !h-10 text-[40px]">error</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
          <p class="text-slate-500 dark:text-slate-400 mb-4">{{ errorDetail() }}</p>
          <a routerLink="/auth/resend-verification" class="inline-block mb-4 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">Resend verification email →</a>
          <button routerLink="/auth/login" class="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Return to Login
          </button>
        </ng-container>
      </div>
    </div>
  `
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  status = signal<'verifying' | 'success' | 'error'>('verifying');
  errorDetail = signal('The verification link is invalid, expired, or the email is already verified.');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const hash = this.route.snapshot.paramMap.get('hash');

    if (!id || !hash) {
      this.errorDetail.set('Missing verification parameters. Please use the link from your email.');
      this.status.set('error');
      return;
    }

    // Forward the full query string (expires, signature) to the backend
    const queryParams = this.route.snapshot.queryParams;
    const qs = new URLSearchParams(queryParams as Record<string, string>).toString();
    const url = `${environment.apiBaseUrl}/api/email/verify/${id}/${hash}${qs ? '?' + qs : ''}`;

    this.http.get(url).subscribe({
      next: () => this.status.set('success'),
      error: (err) => {
        this.errorDetail.set(err.error?.message || 'The verification link is invalid, expired, or the email is already verified.');
        this.status.set('error');
      }
    });
  }
}
