import express from "express";
import { z } from "zod";
import {
  adminFreezeUser,
  adminUpdateStl,
  getAdminDashboard,
  getAdminFranchiseOverview,
  getAdminLogs,
  getAdminUsers,
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const updateStlSchema = z.object({
  userId: z.string().min(3),
  pssScore: z.number().min(0).max(100).optional(),
  crbScore: z.number().min(0).max(100).optional(),
  dmoScore: z.number().min(0).max(100).optional(),
  lockAmount: z.number().min(0).optional(),
  reason: z.string().optional(),
});

const freezeUserSchema = z.object({
  userId: z.string().min(3),
  freeze: z.boolean().optional(),
  reason: z.string().optional(),
});

router.get("/admin/dashboard", requireAuth, requireRole("admin"), getAdminDashboard);
router.get("/admin/users", requireAuth, requireRole("admin"), getAdminUsers);
router.post("/admin/stl/update", requireAuth, requireRole("admin"), validateBody(updateStlSchema), adminUpdateStl);
router.post("/admin/freeze-user", requireAuth, requireRole("admin"), validateBody(freezeUserSchema), adminFreezeUser);
router.get("/admin/logs", requireAuth, requireRole("admin"), getAdminLogs);
router.get("/admin/franchises", requireAuth, requireRole("admin"), getAdminFranchiseOverview);

export default router;

