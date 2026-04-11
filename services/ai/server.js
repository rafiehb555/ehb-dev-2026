require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { connectDb } = require("./ai-system/memory/memoryStore");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();
const PORT = Number(process.env.PORT || 8080);

// Mongo connection state — /health exposes this so you can tell
// whether the service is fully up or running in degraded mode.
const dbState = {
  connected: false,
  error: null,
  lastAttempt: null,
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 120),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(globalLimiter);

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ai-system-backend",
    port: PORT,
    db: {
      connected: dbState.connected,
      error: dbState.error,
      lastAttempt: dbState.lastAttempt,
    },
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use("/ai", aiRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
  });
});

// --- Startup order (fixed 2026-04-11) ---
// Old: awaited Mongo before listen() — if Mongo was down, /health was unreachable.
// New: listen() first (so /health works immediately), Mongo connects in the
// background, failures are reported via /health instead of crashing the process.

function attemptMongoConnect() {
  dbState.lastAttempt = new Date().toISOString();
  connectDb()
    .then(() => {
      dbState.connected = true;
      dbState.error = null;
      console.log("[ai] MongoDB connected");
    })
    .catch((error) => {
      dbState.connected = false;
      dbState.error = error.message || String(error);
      console.warn(
        `[ai] MongoDB not available yet: ${dbState.error}. Service is running in degraded mode. Will retry in 15s.`
      );
      setTimeout(attemptMongoConnect, 15000);
    });
}

app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
  attemptMongoConnect();
});
