import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-suspended-account',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="suspended-page">
      <div class="suspended-card">
        <div class="suspended-glow suspended-glow--1"></div>
        <div class="suspended-glow suspended-glow--2"></div>

        <div class="suspended-content">
          <div class="suspended-icon-wrap">
            <mat-icon>lock</mat-icon>
          </div>

          <h1 class="suspended-title">Account Suspended</h1>
          <p class="suspended-subtitle">
            Your gym's access has been restricted by the platform administrator.
          </p>
          <p class="suspended-reason">
            If you believe this is an error, please contact support or your platform administrator for assistance.
          </p>

          <button class="suspended-logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out & Return to Login</span>
          </button>
        </div>
      </div>

      <p class="suspended-footer">
        Need help? Contact <strong>support&#64;gymplatform.com</strong>
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%);
    }

    .suspended-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .suspended-card {
      position: relative;
      overflow: hidden;
      max-width: 520px;
      width: 100%;
      border-radius: 28px;
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(148, 163, 184, 0.12);
      box-shadow:
        0 30px 60px -12px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.04) inset;
      padding: 3rem 2.5rem;
    }

    .suspended-glow {
      position: absolute;
      border-radius: 9999px;
      filter: blur(80px);
      pointer-events: none;
    }

    .suspended-glow--1 {
      top: -6rem;
      right: -4rem;
      width: 16rem;
      height: 16rem;
      background: radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, transparent 70%);
    }

    .suspended-glow--2 {
      bottom: -5rem;
      left: -3rem;
      width: 14rem;
      height: 14rem;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%);
    }

    .suspended-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .suspended-icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      background: rgba(244, 63, 94, 0.15);
      border: 2px solid rgba(244, 63, 94, 0.3);
      margin-bottom: 1.75rem;

      mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #fb7185;
      }
    }

    .suspended-title {
      margin: 0 0 0.75rem;
      color: #f1f5f9;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .suspended-subtitle {
      margin: 0 0 1rem;
      color: #94a3b8;
      font-size: 1rem;
      line-height: 1.6;
    }

    .suspended-reason {
      margin: 0 0 2rem;
      padding: 1rem;
      border-radius: 14px;
      background: rgba(148, 163, 184, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.1);
      color: #64748b;
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .suspended-logout-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      width: 100%;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 16px;
      background: linear-gradient(135deg, #f43f5e, #e11d48);
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 14px 28px rgba(244, 63, 94, 0.25);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 32px rgba(244, 63, 94, 0.35);
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .suspended-footer {
      margin-top: 2rem;
      color: #475569;
      font-size: 0.82rem;

      strong {
        color: #64748b;
      }
    }
  `]
})
export class SuspendedAccountComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
