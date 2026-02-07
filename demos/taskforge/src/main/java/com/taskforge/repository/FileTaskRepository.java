package com.taskforge.repository;

// Uebung 3: Zweite Implementierung mit @Persistent Qualifier.
// Uebung 8: @Repository Stereotype hinzugefuegt.
// Uebung 9: @Exclude — im UnitTest-Profil deaktiviert (DeltaSpike).

import com.taskforge.model.Task;
import com.taskforge.qualifier.Persistent;
import com.taskforge.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.apache.deltaspike.core.api.exclude.Exclude;
import org.apache.deltaspike.core.api.projectstage.ProjectStage;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Vereinfachte dateibasierte Implementierung des TaskRepository.
 * In einer echten Anwendung wuerden die Tasks in einer Datei persistiert;
 * hier wird der Dateizugriff simuliert und die Daten im Speicher gehalten.
 *
 * @Persistent — Qualifier fuer die typbasierte Auswahl.
 * @Repository — Stereotype (beinhaltet @ApplicationScoped).
 * @Exclude   — DeltaSpike: wird im UnitTest-Profil nicht als Bean registriert.
 */
@Persistent
@Repository
@Exclude(ifProjectStage = ProjectStage.UnitTest.class)
public class FileTaskRepository implements TaskRepository {

    private final List<Task> tasks = new ArrayList<>();

    @PostConstruct
    void init() {
        System.out.println("[FileTaskRepository] Initialisiert — simulierter Dateizugriff (@PostConstruct)");
    }

    @PreDestroy
    void cleanup() {
        System.out.println("[FileTaskRepository] Wird zerstoert — "
                + tasks.size() + " Tasks wuerden in Datei geschrieben (@PreDestroy)");
    }

    @Override
    public void add(Task task) {
        System.out.println("[FileTaskRepository] Speichere Task in Datei: " + task.getTitle());
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
