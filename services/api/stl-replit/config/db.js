import mongoose from "mongoose";

// Shared Mongo state so server.js and /api/health can read it.
export const dbState = {
  connected: false,
  error: null,
  lastAttempt: null,
};

async function attempt() {
  dbState.lastAttempt = new Date().toISOString();
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    dbState.connected = true;
    dbState.error = null;
    console.log("MongoDB Connected");
  } catch (error) {
    dbState.connected = false;
    dbState.error = error.message || String(error);
    console.warn(
      `[api] MongoDB not available: ${dbState.error}. Server stays up in degraded mode. Retrying in 15s.`
    );
    setTimeout(attempt, 15000);
  }
}

// Kept as fire-and-forget so server.js can keep its existing call site.
// Old behaviour: process.exit(1) on failure (crashed the whole API).
// New behaviour: retry in background, expose state via dbState / /api/health.
const connectDB = () => {
  attempt();
};

export default connectDB;
