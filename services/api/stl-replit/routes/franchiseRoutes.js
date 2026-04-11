import express from "express";
import {
  approveFranchiseRequest,
  escalateFranchiseRequest,
  getFranchiseDashboard,
  getFranchisePerformance,
} from "../controllers/franchiseController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/franchise/dashboard", requireAuth, requireRole("admin", "franchise"), getFranchiseDashboard);
router.post("/franchise/approve", requireAuth, requireRole("admin", "franchise"), approveFranchiseRequest);
router.post("/franchise/escalate", requireAuth, requireRole("admin", "franchise"), escalateFranchiseRequest);
router.get("/franchise/performance", requireAuth, requireRole("admin", "franchise"), getFranchisePerformance);

export default router;

