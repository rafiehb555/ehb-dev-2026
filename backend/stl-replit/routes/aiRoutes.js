import express from "express";
import { runAI } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.get("/ai/:id", requireAuth, runAI);

export default router;

