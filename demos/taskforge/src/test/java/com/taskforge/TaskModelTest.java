package com.taskforge;

// Tests fuer Uebung 1: Task-Modell (POJO)

import com.taskforge.model.Task;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testet das Task-Domaenenobjekt ohne CDI-Container.
 */
class TaskModelTest {

    @Test
    void taskHasTitleAndDefaults() {
        Task task = new Task("Testaufgabe");
        assertEquals("Testaufgabe", task.getTitle());
        assertFalse(task.isCompleted());
        assertNotNull(task.getCreatedAt());
        assertTrue(task.getId() > 0);
    }

    @Test
    void taskCanBeCompleted() {
        Task task = new Task("Aufgabe");
        assertFalse(task.isCompleted());
        task.setCompleted(true);
        assertTrue(task.isCompleted());
    }

    @Test
    void taskToStringContainsStatus() {
        Task task = new Task("Demo");
        assertTrue(task.toString().contains("offen"));
        task.setCompleted(true);
        assertTrue(task.toString().contains("erledigt"));
    }

    @Test
    void taskToStringContainsTitle() {
        Task task = new Task("Meine Aufgabe");
        assertTrue(task.toString().contains("Meine Aufgabe"));
    }

    @Test
    void taskIdsAreUnique() {
        Task t1 = new Task("A");
        Task t2 = new Task("B");
        assertNotEquals(t1.getId(), t2.getId());
    }
}
