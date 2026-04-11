/**
 * EHB — Standardized API Response Helper (Phase 1 API standardization).
 *
 * EVERY new route (and every existing route that gets touched) should emit
 * responses using one of these helpers. This gives the frontend a single,
 * predictable envelope to parse, eliminates inconsistent {msg, error, data}
 * shapes, and makes error tracking meaningful.
 *
 * SHAPE
 * -----
 * Success:
 *   { success: true,  data: <payload>, error: null, meta?: {...} }
 * Failure:
 *   { success: false, data: null, error: { code, message, details? } }
 *
 * USAGE
 * -----
 *   import { ok, fail, notFound, unauthorized, forbidden, serverError }
 *     from "../utils/apiResponse.js";
 *
 *   // Success
 *   return ok(res, { user });
 *   return ok(res, users, { meta: { page: 1, total: 42 } });
 *
 *   // Business / validation error
 *   return fail(res, 400, "INVALID_AMOUNT", "Amount must be positive");
 *
 *   // Shorthand helpers
 *   return notFound(res, "User not found");
 *   return unauthorized(res);
 *   return forbidden(res, "Not allowed to edit this record");
 *   return serverError(res, err);
 *
 * MIGRATION
 * ---------
 * This file is ADDITIVE. Old routes that return `{ msg: "..." }` will keep
 * working. New routes should use these helpers. When refactoring legacy
 * routes in Phase 2, migrate them one at a time — the error-handling
 * middleware in middleware/error.js continues to work because we never
 * throw here.
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data  Payload for the client.
 * @param {Object} [options]
 * @param {Object} [options.meta]  Optional metadata (pagination, etc).
 * @param {number} [options.status=200]
 */
export function ok(res, data = null, options = {}) {
  const body = { success: true, data, error: null };
  if (options.meta) body.meta = options.meta;
  return res.status(options.status ?? 200).json(body);
}

/**
 * Send a created response (201).
 */
export function created(res, data = null, options = {}) {
  return ok(res, data, { ...options, status: 201 });
}

/**
 * Send a failure response.
 * @param {import('express').Response} res
 * @param {number} status  HTTP status code (400/401/403/404/409/422/500...).
 * @param {string} code    Machine-readable error code (e.g., "INVALID_AMOUNT").
 * @param {string} message Human-readable message.
 * @param {Object} [details] Optional extra context (NOT leaked secrets).
 */
export function fail(res, status, code, message, details) {
  const error = { code, message };
  if (details !== undefined) error.details = details;
  return res.status(status).json({
    success: false,
    data: null,
    error,
  });
}

// -----------------------------------------------------------------------------
// Shorthand helpers for common HTTP error classes
// -----------------------------------------------------------------------------

export function badRequest(res, message = "Bad request", details) {
  return fail(res, 400, "BAD_REQUEST", message, details);
}

export function unauthorized(res, message = "Unauthorized") {
  return fail(res, 401, "UNAUTHORIZED", message);
}

export function forbidden(res, message = "Forbidden") {
  return fail(res, 403, "FORBIDDEN", message);
}

export function notFound(res, message = "Resource not found") {
  return fail(res, 404, "NOT_FOUND", message);
}

export function conflict(res, message = "Conflict", details) {
  return fail(res, 409, "CONFLICT", message, details);
}

export function unprocessable(res, message = "Unprocessable entity", details) {
  return fail(res, 422, "UNPROCESSABLE", message, details);
}

/**
 * Generic 500 — pulls error.code/message/stack only if we're NOT in prod.
 * Always logs the full error for server-side debugging.
 */
export function serverError(res, err, message = "Internal server error") {
  // eslint-disable-next-line no-console
  console.error("[serverError]", err);
  const details =
    process.env.NODE_ENV === "production"
      ? undefined
      : { message: err?.message, stack: err?.stack };
  return fail(res, 500, "INTERNAL_ERROR", message, details);
}

// -----------------------------------------------------------------------------
// Adapter for Zod validation failures (matches middleware/validate.js output)
// -----------------------------------------------------------------------------

/**
 * Convert a Zod `error.flatten()` payload to a fail() response.
 *
 * Example:
 *   const parsed = schema.safeParse(req.body);
 *   if (!parsed.success) return zodFail(res, parsed.error);
 */
export function zodFail(res, zodError) {
  return fail(
    res,
    400,
    "VALIDATION_ERROR",
    "One or more fields are invalid",
    zodError?.flatten?.() ?? { fieldErrors: {}, formErrors: [] },
  );
}

/**
 * Wrap a controller function so unexpected throws become 500 responses
 * via serverError(). Use this for new async route handlers to avoid
 * forgetting try/catch. Example:
 *
 *   router.post("/payout", requireAuth, catchAsync(async (req, res) => {
 *     const result = await processPayout(req.body);
 *     return ok(res, result);
 *   }));
 */
export function catchAsync(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (res.headersSent) return next(err);
      return serverError(res, err);
    });
  };
}
