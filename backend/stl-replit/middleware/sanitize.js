function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;

  const sanitized = {};
  for (const [key, val] of Object.entries(value)) {
    const safeKey = key.replace(/\$/g, "").replace(/\./g, "");
    sanitized[safeKey] = sanitizeValue(val);
  }
  return sanitized;
}

export function sanitizeRequest(req, _res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

