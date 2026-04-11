export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : null;
  const raw = firstForwarded || req.socket?.remoteAddress || "";
  return raw.replace("::ffff:", "");
}

export function enforceAdminIpAllowList(req, res, next) {
  const rawAllowed = process.env.ADMIN_ALLOWED_IPS || "";
  if (!rawAllowed.trim()) return next();

  const allowedSet = new Set(
    rawAllowed
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

  const ip = getClientIp(req);
  if (!allowedSet.has(ip)) {
    return res.status(403).json({ msg: "IP not allowed for admin action" });
  }
  return next();
}
