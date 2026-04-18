import mongoose from "mongoose";

/**
 * stl_requests — every submission goes here.
 * Lifecycle: pending → (pending_franchise | pending_crb | approved | rejected)
 */
const StlRequestSchema = new mongoose.Schema(
  {
    platformId: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    entityType: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    entityData: { type: Object, default: {} },
    idempotencyKey: { type: String, unique: true, sparse: true },

    status: {
      type: String,
      enum: ["pending", "pending_franchise", "pending_crb", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    score: { type: Number, min: 0, max: 100 },
    criteriaMet: { type: Number },
    criteriaTotal: { type: Number },
    stlLevel: { type: Number, min: 1, max: 10 },

    riskScore: { type: Number, min: 0, max: 100 },
    riskFlags: [{ type: String }],

    route: {
      action: {
        type: String,
        enum: ["auto_approve", "route_franchise", "route_crb", "reject"],
      },
      ruleId: String,
      ruleName: String,
      decidedBy: String, // "system" | franchiseId | "crb"
    },

    franchiseId: { type: String, index: true, sparse: true },
    crbReviewId: { type: String, index: true, sparse: true },
  },
  { timestamps: true, collection: "stl_requests" }
);

StlRequestSchema.index({ platformId: 1, status: 1, createdAt: -1 });
StlRequestSchema.index({ userId: 1, createdAt: -1 });

export const StlRequest =
  mongoose.models.StlRequest || mongoose.model("StlRequest", StlRequestSchema);
