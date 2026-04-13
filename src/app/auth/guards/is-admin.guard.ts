import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';
import { firstValueFrom, of } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthServiceService);

  const router = inject(Router);

  await firstValueFrom(authService.checkAuthStatus());

  const user = authService.user();
  console.log({ user });

  if (!user || !user.roles.includes('admin')) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
