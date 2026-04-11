import User from "../models/User.js";
import Task from "../models/Task.js";
import { generateTasks } from "../services/taskService.js";

export const runAI = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const created = await generateTasks(user);
    const tasks = await Task.find({ userId: user.userId }).sort({ createdAt: -1 });

    return res.json({
      message: "AI Analysis Complete",
      created: created.length,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ msg: "AI controller error", error: error.message });
  }
};

