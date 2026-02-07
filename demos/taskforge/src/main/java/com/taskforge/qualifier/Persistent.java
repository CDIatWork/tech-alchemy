package com.taskforge.qualifier;

// Uebung 3: Qualifier fuer die dateibasierte Implementierung des TaskRepository

import jakarta.enterprise.util.AnnotationLiteral;
import jakarta.inject.Qualifier;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Qualifier zur Auswahl des dateibasierten Repositorys.
 * Verwendung: @Inject @Persistent TaskRepository repository;
 */
@Qualifier
@Retention(RUNTIME)
@Target({FIELD, TYPE, METHOD, PARAMETER})
public @interface Persistent {

    /** AnnotationLiteral fuer programmatischen Lookup (Instance.select(), container.select()). */
    final class Literal extends AnnotationLiteral<Persistent> implements Persistent {
    }
}
