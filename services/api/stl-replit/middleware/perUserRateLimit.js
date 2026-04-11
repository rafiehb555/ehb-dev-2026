/**
 * EHB — Per-User Rate Limiter Middleware (Phase 1 security hardening).
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The server already applies a GLOBAL rate limit (300 req / 15 min) in
 * server.js. That stops obvious flooding from a single IP, but it does NOT
 * protect financial endpoints from an authenticated user who is either
 * (a) legitimately buggy, (b) compromised, or (c) intentionally abusing
 * the system.
 *
 * This middleware adds a SECOND per-user layer:
 *   - key = userId from req.auth (JWT) when available, else the client IP
 *   - sliding window, pure in-memory (no Redis required for Phase 1)
 *   - per-route configurable max + windowMs
 *   - structured error response compatible with utils/apiResponse.js
 *
 * This file is COMPLETELY ADDITIVE. It does NOT modify any existing route,
 * controller, or middleware. To enable it, require it from the specific
 * route files that need protection — see INTEGRATION GUIDE at the bottom.
 *
 * DESIGN NOTES
 * ------------
 *  - In-memory store is fine for a single-process deployment. When the
 *    backend goes multi-instance (Kubernetes horizontal scaling), swap the
 *    `store` object for a Redis-backed one. The public API stays identical.
 *  - We use a manual sliding window instead of express-rate-limit because
 *    (a) we need the key to come from req.auth, and (b) we want the
 *    response shape to match our standardized API envelope.
 *  - Cleanup runs opportunistically on every hit (no timer leak).
 *
 * THREAT MODEL
 * ------------
 *  - Authenticated user runs a buggy script that hits /payout 100x/sec
 *    → limiter blocks after N requests, logs the abuse, protects wallet.
 *  - Compromised JWT used to drain funds
 *    → per-user limit caps damage velocity while fraud detection catches up.
 *  - Unauthenticated bot spraying /login
 *    → falls back to IP key, protected by same limiter.
 *
 * NOT A SUBSTITUTE FOR
 * --------------------
 *  - WAF / Cloudflare Bot Management (network layer).
 *  - Fraud detection / anomaly scoring (business layer).
 *  - Proper secrets management & MFA (identity layer).
 */

const DEFAULT_WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX = 5;            // very tight for financial routes

/**
 * In-memory sliding-window store.
 * Map<key, { count: number, resetAt: number, firstHitAt: number }>
 */
const store = new Map();

function getKey(req) {
  // Prefer authenticated user ID from requireAuth middleware.
  // Fall back to common JWT claim names, then IP.
  const auth = req.auth || {};
  const userId =
    auth.userId || auth.id || auth.sub || auth._id || null;
  if (userId) return `u:${userId}`;
  // Express sets req.ip when trust proxy is configured; else use connection.
  const ip = req.ip || req.connection?.remoteAddress || "unknown";
  return `ip:${ip}`;
}

function prune(now) {
  // Opportunistic cleanup — avoids unbounded memory growth without needing
  // a background timer. Called on each rate-limited request.
  if (store.size < 1000) return;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

/**
 * Build a rate-limiter middleware.
 *
 * @param {Object} opts
 * @param {number} [opts.max=5]           Max requests per window.
 * @param {number} [opts.windowMs=60000]  Window length in ms.
 * @param {string} [opts.name='default']  Label used in the error response.
 * @param {boolean} [opts.skipSuccessfulOnly=false] If true, only count
 *   non-2xx responses toward the quota (useful for auth-style endpoints).
 * @returns {import('express').RequestHandler}
 */
export function perUserRateLimit(opts = {}) {
  const max = Number(opts.max ?? DEFAULT_MAX);
  const windowMs = Number(opts.windowMs ?? DEFAULT_WINDOW_MS);
  const name = String(opts.name ?? "default");
  const skipSuccessfulOnly = Boolean(opts.skipSuccessfulOnly);

  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    const key = `${name}:${getKey(req)}`;

    let entry = store.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs, firstHitAt: now };
      store.set(key, entry);
    }

    entry.count += 1;

    // Standard rate-limit headers (RFC draft 07).
    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(resetSeconds));

    if (entry.count > max) {
      prune(now);
      res.setHeader("Retry-After", String(resetSeconds));
      return res.status(429).json({
        success: false,
        data: null,
        error: {
          code: "RATE_LIMITED",
          message: `Too many ${name} requests. Try again in ${resetSeconds}s.`,
          scope: "per-user",
          retryAfter: resetSeconds,
        },
      });
    }

    if (skipSuccessfulOnly) {
      // If the caller wants to only penalize failures, uncount on 2xx.
      res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          entry.count = Math.max(0, entry.count - 1);
        }
      });
    }

    return next();
  };
}

/**
 * Pre-tuned limiter for money-moving endpoints.
 * 5 requests / minute / user — intentionally aggressive.
 */
export const financialLimiter = perUserRateLimit({
  name: "financial",
  max: 5,
  windowMs: 60_000,
});

/**
 * Pre-tuned limiter for login / signup / password-reset.
 * 10 requests / minute / IP (req.auth usually absent here).
 * skipSuccessfulOnly so legitimate fast logins are not punished.
 */
export const authLimiter = perUserRateLimit({
  name: "auth",
  max: 10,
  windowMs: 60_000,
  skipSuccessfulOnly: true,
});

/**
 * Pre-tuned limiter for DMO activity endpoints (earnings, reward claim).
 * 20 requests / minute / user.
 */
export const dmoLimiter = perUserRateLimit({
  name: "dmo",
  max: 20,
  windowMs: 60_000,
});

/**
 * Test helper — clears the in-memory store.
 * Exported so unit tests can call it between runs. NOT for production use.
 */
export function __resetPerUserStore() {
  store.clear();
}

/* =============================================================================
 * INTEGRATION GUIDE (Phase 1 → Phase 2 rollout)
 * =============================================================================
 *
 * Step 1 — Protect wallet / payout routes (once walletRoutes.js exists, or
 *          in whichever file these endpoints live):
 *
 *   import { requireAuth } from "../middleware/auth.js";
 *   import { financialLimiter } from "../middleware/perUserRateLimit.js";
 *   import { validateBody } from "../middleware/validate.js";
 *   import { payoutSchema, lockSchema, transferSchema }
 *     from "../validation/financialSchemas.js";
 *
 *   router.post("/wallet/payout", requireAuth, financialLimiter,
 *     validateBody(payoutSchema), payoutController);
 *
 *   router.post("/wallet/lock", requireAuth, financialLimiter,
 *     validateBody(lockSchema), lockController);
 *
 *   router.post("/wallet/transfer", requireAuth, financialLimiter,
 *     validateBody(transferSchema), transferController);
 *
 * Step 2 — Protect auth routes:
 *
 *   import { authLimiter } from "../middleware/perUserRateLimit.js";
 *   router.post("/auth/login", authLimiter, loginController);
 *   router.post("/auth/signup", authLimiter, signupController);
 *
 * Step 3 — Protect DMO earning endpoints:
 *
 *   import { dmoLimiter } from "../middleware/perUserRateLimit.js";
 *   router.post("/dmo/claim", requireAuth, dmoLimiter, claimController);
 *
 * Step 4 — When going multi-instance, swap the in-memory `store` Map for
 *          a Redis-backed one. The public middleware signature does not
 *          change, so no route files need to be edited.
 * =============================================================================
 */
