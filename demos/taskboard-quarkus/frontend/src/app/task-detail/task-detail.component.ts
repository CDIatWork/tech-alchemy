// Übung 2: TaskDetailComponent — Detail-Ansicht einer Aufgabe
// Übung 3: Daten vom TaskService per Route-Parameter laden
//
// Vergleichbar mit einer JSF-Detail-Seite, die über einen Query-Parameter (z.B. ?id=42)
// eine einzelne Entität lädt. In Angular wird stattdessen der Route-Parameter :id verwendet.

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Task } from '../task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './task-detail.component.html',
  styles: [`
    .detail-container {
      max-width: 700px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: #4361ee;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .detail-card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e8ecf1;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .detail-card h1 {
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }

    .detail-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .meta-item {
      font-size: 0.9rem;
      color: #718096;
    }

    .meta-item strong {
      color: #4a5568;
    }

    .detail-description {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      color: #4a5568;
      line-height: 1.6;
    }

    .detail-actions {
      display: flex;
      gap: 0.75rem;
    }
  `],
})
export class TaskDetailComponent implements OnInit {
  // Services per inject() — wie @Inject
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  // Signals für reaktiven State
  task = signal<Task | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Route-Parameter :id auslesen — wie @PathParam in JAX-RS
    const id = this.route.snapshot.params['id'];
    this.loadTask(id);
  }

  /** Aufgabe vom Backend laden */
  private loadTask(id: string): void {
    this.taskService.findById(id).pipe(
      catchError(err => {
        this.error.set('Aufgabe konnte nicht geladen werden.');
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(data => this.task.set(data));
  }

  /** Status umschalten (erledigt/offen) */
  toggleComplete(): void {
    const current = this.task();
    if (!current) return;

    this.taskService.toggleComplete(current.id, !current.completed)
      .subscribe({
        next: (updated) => this.task.set(updated),
        error: () => this.error.set('Status konnte nicht geändert werden.'),
      });
  }

  /** Zurück zur Liste navigieren */
  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
