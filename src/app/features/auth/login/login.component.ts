import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  needsVerification = signal(false);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((value) => !value);
  }

  loginWith(provider: string) {
    window.location.href = `${this.authService.getApiUrl()}/auth/${provider}/redirect`;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.needsVerification.set(false);

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 403 && err.error?.email_not_verified) {
            this.needsVerification.set(true);
            this.errorMessage.set('Your email address is not verified.\nPlease verify your email to access the dashboard.');
          } else if (err.status === 401) {
            this.errorMessage.set('Invalid email or password.');
          } else if (err.status === 422) {
            const validationErrors = err.error?.errors;
            let msg = 'Validation failed:\n';
            for (const key in validationErrors) {
              msg += `- ${validationErrors[key][0]}\n`;
            }
            this.errorMessage.set(msg);
          } else {
            this.errorMessage.set(err.error?.message || 'An unexpected error occurred. Please try again.');
          }
        }
      });
    }
  }

  resendVerification() {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.isLoading.set(true);
      this.authService.resendVerification(email).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.needsVerification.set(false);
          this.errorMessage.set('Verification email resent successfully! Please check your inbox.');
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Failed to resend verification email. Please try again later.');
        }
      });
    }
  }
}
