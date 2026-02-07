// Übung 0: Projekt-Setup — Root-Komponente
// Übung 2: Navigation mit routerLink hinzugefügt
// Übung 5: Login/Logout-Button je nach Auth-State
//
// Die AppComponent ist das Layout der gesamten Anwendung.
// Vergleichbar mit einem JSF-Template (template.xhtml) mit <ui:insert>.

import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styles: [`
    /* Navigation */
    .navbar {
      background: #1a1f36;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .navbar-brand {
      color: #fff;
      font-size: 1.15rem;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: 0.02em;
    }

    .navbar-brand:hover {
      color: #fff;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: 5px;
      font-size: 0.9rem;
      transition: color 0.2s, background 0.2s;
    }

    .nav-links a:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
      text-decoration: none;
    }

    .nav-links a.active {
      color: #fff;
      background: rgba(67, 97, 238, 0.35);
    }

    /* Auth-Bereich in der Navigation */
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-user {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
    }

    .btn-nav {
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.3rem 0.8rem;
      border-radius: 5px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-nav:hover {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.08);
    }

    /* Hauptinhalt */
    .main-content {
      min-height: calc(100vh - 56px);
    }
  `],
})
export class AppComponent {
  // AuthService per inject() — vergleichbar mit @Inject in CDI
  auth = inject(AuthService);
}
