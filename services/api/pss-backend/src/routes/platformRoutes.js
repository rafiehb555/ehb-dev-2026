import { Router } from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { z } from "zod";

const PlatformSchema = new mongoose.Schema(
  {
    platformId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    webhookUrl: { type: String, required: true },
    webhookSecret: { type: String, required: true }, // HMAC shared secret
    platformKey: { type: String, required: true }, // bearer for x-platform-key
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Platform = mongoose.models.Platform || mongoose.model("Platform", PlatformSchema);

const router = Router();

const RegisterSchema = z.object({
  platform_id: z.string().min(1),
  name: z.string().min(1),
  webhook_url: z.string().url(),
});

/** POST /platforms/register — generates platformKey + webhookSecret, returns once. */
router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", issues: parsed.error.issues });

  const webhookSecret = crypto.randomBytes(32).toString("hex");
  const platformKey = crypto.randomBytes(24).toString("hex");

  const doc = await Platform.findOneAndUpdate(
    { platformId: parsed.data.platform_id },
    {
      platformId: parsed.data.platform_id,
      name: parsed.data.name,
      webhookUrl: parsed.data.webhook_url,
      webhookSecret,
      platformKey,
      active: true,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    ok: true,
    platform_id: doc.platformId,
    name: doc.name,
    webhook_url: doc.webhookUrl,
    // Returned ONCE — store securely on platform side
    platform_key: platformKey,
    webhook_secret: webhookSecret,
    hint: "Store platform_key + webhook_secret in your platform's env. Rotate via POST /platforms/rotate.",
  });
});

/** GET /platforms — list (sans secrets) */
router.get("/", async (req, res) => {
  const list = await Platform.find({}, { webhookSecret: 0, platformKey: 0 }).lean();
  res.json({ ok: true, platforms: list });
});

/** POST /platforms/:id/rotate — rotate both secrets */
router.post("/:id/rotate", async (req, res) => {
  const webhookSecret = crypto.randomBytes(32).toString("hex");
  const platformKey = crypto.randomBytes(24).toString("hex");
  const doc = await Platform.findOneAndUpdate(
    { platformId: req.params.id },
    { webhookSecret, platformKey },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true, platform_id: doc.platformId, platform_key: platformKey, webhook_secret: webhookSecret });
});

export default router;
