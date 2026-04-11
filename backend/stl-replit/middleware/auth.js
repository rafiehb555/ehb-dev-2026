import jwt from "jsonwebtoken";

const ROLE_RANK = {
  user: 10,
  seller: 20,
  franchise: 30,
  service_provider: 40,
  admin_viewer: 70,
  admin_moderator: 80,
  admin: 90,
  super_admin: 100,
};

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ msg: "Unauthorized" });
  if (!process.env.JWT_SECRET) return res.status(500).json({ msg: "JWT secret misconfigured" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.auth?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    return next();
  };
}

export function requireMinRole(minRole) {
  return (req, res, next) => {
    const role = req.auth?.role;
    const currentRank = ROLE_RANK[role] ?? 0;
    const requiredRank = ROLE_RANK[minRole] ?? Number.MAX_SAFE_INTEGER;
    if (!role || currentRank < requiredRank) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    return next();
  };
}

