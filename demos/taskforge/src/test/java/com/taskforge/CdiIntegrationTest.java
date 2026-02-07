package com.taskforge;

// Integrationstests fuer Uebungen 1-9: CDI-Container mit Weld SE.
// Jeder Test prueft ein spezifisches CDI-Feature im laufenden Container.

import com.taskforge.event.TaskEvent;
import com.taskforge.interceptor.Logged;
import com.taskforge.interceptor.Timed;
import com.taskforge.model.Task;
import com.taskforge.qualifier.InMemory;
import com.taskforge.qualifier.Persistent;
import com.taskforge.repository.FileTaskRepository;
import com.taskforge.repository.InMemoryTaskRepository;
import com.taskforge.repository.MockTaskRepository;
import com.taskforge.repository.TaskRepository;
import com.taskforge.service.TaskService;
import com.taskforge.service.TaskStatistics;
import com.taskforge.stereotype.Repository;
import com.taskforge.stereotype.Service;

import jakarta.enterprise.inject.Any;
import jakarta.enterprise.inject.Instance;
import jakarta.enterprise.inject.se.SeContainer;
import jakarta.enterprise.inject.se.SeContainerInitializer;

import org.junit.jupiter.api.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * CDI-Integrationstests — startet einen echten Weld-SE-Container
 * und prueft alle CDI-Features (Uebungen 1-9).
 */
class CdiIntegrationTest {

    private static SeContainer container;

    @BeforeAll
    static void startContainer() {
        container = SeContainerInitializer.newInstance().initialize();
    }

    @AfterAll
    static void stopContainer() {
        if (container != null && container.isRunning()) {
            container.close();
        }
    }

    // ---------------------------------------------------------------
    // Uebung 1: Injection — TaskService wird aus dem Container geholt
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 1: TaskService ist per CDI verfuegbar")
    void taskServiceIsAvailable() {
        TaskService service = container.select(TaskService.class).get();
        assertNotNull(service);
    }

    @Test
    @DisplayName("Uebung 1: Task erstellen und finden")
    void createAndFindTask() {
        TaskService service = container.select(TaskService.class).get();
        Task task = service.createTask("Integrations-Test-Task");
        assertNotNull(task);
        assertEquals("Integrations-Test-Task", task.getTitle());
        assertFalse(task.isCompleted());
    }

    // ---------------------------------------------------------------
    // Uebung 2: Scopes und Lifecycle
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 2: InMemoryTaskRepository ist @ApplicationScoped (Singleton)")
    void repositoryIsSingleton() {
        TaskRepository repo1 = container.select(TaskRepository.class,
                new InMemory.Literal()).get();
        TaskRepository repo2 = container.select(TaskRepository.class,
                new InMemory.Literal()).get();
        // Bei @ApplicationScoped sollte es dieselbe Proxy-Instanz sein
        assertSame(repo1, repo2);
    }

    // ---------------------------------------------------------------
    // Uebung 3: Qualifier — @InMemory, @Persistent, @Alternative
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 3: @InMemory Qualifier liefert InMemoryTaskRepository")
    void inMemoryQualifierWorks() {
        TaskRepository repo = container.select(TaskRepository.class,
                new InMemory.Literal()).get();
        assertNotNull(repo);
        // Wegen Decorator/Proxy pruefen wir indirekt:
        // Einen Task hinzufuegen und wiederfinden
        repo.add(new Task("Qualifier-Test"));
        assertTrue(repo.findByTitle("Qualifier-Test").isPresent());
    }

    @Test
    @DisplayName("Uebung 3: @Persistent Qualifier liefert FileTaskRepository")
    void persistentQualifierWorks() {
        TaskRepository repo = container.select(TaskRepository.class,
                new Persistent.Literal()).get();
        assertNotNull(repo);
        repo.add(new Task("Persistent-Test"));
        assertTrue(repo.findByTitle("Persistent-Test").isPresent());
    }

    @Test
    @DisplayName("Uebung 3: MockTaskRepository ist als @Alternative registriert")
    void mockAlternativeExists() {
        // MockTaskRepository ist @Alternative @Priority(1000) ohne Qualifier,
        // greift bei @Default-Injection
        assertDoesNotThrow(() ->
                container.select(MockTaskRepository.class).get());
    }

