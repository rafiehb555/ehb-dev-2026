import crypto from "node:crypto";

/** Build the signed header value the platform must verify. */
export function signWebhook(rawBody, secret) {
  const mac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return `sha256=${mac}`;
}

/** Constant-time verify of an inbound signature (used if the platform ever calls back). */
export function verifyWebhook(rawBody, header, secret) {
  if (!header || !secret) return false;
  const expected = signWebhook(rawBody, secret);
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Exponential backoff delays for retry attempts (ms).
 * Attempt 1 → immediate, 2 → 30s, 3 → 5min.
 */
export const RETRY_BACKOFF_MS = [0, 30_000, 5 * 60_000];
