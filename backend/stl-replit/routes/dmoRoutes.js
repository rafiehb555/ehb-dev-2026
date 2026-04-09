import express from "express";
import { getDmoStats, trackDmoActivity } from "../controllers/dmoController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { dmoActivitySchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/dmo/:userId/activity", requireAuth, validateBody(dmoActivitySchema), trackDmoActivity);
router.get("/dmo/:userId/stats", requireAuth, getDmoStats);

export default router;

