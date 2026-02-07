// Übung 2 (Routing) + Übung 3 (HttpClient) + Übung 5 (Interceptor):
// ApplicationConfig — zentrale Provider-Konfiguration der Anwendung.
// Vergleichbar mit beans.xml + web.xml in CDI/Java EE.

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js Change Detection aktivieren
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router aktivieren — definiert die Navigation der SPA
    provideRouter(routes),

    // HttpClient bereitstellen — mit Auth-Interceptor für JWT-Token
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
};
