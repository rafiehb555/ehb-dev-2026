import winston from "winston";
import { isMonitoringEnabled, shouldSample } from "@/monitoring/config";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export function logMonitoringError(scope: string, err: unknown, metadata?: Record<string, unknown>) {
  if (!isMonitoringEnabled()) return;
  const message = err instanceof Error ? err.message : String(err);
  logger.error({ type: "monitoring_error", scope, message, ...(metadata ?? {}) });
}

export function logApiResponseTime(route: string, durationMs: number, status: number) {
  if (!shouldSample()) return;
  logger.info({ type: "api_timing", route, durationMs, status });
}
