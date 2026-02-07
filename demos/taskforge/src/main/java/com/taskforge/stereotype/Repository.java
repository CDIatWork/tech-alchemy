package com.taskforge.stereotype;

// Uebung 8: Stereotype fuer Repository-Klassen.
// Buendelt @ApplicationScoped in einer einzigen, sprechenden Annotation.

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Stereotype;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Stereotype fuer Repository-Beans.
 * Klassen mit @Repository erhalten automatisch @ApplicationScoped,
 * d.h. es existiert genau eine Instanz pro Anwendung.
 *
 * Verwendung: Ersetzt @ApplicationScoped auf Repository-Klassen.
 */
@Stereotype
@ApplicationScoped
@Retention(RUNTIME)
@Target(TYPE)
public @interface Repository {
}
