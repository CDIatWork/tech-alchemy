// Übung 5: AuthService — Authentifizierung und JWT-Token-Verwaltung
// Vergleichbar mit einem @SessionScoped CDI Bean für den Benutzer-Zustand.
// Verwendet localStorage für Persistenz über Seiten-Reloads — wie @SessionScoped + Cookie.
//
// HINWEIS: Dies ist ein simulierter Login für die Übung.
// In einer produktiven Anwendung würde hier ein echtes Backend aufgerufen.

import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

/** Benutzer-Modell */
export interface User {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal für den aktuell angemeldeten Benutzer (reaktiver State)
  currentUser = signal<User | null>(null);

  // Computed: automatisch abgeleiteter Wert — true wenn eingeloggt
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Benutzer aus localStorage wiederherstellen (wie @PostConstruct in CDI)
    this.restoreUser();
  }

  /**
   * Simulierter Login — speichert einen Fake-Token im localStorage.
   * In der Praxis: POST /api/auth/login mit echtem Backend.
   */
  login(email: string, password: string): Observable<{ token: string }> {
    // Einfache Validierung für die Übung
    if (!email || !password) {
      return throwError(() => new Error('E-Mail und Passwort sind erforderlich'));
    }

    // Akzeptiere jedes Passwort mit mindestens 3 Zeichen (nur für Demo!)
    if (password.length < 3) {
      return throwError(() => new Error('Ungültige Anmeldedaten'));
    }

    // Fake-Token erzeugen (Base64-codiertes JSON)
    const fakeToken = btoa(JSON.stringify({ email, role: 'user' }));
    localStorage.setItem('token', fakeToken);
    this.currentUser.set({ email });

    return of({ token: fakeToken });
  }

  /**
   * Logout — entfernt Token und setzt den Benutzer zurück.
   * Vergleichbar mit Session-Invalidierung in Java EE.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  /**
   * Token aus localStorage lesen — wird vom authInterceptor verwendet.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Benutzer aus gespeichertem Token wiederherstellen.
   * Wird im Konstruktor aufgerufen — wie @PostConstruct.
   */
  private restoreUser(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        if (payload.email) {
          this.currentUser.set({ email: payload.email });
        }
      } catch {
        // Ungültiger Token — aufräumen
        localStorage.removeItem('token');
      }
    }
  }
}
