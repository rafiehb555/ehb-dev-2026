import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Log.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Log.countDocuments(),
  ]);

  return res.json({ items, page, limit, total });
};

