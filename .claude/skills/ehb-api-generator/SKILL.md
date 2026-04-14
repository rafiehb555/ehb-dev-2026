---
name: ehb-api-generator
description: Generate complete CRUD APIs with pagination, search, filtering, and webhooks
---

# EHB API Generator

Rapidly generate production-ready REST APIs with standard patterns for CRUD operations, pagination, filtering, search, and webhooks.

## Full CRUD Generation

Generate all 5 core endpoints from a single model definition.

### Step 1: Define Model

```javascript
// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["electronics", "clothing", "food"], required: true },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productSchema.index({ userId: 1, isDeleted: 1 });
productSchema.index({ category: 1, isActive: 1 });

export default mongoose.model("Product", productSchema);
```

### Step 2: Generate Validation Schemas

```javascript
// validation/productSchemas.js
import { z } from "zod";

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    price: z.number().positive(),
    category: z.enum(["electronics", "clothing", "food"]),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const productUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    price: z.number().positive().optional(),
    category: z.enum(["electronics", "clothing", "food"]).optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["asc", "desc"]).default("desc"),
    sortBy: z.string().default("createdAt"),
    category: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    search: z.string().optional(),
  }),
});
```

### Step 3: Generate Service Layer

```javascript
// services/productService.js
import Product from "../models/Product.js";
import { AppError } from "../utils/errors.js";

// CREATE
export async function createProduct({ userId, ...data }) {
  const product = new Product({
    userId,
    ...data,
  });

  await product.save();
  return product;
}

// READ (single by ID)
export async function getProductById(id, userId) {
  const product = await Product.findOne({
    _id: id,
    userId,
    isDeleted: false,
  }).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

// READ (list with pagination + filters)
export async function listProducts(userId, filters = {}) {
  const {
    page = 1,
    limit = 20,
    sort = "desc",
    sortBy = "createdAt",
    category,
    minPrice,
    maxPrice,
    search,
  } = filters;

  const skip = (page - 1) * limit;

  // Build query
  const query = {
    userId,
    isDeleted: false,
  };

  if (category) query.category = category;
  if (minPrice !== undefined) query.price = { $gte: minPrice };
  if (maxPrice !== undefined) {
    query.price = { ...query.price, $lte: maxPrice };
  }

  // Text search
  let findQuery = Product.find(query);
  if (search) {
    findQuery = findQuery.or([
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]);
  }

  // Pagination + sort
  const [products, total] = await Promise.all([
    findQuery
      .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}

// UPDATE
export async function updateProduct(id, userId, updates) {
  const product = await Product.findOne({
    _id: id,
    userId,
    isDeleted: false,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Update only allowed fields
  const allowedFields = ["name", "description", "price", "category", "stock"];
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      product[key] = updates[key];
    }
  });

  await product.save();
  return product;
}

// DELETE (soft delete)
export async function deleteProduct(id, userId) {
  const product = await Product.findOne({
    _id: id,
    userId,
    isDeleted: false,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();
}

// Batch operations
export async function deleteMany(userId, ids) {
  const result = await Product.updateMany(
    { _id: { $in: ids }, userId },
    { isDeleted: true, deletedAt: new Date() }
  );

  return { deletedCount: result.modifiedCount };
}

export async function bulkUpdatePrice(categoryId, priceMultiplier) {
  const result = await Product.updateMany(
    { category: categoryId, isDeleted: false },
    [{ $set: { price: { $multiply: ["$price", priceMultiplier] } } }]
  );

  return { updatedCount: result.modifiedCount };
}
```

### Step 4: Generate Controller Layer

```javascript
// controllers/productController.js
import * as productService from "../services/productService.js";
import { auditLog } from "../middleware/auditLog.js";

export async function createProduct(req, res, next) {
  try {
    const { userId } = req.user;
    const { body } = req.validated;

    const product = await productService.createProduct({
      userId,
      ...body,
    });

    await auditLog({
      userId,
      action: "PRODUCT_CREATED",
      resourceId: product._id,
      changes: body,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const product = await productService.getProductById(id, userId);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const { userId } = req.user;
    const { query } = req.validated;

    const { products, pagination } = await productService.listProducts(
      userId,
      query
    );

    res.json({
      success: true,
      data: products,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { body } = req.validated;

    const product = await productService.updateProduct(id, userId, body);

    await auditLog({
      userId,
      action: "PRODUCT_UPDATED",
      resourceId: product._id,
      changes: body,
    });

    res.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await productService.deleteProduct(id, userId);

    await auditLog({
      userId,
      action: "PRODUCT_DELETED",
      resourceId: id,
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
```

### Step 5: Generate Routes