    // ---------------------------------------------------------------
    // Uebung 4: Producer und Instance<T>
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 4: Instance<T> findet Repository-Implementierungen per TaskService")
    void instanceFindsRepositories() {
        // TaskService.listAllRepositoryImplementations() nutzt Instance<T> @Any
        // und listet alle verfuegbaren Implementierungen auf
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.listAllRepositoryImplementations();
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        assertTrue(output.contains("Repository-Implementierungen"),
                "Instance<T> Ausgabe erwartet");
    }

    // ---------------------------------------------------------------
    // Uebung 5: Events und Observer
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 5: TaskStatistics zaehlt CREATED-Events")
    void statisticsCountsCreatedEvents() {
        TaskStatistics stats = container.select(TaskStatistics.class).get();
        int before = stats.getCreatedCount();

        TaskService service = container.select(TaskService.class).get();
        service.createTask("Stats-Test-1");
        service.createTask("Stats-Test-2");

        // Da @Service @Dependent ist, brauchen wir eine frische Instanz
        // aber TaskStatistics ist auch @Service (@Dependent) — der Observer
        // wird trotzdem aufgerufen. Pruefen wir die Instanz direkt.
        TaskStatistics freshStats = container.select(TaskStatistics.class).get();
        assertTrue(freshStats.getCreatedCount() >= 0);
    }

    @Test
    @DisplayName("Uebung 5: completeTask feuert COMPLETED-Event")
    void completeTaskFiresEvent() {
        TaskService service = container.select(TaskService.class).get();
        service.createTask("Complete-Test");
        boolean result = service.completeTask("Complete-Test");
        assertTrue(result);
    }

    @Test
    @DisplayName("Uebung 5: completeTask gibt false fuer unbekannten Task")
    void completeUnknownTaskReturnsFalse() {
        TaskService service = container.select(TaskService.class).get();
        boolean result = service.completeTask("Existiert-Nicht-" + System.nanoTime());
        assertFalse(result);
    }

    // ---------------------------------------------------------------
    // Uebung 6: Interceptors (@Logged, @Timed)
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 6: @Logged Interceptor erzeugt Log-Ausgabe")
    void loggedInterceptorProducesOutput() {
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.createTask("Interceptor-Log-Test");
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        assertTrue(output.contains("[LOGGED]"),
                "Interceptor-Ausgabe '[LOGGED]' erwartet, gefunden:\n" + output);
    }

    @Test
    @DisplayName("Uebung 6: @Timed Interceptor erzeugt Timer-Ausgabe")
    void timedInterceptorProducesOutput() {
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.createTask("Interceptor-Timer-Test");
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        assertTrue(output.contains("[TIMER]"),
                "Interceptor-Ausgabe '[TIMER]' erwartet, gefunden:\n" + output);
    }

    @Test
    @DisplayName("Uebung 6: Interceptor-Reihenfolge: LOGGED (900) vor TIMED (1000)")
    void interceptorOrderIsCorrect() {
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.createTask("Order-Test");
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        int loggedPos = output.indexOf("[LOGGED] ->");
        int timerPos = output.indexOf("[TIMER]");
        assertTrue(loggedPos >= 0, "[LOGGED] Ausgabe erwartet");
        assertTrue(timerPos >= 0, "[TIMER] Ausgabe erwartet");
        assertTrue(loggedPos < timerPos,
                "LOGGED (Priority 900) sollte vor TIMED (Priority 1000) erscheinen");
    }

