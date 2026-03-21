import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../../shared/models/user.model';
import { Router, Params } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  // State using Signals
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role);

  constructor(private http: HttpClient, private router: Router) { }

  getApiUrl(): string {
    return this.API_URL;
  }

  handleSocialLogin(params: Params): boolean {
    const token = params['token'];
    const userParam = params['u'] || params['user'];

    if (!token || !userParam) return false;

    try {
      const isBase64 = !!params['u'];
      const userStr = isBase64 ? atob(userParam) : userParam;
      const user = JSON.parse(userStr);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', userStr);
      this.currentUser.set(user);
      return true;
    } catch (e) {
      console.error('Social login parsing error:', e);
      return false;
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuthentication(response: AuthResponse): void {
    if (response.success && response.data) {
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from storage', error);
      localStorage.removeItem('user');
      return null;
    }
  }
}
