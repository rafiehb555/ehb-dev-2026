import express from "express";
import { z } from "zod";
import { login, signup } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const signupSchema = z.object({
  userId: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "seller", "franchise", "admin"]).optional(),
  type: z.string().optional(),
  source: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/auth/signup", validateBody(signupSchema), signup);
router.post("/auth/login", validateBody(loginSchema), login);

export default router;

