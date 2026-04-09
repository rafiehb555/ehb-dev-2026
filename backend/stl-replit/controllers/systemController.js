import mongoose from "mongoose";
import Franchise from "../models/Franchise.js";
import User from "../models/User.js";

const ESCALATE_MS = 24 * 60 * 60 * 1000;

export const getSystemHealth = async (_req, res) => {
  try {
    const now = Date.now();
    const pendingCrbCount = await User.countDocuments({
      "modules.crb.application.status": { $in: ["submitted", "in_review", "escalated"] },
    });

    const candidates = await User.find({
      "modules.crb.application.updatedAt": { $exists: true },
      "modules.crb.application.status": { $in: ["submitted", "in_review", "escalated"] },
    }).select("modules.crb.application stlScore modules.dmo.activityLevel");

    const stuckRequests = candidates.filter((u) => {
      const app = u.modules?.crb?.application;
      if (!app?.updatedAt) return false;
      return now - new Date(app.updatedAt).getTime() > ESCALATE_MS;
    }).length;

    const allUsers = await User.find().select("stlScore modules.dmo.activityLevel");
    const inactiveUsers = allUsers.filter((u) => (u.modules?.dmo?.activityLevel || "low") === "low").length;
    const lowStlUsers = allUsers.filter((u) => Number(u.stlScore || 0) < 40).length;
    const avg = await Franchise.aggregate([{ $group: { _id: null, avgResponseTime: { $avg: "$responseTime" } } }]);
    const avgResponseTime = avg?.[0]?.avgResponseTime ?? 0;

    return res.json({
      dbStatus: mongoose.connection.readyState === 1 ? "up" : "down",
      pendingCrbCount,
      stuckRequests,
      inactiveUsers,
      lowStlUsers,
      avgResponseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ msg: "System health error", error: error.message });
  }
};

