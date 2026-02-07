// Übung 4: CreateTaskComponent — Formular mit Reactive Forms und Validierung
//
// Vergleichbar mit einer JSF-Seite mit <h:form>, <h:inputText> und Bean Validation.
// Reactive Forms validieren in Echtzeit im Client — der Benutzer sieht Fehler sofort.
//
// WICHTIG: ReactiveFormsModule muss in den imports der Komponente stehen!

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-task.component.html',
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .form-card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e8ecf1;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .form-card h1 {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
  `],
})
export class CreateTaskComponent {
  // Services per inject()
  private taskService = inject(TaskService);
  private router = inject(Router);

  // Formular-Fehlermeldung
  submitError: string | null = null;

  // Reactive Form mit Validatoren (Übung 4)
  // Vergleichbar mit Bean Validation (@NotNull, @Size, etc.)
  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,        // @NotNull
      Validators.minLength(3),    // @Size(min = 3)
      Validators.maxLength(100),  // @Size(max = 100)
    ]),
    category: new FormControl('', [
      Validators.required,        // @NotNull
    ]),
    description: new FormControl(''),  // Optional — kein Validator
  });

  /**
   * Formular absenden — wie action="#{bean.save}" in JSF.
   * Erst wenn form.valid === true wird der Service aufgerufen.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      // Alle Felder als "touched" markieren, damit Fehler sichtbar werden
      this.form.markAllAsTouched();
      return;
    }

    this.submitError = null;

    this.taskService.create(this.form.value as Record<string, string>).subscribe({
      next: () => {
        // Nach erfolgreichem Erstellen zur Aufgabenliste navigieren
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.submitError = 'Aufgabe konnte nicht erstellt werden. Bitte versuchen Sie es erneut.';
      },
    });
  }
}
