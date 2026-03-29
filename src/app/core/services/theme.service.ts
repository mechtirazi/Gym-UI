import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme-preference';
  
  // Public signal for components that want to bind to the current theme
  theme = signal<Theme>('light');

  // Alias for compatibility
  darkMode = computed(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();
    
    // Setup effect to automatically persist theme changes and toggle DOM class
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.THEME_KEY, currentTheme);
      
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    // try old key as well
    const oldSavedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.theme.set(savedTheme);
    } else if (oldSavedTheme === 'dark' || oldSavedTheme === 'light') {
      this.theme.set(oldSavedTheme as Theme);
    } else {
      // Fallback to system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  // Alias for compatibility
  toggleDarkMode() {
    this.toggleTheme();
  }
}
