package com.taskforge.interceptor;

// Uebung 6 (Bonus): Interceptor-Implementierung — protokolliert Methodenein-/austritt.
// @Priority(900) — wird vor dem TimedInterceptor (1000) ausgefuehrt.
// Das bedeutet: Logging umschliesst das Timing.

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;

/**
 * Protokolliert den Ein- und Austritt aus annotierten Methoden.
 */
@Interceptor
@Logged
@Priority(900)
public class LoggingInterceptor {

    @AroundInvoke
    public Object logMethod(InvocationContext ctx) throws Exception {
        String className = ctx.getTarget().getClass().getSimpleName();
        String methodName = ctx.getMethod().getName();
        System.out.printf("  [LOGGED] -> %s.%s()%n", className, methodName);
        try {
            Object result = ctx.proceed();
            System.out.printf("  [LOGGED] <- %s.%s()%n", className, methodName);
            return result;
        } catch (Exception e) {
            System.out.printf("  [LOGGED] !! %s.%s() warf %s: %s%n",
                    className, methodName,
                    e.getClass().getSimpleName(), e.getMessage());
            throw e;
        }
    }
}
