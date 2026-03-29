import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, startWith, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, NotificationDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private url = `${environment.apiBaseUrl}/api/notifications`;
  private adminUrl = `${environment.apiBaseUrl}/api/admin/notifications`;

  unreadCount = signal(0);

  constructor() {
    // Basic polling every 60 seconds
    interval(60000).pipe(
      startWith(0),
      switchMap(() => this.getNotifications())
    ).subscribe(notifications => {
      // In a real app, unread logic would be on the backend, 
      // here we just update a count for demo.
      this.unreadCount.set(notifications.length);
    });
  }

  getNotifications(): Observable<NotificationDto[]> {
    return this.http.get<ApiResponse<NotificationDto[]>>(this.url).pipe(
      map(res => res.data || [])
    );
  }

  sendToAllUsers(text: string): Observable<any> {
    return this.http.post(`${this.adminUrl}/all`, { text });
  }

  sendToOwner(ownerId: string, text: string): Observable<any> {
    return this.http.post(`${this.adminUrl}/owner/${ownerId}`, { text });
  }
}
