import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { AdminOwnersService } from '../services/admin-owners.service';
import { NotificationsService } from '../services/notifications.service';

export const dashboardResolver: ResolveFn<any> = () => {
  return forkJoin({
    owners: inject(AdminOwnersService).getOwners().pipe(catchError(() => of([]))),
    notifications: inject(NotificationsService).getNotifications().pipe(catchError(() => of([])))
  });
};
