import express from "express";
import { calculateStl, getStlBreakdown, getUserSTL } from "../controllers/stlController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/stl/:id", requireAuth, getUserSTL);
router.post("/stl/:userId/calculate", requireAuth, calculateStl);
router.get("/stl/:userId/breakdown", requireAuth, getStlBreakdown);

export default router;

