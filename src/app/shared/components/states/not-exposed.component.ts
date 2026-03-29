import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-exposed-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="state-container not-exposed">
      <mat-icon class="state-icon">construction</mat-icon>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
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
      color: #9e9e9e;
      opacity: 0.8;
    }
  `]
})
export class NotExposedStateComponent {
  @Input() title = 'Feature Not Available';
  @Input() message = 'This feature or endpoint is not fully exposed or implemented by the backend yet.';
}
