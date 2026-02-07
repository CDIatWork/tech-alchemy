package com.taskforge;

// Uebung 0: Main-Klasse mit CDI-Container (Weld SE).
// Erweitert in jeder Uebung — zeigt am Ende alle CDI-Features im Zusammenspiel.

import com.taskforge.service.TaskService;
import com.taskforge.service.TaskStatistics;

import jakarta.enterprise.inject.se.SeContainer;
import jakarta.enterprise.inject.se.SeContainerInitializer;

/**
 * Einstiegspunkt der TaskForge-Anwendung.
 * Startet den Weld-SE-Container und demonstriert alle CDI-Features:
 *
 *   Uebung 0:  Projekt-Setup, CDI-Container starten
 *   Uebung 1:  Task, TaskRepository, TaskService mit @Inject
 *   Uebung 2:  @ApplicationScoped, @PostConstruct, @PreDestroy
 *   Uebung 3:  Interface, @InMemory/@Persistent Qualifier, @Alternative
 *   Uebung 4:  ConfigProducer mit @Produces, @ConfigValue, Instance<T>
 *   Uebung 5:  TaskEvent, Event-Firing, @Observes (TaskLogger, TaskStatistics)
 *   Uebung 6:  @Timed + @Logged Interceptors mit @Priority
 *   Uebung 7:  ValidatingTaskRepository @Decorator
 *   Uebung 8:  @Service und @Repository Stereotypes
 *   Uebung 9:  DeltaSpike @ConfigProperty, @Exclude, apache-deltaspike.properties
 */
public class TaskForgeApp {

    public static void main(String[] args) {
        try (SeContainer container = SeContainerInitializer
                .newInstance().initialize()) {

            System.out.println("=".repeat(60));
            System.out.println("  TaskForge CDI Demo — Alle 10 Uebungen");
            System.out.println("=".repeat(60));

            // --- TaskService aus dem Container holen (Uebung 1) ---
            TaskService taskService = container.select(TaskService.class).get();

            // --- DeltaSpike @ConfigProperty demonstrieren (Uebung 9) ---
            System.out.println();
            System.out.println("--- Konfiguration (DeltaSpike @ConfigProperty) ---");
            System.out.println("  App-Name: " + taskService.getAppName());

            // --- Tasks erstellen (Uebung 1, Events: Uebung 5) ---
            // Hinweis: Interceptors (@Logged, @Timed) und Decorator (Validator)
            // werden automatisch in der Aufrufkette aktiv.
            System.out.println();
            System.out.println("--- Tasks erstellen ---");
            taskService.createTask("CDI-Grundlagen lernen");
            taskService.createTask("Qualifier implementieren");
            taskService.createTask("Interceptors testen");

            // --- Task als erledigt markieren (Uebung 5: COMPLETED-Event) ---
            System.out.println();
            System.out.println("--- Task abschliessen ---");
            taskService.completeTask("CDI-Grundlagen lernen");

            // --- Alle Tasks auflisten (Uebung 1) ---
            System.out.println();
            System.out.println("--- Aktuelle Task-Liste ---");
            taskService.listTasks();

            // --- Statistik anzeigen (Uebung 5: @Observes) ---
            System.out.println();
            System.out.println("--- Statistik (TaskStatistics per @Observes) ---");
            TaskStatistics stats = container.select(TaskStatistics.class).get();
            System.out.println("  " + stats.getSummary());

            // --- Alle Repository-Implementierungen auflisten (Uebung 4: Instance<T>) ---
            System.out.println();
            System.out.println("--- Repository-Implementierungen (Instance<T>) ---");
            taskService.listAllRepositoryImplementations();

            // --- Decorator-Validierung testen (Uebung 7) ---
            System.out.println();
            System.out.println("--- Decorator-Validierung testen ---");
            try {
                taskService.createTask("");
            } catch (IllegalArgumentException e) {
                System.out.println("  Erwartet: " + e.getMessage());
            }

            System.out.println();
            System.out.println("=".repeat(60));
            System.out.println("  TaskForge beendet — @PreDestroy folgt...");
            System.out.println("=".repeat(60));

        } // Container wird geschlossen -> @PreDestroy-Callbacks werden aufgerufen
    }
}