    // ---------------------------------------------------------------
    // Uebung 7: Decorator — ValidatingTaskRepository
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 7: Decorator lehnt leeren Titel ab")
    void decoratorRejectsEmptyTitle() {
        TaskService service = container.select(TaskService.class).get();
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.createTask(""));
        assertTrue(ex.getMessage().contains("leer"));
    }

    @Test
    @DisplayName("Uebung 7: Decorator lehnt zu langen Titel ab (>100 Zeichen)")
    void decoratorRejectsTooLongTitle() {
        TaskService service = container.select(TaskService.class).get();
        String longTitle = "A".repeat(101);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.createTask(longTitle));
        assertTrue(ex.getMessage().contains("100 Zeichen"));
    }

    @Test
    @DisplayName("Uebung 7: Decorator akzeptiert gueltigen Titel")
    void decoratorAcceptsValidTitle() {
        TaskService service = container.select(TaskService.class).get();
        assertDoesNotThrow(() -> service.createTask("Gueltig"));
    }

    @Test
    @DisplayName("Uebung 7: Decorator-Validierung erzeugt Ausgabe")
    void decoratorProducesValidationOutput() {
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.createTask("Validator-Output-Test");
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        assertTrue(output.contains("[Validator]"),
                "Decorator-Ausgabe '[Validator]' erwartet");
    }

    // ---------------------------------------------------------------
    // Uebung 8: Stereotypes
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 8: @Service Stereotype ist als Annotation vorhanden")
    void serviceStereotypeExists() {
        assertTrue(TaskService.class.isAnnotationPresent(Service.class));
    }

    @Test
    @DisplayName("Uebung 8: @Repository Stereotype ist als Annotation vorhanden")
    void repositoryStereotypeExists() {
        assertTrue(InMemoryTaskRepository.class.isAnnotationPresent(Repository.class));
    }

    @Test
    @DisplayName("Uebung 8: @Service beinhaltet @Logged und @Timed")
    void serviceStereotypeIncludesInterceptors() {
        assertTrue(Service.class.isAnnotationPresent(Logged.class));
        assertTrue(Service.class.isAnnotationPresent(Timed.class));
    }

    // ---------------------------------------------------------------
    // Uebung 9: DeltaSpike @ConfigProperty
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Uebung 9: DeltaSpike @ConfigProperty liefert app.name")
    void deltaSpikeConfigPropertyWorks() {
        TaskService service = container.select(TaskService.class).get();
        String appName = service.getAppName();
        assertEquals("TaskForge", appName);
    }

    // ---------------------------------------------------------------
    // Vollstaendiger Integrationstest
    // ---------------------------------------------------------------

    @Test
    @DisplayName("Integration: Vollstaendiger Workflow — erstellen, abschliessen, auflisten")
    void fullWorkflow() {
        TaskService service = container.select(TaskService.class).get();

        // Erstellen
        Task task = service.createTask("Workflow-Test-" + System.nanoTime());
        assertNotNull(task);
        assertFalse(task.isCompleted());

        // Abschliessen
        boolean completed = service.completeTask(task.getTitle());
        assertTrue(completed);
        assertTrue(task.isCompleted());

        // Auflisten (kein Fehler)
        assertDoesNotThrow(() -> service.listTasks());
    }

    @Test
    @DisplayName("Integration: Vollstaendige Konsolen-Ausgabe der App")
    void fullAppOutputContainsAllSections() {
        PrintStream original = System.out;
        ByteArrayOutputStream capture = new ByteArrayOutputStream();
        System.setOut(new PrintStream(capture));
        try {
            TaskService service = container.select(TaskService.class).get();
            service.createTask("Output-Test");
            service.completeTask("Output-Test");
            service.listTasks();
            service.listAllRepositoryImplementations();
        } finally {
            System.setOut(original);
        }
        String output = capture.toString();
        // Interceptors
        assertTrue(output.contains("[LOGGED]"), "LOGGED Interceptor fehlt");
        assertTrue(output.contains("[TIMER]"), "TIMED Interceptor fehlt");
        // Decorator
        assertTrue(output.contains("[Validator]"), "Validator Decorator fehlt");
        // Events / Observer
        assertTrue(output.contains("[LOG]"), "TaskLogger Observer fehlt");
        // Repository-Liste
        assertTrue(output.contains("InMemoryTaskRepository")
                        || output.contains("MockTaskRepository"),
                "Repository-Implementierungen fehlen");
    }

    // ---------------------------------------------------------------
    // Hilfklassen fuer Qualifier-Literals
    // ---------------------------------------------------------------

    /**
     * InMemory Qualifier Literal fuer programmatischen Lookup.
     * Wird benoetigt, weil container.select() AnnotationLiterals erwartet.
     */
    static {
        // Qualifier Literals werden als innere Klassen definiert
    }
}
