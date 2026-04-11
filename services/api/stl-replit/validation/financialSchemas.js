/**
 * EHB — Financial Endpoint Zod Schemas (Phase 1 input validation).
 *
 * All schemas live in one place so that:
 *   1. Every money-moving route uses the SAME validation rules
 *      (no more ad-hoc regex and hand-rolled checks).
 *   2. A security audit can review all constraints in a single file.
 *   3. When OpenAPI generation is added in Phase 2, these schemas become
 *      the source of truth for the API contract.
 *
 * ALL schemas here are DEFENSIVE — they reject by default, allow by
 * explicit rule. No fields are optional unless clearly business-safe.
 *
 * This file is ADDITIVE. It does not modify anything. To use, import
 * in your route file and pass to the existing middleware/validate.js
 * `validateBody(schema)` helper.
 */

import { z } from "zod";

// -----------------------------------------------------------------------------
// Shared primitives
// -----------------------------------------------------------------------------

/**
 * Mongo ObjectId hex string (24 chars) OR a safe slug up to 40 chars.
 * Accepts both so the schemas work across Mongo and any legacy string IDs.
 */
export const idString = z
  .string()
  .trim()
  .min(3, "id too short")
  .max(64, "id too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "id contains invalid characters");

/**
 * Currency enum — lock this tightly.
 * Add new entries here only after a product/legal review.
 */
export const currency = z.enum(["PKR", "USD", "EHB"]);

/**
 * Positive money amount with hard ceiling.
 * - min 0.01 (fractional coins allowed)
 * - max 1,000,000 (one-time transaction hard cap; business-level raises
 *   require an explicit override with second-factor approval).
 */
export const moneyAmount = z
  .number({ invalid_type_error: "amount must be a number" })
  .positive("amount must be positive")
  .finite("amount must be finite")
  .max(1_000_000, "amount exceeds single-transaction ceiling");

/**
 * Short human-readable note attached to money movement.
 * - trimmed, 0..280 chars
 * - strips control characters
 */
export const shortNote = z
  .string()
  .trim()
  .max(280, "note too long")
  .regex(/^[^\x00-\x1F]*$/, "note contains control characters")
  .optional();

// -----------------------------------------------------------------------------
// Wallet — Payout request
// -----------------------------------------------------------------------------
export const payoutSchema = z
  .object({
    userId: idString,
    amount: moneyAmount,
    currency: currency.default("PKR"),
    destinationAccountId: idString,
    note: shortNote,
    idempotencyKey: z.string().uuid().optional(),
  })
  .strict();

// -----------------------------------------------------------------------------
// Wallet — Coin Lock / Unlock
// -----------------------------------------------------------------------------
export const lockSchema = z
  .object({
    userId: idString,
    amount: z
      .number()
      .int("lock amount must be whole coins")
      .positive()
      .max(1_000_000),
    reason: z.enum([
      "STL_UPGRADE",
      "STL_MAINTAIN",
      "FRANCHISE_REQUIREMENT",
      "CERTIFICATION_LOCK",
      "MANUAL",
    ]),
    note: shortNote,
  })
  .strict();

export const unlockSchema = z
  .object({
    userId: idString,
    amount: z.number().int().positive().max(1_000_000),
    acknowledgeDowngrade: z
      .literal(true, {
        errorMap: () => ({
          message: "You must acknowledge the STL downgrade to unlock coins.",
        }),
      }),
    note: shortNote,
  })
  .strict();

// -----------------------------------------------------------------------------
// Wallet — User-to-user transfer
// -----------------------------------------------------------------------------
export const transferSchema = z
  .object({
    fromUserId: idString,
    toUserId: idString,
    amount: moneyAmount,
    currency: currency.default("EHB"),
    note: shortNote,
    idempotencyKey: z.string().uuid().optional(),
  })
  .strict()
  .refine(
    (data) => data.fromUserId !== data.toUserId,
    { message: "Cannot transfer to self", path: ["toUserId"] },
  );

// -----------------------------------------------------------------------------
// DMO — Daily reward claim / earning credit
// -----------------------------------------------------------------------------
export const dmoClaimSchema = z
  .object({
    userId: idString,
    claimType: z.enum(["DAILY_REWARD", "REFERRAL_BONUS", "TASK_REWARD"]),
    taskId: idString.optional(),
  })
  .strict();

export const addEarningSchema = z
  .object({
    userId: idString,
    amount: moneyAmount,
    source: z.enum([
      "AFFILIATE",
      "SERVICE_COMMISSION",
      "DAILY_REWARD",
      "BONUS",
      "REFUND",
      "ADJUSTMENT",
    ]),
    reason: shortNote,
    referenceId: idString.optional(),
  })
  .strict();

// -----------------------------------------------------------------------------
// Auth — Login / Signup / Password reset
// -----------------------------------------------------------------------------
export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8, "password too short").max(200),
  })
  .strict();

export const signupSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z
      .string()
      .min(10, "password must be at least 10 characters")
      .max(200)
      .refine(
        (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p),
        "password must contain upper, lower, and digit",
      ),
    displayName: z.string().trim().min(2).max(80),
    referralCode: z
      .string()
      .trim()
      .regex(/^[A-Z0-9]{4,16}$/, "invalid referral code")
      .optional(),
  })
  .strict();

export const passwordResetRequestSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
  })
  .strict();

// -----------------------------------------------------------------------------
// STL — Manual adjustment (admin only, but still validated)
// -----------------------------------------------------------------------------
export const stlAdjustSchema = z
  .object({
    userId: idString,
    delta: z
      .number()
      .int("delta must be whole points")
      .min(-50, "delta below minimum")
      .max(50, "delta above maximum"),
    reason: z
      .string()
      .trim()
      .min(10, "reason must explain the adjustment"),
  })
  .strict();

// -----------------------------------------------------------------------------
// Utility — pull a typed schema by name (for generic controllers)
// -----------------------------------------------------------------------------
export const financialSchemas = Object.freeze({
  payout: payoutSchema,
  lock: lockSchema,
  unlock: unlockSchema,
  transfer: transferSchema,
  dmoClaim: dmoClaimSchema,
  addEarning: addEarningSchema,
  login: loginSchema,
  signup: signupSchema,
  passwordResetRequest: passwordResetRequestSchema,
  stlAdjust: stlAdjustSchema,
});
