import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);
  
  // Optionally skip loading for silent background requests (like monitoring)
  const isSilent = req.url.includes('/up') || req.url.includes('/api/refresh');
  
  if (!isSilent) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!isSilent) {
        loadingService.hide();
      }
    })
  );
};
