import { Router } from "express";
import { z } from "zod";
import { StlRequest } from "../models/stlRequest.js";

const router = Router();

/** POST /users/verify — returns latest STL + verification summary for a user */
const VerifySchema = z.object({ user_id: z.string().min(1) });

router.post("/verify", async (req, res) => {
  const parsed = VerifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const latest = await StlRequest.findOne({
    userId: parsed.data.user_id,
    status: { $in: ["approved", "pending_franchise", "pending_crb"] },
  })
    .sort({ updatedAt: -1 })
    .lean();

  if (!latest) {
    return res.json({
      ok: true,
      user_id: parsed.data.user_id,
      verified: false,
      stl_level: 0,
    });
  }

  res.json({
    ok: true,
    user_id: parsed.data.user_id,
    verified: latest.status === "approved",
    stl_level: latest.stlLevel || 0,
    last_request_id: latest._id,
    status: latest.status,
    decided_by: latest.route?.decidedBy,
    decided_at: latest.updatedAt,
  });
});

/** POST /stl/status/bulk — multi-id polling for platforms */
const BulkSchema = z.object({ ids: z.array(z.string()).min(1).max(100) });

router.post("/bulk-status", async (req, res) => {
  const parsed = BulkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });
  const docs = await StlRequest.find({ _id: { $in: parsed.data.ids } }).lean();
  res.json({
    ok: true,
    results: docs.map((r) => ({
      id: r._id,
      status: r.status,
      stl_level: r.stlLevel,
      score: r.score,
    })),
  });
});

export default router;
