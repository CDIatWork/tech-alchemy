package com.taskforge.config;

// Uebung 4: Producer-Klasse fuer Konfigurationswerte.
// Demonstriert @Produces, InjectionPoint und @ConfigValue-Qualifier mit @Nonbinding.
//
// Hinweis: Ab Uebung 9 wird die Konfiguration durch DeltaSpike @ConfigProperty ersetzt.
// Diese Klasse bleibt als Referenzbeispiel erhalten, liefert aber nur noch Werte,
// die nicht bereits durch DeltaSpike abgedeckt sind.

import com.taskforge.qualifier.ConfigValue;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.enterprise.inject.spi.InjectionPoint;
import java.util.HashMap;
import java.util.Map;

/**
 * Erzeugt Konfigurationswerte per @Produces.
 * Demonstriert:
 * - Producer-Methoden
 * - InjectionPoint-API (Metadaten des Injection-Punktes auslesen)
 * - Qualifier mit @Nonbinding Member
 */
@ApplicationScoped
public class ConfigProducer {

    private final Map<String, String> config = new HashMap<>();

    public ConfigProducer() {
        // Standardwerte — in der Praxis aus einer Datei oder Datenbank geladen
        config.put("app.name", "TaskForge");
        config.put("app.maxTasks", "100");
        config.put("app.version", "1.0");
    }

    /**
     * Producer-Methode: Liefert den Wert zum angegebenen Konfigurationsschluessel.
     * Der Schluessel wird aus dem @ConfigValue-Qualifier am Injection-Point gelesen.
     */
    @Produces
    @ConfigValue
    public String getConfigValue(InjectionPoint ip) {
        ConfigValue annotation = ip.getAnnotated().getAnnotation(ConfigValue.class);
        String key = annotation.value();
        return config.getOrDefault(key, "?");
    }
}
