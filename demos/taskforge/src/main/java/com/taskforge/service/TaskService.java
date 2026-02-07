package com.taskforge.service;

// Uebung 1: Grundlegende Geschaeftslogik mit @Inject.
// Uebung 3: Qualifier @InMemory fuer die Repository-Auswahl.
// Uebung 4: Instance<TaskRepository> fuer programmatischen Lookup.
// Uebung 5: Event<TaskEvent> fuer lose gekoppelte Kommunikation.
// Uebung 8: @Service Stereotype ersetzt direkte Annotationen.
// Uebung 9: @ConfigProperty (DeltaSpike) ersetzt eigenen ConfigProducer.

import com.taskforge.event.TaskEvent;
import com.taskforge.model.Task;
import com.taskforge.qualifier.InMemory;
import com.taskforge.repository.TaskRepository;
import com.taskforge.stereotype.Service;

import jakarta.enterprise.event.Event;
import jakarta.enterprise.inject.Any;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import org.apache.deltaspike.core.api.config.ConfigProperty;

import java.util.List;

/**
 * Zentrale Geschaeftslogik der TaskForge-Anwendung.
 * Orchestriert Task-Erzeugung, -Abschluss und -Auflistung.
 *
 * @Service — Stereotype (beinhaltet @Dependent, @Logged, @Timed).
 */
@Service
public class TaskService {

    // Uebung 3: Injection mit Qualifier — waehlt InMemoryTaskRepository
    @Inject
    @InMemory
    private TaskRepository repository;

    // Uebung 5: Event-Injection fuer lose Kopplung
    @Inject
    private Event<TaskEvent> taskEvent;

    // Uebung 9: DeltaSpike @ConfigProperty statt eigenem ConfigProducer
    @Inject
    @ConfigProperty(name = "app.name")
    private String appName;

    // Uebung 4: Instance<T> fuer programmatischen Lookup aller Repository-Implementierungen
    @Inject
    @Any
    private Instance<TaskRepository> allRepositories;

    /**
     * Erstellt einen neuen Task und feuert ein CREATED-Event.
     */
    public Task createTask(String title) {
        Task task = new Task(title);
        repository.add(task);
        taskEvent.fire(new TaskEvent(task, TaskEvent.Action.CREATED));
        return task;
    }

    /**
     * Markiert einen Task als erledigt und feuert ein COMPLETED-Event.
     */
    public boolean completeTask(String title) {
        return repository.findByTitle(title).map(task -> {
            task.setCompleted(true);
            taskEvent.fire(new TaskEvent(task, TaskEvent.Action.COMPLETED));
            return true;
        }).orElse(false);
    }

    /**
     * Listet alle Tasks auf der Konsole auf.
     */
    public void listTasks() {
        List<Task> tasks = repository.findAll();
        if (tasks.isEmpty()) {
            System.out.println("  Keine Tasks vorhanden.");
        } else {
            tasks.forEach(t -> System.out.println("  " + t));
        }
    }

    /**
     * Gibt den konfigurierten Anwendungsnamen zurueck (DeltaSpike @ConfigProperty).
     */
    public String getAppName() {
        return appName;
    }

    /**
     * Uebung 4: Listet alle verfuegbaren TaskRepository-Implementierungen per Instance<T>.
     */
    public void listAllRepositoryImplementations() {
        System.out.println("  Verfuegbare Repository-Implementierungen:");
        for (TaskRepository repo : allRepositories) {
            System.out.println("    - " + repo.getClass().getSimpleName());
        }
    }
}
