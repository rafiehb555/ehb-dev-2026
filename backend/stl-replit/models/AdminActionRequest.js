import mongoose from "mongoose";

const adminActionRequestSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: ["STL_UPDATE", "FREEZE_USER", "WALLET_ADJUST"],
      required: true,
      index: true,
    },
    targetUserId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rolled_back", "expired"],
      default: "pending",
      index: true,
    },
    requestedBy: {
      type: String,
      required: true,
      index: true,
    },
    approvedBy: String,
    rejectedBy: String,
    rolledBackBy: String,
    payload: mongoose.Schema.Types.Mixed,
    beforeSnapshot: mongoose.Schema.Types.Mixed,
    afterSnapshot: mongoose.Schema.Types.Mixed,
    reason: {
      type: String,
      default: "admin_action",
    },
    rejectReason: String,
    correlationId: {
      type: String,
      index: true,
    },
    requestIp: String,
    approvalIp: String,
    userAgent: String,
    approvedAt: Date,
    rejectedAt: Date,
    executedAt: Date,
    rolledBackAt: Date,
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

adminActionRequestSchema.index({ status: 1, createdAt: -1 });
adminActionRequestSchema.index({ requestedBy: 1, createdAt: -1 });
adminActionRequestSchema.index({ targetUserId: 1, createdAt: -1 });

export default mongoose.model("AdminActionRequest", adminActionRequestSchema);
