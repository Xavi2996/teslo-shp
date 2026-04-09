import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '@auth/services/auth-service.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const token = inject(AuthServiceService).token();
  // Clone the request to add the authentication header.

  // console.log('token', token);
  // console.log(req);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
