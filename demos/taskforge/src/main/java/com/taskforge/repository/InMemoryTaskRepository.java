package com.taskforge.repository;

// Uebung 1: Urspruengliche TaskRepository-Klasse.
// Uebung 2: @ApplicationScoped + @PostConstruct/@PreDestroy hinzugefuegt.
// Uebung 3: @InMemory Qualifier hinzugefuegt, Interface extrahiert.
// Uebung 8: @Repository Stereotype ersetzt direkte @ApplicationScoped-Annotation.

import com.taskforge.model.Task;
import com.taskforge.qualifier.InMemory;
import com.taskforge.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * In-Memory-Implementierung des TaskRepository.
 * Speichert Tasks in einer ArrayList — Daten gehen beim Beenden verloren.
 *
 * @InMemory — Qualifier fuer die typbasierte Auswahl.
 * @Repository — Stereotype (beinhaltet @ApplicationScoped).
 */
@InMemory
@Repository
public class InMemoryTaskRepository implements TaskRepository {

    private final List<Task> tasks = new ArrayList<>();

    @PostConstruct
    void init() {
        System.out.println("[InMemoryTaskRepository] Initialisiert (@PostConstruct)");
    }

    @PreDestroy
    void cleanup() {
        System.out.println("[InMemoryTaskRepository] Wird zerstoert (@PreDestroy) — "
                + tasks.size() + " Tasks verworfen");
    }

    @Override
    public void add(Task task) {
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
