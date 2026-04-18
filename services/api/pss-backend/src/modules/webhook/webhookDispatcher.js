/**
 * Webhook dispatcher — signs outbound payloads (HMAC SHA-256) and retries with
 * exponential backoff: 0ms, 30s, 5min. After 3 failed attempts → mark failed.
 * Platforms verify the X-PSS-Signature header using their webhookSecret.
 *
 * Queue backend: in-memory fallback; in production swap to BullMQ+Redis.
 */

import { signWebhook, RETRY_BACKOFF_MS } from "./webhookSigner.js";
import { Platform } from "../../routes/platformRoutes.js";

const pending = new Map(); // id → { attempts, event, targetUrl, secret, timer }

async function attemptDelivery(id) {
  const job = pending.get(id);
  if (!job) return;
  const { event, targetUrl, secret } = job;
  const body = JSON.stringify(event);
  const signature = signWebhook(body, secret);

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8_000);
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-pss-signature": signature,
        "x-pss-event-id": event.id,
        "x-pss-attempt": String(job.attempts + 1),
      },
      body,
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`http_${res.status}`);
    job.status = "delivered";
    job.latencyMs = Date.now() - job.startedAt;
    pending.delete(id);
    return { ok: true, attempt: job.attempts + 1 };
  } catch (err) {
    job.attempts += 1;
    job.lastError = err.message;
    if (job.attempts >= RETRY_BACKOFF_MS.length) {
      job.status = "failed";
      pending.delete(id);
      return { ok: false, final: true, error: err.message };
    }
    const delay = RETRY_BACKOFF_MS[job.attempts];
    job.status = "retry";
    job.timer = setTimeout(() => attemptDelivery(id), delay);
    return { ok: false, retrying: true, nextDelayMs: delay, error: err.message };
  }
}

/** Enqueue a signed webhook delivery. */
export async function dispatch({ platformId, event }) {
  const platform = await Platform.findOne({ platformId, active: true }).lean();
  if (!platform) throw new Error("platform_not_registered");

  const id = `${event.id}:${platformId}`;
  const job = {
    id,
    event,
    targetUrl: platform.webhookUrl,
    secret: platform.webhookSecret,
    attempts: 0,
    startedAt: Date.now(),
    status: "pending",
  };
  pending.set(id, job);
  return attemptDelivery(id);
}

export function _inspect() {
  return Array.from(pending.values()).map(({ id, attempts, status, lastError }) => ({
    id,
    attempts,
    status,
    lastError,
  }));
}
