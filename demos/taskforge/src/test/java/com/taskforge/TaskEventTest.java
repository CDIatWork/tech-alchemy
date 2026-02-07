package com.taskforge;

// Tests fuer Uebung 5: TaskEvent (POJO-Teil)

import com.taskforge.event.TaskEvent;
import com.taskforge.model.Task;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testet das TaskEvent-Objekt ohne CDI-Container.
 */
class TaskEventTest {

    @Test
    void eventContainsTaskAndAction() {
        Task task = new Task("Test");
        TaskEvent event = new TaskEvent(task, TaskEvent.Action.CREATED);
        assertSame(task, event.getTask());
        assertEquals(TaskEvent.Action.CREATED, event.getAction());
    }

    @Test
    void eventToStringContainsAction() {
        Task task = new Task("Demo");
        TaskEvent event = new TaskEvent(task, TaskEvent.Action.COMPLETED);
        String str = event.toString();
        assertTrue(str.contains("COMPLETED"));
        assertTrue(str.contains("Demo"));
    }

    @Test
    void allActionsExist() {
        TaskEvent.Action[] actions = TaskEvent.Action.values();
        assertEquals(3, actions.length);
        assertNotNull(TaskEvent.Action.valueOf("CREATED"));
        assertNotNull(TaskEvent.Action.valueOf("COMPLETED"));
        assertNotNull(TaskEvent.Action.valueOf("DELETED"));
    }
}
