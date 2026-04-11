import { logEvent } from "../services/logService.js";

export function notFound(_req, res) {
  return res.status(404).json({ msg: "Route not found" });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  logEvent({
    userId: req?.auth?.userId || "unknown",
    event: "FAILED_ACTION",
    entity: "api",
    meta: {
      status,
      path: req?.originalUrl,
      method: req?.method,
      message: err.message || "Internal server error",
    },
  });
  return res.status(status).json({
    msg: err.message || "Internal server error",
  });
}

