import express from "express";
import { completeTask } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.post("/task/:id", requireAuth, completeTask);

export default router;

