export function isMonitoringEnabled(): boolean {
  const v = process.env.EHB_MONITORING_ENABLED;
  return v === "1" || v === "true";
}

export function getMonitoringSampleRate(): number {
  const raw = Number(process.env.EHB_MONITORING_SAMPLE_RATE ?? "0.1");
  if (!Number.isFinite(raw)) return 0.1;
  return Math.max(0, Math.min(1, raw));
}

export function shouldSample(): boolean {
  if (!isMonitoringEnabled()) return false;
  return Math.random() <= getMonitoringSampleRate();
}
