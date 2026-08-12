import { HttpInterceptorFn } from '@angular/common/http';
import { UserTokenStore } from '../services/user-token-store';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userTokenStore = inject(UserTokenStore);

  const HAS_TOKEN = userTokenStore.hasToken();

  if (HAS_TOKEN) {
    const newRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userTokenStore.getToken()}`,
      },
    });
    return next(newRequest);
  }
  return next(req);
};
