// Übung 5: authGuard — funktionaler Route Guard
// Vergleichbar mit DeltaSpike @Secured / AccessDecisionVoter.
// Prüft ob der Benutzer eingeloggt ist und leitet ggf. zum Login weiter.
//
// WICHTIG: Client-seitige Guards sind nur UX — sie verhindern die Navigation,
// aber NICHT den API-Zugriff. Das Backend muss die echte Sicherheit gewährleisten!

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    // Benutzer ist eingeloggt — Zugriff erlauben
    return true;
  }

  // Nicht eingeloggt — zum Login weiterleiten mit Rückkehr-URL
  return router.createUrlTree(
    ['/login'],
    { queryParams: { returnUrl: state.url } }
  );
};
