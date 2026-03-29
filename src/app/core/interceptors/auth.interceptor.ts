import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);
let ObjectToThrow: any = null;

export const IS_RETRY = new HttpContextToken<boolean>(() => false);
function addTokenHeader(request: HttpRequest<any>, token: string | null) {
  const authService = inject(AuthService);
  const gymId = authService.connectedGymId();
  
  let headers: any = {
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (gymId) {
    headers['X-Gym-Id'] = gymId.toString();
  }

  return request.clone({ setHeaders: headers });
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const token = tokenService.getToken();

  // Skip refresh requests to avoid infinite loops
  if (req.url.includes('/api/refresh') || req.url.includes('/api/auth/login')) {
    return next(addTokenHeader(req, token));
  }

  const clonedReq = addTokenHeader(req, token);

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized globally for token refresh
      if (error.status === 401 && !req.context.get(IS_RETRY)) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refresh().pipe(
            switchMap((res) => {
              isRefreshing = false;
              const newToken = res.data?.access_token || tokenService.getToken();
              if (newToken) {
                refreshTokenSubject.next(newToken);
                return next(addTokenHeader(req.clone({ context: req.context.set(IS_RETRY, true) }), newToken));
              } else {
                authService.logout(true);
                refreshTokenSubject.error(error);
                refreshTokenSubject = new BehaviorSubject<string | null>(null);
                return throwError(() => error);
              }
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout(true);
              refreshTokenSubject.error(err);
              refreshTokenSubject = new BehaviorSubject<string | null>(null);
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(newToken => newToken !== null),
            take(1),
            switchMap((newToken) => {
              return next(addTokenHeader(req.clone({ context: req.context.set(IS_RETRY, true) }), newToken as string));
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
