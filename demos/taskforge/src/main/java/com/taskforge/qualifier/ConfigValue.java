package com.taskforge.qualifier;

// Uebung 4: Qualifier mit @Nonbinding-Member fuer Konfigurationswerte.
// Wird vom ConfigProducer ausgewertet, um den richtigen Wert zu liefern.
// Ab Uebung 9 durch DeltaSpike @ConfigProperty ersetzt — bleibt aber als Referenz erhalten.

import jakarta.enterprise.util.Nonbinding;
import jakarta.inject.Qualifier;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Qualifier fuer die Injection von Konfigurationswerten.
 * Der value()-Member wird per @Nonbinding markiert, damit der CDI-Container
 * nicht fuer jeden Key eine eigene Producer-Methode braucht.
 *
 * Verwendung: @Inject @ConfigValue("app.name") String appName;
 */
@Qualifier
@Retention(RUNTIME)
@Target({FIELD, METHOD, PARAMETER})
public @interface ConfigValue {

    /**
     * Der Konfigurationsschluessel, z.B. "app.name".
     * @Nonbinding — wird beim Qualifier-Matching ignoriert.
     */
    @Nonbinding
    String value() default "";
}
