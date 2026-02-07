package com.taskforge.repository;

// Uebung 3 (Bonus): @Alternative — Test-Implementierung.
// Mit @Priority(1000) global aktiviert — ueberschreibt alle anderen Implementierungen
// gleichen Typs, wenn sie denselben Qualifier tragen oder @Default verwenden.

import com.taskforge.model.Task;

import jakarta.annotation.Priority;
import jakarta.enterprise.inject.Alternative;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Mock-Implementierung fuer Tests.
 * @Alternative + @Priority(1000) — wird bevorzugt gegenueber
 * Nicht-Alternative-Beans, sofern kein Qualifier die Auswahl einschraenkt.
 *
 * Hinweis: Da InMemoryTaskRepository mit @InMemory qualifiziert ist,
 * greift die Alternative hier nur bei @Default-Injection-Points
 * (also ohne expliziten Qualifier).
 */
@Alternative
@Priority(1000)
@ApplicationScoped
public class MockTaskRepository implements TaskRepository {

    private final List<Task> tasks = new ArrayList<>();

    @Override
    public void add(Task task) {
        System.out.println("[MockTaskRepository] Task hinzugefuegt (Mock): " + task.getTitle());
        tasks.add(task);
    }

    @Override
    public List<Task> findAll() {
        return Collections.unmodifiableList(tasks);
    }

    @Override
    public Optional<Task> findByTitle(String title) {
        return tasks.stream()
                .filter(t -> t.getTitle().equalsIgnoreCase(title))
                .findFirst();
    }
}
