const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: [
        "vision",
        "department",
        "uiux",
        "business_logic",
        "decision",
        "update",
        "chat",
        "system",
      ],
      default: "update",
    },
    tags: [{ type: String, trim: true }],
    importance: { type: Number, min: 1, max: 5, default: 3 },
    source: { type: String, default: "manual" },
  },
  { timestamps: true }
);

memorySchema.index({ key: 1, category: 1 }, { unique: true });
memorySchema.index({ tags: 1, updatedAt: -1 });

module.exports = mongoose.model("Memory", memorySchema);
