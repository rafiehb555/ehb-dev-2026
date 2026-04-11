export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ msg: "Validation error", issues: parsed.error.flatten() });
    }
    req.body = parsed.data;
    return next();
  };
}

