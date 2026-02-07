// Übung 3: TaskService — REST-Client für Aufgaben
// Vergleichbar mit einem @ApplicationScoped CDI Bean, das ein Repository kapselt.
// inject(HttpClient) entspricht @Inject HttpClient in CDI.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // HttpClient per inject() — wie @Inject in CDI
  private http = inject(HttpClient);

  // Basis-URL für die REST-API (wird durch proxy.conf.json an json-server weitergeleitet)
  private apiUrl = '/api/tasks';

  /**
   * Alle Aufgaben laden.
   * GET /api/tasks
   */
  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Eine einzelne Aufgabe per ID laden.
   * GET /api/tasks/:id
   */
  findById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Neue Aufgabe erstellen.
   * POST /api/tasks
   */
  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, {
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Aufgabe als erledigt markieren (Toggle).
   * PATCH /api/tasks/:id
   */
  complete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, {
      completed: true,
    });
  }

  /**
   * Aufgaben-Status umschalten (erledigt/offen).
   * PATCH /api/tasks/:id
   */
  toggleComplete(id: string, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, {
      completed,
    });
  }
}
