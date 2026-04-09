import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId: String,
    event: String,
    entity: String,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ event: 1, createdAt: -1 });

export default mongoose.model("Log", logSchema);

