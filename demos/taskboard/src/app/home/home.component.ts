// Übung 2: HomeComponent — Willkommensseite
// Die Startseite der Anwendung mit Links zu den wichtigsten Bereichen.

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: [`
    .hero {
      text-align: center;
      padding: 4rem 1.5rem 2rem;
    }

    .hero h1 {
      font-size: 2.2rem;
      margin-bottom: 0.75rem;
      color: #1a1f36;
    }

    .hero p {
      font-size: 1.1rem;
      color: #718096;
      max-width: 520px;
      margin: 0 auto 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      max-width: 800px;
      margin: 2rem auto 0;
      padding: 0 1.5rem;
    }

    .feature-card {
      display: block;
      background: #fff;
      border-radius: 10px;
      padding: 1.5rem;
      border: 1px solid #e8ecf1;
      text-align: center;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.15s;
    }

    .feature-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .feature-card h3 {
      margin-bottom: 0.4rem;
      color: #4361ee;
    }

    .feature-card p {
      font-size: 0.9rem;
      color: #718096;
      margin: 0;
    }

    .feature-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  `],
})
export class HomeComponent {}
