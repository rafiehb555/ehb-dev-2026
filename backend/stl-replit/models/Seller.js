import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sellerScore: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    complaints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Seller", sellerSchema);

