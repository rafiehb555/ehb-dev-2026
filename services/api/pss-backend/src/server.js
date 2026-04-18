import express from "express";
import mongoose from "mongoose";
import stlRoutes from "./routes/stlRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import criteriaRoutes from "./routes/criteriaRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import opsRoutes from "./routes/opsRoutes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Health check (DB optional — follows fail-open pattern per AGENTS.md §7.5)
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "pss-backend",
    version: "0.1.0",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "connecting",
    time: new Date().toISOString(),
  });
});

app.use("/stl", stlRoutes);
app.use("/users", userRoutes);
app.use("/stl", userRoutes); // exposes /stl/status/bulk alias via POST /users/bulk-status too
app.use("/criteria", criteriaRoutes);
app.use("/platforms", platformRoutes);
app.use("/ops", opsRoutes);

const PORT = process.env.PORT || 6000;
const MONGO = process.env.PSS_MONGO_URI || "mongodb://127.0.0.1:27017/pss_db";

// Start HTTP first, connect Mongo in background
app.listen(PORT, () => {
  console.log(`[pss-backend] listening on :${PORT}`);
});

(async () => {
  try {
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 5_000 });
    console.log("[pss-backend] mongo connected");
  } catch (err) {
    console.warn("[pss-backend] mongo connect failed (will retry in background):", err.message);
    // Retry loop: soft — does not crash the service
    setInterval(async () => {
      if (mongoose.connection.readyState !== 1) {
        try {
          await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 5_000 });
          console.log("[pss-backend] mongo re-connected");
        } catch {
          /* retry again next tick */
        }
      }
    }, 30_000);
  }
})();