```javascript
// routes/productRoutes.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { rateLimit } from "../middleware/rateLimit.js";
import * as productController from "../controllers/productController.js";
import {
  productCreateSchema,
  productUpdateSchema,
  paginationSchema,
} from "../validation/productSchemas.js";

const router = express.Router();

// POST /api/v1/product
router.post(
  "/",
  authenticate,
  rateLimit("product:create", 50, 3600),
  validate(productCreateSchema),
  productController.createProduct
);

// GET /api/v1/product (list with pagination/filters)
router.get(
  "/",
  authenticate,
  validate(paginationSchema),
  productController.listProducts
);

// GET /api/v1/product/:id
router.get(
  "/:id",
  authenticate,
  productController.getProduct
);

// PATCH /api/v1/product/:id
router.patch(
  "/:id",
  authenticate,
  rateLimit("product:update", 100, 3600),
  validate(productUpdateSchema),
  productController.updateProduct
);

// DELETE /api/v1/product/:id
router.delete(
  "/:id",
  authenticate,
  rateLimit("product:delete", 30, 3600),
  productController.deleteProduct
);

export default router;
```

## Advanced Pagination

### Cursor-Based Pagination (for large datasets)

```javascript
// Useful for APIs that need to handle millions of documents
export async function listProductsCursor(userId, { cursor, limit = 20, sort = "desc" }) {
  const query = { userId, isDeleted: false };

  if (cursor) {
    // cursor is the _id of the last document from previous request
    query._id = sort === "asc" ? { $gt: cursor } : { $lt: cursor };
  }

  const products = await Product.find(query)
    .sort({ _id: sort === "asc" ? 1 : -1 })
    .limit(limit + 1) // Fetch one extra to know if there's a next page
    .lean();

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, -1) : products;
  const nextCursor = data.length > 0 ? data[data.length - 1]._id : null;

  return { data, nextCursor, hasMore };
}
```

### Offset-Based Pagination Response

```javascript
// Response structure
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    pages: 8,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

## Filtering & Search

### Text Search

```javascript
// Add text index to schema
productSchema.index({ name: "text", description: "text" });

// Query
export async function searchProducts(userId, searchTerm) {
  return Product.find(
    { userId, isDeleted: false, $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();
}
```

### Exact Match Filters

```javascript
// In listProducts service:
const query = { userId, isDeleted: false };

if (category) query.category = category;
if (isActive !== undefined) query.isActive = isActive;

const products = await Product.find(query).lean();
```

### Range Filters

```javascript
// Price range
if (minPrice !== undefined || maxPrice !== undefined) {
  query.price = {};
  if (minPrice !== undefined) query.price.$gte = minPrice;
  if (maxPrice !== undefined) query.price.$lte = maxPrice;
}

// Date range
if (startDate || endDate) {
  query.createdAt = {};
  if (startDate) query.createdAt.$gte = new Date(startDate);
  if (endDate) query.createdAt.$lte = new Date(endDate);
}
```

### Multiple Filters (AND/OR)

```javascript
// AND: all conditions must match
const query = {
  userId,
  category: "electronics",
  price: { $lte: 500 },
  isActive: true,
};

// OR: any condition can match
const orQuery = {
  $or: [
    { category: "electronics" },
    { category: "gadgets" },
  ]
};

const products = await Product.find({ ...query, ...orQuery }).lean();
```

## Bulk Operations

### Bulk Insert

```javascript
export async function bulkCreateProducts(userId, productsData) {
  const products = productsData.map((data) => ({
    userId,
    ...data,
  }));

  const inserted = await Product.insertMany(products, { ordered: false });
  return { count: inserted.length, products: inserted };
}

// Route:
router.post(
  "/bulk",
  authenticate,
  validate(bulkCreateSchema),
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { products } = req.body;

      const result = await productService.bulkCreateProducts(userId, products);

      res.status(201).json({
        success: true,
        data: result.products,
        message: `Created ${result.count} products`,
      });
    } catch (error) {
      next(error);
    }
  }
);
```

### Bulk Update

```javascript
export async function bulkUpdate(userId, updates) {
  // updates = [{ id, changes }, { id, changes }, ...]
  const results = [];

  for (const { id, changes } of updates) {
    const product = await Product.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      changes,
      { new: true }
    );

    if (product) results.push(product);
  }

  return { count: results.length, products: results };
}
```

### Bulk Delete

```javascript
export async function bulkDelete(userId, ids) {
  const result = await Product.updateMany(
    { _id: { $in: ids }, userId },
    { isDeleted: true, deletedAt: new Date() }
  );

  return { deletedCount: result.modifiedCount };
}
```

## File Upload Handling

### Single File Upload

```javascript
// middleware/upload.js
import multer from "multer";
import { uploadToS3 } from "../utils/s3.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Route
router.post(
  "/upload-image",
  authenticate,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { key, url } = await uploadToS3(req.file, "product-images");

      res.json({
        success: true,
        data: { key, url },
      });
    } catch (error) {
      next(error);
    }
  }
);
```

### Multiple Files Upload

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/bulk-upload",
  authenticate,
  upload.array("files", 10), // Max 10 files
  async (req, res, next) => {
    try {
      const uploads = await Promise.all(
        req.files.map((file) => uploadToS3(file, "products"))
      );

      res.json({
        success: true,
        data: uploads,
      });
    } catch (error) {
      next(error);
    }
  }
);
```

## Webhook Patterns

### Create Webhook Endpoint

