import express from "express";
import { createCrbApplication, getCrbApplicationStatus, getCrbTimeline, updateCrbApproval } from "../controllers/crbController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { crbApplicationSchema, crbApprovalSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/crb/:userId/application", requireAuth, validateBody(crbApplicationSchema), createCrbApplication);
router.get("/crb/:userId/application", requireAuth, getCrbApplicationStatus);
router.get("/crb/:userId/timeline", requireAuth, getCrbTimeline);
router.patch("/crb/:userId/approval", requireAuth, requireRole("admin", "franchise"), validateBody(crbApprovalSchema), updateCrbApproval);

export default router;

