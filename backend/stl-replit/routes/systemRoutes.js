import express from "express";
import { getSystemHealth } from "../controllers/systemController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.get("/system/health", requireAuth, requireRole("admin"), getSystemHealth);

export default router;

