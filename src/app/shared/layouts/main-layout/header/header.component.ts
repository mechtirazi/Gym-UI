import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private notificationsService = inject(NotificationsService);

  currentUser = this.authService.currentUser;
  isDarkMode = this.themeService.darkMode;
  showNotifications = signal(false);
  showLangDropdown = signal(false);
  currentLang = signal<'en' | 'fr'>('en');

  // Use the notification service's signals
  notifications = this.notificationsService.notifications;
  unreadCount = this.notificationsService.unreadCount;

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
  }

  toggleLangDropdown(): void {
    this.showLangDropdown.update(v => !v);
  }

  setLanguage(lang: 'en' | 'fr'): void {
    this.currentLang.set(lang);
    this.showLangDropdown.set(false);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe();
  }

  markAsRead(id: number): void {
    this.notificationsService.markAsRead(id).subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  getAvatarUrl(path?: string): string {
    return this.authService.getAvatarUrl(path);
  }

  logout(): void {
    this.authService.logout();
  }
}
