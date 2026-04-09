import { startBackgroundWorker } from "@/jobs/worker";

const worker = startBackgroundWorker();

if (!worker) {
  console.warn("[dmo-worker] REDIS_URL missing; worker is idle.");
  // Keep process alive in container for predictable compose behavior.
  setInterval(() => undefined, 60_000);
} else {
  console.log("[dmo-worker] Worker started.");

  worker.on("completed", (job) => {
    console.log("[dmo-worker] completed", job.name, job.id);
  });

  worker.on("failed", (job, err) => {
    console.error("[dmo-worker] failed", job?.name, job?.id, err?.message);
  });
}
