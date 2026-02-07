package com.taskforge.interceptor;

// Uebung 6: Interceptor Binding fuer Zeitmessung.
// Wird vom TimedInterceptor implementiert.

import jakarta.interceptor.InterceptorBinding;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Interceptor Binding zur Messung der Ausfuehrungszeit.
 * Kann auf Klassen (alle Methoden) oder einzelne Methoden angewendet werden.
 * Wird auch im @Service-Stereotype verwendet (Uebung 8).
 */
@InterceptorBinding
@Retention(RUNTIME)
@Target({TYPE, METHOD})
public @interface Timed {
}
