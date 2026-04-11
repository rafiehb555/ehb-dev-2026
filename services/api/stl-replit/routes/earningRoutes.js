import express from "express";
import { z } from "zod";
import { addEarning, getEarnings } from "../controllers/earningController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const addEarningSchema = z.object({
  userId: z.string().min(3),
  amount: z.number().positive(),
  reason: z.string().optional(),
});

router.get("/earnings/:userId", requireAuth, getEarnings);
router.post("/earnings/add", requireAuth, validateBody(addEarningSchema), addEarning);

export default router;

