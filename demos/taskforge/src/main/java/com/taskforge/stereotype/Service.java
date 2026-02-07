package com.taskforge.stereotype;

// Uebung 8: Stereotype fuer Service-Klassen.
// Buendelt @Dependent, @Logged und @Timed in einer einzigen Annotation.
// Ist selbst eine Bean-Defining Annotation (wichtig fuer bean-discovery-mode="annotated").

import com.taskforge.interceptor.Logged;
import com.taskforge.interceptor.Timed;

import jakarta.enterprise.context.Dependent;
import jakarta.enterprise.inject.Stereotype;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Stereotype fuer Service-Beans.
 * Klassen mit @Service erhalten automatisch:
 * - @Dependent Scope (neues Objekt pro Injection-Point)
 * - @Logged (Method-Entry/Exit-Logging per Interceptor)
 * - @Timed (Ausfuehrungszeit-Messung per Interceptor)
 *
 * Verwendung: Ersetzt @Dependent @Logged @Timed auf der Klasse.
 */
@Stereotype
@Dependent
@Logged
@Timed
@Retention(RUNTIME)
@Target(TYPE)
public @interface Service {
}
