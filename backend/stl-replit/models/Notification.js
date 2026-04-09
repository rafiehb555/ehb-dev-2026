import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: String,
    type: String,
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);

