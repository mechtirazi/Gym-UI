import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AdminOwnersService } from '../services/admin-owners.service';
import { UserVm } from '../models/api.models';
import { catchError, of } from 'rxjs';

export const ownersResolver: ResolveFn<UserVm[]> = () => {
  return inject(AdminOwnersService).getOwners().pipe(catchError(() => of([] as UserVm[])));
};
