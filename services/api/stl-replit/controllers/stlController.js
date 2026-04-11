import User from "../models/User.js";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";
import Franchise from "../models/Franchise.js";
import { explainSTL, getLevel, getStlBreakdown as computeStlBreakdown, recalculateUserStl } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";
import { calculateFranchiseSTL, calculateProductSTL, calculateSellerSTL } from "../services/multiStlService.js";

export const getUserSTL = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (req.auth?.role !== "admin" && req.auth?.userId !== targetUserId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: targetUserId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const score = user.stlScore ?? 0;
    const reasons = explainSTL(user);
    const breakdown = computeStlBreakdown(user);
    await logEvent({ userId: user.userId, event: "STL_VIEWED", entity: "stl", meta: { score, level: user.stlLevel } });

    return res.json({
      stlScore: score,
      stlLevel: user.stlLevel,
      reasons,
      breakdown,
      ai: user.aiInsight || { risk: "medium", trustAdjustment: 0, reason: "No AI insight yet." },
      warning: reasons[0] || `Improve ${breakdown.weakArea} to reach next level`,
      userProfile: {
        type: user.role || "SELLER",
        source: user.source || "signup",
        franchiseConnected: Boolean(user.modules?.franchise?.connected),
      },
      policy: [
        "Fake data = ban risk",
        "Low activity = downgrade",
        "High performance = STL boost",
      ],
      user,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const calculateStl = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const result = await recalculateUserStl(user, { reason: "manual_calculate" });
    await user.save();
    await logEvent({ userId: user.userId, event: "STL_UPDATED", entity: "stl", meta: { score: user.stlScore, level: user.stlLevel, source: "manual_calculate" } });

    return res.json({
      userId: user.userId,
      stlScore: user.stlScore,
      stlLevel: user.stlLevel,
      ai: result.ai || user.aiInsight || null,
    });
  } catch (error) {
    return res.status(500).json({ msg: "STL calculate error", error: error.message });
  }
};

export const getStlBreakdown = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const score = user.stlScore ?? 0;
    const stlLevel = user.stlLevel ?? getLevel(score);
    const breakdown = computeStlBreakdown(user);
    await logEvent({ userId: user.userId, event: "STL_BREAKDOWN_VIEWED", entity: "stl", meta: { score, level: stlLevel } });

    return res.json({ userId: user.userId, stlScore: score, stlLevel, breakdown });
  } catch (error) {
    return res.status(500).json({ msg: "Breakdown error", error: error.message });
  }
};

export const getSellerSTL = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ msg: "Seller not found" });

    const user = await User.findOne({ userId: seller.userId });
    if (!user) return res.status(404).json({ msg: "Linked user not found" });
    if (req.auth?.role !== "admin" && req.auth?.userId !== user.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const result = calculateSellerSTL(user.stlLevel, seller.sellerScore);
    await logEvent({
      userId: user.userId,
      event: "SELLER_STL_VIEWED",
      entity: "seller_stl",
      meta: { sellerId: seller.id, level: result.label },
    });
    return res.json({
      sellerId: seller.id,
      userId: seller.userId,
      sellerScore: seller.sellerScore,
      level: result.label,
      breakdown: result.breakdown,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Seller STL error", error: error.message });
  }
};

export const getProductSTL = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const seller = await Seller.findById(product.sellerId);
    if (!seller) return res.status(404).json({ msg: "Linked seller not found" });

    const user = await User.findOne({ userId: seller.userId });
    if (!user) return res.status(404).json({ msg: "Linked user not found" });
    if (req.auth?.role !== "admin" && req.auth?.userId !== user.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const sellerStl = calculateSellerSTL(user.stlLevel, seller.sellerScore);
    const productStl = calculateProductSTL(sellerStl.level, product.qualityScore);
    await logEvent({
      userId: user.userId,
      event: "PRODUCT_STL_VIEWED",
      entity: "product_stl",
      meta: { productId: product.id, level: productStl.label },
    });

    return res.json({
      productId: product.id,
      sellerId: seller.id,
      level: productStl.label,
      breakdown: {
        ...productStl.breakdown,
        userLevel: sellerStl.breakdown.userLevel,
      },
      trustChain: "Product STL <= Seller STL <= User STL",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Product STL error", error: error.message });
  }
};

export const getFranchiseSTL = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.role !== "franchise") {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const franchise = await Franchise.findById(req.params.id);
    if (!franchise) return res.status(404).json({ msg: "Franchise not found" });

    const result = calculateFranchiseSTL(franchise.performanceScore || 0);
    await logEvent({
      userId: req.auth?.userId || "system",
      event: "FRANCHISE_STL_VIEWED",
      entity: "franchise_stl",
      meta: { franchiseId: franchise.id, level: result.label },
    });
    return res.json({
      franchiseId: franchise.id,
      level: result.label,
      performanceScore: franchise.performanceScore || 0,
      breakdown: result.breakdown,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Franchise STL error", error: error.message });
  }
};

