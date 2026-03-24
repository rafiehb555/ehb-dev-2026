const mongoose = require("mongoose");
const Memory = require("./memoryModel");

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }
  await mongoose.connect(mongoUri);
}

async function upsertMemory(item) {
  const { key, category = "update", value, tags = [], importance = 3, source } = item;
  return Memory.findOneAndUpdate(
    { key, category },
    { key, category, value, tags, importance, source },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function listMemory(limit = 100) {
  return Memory.find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
}

module.exports = {
  connectDb,
  upsertMemory,
  listMemory,
  Memory,
};
