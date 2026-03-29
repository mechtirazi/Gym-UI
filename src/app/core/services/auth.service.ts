import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { ApiAuthData, ApiResponse, UserVm } from '../models/api.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // State using Signals
  public currentUser = signal<any | null>(this.getUserFromStorage());
  public isAuthenticated = computed(() => !!this.currentUser());
  public connectedGymId = computed(() => this.currentUser()?.gym_id);

  public userRole = computed(() => this.currentUser()?.role || '');

  public isImpersonating = signal<boolean>(!!localStorage.getItem('original_admin_token'));

  getToken(): string | null { return this.tokenService.getToken(); }
  getApiUrl(): string { return environment.apiUrl; }
  register(payload: any): Observable<any> { return this.http.post(`${environment.apiUrl}/register`, payload); }
  handleSocialLogin(params: any): boolean { return true; }
  forgotPassword(email: string): Observable<any> { return this.http.post(`${environment.apiUrl}/forgot-password`, { email }); }
  resetPassword(payload: any): Observable<any> { return this.http.post(`${environment.apiUrl}/reset-password`, payload); }

  /** Log in user */
  login(payload: any): Observable<ApiResponse<ApiAuthData>> {
    return this.http.post<ApiResponse<ApiAuthData>>(`${environment.apiBaseUrl}/api/auth/login`, payload).pipe(
      tap(res => {
        if (res.success && res.data?.access_token) {
          this.tokenService.setToken(res.data.access_token);
          if (res.data.user) {
            this.currentUser.set(res.data.user);
          }
        }
      })
    );
  }

  /** Refresh token */
  refresh(): Observable<ApiResponse<ApiAuthData>> {
    return this.http.post<ApiResponse<ApiAuthData>>(`${environment.apiBaseUrl}/api/refresh`, {}).pipe(
      tap(res => {
        if (res.success && res.data?.access_token) {
          this.tokenService.setToken(res.data.access_token);
        }
      })
    );
  }

  /** Impersonate a user */
  impersonate(id_user: number, userName?: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${environment.apiBaseUrl}/api/admin/impersonate/${id_user}`, {}).pipe(
      tap(res => {
        if (res.success && res.data?.access_token) {
          const currentToken = this.tokenService.getToken();
          if (currentToken) {
            localStorage.setItem('original_admin_token', currentToken);
          }
          if (userName) {
            localStorage.setItem('impersonated_user_name', userName);
          } else if (res.data.user) {
            localStorage.setItem('impersonated_user_name', `${res.data.user.name} ${res.data.user.last_name || ''}`.trim());
          }
          this.tokenService.setToken(res.data.access_token);
          this.isImpersonating.set(true);
          
          // Re-initialize the user state before deciding where to route
          this.checkMe().subscribe(() => {
            const role = this.currentUser()?.role;
            if (role === 'owner') {
              window.open('/owner/dashboard', '_blank');
            } else if (role === 'member') {
              window.open('/member/dashboard', '_blank');
            } else {
              window.open('/', '_blank');
            }
          });
        }
      })
    );
  }

  /** Stop impersonating */
  stopImpersonating(): void {
    const originalToken = localStorage.getItem('original_admin_token');
    if (originalToken) {
      this.tokenService.setToken(originalToken);
    } else {
      this.tokenService.clearToken();
    }
    localStorage.removeItem('original_admin_token');
    localStorage.removeItem('impersonated_user_name');
    this.isImpersonating.set(false);
    window.location.reload();
  }

  /** Check me */
  checkMe(): Observable<ApiResponse<UserVm>> {
    const url = `${environment.apiBaseUrl}/api/me`;
    return this.http.get<ApiResponse<UserVm>>(url).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
        }
      })
    );
  }

  /** Resend verification */
  resendVerification(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${environment.apiBaseUrl}/api/auth/resend-verification`, { email });
  }

  /** Logout */
  logout(navigate: boolean = true): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.http.post(`${environment.apiBaseUrl}/api/logout`, {}).pipe(
        catchError(() => of(null)) // Ignore errors on logout
      ).subscribe();
    }
    this.tokenService.clearToken();
    this.currentUser.set(null);
    if (navigate) {
      this.router.navigate(['/auth/login']);
    }
  }

  updateCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  switchGym(gymId: number): void {
    const user: any = this.currentUser();
    if (user) {
      const updatedUser = { ...user, gym_id: gymId };
      this.updateCurrentUser(updatedUser);
      // Reload is necessary to force all services/components to re-fetch data for the new gym context
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  private getUserFromStorage(): any {
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

  getAvatarUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/storage/${path}`;
  }
}
