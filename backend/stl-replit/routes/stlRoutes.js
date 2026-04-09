import express from "express";
import { calculateStl, getFranchiseSTL, getProductSTL, getSellerSTL, getStlBreakdown, getUserSTL } from "../controllers/stlController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/stl/seller/:id", requireAuth, getSellerSTL);
router.get("/stl/product/:id", requireAuth, getProductSTL);
router.get("/stl/franchise/:id", requireAuth, getFranchiseSTL);
router.post("/stl/:userId/calculate", requireAuth, calculateStl);
router.get("/stl/:userId/breakdown", requireAuth, getStlBreakdown);
router.get("/stl/:id", requireAuth, getUserSTL);

export default router;

