package com.taskforge.repository;

// Uebung 3: Interface — extrahiert aus der urspruenglichen TaskRepository-Klasse.
// Ermoeglicht Qualifier-basierte Auswahl und ist Voraussetzung fuer den Decorator (Uebung 7).

import com.taskforge.model.Task;

import java.util.List;
import java.util.Optional;

/**
 * Definiert die Schnittstelle fuer Task-Persistenz.
 * Implementierungen: InMemoryTaskRepository, FileTaskRepository, MockTaskRepository.
 */
public interface TaskRepository {

    void add(Task task);

    List<Task> findAll();

    Optional<Task> findByTitle(String title);
}
