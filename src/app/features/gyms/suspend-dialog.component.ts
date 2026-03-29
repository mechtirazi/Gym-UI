import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-suspend-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="suspend-dialog">
      <div class="suspend-dialog-header">
        <div class="suspend-dialog-icon">
          <mat-icon>warning</mat-icon>
        </div>
        <h2>Suspend Gym</h2>
        <p>This will immediately block all users of <strong>{{ data.gymName }}</strong> from accessing the platform.</p>
      </div>

      <div class="suspend-dialog-body">
        <label class="suspend-label" for="reason">Suspension Reason</label>
        <textarea
          id="reason"
          class="suspend-textarea"
          [(ngModel)]="reason"
          placeholder="e.g. Payment overdue, Terms violation, etc."
          rows="3"
        ></textarea>
      </div>

      <div class="suspend-dialog-actions">
        <button type="button" class="suspend-cancel-btn" (click)="dialogRef.close()">Cancel</button>
        <button
          type="button"
          class="suspend-confirm-btn"
          [disabled]="!reason.trim()"
          (click)="dialogRef.close(reason)"
        >
          <mat-icon>block</mat-icon>
          Suspend Gym
        </button>
      </div>
    </div>
  `,
  styles: [`
    .suspend-dialog {
      padding: 0.5rem;
    }

    .suspend-dialog-header {
      text-align: center;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0.75rem 0 0.5rem;
        color: #0f172a;
        font-size: 1.35rem;
        font-weight: 800;
      }

      p {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.5;
      }
    }

    .suspend-dialog-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: #fef2f2;
      border: 2px solid #fecaca;

      mat-icon {
        color: #ef4444;
        font-size: 1.75rem;
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    .suspend-dialog-body {
      margin-bottom: 1.5rem;
    }

    .suspend-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #334155;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .suspend-textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-family: inherit;
      font-size: 0.92rem;
      color: #0f172a;
      resize: vertical;
      transition: border-color 0.2s;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    .suspend-dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .suspend-cancel-btn,
    .suspend-confirm-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .suspend-cancel-btn {
      background: #f1f5f9;
      color: #475569;

      &:hover {
        background: #e2e8f0;
      }
    }

    .suspend-confirm-btn {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff;
      box-shadow: 0 8px 16px rgba(239, 68, 68, 0.25);

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 12px 20px rgba(239, 68, 68, 0.35);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class SuspendDialogComponent {
  reason = '';

  constructor(
    public dialogRef: MatDialogRef<SuspendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gymName: string }
  ) {}
}
