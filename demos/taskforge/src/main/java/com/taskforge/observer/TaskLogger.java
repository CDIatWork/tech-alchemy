package com.taskforge.observer;

// Uebung 5: Observer — protokolliert alle Task-Events auf der Konsole.
// Demonstriert lose Kopplung: TaskService kennt den TaskLogger nicht.

import com.taskforge.event.TaskEvent;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

/**
 * Protokolliert alle Task-Ereignisse auf der Konsole.
 * Wird automatisch vom CDI-Container benachrichtigt, wenn ein TaskEvent gefeuert wird.
 */
@ApplicationScoped
public class TaskLogger {

    /**
     * Reagiert auf alle TaskEvents — synchron aufgerufen.
     *
     * @param event das empfangene Task-Ereignis
     */
    public void onTaskEvent(@Observes TaskEvent event) {
        System.out.printf("  [LOG] %s: \"%s\"%n",
                event.getAction(), event.getTask().getTitle());
    }
}
