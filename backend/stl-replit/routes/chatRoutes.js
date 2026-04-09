import express from "express";
import { z } from "zod";
import { chatWithAI } from "../controllers/aiChatController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();
const chatSchema = z.object({
  message: z.string().min(2).max(2000),
  userId: z.string().optional(),
});

router.post("/chat", requireAuth, validateBody(chatSchema), chatWithAI);

export default router;

