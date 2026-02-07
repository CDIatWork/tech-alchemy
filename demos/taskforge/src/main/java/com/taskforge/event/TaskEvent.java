package com.taskforge.event;

// Uebung 5: Event-Klasse fuer lose gekoppelte Kommunikation zwischen Beans.
// Wird vom TaskService gefeuert und von TaskLogger/TaskStatistics beobachtet.

import com.taskforge.model.Task;

/**
 * Repraesentiert ein Ereignis im Lebenszyklus eines Tasks.
 * Enthaelt den betroffenen Task und die ausgefuehrte Aktion.
 */
public class TaskEvent {

    /**
     * Moegliche Aktionen auf einem Task.
     */
    public enum Action {
        CREATED,
        COMPLETED,
        DELETED
    }

    private final Task task;
    private final Action action;

    public TaskEvent(Task task, Action action) {
        this.task = task;
        this.action = action;
    }

    public Task getTask() {
        return task;
    }

    public Action getAction() {
        return action;
    }

    @Override
    public String toString() {
        return String.format("TaskEvent{action=%s, task='%s'}", action, task.getTitle());
    }
}
