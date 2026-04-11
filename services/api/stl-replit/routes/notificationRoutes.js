import express from "express";
import { getMyNotifications } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.get("/notifications/me", requireAuth, getMyNotifications);

export default router;

