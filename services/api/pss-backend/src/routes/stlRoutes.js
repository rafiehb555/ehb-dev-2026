import { Router } from "express";
import { z } from "zod";
import { StlRequest } from "../models/stlRequest.js";
import { PlatformRule } from "../models/platformRule.js";
import { calcScore, scoreToLevel, applyPssCap } from "../modules/stl-engine/stlEngine.js";
import { evaluateRules } from "../modules/rule-engine/ruleEngine.js";

const router = Router();

const SubmitSchema = z.object({
  entity_id: z.string().min(1),
  entity_type: z.string().min(1),
  user_id: z.string().min(1),
  entity_data: z.record(z.unknown()).default({}),
});

/** POST /stl/submit — platform → PSS */
router.post("/submit", async (req, res) => {
  const platformId = req.header("x-platform-id");
  if (!platformId) return res.status(401).json({ error: "missing_platform_id" });

  const parsed = SubmitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", issues: parsed.error.issues });

  const idempotency = req.header("x-idempotency-key");
  if (idempotency) {
    const prior = await StlRequest.findOne({ idempotencyKey: idempotency });
    if (prior) return res.status(200).json({ ok: true, stl_request_id: prior._id, status: prior.status, replayed: true });
  }

  const reqDoc = await StlRequest.create({
    platformId,
    entityId: parsed.data.entity_id,
    entityType: parsed.data.entity_type,
    userId: parsed.data.user_id,
    entityData: parsed.data.entity_data,
    idempotencyKey: idempotency,
    status: "pending",
  });

  res.status(202).json({ ok: true, stl_request_id: reqDoc._id, status: "pending" });
});

/** GET /stl/status/:id — platform polling fallback */
router.get("/status/:id", async (req, res) => {
  const r = await StlRequest.findById(req.params.id).lean();
  if (!r) return res.status(404).json({ error: "not_found" });
  res.json({
    id: r._id,
    status: r.status,
    stl_level: r.stlLevel,
    score: r.score,
    risk_score: r.riskScore,
    decided_by: r.route?.decidedBy,
  });
});

/** Internal worker — score + route a pending request. Called by stl.processRequest queue. */
export async function processPendingRequest(reqId) {
  const doc = await StlRequest.findById(reqId);
  if (!doc || doc.status !== "pending") return;

  // Placeholder: in production, criteria evaluator runs here.
  // For scaffold, assume entityData.meta_criteria is a simple array of booleans.
  const results = doc.entityData?.meta_criteria ?? [];
  const met = results.filter(Boolean).length;
  const total = results.length || 15;

  doc.criteriaMet = met;
  doc.criteriaTotal = total;
  doc.score = calcScore(met, total);

  const { level } = scoreToLevel(doc.score);

  const rules = await PlatformRule.find({ platformId: doc.platformId, active: true });
  const decision = evaluateRules(rules, met);

  if (decision.action === "auto_approve") {
    doc.stlLevel = applyPssCap(decision.stlLevelAssigned ?? level, "pss");
    doc.status = "approved";
  } else if (decision.action === "route_franchise") {
    doc.status = "pending_franchise";
  } else if (decision.action === "route_crb") {
    doc.status = "pending_crb";
  } else {
    doc.status = "rejected";
  }

  doc.route = {
    action: decision.action,
    ruleId: decision.ruleId,
    ruleName: decision.ruleName,
    decidedBy: decision.action === "auto_approve" ? "system" : "pending_review",
  };

  await doc.save();
  return doc;
}

export default router;
