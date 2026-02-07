package com.taskforge.interceptor;

// Uebung 6 (Bonus): Interceptor Binding fuer Logging.
// Wird vom LoggingInterceptor implementiert und im @Service-Stereotype verwendet (Uebung 8).

import jakarta.interceptor.InterceptorBinding;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Interceptor Binding fuer Method-Entry/Exit-Logging.
 * Kann auf Klassen (alle Methoden) oder einzelne Methoden angewendet werden.
 */
@InterceptorBinding
@Retention(RUNTIME)
@Target({TYPE, METHOD})
public @interface Logged {
}
