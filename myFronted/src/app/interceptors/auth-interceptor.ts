import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Toast } from '../services/toast';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  const token = auth.getToken();
  const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(cloned).pipe(
    catchError((err: any) => {
      if (err && err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      } else if (err && err.status === 403) {
        toast.show('אין לך הרשאה לבצע פעולה זו', 'error');
      }
      return throwError(() => err);
    })
  );
};
