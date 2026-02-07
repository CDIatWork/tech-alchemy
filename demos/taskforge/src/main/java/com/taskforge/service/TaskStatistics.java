package com.taskforge.service;

// Uebung 5: Observer — zaehlt erstellte und erledigte Tasks per @Observes.
// Uebung 8: @Service Stereotype hinzugefuegt.

import com.taskforge.event.TaskEvent;
import com.taskforge.stereotype.Service;

import jakarta.enterprise.event.Observes;

/**
 * Zaehlt die erstellten und erledigten Tasks.
 * Wird automatisch per CDI-Events benachrichtigt — kein direkter Aufruf noetig.
 *
 * @Service — Stereotype (beinhaltet @Dependent, @Logged, @Timed).
 */
@Service
public class TaskStatistics {

    private int createdCount = 0;
    private int completedCount = 0;

    /**
     * Reagiert auf TaskEvents und aktualisiert die Statistik.
     */
    public void onTaskEvent(@Observes TaskEvent event) {
        switch (event.getAction()) {
            case CREATED -> createdCount++;
            case COMPLETED -> completedCount++;
            default -> { /* DELETED etc. — hier nicht gezaehlt */ }
        }
    }

    public int getCreatedCount() {
        return createdCount;
    }

    public int getCompletedCount() {
        return completedCount;
    }

    /**
     * Gibt eine Zusammenfassung der Statistik zurueck.
     */
    public String getSummary() {
        return String.format("Erstellt: %d, Erledigt: %d", createdCount, completedCount);
    }
}
