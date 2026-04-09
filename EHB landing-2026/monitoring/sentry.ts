import { isMonitoringEnabled } from "@/monitoring/config";
import { logMonitoringError } from "@/monitoring/logger";

let sentryLoaded = false;

/**
 * Placeholder Sentry hook. Uses lazy dynamic import and is a no-op unless enabled.
 */
export async function captureSentryError(scope: string, err: unknown, metadata?: Record<string, unknown>) {
  if (!isMonitoringEnabled()) return;

  try {
    if (!sentryLoaded) {
      // Future: dynamically import '@sentry/nextjs' only when configured.
      sentryLoaded = true;
    }
  } catch {
    // Keep runtime safe when Sentry package is absent.
  }

  logMonitoringError(scope, err, metadata);
}
