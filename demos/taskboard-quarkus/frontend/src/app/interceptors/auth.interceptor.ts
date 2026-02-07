// Übung 5: authInterceptor — funktionaler HTTP-Interceptor
// Vergleichbar mit einem Servlet-Filter oder CDI-Interceptor (@AroundInvoke).
// Hängt den JWT-Token automatisch an jeden ausgehenden HTTP-Request.

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    // Request klonen und Authorization-Header hinzufügen
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // Kein Token vorhanden — Request unverändert weiterleiten
  return next(req);
};
