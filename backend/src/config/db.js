const mongoose = require("mongoose");

// This function connects the backend to MongoDB.
// We keep it in the config folder so database logic is separated from business logic.
const connectDB = async () => {
  try {
    // We read the database URL from environment variables instead of hardcoding it.
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables.");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    // If the database cannot connect at startup, we stop the server.
    // This prevents the app from running in a broken state.
    process.exit(1);
  }
};

module.exports = connectDB;
