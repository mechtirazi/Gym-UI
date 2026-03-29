import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resend-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>

      <div class="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/50 dark:border-slate-700/50 relative z-10">
        
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <mat-icon class="text-blue-500 !w-10 !h-10 text-[40px]">mark_email_unread</mat-icon>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resend Verification Email</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">Enter the email address associated with your account and we'll resend the verification link.</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <input formControlName="email" type="email" placeholder="name@example.com"
                 class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white text-center" />

          <button type="submit" [disabled]="form.invalid || loading()"
                  class="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
            {{ loading() ? 'Sending…' : 'Resend Verification' }}
          </button>
        </form>

        <div *ngIf="successMsg()" class="mt-6 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
          {{ successMsg() }}
        </div>

        <div *ngIf="errorMsg()" class="mt-6 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-xl text-sm font-medium border border-red-200 dark:border-red-500/20">
          {{ errorMsg() }}
        </div>

        <div class="mt-8">
          <a routerLink="/auth/login" class="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">← Back to Login</a>
        </div>
      </div>
    </div>
  `
})
export class ResendVerificationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading = signal(false);
  successMsg = signal<string | null>(null);
  errorMsg = signal<string | null>(null);

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.successMsg.set(null);
    this.errorMsg.set(null);

    this.authService.resendVerification(this.form.value.email!).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('Verification email sent successfully! Please check your inbox.');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to resend verification email. Please try again later.');
      }
    });
  }
}
