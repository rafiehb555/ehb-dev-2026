import mongoose from "mongoose";

let connected = false;

export async function ensureMongoConnected(): Promise<void> {
  if (connected) return;
  const uri = process.env.MONGO_URL ?? "mongodb://mongo:27017/ehb";
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  connected = true;
}
