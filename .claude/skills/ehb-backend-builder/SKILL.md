---
name: ehb-backend-builder
description: Build Express.js API routes, controllers, services, and models following EHB architecture
---

# EHB Backend Builder

Build scalable, secure REST APIs with Node.js + Express + Mongoose. Follow the Route → Controller → Service → Model layered architecture.

## File Structure

```
services/api/stl-replit/
├── routes/
│   ├── authRoutes.js
│   ├── featureRoutes.js
│   └── ...Routes.js         (one per domain)
├── controllers/
│   ├── authController.js
│   ├── featureController.js
│   └── ...Controller.js
├── services/
│   ├── authService.js
│   ├── featureService.js
│   ├── stlService.js        (PROTECTED: 58 gold-master tests)
│   └── ...Service.js
├── models/
│   ├── User.js
│   ├── Feature.js
│   └── ...js
├── validation/
│   ├── authSchemas.js
│   ├── featureSchemas.js
│   └── ...Schemas.js        (Zod input validation)
├── middleware/
│   ├── auth.js
│   ├── validate.js
│   ├── rateLimit.js
│   ├── errorHandler.js
│   └── auditLog.js
├── config/
│   ├── db.js                (MongoDB connection)
│   ├── constants.js
│   └── env.js
└── utils/
    ├── errors.js            (AppError class)
    └── response.js          (standardResponse helper)
```

## Architecture Layers

### Layer 1: Route (Orchestration)

Routes define endpoints, middleware chain, and delegation.

```javascript
// routes/featureRoutes.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { 
  createFeature, 
  getFeature, 
  updateFeature, 
  deleteFeature 
} from "../controllers/featureController.js";
import { featureCreateSchema, featureUpdateSchema } from "../validation/featureSchemas.js";

const router = express.Router();

// POST /api/feature
router.post(
  "/",
  authenticate,                           // 1. Auth check
  rateLimit("feature:create", 10, 3600),  // 2. Rate limit
  validate(featureCreateSchema),          // 3. Input validation
  createFeature                           // 4. Handler
);

// GET /api/feature/:id
router.get(
  "/:id",
  authenticate,
  getFeature
);

// PATCH /api/feature/:id
router.patch(
  "/:id",
  authenticate,
  rateLimit("feature:update", 20, 3600),
  validate(featureUpdateSchema),
  updateFeature
);

// DELETE /api/feature/:id
router.delete(
  "/:id",
  authenticate,
  rateLimit("feature:delete", 5, 3600),
  deleteFeature
);

export default router;
```

### Layer 2: Controller (HTTP → Business Logic)

Controllers handle request/response, parse params, call services.

```javascript
// controllers/featureController.js
import { AppError } from "../utils/errors.js";
import * as featureService from "../services/featureService.js";
import { auditLog } from "../middleware/auditLog.js";

export async function createFeature(req, res, next) {
  try {
    const { userId } = req.user;
    const { name, description } = req.body;

    const feature = await featureService.createFeature({
      userId,
      name,
      description,
    });

    // Audit log
    await auditLog({
      userId,
      action: "FEATURE_CREATED",
      resourceId: feature._id,
      changes: { name, description },
    });

    res.status(201).json({
      success: true,
      data: feature,
      message: "Feature created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeature(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const feature = await featureService.getFeatureById(id, userId);

    if (!feature) {
      throw new AppError("Feature not found", 404);
    }

    res.json({
      success: true,
      data: feature,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFeature(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const updates = req.body;

    const feature = await featureService.updateFeature(id, userId, updates);

    await auditLog({
      userId,
      action: "FEATURE_UPDATED",
      resourceId: feature._id,
      changes: updates,
    });

    res.json({
      success: true,
      data: feature,
      message: "Feature updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFeature(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await featureService.deleteFeature(id, userId);

    await auditLog({
      userId,
      action: "FEATURE_DELETED",
      resourceId: id,
    });

    res.json({
      success: true,
      message: "Feature deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
```

### Layer 3: Service (Business Logic)

Services contain all business logic, validation, and database queries.

