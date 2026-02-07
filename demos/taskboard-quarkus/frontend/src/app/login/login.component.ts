// Übung 5: LoginComponent — Login-Formular mit AuthService
//
// Einfaches Anmeldeformular mit E-Mail und Passwort.
// Nach erfolgreichem Login wird zur returnUrl oder /tasks navigiert.
// Der Login ist simuliert — kein echtes Backend nötig (siehe AuthService).

import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    .login-container {
      max-width: 420px;
      margin: 3rem auto;
      padding: 0 1.5rem;
    }

    .login-card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e8ecf1;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .login-card h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .login-subtitle {
      text-align: center;
      color: #718096;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .login-hint {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      font-size: 0.82rem;
      color: #718096;
      margin-top: 1rem;
      text-align: center;
    }
  `],
})
export class LoginComponent {
  // Services per inject()
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Fehlermeldung als Signal
  error = signal<string | null>(null);

  // Login-Formular
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  /** Login ausführen */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    const { email, password } = this.form.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        // Nach Login zur ursprünglichen Seite navigieren (returnUrl)
        // oder zur Aufgabenliste als Standard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tasks';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.error.set(err.message || 'Anmeldung fehlgeschlagen.');
      },
    });
  }
}
