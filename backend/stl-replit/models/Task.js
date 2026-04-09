import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    description: String,
    type: String,
    status: {
      type: String,
      default: "pending",
    },
    reward: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);

