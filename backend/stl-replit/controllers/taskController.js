import Task from "../models/Task.js";
import User from "../models/User.js";
import { calculateSTL, getLevel } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";
import { notifyUser } from "../services/notificationService.js";

export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (req.auth?.role !== "admin" && req.auth?.userId !== task.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    if (task.status === "completed") {
      return res.json({ message: "Task already completed", newSTL: null });
    }

    task.status = "completed";
    await task.save();

    const user = await User.findOne({ userId: task.userId });
    if (!user) return res.status(404).json({ msg: "User not found for task" });

    switch (task.type) {
      case "KYC":
        user.modules.pss.kycVerified = true;
        user.modules.pss.verificationPending = 0;
        user.modules.pss.score = Math.min(100, (user.modules.pss.score || 0) + task.reward);
        break;
      case "EXAM":
        user.modules.crb.examsPassed = (user.modules.crb.examsPassed || 0) + 1;
        user.modules.crb.examsFailed = Math.max(0, (user.modules.crb.examsFailed || 0) - 1);
        user.modules.crb.score = Math.min(100, (user.modules.crb.score || 0) + task.reward);
        break;
      case "ACTIVITY":
        user.modules.dmo.activityLevel = "medium";
        user.modules.dmo.score = Math.min(100, (user.modules.dmo.score || 0) + task.reward);
        break;
      default:
        break;
    }

    user.stlScore = calculateSTL(user);
    user.stlLevel = getLevel(user.stlScore);
    await user.save();

    await logEvent({ userId: user.userId, event: "TASK_COMPLETED", entity: "task", meta: { taskId: task._id, type: task.type } });
    await logEvent({ userId: user.userId, event: "STL_UPDATED", entity: "stl", meta: { stlScore: user.stlScore, stlLevel: user.stlLevel } });
    await notifyUser({
      userId: user.userId,
      type: "STL_CHANGED",
      title: "Task completed",
      message: `Your STL is now ${user.stlScore} (${user.stlLevel}).`,
    });

    return res.json({
      message: "Task completed",
      newSTL: user.stlScore,
      level: user.stlLevel,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Task completion error", error: error.message });
  }
};