```javascript
// services/featureService.js
import Feature from "../models/Feature.js";
import { AppError } from "../utils/errors.js";

export async function createFeature({ userId, name, description }) {
  // Validate business rules
  const existing = await Feature.findOne({ userId, name });
  if (existing) {
    throw new AppError("Feature with this name already exists", 409);
  }

  // Create and save
  const feature = new Feature({
    userId,
    name,
    description,
    status: "active",
  });

  await feature.save();
  return feature;
}

export async function getFeatureById(id, userId) {
  const feature = await Feature.findOne({
    _id: id,
    userId,
    isDeleted: false, // soft delete check
  })
    .lean()            // Return plain JS object (faster)
    .select("+secretField"); // Include hidden fields if needed

  return feature;
}

export async function updateFeature(id, userId, updates) {
  // Validate ownership
  const feature = await Feature.findOne({
    _id: id,
    userId,
    isDeleted: false,
  });

  if (!feature) {
    throw new AppError("Feature not found", 404);
  }

  // Update only allowed fields
  const allowedFields = ["name", "description"];
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      feature[key] = updates[key];
    }
  });

  feature.updatedAt = new Date();
  await feature.save();
  return feature;
}

export async function deleteFeature(id, userId) {
  const feature = await Feature.findOne({
    _id: id,
    userId,
    isDeleted: false,
  });

  if (!feature) {
    throw new AppError("Feature not found", 404);
  }

  // Soft delete
  feature.isDeleted = true;
  feature.deletedAt = new Date();
  await feature.save();
}

// Batch operations
export async function getFeaturesByUserId(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [features, total] = await Promise.all([
    Feature.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feature.countDocuments({ userId, isDeleted: false }),
  ]);

  return {
    features,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

### Layer 4: Model (Data Schema)

Mongoose schemas with validation, indexes, and lifecycle hooks.

```javascript
// models/Feature.js
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "archived"],
        message: "Invalid status",
      },
      default: "active",
      index: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compound index for fast queries
featureSchema.index({ userId: 1, status: 1 });
featureSchema.index({ userId: 1, isDeleted: 1 });
featureSchema.index({ name: "text", description: "text" }); // Text search

// Pre-save hook: normalize data
featureSchema.pre("save", function (next) {
  this.name = this.name?.trim();
  next();
});

// Post-save hook: emit event (optional)
featureSchema.post("save", function (doc) {
  // Emit to event bus: feature.updated
});

export default mongoose.model("Feature", featureSchema);
```

## JWT Authentication Middleware

```javascript
// middleware/auth.js
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors.js";

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid authorization header", 401);
    }

    const token = authHeader.slice(7); // Remove "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(new AppError("Token has expired", 401));
    } else if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid token", 401));
    } else {
      next(error);
    }
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
}
```

## STL Level Check Middleware

```javascript
// middleware/stlCheck.js
import { AppError } from "../utils/errors.js";
import * as stlService from "../services/stlService.js";

export function requireSTLLevel(minLevel) {
  return async (req, res, next) => {
    try {
      const { userId } = req.user;

      // Get user's current STL level
      const stlRecord = await stlService.getSTLLevel(userId);
      
      if (!stlRecord || stlRecord.level < minLevel) {
        throw new AppError(
          `Service requires STL Level ${minLevel} or higher. Current: ${stlRecord?.level || 0}`,
          403
        );
      }

      req.user.stlLevel = stlRecord.level;
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Usage in route:
// router.post("/", authenticate, requireSTLLevel(2), controller);
```

## Input Validation (Zod Schemas)

```javascript
// validation/featureSchemas.js
import { z } from "zod";

export const featureCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
  }),
});

export const featureUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["asc", "desc"]).default("desc").optional(),
  }),
});
```

```javascript
// middleware/validate.js
import { AppError } from "../utils/errors.js";

export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req);
      req.validated = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        next(new AppError(messages, 400));
      } else {
        next(error);
      }
    }
  };
}
```

## Rate Limiting

```javascript
// middleware/rateLimit.js
import rateLimit from "express-rate-limit";

const limiters = new Map();

export function rateLimit(key, max, windowSeconds) {
  if (!limiters.has(key)) {
    limiters.set(
      key,
      new rateLimit({
        windowMs: windowSeconds * 1000,
        max,
        message: "Too many requests. Please try again later.",
        standardHeaders: false,
        skip: (req) => req.user?.role === "admin", // Skip for admins
      })
    );
  }

  return limiters.get(key);
}
```

## Error Handling

```javascript
// utils/errors.js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
}

