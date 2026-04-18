import mongoose from "mongoose";

const PlatformRuleSchema = new mongoose.Schema(
  {
    platformId: { type: String, required: true, index: true },
    ruleName: { type: String, required: true },
    priority: { type: Number, required: true },
    operator: {
      type: String,
      enum: ["gte", "lte", "eq", "between"],
      required: true,
    },
    threshold: { type: Number, required: true },
    thresholdMax: { type: Number }, // for "between"
    action: {
      type: String,
      enum: ["auto_approve", "route_franchise", "route_crb", "reject"],
      required: true,
    },
    stlLevelAssigned: { type: Number, min: 0, max: 8 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "platform_rules" }
);

PlatformRuleSchema.index({ platformId: 1, active: 1, priority: 1 });

export const PlatformRule =
  mongoose.models.PlatformRule || mongoose.model("PlatformRule", PlatformRuleSchema);
