import { askAI } from "../ai/chatEngine.js";
import { createTaskFromDepartment } from "../services/taskService.js";
import { logEvent } from "../services/logService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body || {};
    const requestedUserId = req.body?.userId;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ msg: "message is required" });
    }

    const ai = await askAI(message);
    const userId = req.auth?.role === "admin" ? requestedUserId || req.auth?.userId : req.auth?.userId;
    let task = null;
    if (userId && ai?.department) {
      task = await createTaskFromDepartment(String(userId), ai.department);
    }

    await logEvent({
      userId: String(userId || "unknown"),
      event: "AI_DECISION",
      entity: "ai",
      meta: { department: ai?.department, intent: ai?.intent },
    });

    return res.json({ reply: ai, task });
  } catch (error) {
    return res.status(500).json({ msg: "AI chat error", error: error.message });
  }
};

