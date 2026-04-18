/**
 * Operator routes — queue, manual reroute, decision, audit view.
 * Called from the DMO web UI (franchise + CRB operators).
 */

import { Router } from "express";
import { z } from "zod";
import { StlRequest } from "../models/stlRequest.js";
import { appendAudit, verifyChain, AuditEvent } from "../modules/audit/auditLog.js";
import { applyPssCap } from "../modules/stl-engine/stlEngine.js";

const router = Router();

/** GET /ops/queue?stage=pending_franchise&platform=gosellr&limit=50 */
router.get("/queue", async (req, res) => {
  const { stage, platform, limit = "50" } = req.query;
  const q = {};
  if (stage) q.status = stage;
  if (platform) q.platformId = platform;
  const docs = await StlRequest.find(q).sort({ createdAt: -1 }).limit(Math.min(+limit, 200)).lean();
  res.json({ ok: true, count: docs.length, cases: docs });
});

/** POST /ops/:id/decision — franchise or CRB operator decides */
const DecisionSchema = z.object({
  actor: z.string().min(1),
  decision: z.enum(["approve", "reject", "route_crb", "request_more_info"]),
  stl_level: z.number().int().min(0).max(8).optional(),
  justification: z.string().min(10),
  source: z.enum(["pss", "franchise", "crb"]).default("franchise"),
});

router.post("/:id/decision", async (req, res) => {
  const parsed = DecisionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", issues: parsed.error.issues });

  const doc = await StlRequest.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not_found" });

  const { decision, stl_level, justification, actor, source } = parsed.data;

  if (decision === "approve") {
    doc.status = "approved";
    doc.stlLevel = applyPssCap(stl_level ?? doc.stlLevel ?? 2, source);
  } else if (decision === "reject") {
    doc.status = "rejected";
  } else if (decision === "route_crb") {
    doc.status = "pending_crb";
  } else {
    doc.status = "pending"; // request_more_info → back to user
  }

  doc.route = {
    ...doc.route,
    decidedBy: actor,
    justification,
    source,
    decidedAt: new Date(),
  };

  await doc.save();
  await appendAudit({
    requestId: doc._id,
    platformId: doc.platformId,
    actor,
    event: `decision_${decision}`,
    detail: { stl_level: doc.stlLevel, justification, source },
    tone: decision === "approve" ? "ok" : decision === "reject" ? "err" : "info",
  });

  res.json({ ok: true, id: doc._id, status: doc.status, stl_level: doc.stlLevel });
});

/** POST /ops/:id/reroute — manual reroute (franchise ↔ CRB ↔ back-to-pss) */
const RerouteSchema = z.object({
  actor: z.string().min(1),
  target: z.enum(["pending", "pending_franchise", "pending_crb"]),
  reason: z.string().min(5),
});

router.post("/:id/reroute", async (req, res) => {
  const parsed = RerouteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const doc = await StlRequest.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not_found" });

  doc.status = parsed.data.target;
  await doc.save();
  await appendAudit({
    requestId: doc._id,
    platformId: doc.platformId,
    actor: parsed.data.actor,
    event: "manual_reroute",
    detail: { target: parsed.data.target, reason: parsed.data.reason },
    tone: "warn",
  });

  res.json({ ok: true, id: doc._id, status: doc.status });
});

/** GET /ops/:id/audit — full audit timeline + hash chain verification */
router.get("/:id/audit", async (req, res) => {
  const events = await AuditEvent.find({ requestId: req.params.id }).sort({ at: 1 }).lean();
  const integrity = await verifyChain(req.params.id);
  res.json({ ok: true, count: events.length, integrity, events });
});

export default router;
