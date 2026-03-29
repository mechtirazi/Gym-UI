import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="state-container forbidden">
      <mat-icon class="state-icon" color="warn">gavel</mat-icon>
      <h2>Access Forbidden</h2>
      <p>You do not have the required permissions to view this content or perform this action.</p>
    </div>
  `,
  styles: [`
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      background-color: var(--mat-sys-surface-container-lowest, #fafafa);
      border-radius: 8px;
      margin: 1rem 0;
      border: 1px dashed var(--mat-sys-outline, #ccc);
    }
    .state-container h2 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: var(--mat-sys-on-surface, #333);
    }
    .state-container p {
      color: var(--mat-sys-on-surface-variant, #666);
      max-width: 400px;
    }
    .state-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.8;
    }
  `]
})
export class ForbiddenStateComponent {}