```javascript
// routes/webhookRoutes.js
export async function registerWebhook(req, res, next) {
  try {
    const { userId } = req.user;
    const { url, event } = req.body;

    const webhook = new Webhook({
      userId,
      url,
      event,
      secret: crypto.randomBytes(32).toString("hex"),
      isActive: true,
    });

    await webhook.save();

    res.status(201).json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
}

// Route
router.post("/webhooks", authenticate, registerWebhook);
```

### Trigger Webhook on Event

```javascript
// After creating a product
export async function createProduct(req, res, next) {
  try {
    // ... create product ...

    // Trigger webhooks
    await triggerWebhook(userId, "product.created", {
      productId: product._id,
      name: product.name,
      price: product.price,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
```

### Webhook Service with Retry

```javascript
// services/webhookService.js
export async function triggerWebhook(userId, event, payload) {
  const webhooks = await Webhook.find({
    userId,
    event,
    isActive: true,
  });

  for (const webhook of webhooks) {
    // Queue webhook for async processing (Bull, RabbitMQ, etc.)
    await webhookQueue.add({
      webhookId: webhook._id,
      url: webhook.url,
      payload,
      secret: webhook.secret,
    });
  }
}

// Background job processor
webhookQueue.process(async (job) => {
  const { url, payload, secret } = job.data;
  const signature = generateSignature(secret, payload);

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
      },
      body: JSON.stringify(payload),
      timeout: 10000,
    });
  } catch (error) {
    // Retry with exponential backoff
    throw error;
  }
});
```

## API Versioning

### Single Version

```javascript
// routes/index.js
router.use("/api/v1/product", productRoutes);
router.use("/api/v1/user", userRoutes);
```

### Multiple Versions (for backward compatibility)

```javascript
// routes/v1/productRoutes.js - Legacy (deprecated)
// routes/v2/productRoutes.js - Current (recommended)

router.use("/api/v1/product", productRoutesV1);
router.use("/api/v2/product", productRoutesV2); // Enhanced with new fields
```

## Standard Error Codes

```javascript
// Standard HTTP status codes + EHB-specific codes
export const ERROR_CODES = {
  // 400 Bad Request
  INVALID_INPUT: { code: "INVALID_INPUT", status: 400 },
  VALIDATION_ERROR: { code: "VALIDATION_ERROR", status: 400 },

  // 401 Unauthorized
  UNAUTHORIZED: { code: "UNAUTHORIZED", status: 401 },
  EXPIRED_TOKEN: { code: "EXPIRED_TOKEN", status: 401 },

  // 403 Forbidden
  INSUFFICIENT_PERMISSIONS: { code: "INSUFFICIENT_PERMISSIONS", status: 403 },
  INSUFFICIENT_STL_LEVEL: { code: "INSUFFICIENT_STL_LEVEL", status: 403 },

  // 404 Not Found
  NOT_FOUND: { code: "NOT_FOUND", status: 404 },
  RESOURCE_NOT_FOUND: { code: "RESOURCE_NOT_FOUND", status: 404 },

  // 409 Conflict
  DUPLICATE_ENTRY: { code: "DUPLICATE_ENTRY", status: 409 },
  RESOURCE_ALREADY_EXISTS: { code: "RESOURCE_ALREADY_EXISTS", status: 409 },

  // 429 Too Many Requests
  RATE_LIMIT_EXCEEDED: { code: "RATE_LIMIT_EXCEEDED", status: 429 },

  // 500 Server Error
  INTERNAL_ERROR: { code: "INTERNAL_ERROR", status: 500 },
  DATABASE_ERROR: { code: "DATABASE_ERROR", status: 500 },
};
```

## OpenAPI/Swagger Documentation

```javascript
// swagger.js
export const productApi = {
  "/api/v1/product": {
    post: {
      summary: "Create a product",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                category: { enum: ["electronics", "clothing", "food"] },
              },
              required: ["name", "price", "category"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: "List products",
      tags: ["Products"],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "category", in: "query", schema: { type: "string" } },
      ],
    },
  },
};
```

## Postman Collection Generation

```javascript
// Generate collection template
export function generatePostmanCollection(apiName, endpoints) {
  return {
    info: {
      name: apiName,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: {
      type: "bearer",
      bearer: [{ key: "token", value: "{{token}}" }],
    },
    item: endpoints.map((ep) => ({
      name: ep.name,
      request: {
        method: ep.method,
        url: "{{baseUrl}}" + ep.path,
        body: ep.body ? { mode: "raw", raw: JSON.stringify(ep.body) } : undefined,
      },
    })),
  };
}
```

## Checklist Before Committing

- [ ] All CRUD endpoints (POST, GET, PATCH, DELETE) implemented
- [ ] Pagination working (offset-based or cursor)
- [ ] Filters + search working
- [ ] Input validation (Zod) in place
- [ ] Rate limiting on write endpoints
- [ ] JWT auth on all endpoints
- [ ] Soft delete implemented
- [ ] Audit logging captured
- [ ] Error responses standardized
- [ ] Bulk operations if needed
- [ ] File upload working (if needed)
- [ ] Webhooks triggered on events
- [ ] OpenAPI docs generated
- [ ] Postman collection available
- [ ] Tests written (unit + integration)
- [ ] Commit message: `feat(api): description`
