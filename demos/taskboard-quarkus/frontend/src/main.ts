// Übung 0: Angular-Projekt-Setup — Bootstrap der Anwendung
// Einstiegspunkt der Angular-Anwendung. Hier wird die App gestartet.

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
