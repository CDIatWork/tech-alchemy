package com.taskforge.model;

// Uebung 1: Domaenenobjekt Task

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Repraesentiert eine Aufgabe in der TaskForge-Anwendung.
 * Einfaches POJO — kein CDI Bean, wird aber von Beans verwaltet.
 */
public class Task {

    private static long idCounter = 0;

    private final long id;
    private final String title;
    private boolean completed;
    private final LocalDateTime createdAt;

    public Task(String title) {
        this.id = ++idCounter;
        this.title = title;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getter & Setter ---

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        String status = completed ? "erledigt" : "offen";
        String time = createdAt.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        return String.format("[#%d] %s (%s, %s)", id, title, status, time);
    }
}
