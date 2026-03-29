import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button 
      mat-icon-button 
      (click)="themeService.toggleTheme()" 
      class="app-theme-toggle !text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-800 transition-colors" 
      [title]="themeService.theme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <mat-icon>{{ themeService.theme() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .app-theme-toggle {
      position: relative;
      /* Ensures the theme toggle sits cleanly above standard elements */
      z-index: 50; 
    }
  `]
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
}
