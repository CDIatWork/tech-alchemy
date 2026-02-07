package com.taskforge.interceptor;

// Uebung 6: Interceptor-Implementierung — misst die Ausfuehrungszeit in Millisekunden.
// Aktiviert mit @Priority(1000), wird nach dem LoggingInterceptor (@Priority 900) ausgefuehrt.

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;

/**
 * Misst die Ausfuehrungszeit jeder annotierten Methode.
 *
 * Aufruf-Reihenfolge bei mehreren Interceptors:
 *   LoggingInterceptor (900) -> TimedInterceptor (1000) -> eigentliche Methode
 */
@Interceptor
@Timed
@Priority(1000)
public class TimedInterceptor {

    @AroundInvoke
    public Object measure(InvocationContext ctx) throws Exception {
        long start = System.nanoTime();
        try {
            return ctx.proceed();
        } finally {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            System.out.printf("  [TIMER] %s.%s(): %dms%n",
                    ctx.getTarget().getClass().getSimpleName(),
                    ctx.getMethod().getName(),
                    durationMs);
        }
    }
}
