// Übung 1: Task-Modell — TypeScript-Interface für eine Aufgabe
// Vergleichbar mit einer JPA-Entity oder einem CDI-Event-Objekt.
// In TypeScript reicht ein Interface (Structural Typing — kein "implements" nötig).

export interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO-8601 Datum vom Backend (json-server)
}
