// Übung 1: TaskListComponent — Aufgabenliste mit Signals
// Übung 2: Navigation zur Detail-Ansicht hinzugefügt
// Übung 3: Daten vom TaskService laden (statt hardcodiert), Loading/Error-State
//
// Vergleichbar mit einem JSF-Bean (@Named @ViewAccessScoped) das eine Liste rendert.
// signal() und computed() ersetzen die EL-Ausdrücke und das automatische Re-Rendering.

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Task } from '../task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './task-list.component.html',
  styles: [`
    .task-list-header {
      max-width: 800px;
      margin: 2rem auto 0;
      padding: 0 1.5rem;
    }

    .task-list-header .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .counters {
      display: flex;
      gap: 0.75rem;
    }

    .task-grid {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Einzelne Task-Karte */
    .task-card {
      background: #fff;
      border-radius: 10px;
      padding: 1rem 1.25rem;
      border: 1px solid #e8ecf1;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.15s;
    }

    .task-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .task-card.completed {
      opacity: 0.65;
    }

    .task-card.completed .task-title {
      text-decoration: line-through;
      color: #a0aec0;
    }

    .task-info {
      flex: 1;
      min-width: 0;
    }

    .task-title {
      font-weight: 600;
      font-size: 1rem;
      color: #1a1f36;
      margin-bottom: 0.2rem;
    }

    .task-meta {
      font-size: 0.82rem;
      color: #718096;
    }

    .task-actions {
      flex-shrink: 0;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #a0aec0;
    }
  `],
})
export class TaskListComponent implements OnInit {
  // Services per inject() — wie @Inject in CDI
  private taskService = inject(TaskService);
  router = inject(Router);

  // Signals — reaktiver State (Übung 1 + 3)
  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Computed: abgeleitete Werte — automatisch aktualisiert (Übung 1)
  openCount = computed(() =>
    this.tasks().filter(t => !t.completed).length
  );

  completedCount = computed(() =>
    this.tasks().filter(t => t.completed).length
  );

  // Lifecycle: ngOnInit — wie @PostConstruct in CDI
  ngOnInit(): void {
    this.loadTasks();
  }

  /** Aufgaben vom Backend laden (Übung 3) */
  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.findAll().pipe(
      // Fehlerbehandlung — wie try/catch im CDI-Bean
      catchError(err => {
        this.error.set('Aufgaben konnten nicht geladen werden. Ist der json-server gestartet?');
        return of([]);
      }),
      // Loading-State zurücksetzen — wie ein finally-Block
      finalize(() => this.loading.set(false))
    ).subscribe(data => this.tasks.set(data));
  }

  /** Aufgabe als erledigt markieren (Übung 1 + 3) */
  complete(task: Task, event: Event): void {
    event.stopPropagation(); // Verhindert Navigation zur Detail-Ansicht

    this.taskService.toggleComplete(task.id, !task.completed).subscribe({
      next: (updated) => {
        // Signal immutable aktualisieren — neue Liste erzeugen
        this.tasks.update(list =>
          list.map(t => t.id === updated.id ? updated : t)
        );
      },
      error: () => {
        this.error.set('Status konnte nicht aktualisiert werden.');
      },
    });
  }

  /** Zur Detail-Ansicht navigieren (Übung 2) */
  goToDetail(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }
}
