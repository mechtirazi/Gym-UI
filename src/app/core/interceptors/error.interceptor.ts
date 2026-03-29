import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const SUSPENSION_MESSAGE = 'suspended';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Handle 500 wrapping authorization (backend quirk normalization)
      if (error.status === 500 && error.error?.message && error.error.message.toLowerCase().includes('this action is unauthorized')) {
        const normalizedError = new HttpErrorResponse({
          error: { message: 'Forbidden. You do not have permission.' },
          status: 403,
          headers: error.headers,
          statusText: 'Forbidden',
          url: error.url || undefined
        });
        return throwError(() => normalizedError);
      }

      // 2. Handle 422 Validation Errors globally
      if (error.status === 422) {
        // Standardize Laravel validation errors into a flat string or unified object
        let validationMessage = 'Validation failed.';
        if (error.error?.errors) {
          const messages = Object.values(error.error.errors).flat();
          validationMessage = messages.join(' ');
          
          // Auto-focus first invalid field
          const firstInvalidField = Object.keys(error.error.errors)[0];
          if (firstInvalidField) {
            setTimeout(() => {
              const el = document.querySelector('[formControlName="' + firstInvalidField + '"], [name="' + firstInvalidField + '"], #' + firstInvalidField + ', [id="' + firstInvalidField + '"]') as HTMLElement;
              if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        } else if (error.error?.message) {
          validationMessage = error.error.message;
        }
        
        const normalizedError = new HttpErrorResponse({
          error: { message: validationMessage, fieldErrors: error.error?.errors || {} },
          status: 422,
          headers: error.headers,
          statusText: 'Unprocessable Entity',
          url: error.url || undefined
        });
        return throwError(() => normalizedError);
      }

      // 3. Handle 403 Forbidden
      if (error.status === 403) {
        const message = error.error?.message || '';

        // 3a. Gym Suspension — redirect to /suspended without clearing token
        if (message.toLowerCase().includes(SUSPENSION_MESSAGE)) {
          console.warn('[Interceptor] Gym suspension detected. Redirecting to /suspended.');
          router.navigate(['/suspended']);
          return throwError(() => error);
        }

        // 3b. Generic 403 normalization
        const normalizedError = new HttpErrorResponse({
          error: { message: message || 'Forbidden. You do not have permission.', ...error.error },
          status: 403,
          headers: error.headers,
          statusText: 'Forbidden',
          url: error.url || undefined
        });
        return throwError(() => normalizedError);
      }

      // 4. Handle 402 Payment Required (Subscription Expired)
      if (error.status === 402) {
        const attemptedUrl = router.url;
        console.warn('[Interceptor] Subscription expired. Redirecting to /subscription-expired.');
        router.navigate(['/subscription-expired'], { queryParams: { returnUrl: attemptedUrl } });
        return throwError(() => error);
      }

      // Passthrough for others
      return throwError(() => error);
    })
  );
};
