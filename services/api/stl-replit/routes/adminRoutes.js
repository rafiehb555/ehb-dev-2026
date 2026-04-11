import express from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import {
  approveAdminAction,
  adminFreezeUser,
  adminUpdateStl,
  createWalletAdjustmentRequest,
  getAdminActionHistory,
  getAdminDashboard,
  getAdminFranchiseOverview,
  getAdminLogs,
  getAdminSecurityOverview,
  getAdminUsers,
  getPendingAdminActionQueue,
  rejectAdminAction,
  rollbackAdminAction,
} from "../controllers/adminController.js";
import { requireAuth, requireMinRole } from "../middleware/auth.js";
import { enforceAdminIpAllowList } from "../middleware/adminSecurity.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();
const strictAdminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: Number(process.env.ADMIN_ACTION_RATE_LIMIT || 40),
});

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

const walletAdjustSchema = z.object({
  userId: z.string().min(3),
  amount: z.number(),
  reason: z.string().optional(),
});

const requestActionSchema = z.object({
  requestId: z.string().min(12),
});

const rejectActionSchema = z.object({
  requestId: z.string().min(12),
  reason: z.string().min(3).optional(),
});

const rollbackActionSchema = z.object({
  requestId: z.string().min(12),
  reason: z.string().min(3).optional(),
});

router.get("/admin/dashboard", requireAuth, requireMinRole("admin_viewer"), getAdminDashboard);
router.get("/admin/users", requireAuth, requireMinRole("admin_viewer"), getAdminUsers);
router.get("/admin/security/overview", requireAuth, requireMinRole("admin_viewer"), getAdminSecurityOverview);
router.get("/admin/actions/pending", requireAuth, requireMinRole("admin_viewer"), getPendingAdminActionQueue);
router.get("/admin/actions/history", requireAuth, requireMinRole("admin_viewer"), getAdminActionHistory);
router.post(
  "/admin/stl/update",
  requireAuth,
  requireMinRole("admin_moderator"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(updateStlSchema),
  adminUpdateStl,
);
router.post(
  "/admin/freeze-user",
  requireAuth,
  requireMinRole("admin_moderator"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(freezeUserSchema),
  adminFreezeUser,
);
router.post(
  "/admin/wallet/adjust",
  requireAuth,
  requireMinRole("admin_moderator"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(walletAdjustSchema),
  createWalletAdjustmentRequest,
);
router.post(
  "/admin/actions/approve",
  requireAuth,
  requireMinRole("admin"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(requestActionSchema),
  approveAdminAction,
);
router.post(
  "/admin/actions/reject",
  requireAuth,
  requireMinRole("admin"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(rejectActionSchema),
  rejectAdminAction,
);
router.post(
  "/admin/actions/rollback",
  requireAuth,
  requireMinRole("super_admin"),
  strictAdminLimiter,
  enforceAdminIpAllowList,
  validateBody(rollbackActionSchema),
  rollbackAdminAction,
);
router.get("/admin/logs", requireAuth, requireMinRole("admin_viewer"), getAdminLogs);
router.get("/admin/franchises", requireAuth, requireMinRole("admin_viewer"), getAdminFranchiseOverview);

export default router;

