// Übung 2: Routing — Routen-Definition mit Lazy Loading
// Übung 5: authGuard schützt die /tasks-Routen
//
// Vergleichbar mit DeltaSpike ViewConfig — definiert alle Seiten der Anwendung.
// WICHTIG: 'tasks/new' muss VOR 'tasks/:id' stehen, sonst wird "new" als ID interpretiert!

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Startseite — ohne Guard, frei zugänglich
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },

  // Aufgabenliste — geschützt durch authGuard
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./task-list/task-list.component').then(m => m.TaskListComponent),
  },

  // Neue Aufgabe erstellen — geschützt (muss VOR :id stehen!)
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./create-task/create-task.component').then(m => m.CreateTaskComponent),
  },

  // Aufgaben-Detail — geschützt, mit Route-Parameter :id
  {
    path: 'tasks/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./task-detail/task-detail.component').then(m => m.TaskDetailComponent),
  },

  // Login-Seite — frei zugänglich
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },

  // Fallback: unbekannte Routen zur Startseite umleiten
  {
    path: '**',
    redirectTo: '',
  },
];