// In main server file:
// app.use(errorHandler);
```

## Audit Logging

```javascript
// middleware/auditLog.js
import AuditLog from "../models/AuditLog.js";

export async function auditLog({
  userId,
  action,
  resourceId,
  changes,
  metadata = {},
}) {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceId,
      changes,
      metadata,
      timestamp: new Date(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
  } catch (error) {
    console.error("Audit log failed:", error);
    // Don't throw — audit failure shouldn't break the request
  }
}
```

## Standard Response Format

```javascript
// utils/response.js
export function successResponse(data, message = "Success", statusCode = 200) {
  return {
    success: true,
    statusCode,
    data,
    message,
  };
}

export function paginatedResponse(data, pagination, message = "Success") {
  return {
    success: true,
    data,
    pagination,
    message,
  };
}

// Usage in controller:
// res.json(successResponse(feature, "Feature created successfully", 201));
```

## Pagination Helper

```javascript
// utils/pagination.js
export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getPaginationMeta(total, page, limit) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}
```

## File Upload Handling (Multer + S3)

```javascript
// middleware/upload.js
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "../utils/errors.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type", 400));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export async function uploadToS3(file, folder) {
  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { key, url };
}

// Usage in route:
// router.post("/upload", authenticate, upload.single("file"), async (req, res, next) => {
//   const { key, url } = await uploadToS3(req.file, "features");
//   res.json(successResponse({ key, url }));
// });
```

## Webhook Pattern

```javascript
// services/webhookService.js
export async function triggerWebhook(event, payload) {
  const webhooks = await Webhook.find({
    event,
    isActive: true,
  });

  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-EHB-Signature": generateSignature(webhook.secret, payload),
        },
        body: JSON.stringify(payload),
        timeout: 5000,
      });
    } catch (error) {
      console.error(`Webhook delivery failed for ${webhook._id}:`, error);
      // Implement retry logic (exponential backoff)
    }
  }
}

function generateSignature(secret, payload) {
  const crypto = require("crypto");
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}
```

## API Versioning

```javascript
// routes/index.js
import express from "express";
import featureRoutes from "./v1/featureRoutes.js";
import authRoutes from "./v1/authRoutes.js";

const router = express.Router();

// API v1
router.use("/api/v1/feature", featureRoutes);
router.use("/api/v1/auth", authRoutes);

export default router;
```

## Health Check Endpoint

```javascript
// routes/healthRoutes.js
import { AppError } from "../utils/errors.js";

export async function healthCheck(req, res, next) {
  try {
    // Check database
    const dbHealthy = await checkDatabase();

    res.json({
      success: true,
      service: "EHB API",
      status: dbHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      message: error.message,
    });
  }
}

async function checkDatabase() {
  try {
    await mongoose.connection.db.admin().ping();
    return true;
  } catch {
    return false;
  }
}

// In main server:
// app.get("/health", healthCheck);
```

## Server Setup Template

```javascript
// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/", routes);
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handler (last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
```

## STL Formula Protection

**NEVER modify `services/stlService.js`** without running:

```bash
npm run test:stl
```

Must pass all 58 gold-master tests. This is the platform's core truth.

## Auto-Naming Migration

Auto-apply these renames:
- `SQL` → `STL` (Service Trust Level)
- `sqlLevel` → `stlLevel`
- `SQLLevelDashboard` → `STLLevelDashboard`
- `EDR` → `CRB` (Central Record Blockchain)

## Checklist Before Committing

- [ ] Route defines middleware chain (auth → validate → handler)
- [ ] Controller handles errors with try/catch, calls service
- [ ] Service contains all business logic, validates rules
- [ ] Model has proper indexes (compound where needed)
- [ ] Zod schema validates all input
- [ ] Error responses use AppError class
- [ ] Audit log captures important actions
- [ ] STL formula untouched (or tests all pass)
- [ ] Response format: `{ success: true, data: ..., message: "..." }`
- [ ] JWT token extracted and validated
- [ ] Rate limiting applied to sensitive endpoints
- [ ] Database connection fails gracefully (no hard exit)
- [ ] Tests written (unit + integration)
- [ ] Commit message: `feat(api): description` or `fix(api): description`
