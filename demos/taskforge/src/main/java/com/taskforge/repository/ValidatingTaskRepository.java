package com.taskforge.repository;

// Uebung 7: Decorator — erweitert die Geschaeftslogik des TaskRepository.
// Validiert eingehende Tasks, bevor sie an die eigentliche Implementierung delegiert werden.

import com.taskforge.model.Task;

import jakarta.annotation.Priority;
import jakarta.decorator.Decorator;
import jakarta.decorator.Delegate;
import jakarta.enterprise.inject.Any;
import jakarta.inject.Inject;
import java.util.List;
import java.util.Optional;

/**
 * Validierender Decorator fuer das TaskRepository.
 * Prueft: Titel darf nicht null/leer sein und maximal 100 Zeichen lang.
 *
 * @Decorator — kennzeichnet die Klasse als Decorator.
 * @Priority(100) — aktiviert den Decorator und definiert die Reihenfolge.
 * @Delegate @Any — injiziert das dekorierte Bean (beliebiger Qualifier).
 *
 * Aufruf-Kette: Interceptors -> ValidatingTaskRepository -> echtes Repository
 */
@Decorator
@Priority(100)
public abstract class ValidatingTaskRepository implements TaskRepository {

    @Inject
    @Delegate
    @Any
    private TaskRepository delegate;

    @Override
    public void add(Task task) {
        // Validierung: Titel darf nicht null oder leer sein
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new IllegalArgumentException(
                    "Titel darf nicht leer sein!");
        }

        // Validierung: Titel maximal 100 Zeichen
        if (task.getTitle().length() > 100) {
            throw new IllegalArgumentException(
                    "Titel darf maximal 100 Zeichen lang sein! (aktuell: "
                            + task.getTitle().length() + ")");
        }

        System.out.println("[Validator] Task-Titel validiert: \"" + task.getTitle() + "\"");
        delegate.add(task);
    }

    // findAll() und findByTitle() werden automatisch an delegate weitergeleitet,
    // da die Klasse abstract ist und diese Methoden nicht ueberschrieben werden.

    @Override
    public List<Task> findAll() {
        return delegate.findAll();
    }

    @Override
    public Optional<Task> findByTitle(String title) {
        return delegate.findByTitle(title);
    }
}
