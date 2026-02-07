-- Seed data matching the original db.json
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (1, 'Angular Grundlagen lernen', 'learning', 'Komponenten, Templates und Signals verstehen — die Basis für jede Angular-Anwendung.', true, '2025-01-15T09:00:00.000Z');
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (2, 'REST-API mit Quarkus erstellen', 'work', 'JAX-RS Endpoints für die TaskBoard-Anwendung implementieren. CRUD-Operationen für Tasks bereitstellen.', false, '2025-01-16T10:30:00.000Z');
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (3, 'TaskBoard-Frontend mit Angular bauen', 'work', 'Standalone Components, Routing und HttpClient-Integration für das TaskBoard umsetzen.', false, '2025-01-17T14:00:00.000Z');
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (4, 'DeltaSpike zu MicroProfile migrieren', 'learning', 'ConfigResolver durch MicroProfile Config ersetzen, BeanProvider-Aufrufe durch CDI.current() ablösen.', false, '2025-01-18T08:15:00.000Z');
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (5, 'Unit-Tests schreiben', 'work', 'Jasmine-Tests für TaskService und TaskListComponent erstellen. Mindestens 80% Code-Abdeckung anstreben.', false, '2025-01-19T11:00:00.000Z');
INSERT INTO task (id, title, category, description, completed, createdAt) VALUES (6, 'TypeScript-Buch lesen', 'personal', 'Kapitel über Generics und Utility Types nachlesen — besonders Partial<T>, Pick<T> und Omit<T>.', true, '2025-01-20T16:45:00.000Z');

-- Restart sequence above seed IDs to avoid collisions
ALTER SEQUENCE task_seq RESTART WITH 100;
