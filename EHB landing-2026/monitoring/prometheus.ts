import client from "prom-client";
import { isMonitoringEnabled } from "@/monitoring/config";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestCounter = new client.Counter({
  name: "ehb_api_requests_total",
  help: "Total API requests by route/status",
  labelNames: ["route", "status"],
  registers: [register],
});

const latencyHistogram = new client.Histogram({
  name: "ehb_api_latency_ms",
  help: "API latency in milliseconds",
  labelNames: ["route"],
  buckets: [10, 25, 50, 100, 200, 500, 1000, 2000, 5000],
  registers: [register],
});

export function incMetric(name: string, by = 1) {
  if (!isMonitoringEnabled()) return;
  if (name.startsWith("ehb_api_status_")) {
    const status = name.replace("ehb_api_status_", "").replace("_total", "");
    requestCounter.inc({ route: "unknown", status }, by);
  }
}

export function observeRouteLatency(route: string, durationMs: number) {
  if (!isMonitoringEnabled()) return;
  latencyHistogram.observe({ route }, durationMs);
}

export function observeRouteStatus(route: string, status: number) {
  if (!isMonitoringEnabled()) return;
  requestCounter.inc({ route, status: String(status) });
}

export async function renderPrometheusMetrics(): Promise<string> {
  return register.metrics();
}
