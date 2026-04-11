import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  const userId = req.auth?.userId;
  const items = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  return res.json({ items });
};

