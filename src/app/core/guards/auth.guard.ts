import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CapabilityService } from '../services/capability.service';

export const superAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.currentUser();
  if (user) {
    return (user.role === 'super_admin' || authService.isImpersonating()) ? true : router.parseUrl('/auth/login');
  }
  
  const token = authService.getToken();
  if (!token) {
    return router.parseUrl('/auth/login');
  }

  // If token exists but user isn't in state (e.g. refresh), we call checkMe and wait
  return authService.checkMe().pipe(
    map(res => {
      if (res.success && (res.data?.role === 'super_admin' || authService.isImpersonating())) {
        return true;
      }
      return router.parseUrl('/auth/login');
    }),
    catchError(() => of(router.parseUrl('/auth/login')))
  );
};

export const capabilityGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const capabilityService = inject(CapabilityService);
  const router = inject(Router);

  // We read the required capability from route data
  const requiredCapability = route.data['capability'] as string;
  if (!requiredCapability) {
    return true; // No guard if no capability required
  }

  if (capabilityService.can(requiredCapability)) {
    return true;
  }

  // Fallback to dashboard with forbidden flag or unauthorized component
  return router.parseUrl('/dashboard?error=forbidden');
};
