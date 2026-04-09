import express from "express";
import { getLogs } from "../controllers/logController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.get("/logs", requireAuth, requireRole("admin"), getLogs);

export default router;

