import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sub", "master", "corporate"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    assignedUsers: {
      type: [String],
      default: [],
    },
    pendingRequests: {
      type: Number,
      default: 0,
    },
    approvals: {
      type: Number,
      default: 0,
    },
    performanceScore: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

franchiseSchema.index({ type: 1, location: 1 });

export default mongoose.model("Franchise", franchiseSchema);

