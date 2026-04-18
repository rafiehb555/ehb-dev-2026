/**
 * Append-only audit log with SHA-256 hash chain for tamper-evident trails.
 * Every event links to the previous via prevHash → hash chain integrity.
 */

import crypto from "node:crypto";
import mongoose from "mongoose";

const AuditEventSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, index: true },
    platformId: { type: String, index: true },
    actor: { type: String, required: true }, // "system" | "operator:xxx" | "crb:xxx"
    event: { type: String, required: true }, // "stl_submitted" | "routed" | "decided" | etc
    detail: { type: mongoose.Schema.Types.Mixed },
    tone: { type: String, enum: ["ok", "warn", "err", "info"], default: "info" },
    prevHash: { type: String, default: null },
    hash: { type: String, required: true },
    at: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

AuditEventSchema.index({ requestId: 1, at: 1 });

export const AuditEvent = mongoose.models.AuditEvent || mongoose.model("AuditEvent", AuditEventSchema);

function computeHash({ prevHash, requestId, actor, event, detail, at }) {
  const payload = JSON.stringify({ prevHash, requestId, actor, event, detail, at });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/** Append an event to the chain for a given request. */
export async function appendAudit({ requestId, platformId, actor, event, detail, tone = "info" }) {
  const last = await AuditEvent.findOne({ requestId }).sort({ at: -1 }).lean();
  const at = new Date();
  const prevHash = last?.hash || null;
  const hash = computeHash({ prevHash, requestId, actor, event, detail, at });
  return AuditEvent.create({ requestId, platformId, actor, event, detail, tone, prevHash, hash, at });
}

/** Verify hash chain for a request — returns {ok, brokenAt}. */
export async function verifyChain(requestId) {
  const events = await AuditEvent.find({ requestId }).sort({ at: 1 }).lean();
  let prev = null;
  for (const e of events) {
    const expected = computeHash({
      prevHash: prev,
      requestId: e.requestId,
      actor: e.actor,
      event: e.event,
      detail: e.detail,
      at: e.at,
    });
    if (e.hash !== expected || e.prevHash !== prev) {
      return { ok: false, brokenAt: e._id };
    }
    prev = e.hash;
  }
  return { ok: true, count: events.length };
}
