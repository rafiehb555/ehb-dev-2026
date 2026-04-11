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
  res.json({ ok: true, service: "ai-system-backend" });
});

app.use("/ai", aiRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
  });
});

async function startServer() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`AI backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
