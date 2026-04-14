---
name: ehb-database-schema
description: Design MongoDB schemas with Mongoose, indexes, validation, and soft deletes
---

# EHB Database Schema

Design scalable MongoDB schemas with proper validation, indexing, and data integrity patterns.

## Schema Template (Complete Pattern)

```javascript
// models/Feature.js
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    // User reference (ownership/permissions)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Fast lookup by user
    },

    // Basic fields
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name exceeds maximum length"],
      trim: true,
      lowercase: true, // Normalize for search
    },

    description: {
      type: String,
      maxlength: [500, "Description exceeds maximum length"],
      trim: true,
    },

    // Enumerated status
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "archived"],
        message: "Invalid status",
      },
      default: "active",
      index: true, // Filter by status frequently
    },

    // STL level requirement (auto-named from SQL→STL migration)
    stlLevel: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },

    // Sensitive field (encrypted in production)
    apiKey: {
      type: String,
      select: false, // Exclude by default
      sparse: true, // Only index if present
    },

    // Metadata (flexible schema)
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Soft delete flags
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Timestamps (auto-managed)
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Cannot be updated
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Options
    timestamps: true, // Auto-manage createdAt, updatedAt
    toJSON: { virtuals: true }, // Include virtual fields in JSON
    toObject: { virtuals: true },
  }
);

// ===== INDEXES =====

// Single field indexes
featureSchema.index({ userId: 1 }); // Fast user lookups
featureSchema.index({ status: 1 }); // Filter by status
featureSchema.index({ isDeleted: 1 }); // Exclude soft-deleted docs

// Compound indexes (optimize common query patterns)
featureSchema.index({ userId: 1, status: 1 }); // "Get user's active features"
featureSchema.index({ userId: 1, isDeleted: 1 }); // "Get user's non-deleted features"
featureSchema.index({ userId: 1, createdAt: -1 }); // "Get user's features by recency"

// Text search index
featureSchema.index({ name: "text", description: "text" });

// TTL index (auto-delete after 30 days if deletedAt is set)
featureSchema.index(
  { deletedAt: 1 },
  {
    expireAfterSeconds: 2592000, // 30 days
    partialFilterExpression: { isDeleted: true },
  }
);

// ===== PRE-SAVE HOOKS =====

// Normalize data before saving
featureSchema.pre("save", function (next) {
  // Trim strings
  if (typeof this.name === "string") {
    this.name = this.name.trim();
  }

  // Update timestamp
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  next();
});

// Validate business rules
featureSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Check for duplicate name within user
    const existing = await this.constructor.findOne({
      userId: this.userId,
      name: this.name,
      isDeleted: false,
    });

    if (existing) {
      throw new Error("Feature with this name already exists");
    }
  }

  next();
});

// ===== POST HOOKS =====

// Emit event after save (for webhooks, notifications)
featureSchema.post("save", async function (doc) {
  // Example: emit "feature.created" or "feature.updated" event
  if (this.isNew) {
    // Emit to event bus
  }
});

// ===== VIRTUALS =====

// Computed field
featureSchema.virtual("isRecent").get(function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.createdAt > thirtyDaysAgo;
});

// ===== INSTANCE METHODS =====

featureSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.apiKey; // Never expose in JSON
  return obj;
};

featureSchema.methods.softDelete = function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

featureSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

// ===== STATIC METHODS =====

featureSchema.statics.findByUserAndId = function (userId, featureId) {
  return this.findOne({
    _id: featureId,
    userId,
    isDeleted: false,
  });
};

featureSchema.statics.findByUser = function (userId, options = {}) {
  const { page = 1, limit = 20, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  return this.find({ userId, isDeleted: false })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

featureSchema.statics.countByUser = function (userId) {
  return this.countDocuments({ userId, isDeleted: false });
};

// ===== EXPORT =====

export default mongoose.model("Feature", featureSchema);
```

## Common Field Patterns

### User ID Reference

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
}
```

### Status Enumeration

```javascript
status: {
  type: String,
  enum: {
    values: ["pending", "approved", "rejected"],
    message: "Invalid status",
  },
  default: "pending",
  index: true,
}
```

### Nested Objects

```javascript
address: {
  street: String,
  city: String,
  country: String,
}
// Query: db.collection.find({ "address.city": "NYC" })
```

### Arrays of Objects

```javascript
tags: [{
  name: String,
  color: String,
  createdAt: { type: Date, default: Date.now }
}]
// Query: db.collection.find({ "tags.name": "urgent" })
```

### Flexible Metadata

```javascript
metadata: {
  type: Map,
  of: mongoose.Schema.Types.Mixed,
  default: {}
}
// Usage: { metadata: { key1: "value", key2: 123 } }
```

### Encrypted Fields (for sensitive data)

```javascript
ssn: {
  type: String,
  select: false, // Never returned by default
  encrypt: true, // Requires mongoose-encryption plugin
}

// Query:
// User.findById(id).select("+ssn"); // Explicitly include
```

### Soft Delete Pattern

```javascript
isDeleted: {
  type: Boolean,
  default: false,
  index: true,
},
deletedAt: Date,
deletedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}

// In all queries, always filter:
// Feature.find({ isDeleted: false })
```

## Index Design Principles

### Single Field Indexes

```javascript
// Fast equality lookups
schema.index({ userId: 1 });

// Fast sorting
schema.index({ createdAt: -1 });

// Sparse index (only for documents with field)
schema.index({ email: 1 }, { sparse: true });

// Unique index
schema.index({ email: 1 }, { unique: true });
```

### Compound Indexes (ESR Rule)

Follow the **ESR Rule**: Equality → Sort → Range

```javascript
// Query: db.users.find({ status: "active" }).sort({ createdAt: -1 })
// Index: { status: 1, createdAt: -1 }
schema.index({ status: 1, createdAt: -1 });

// Query: db.features.find({ userId, status }).sort({ updatedAt: -1 }).limit(20)
// Index: { userId: 1, status: 1, updatedAt: -1 }
schema.index({ userId: 1, status: 1, updatedAt: -1 });
```

### Text Search Indexes

```javascript
schema.index({ name: "text", description: "text" });
schema.index({ title: "text" }, { weights: { title: 10 } }); // Weighted

// Query:
// Feature.find({ $text: { $search: "nodejs" } })
```

### TTL (Time To Live) Indexes

```javascript
// Auto-delete documents 30 days after createdAt
schema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Auto-delete documents where deletedAt is set + 30 days
schema.index(
  { deletedAt: 1 },
  {
    expireAfterSeconds: 2592000,
    partialFilterExpression: { isDeleted: true },
  }
);
```

### Partial Indexes

```javascript
// Only index non-deleted documents
schema.index(
  { userId: 1 },
  { partialFilterExpression: { isDeleted: false } }
);

// Only index documents where status is "active"
schema.index(
  { userId: 1, createdAt: -1 },
  { partialFilterExpression: { status: "active" } }
);
```

## Query Optimization Tips

### Use `lean()` for read-only queries

```javascript
// Returns plain JavaScript objects (faster)
Feature.find({ userId }).lean();
// ~3x faster than returning Mongoose documents
```

### Use `select()` to exclude fields

```javascript
// Exclude heavy fields
Feature.find({})
  .select("-largeField -anotherHeavyField");

// Or explicitly include
Feature.find({})
  .select("userId name status"); // Only these fields
```

### Limit population depth

```javascript
// Only populate what's needed
Feature.find({ userId })
  .populate({
    path: "userId",
    select: "name email", // Only these fields from User
    options: { limit: 1 }, // Don't fetch all refs
  });
```

### Use `countDocuments()` efficiently

```javascript
// Fast count with index
const total = await Feature.countDocuments({ userId, isDeleted: false });

// Avoid: estimatedDocumentCount() (ignores filters)
```

### Batch operations

```javascript
// Insert many
await Feature.insertMany([doc1, doc2, doc3], { ordered: false });

// Update many
await Feature.updateMany(
  { userId, status: "active" },
  { status: "archived" }
);

// Delete many
await Feature.deleteMany({ userId, isDeleted: true });
```

## Schema Versioning Approach

```javascript
// Version 1: Initial schema
const featureSchema = new mongoose.Schema({
  userId: ObjectId,
  name: String,
  // ...
});

// Version 2: Add new field with default
featureSchema.add({
  category: {
    type: String,
    default: "uncategorized",
  },
});

// Version 3: Rename field (data migration required)
featureSchema.statics.migrateV3 = async function () {
  // Old field: "type" → New field: "category"
  await this.updateMany(
    { type: { $exists: true }, category: { $exists: false } },
    [{ $set: { category: "$type" } }, { $unset: "type" }]
  );
};

// In migration script:
// await Feature.migrateV3();
```

## Seed Data File Template

```javascript
// data/ehb-data/features-seed.js
import Feature from "../../services/api/stl-replit/models/Feature.js";

export async function seedFeatures(db) {
  const features = [
    {
      _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
      userId: new mongoose.Types.ObjectId("507f1f77bcf86cd799439001"),
      name: "Feature 1",
      description: "Test feature",
      status: "active",
      stlLevel: 2,
      metadata: {
        version: "1.0",
        testData: true,
      },
    },
    // More documents...
  ];

  // Clear existing (in dev only)
  if (process.env.NODE_ENV !== "production") {
    await Feature.deleteMany({});
  }

  const inserted = await Feature.insertMany(features);
  console.log(`Seeded ${inserted.length} features`);

  return inserted;
}
```

## Migration Script Pattern

```javascript
// scripts/migrations/001-add-category.js
import mongoose from "mongoose";
import Feature from "../../services/api/stl-replit/models/Feature.js";

export async function up() {
  console.log("Migration: Adding category field...");

  // Add with default value
  const result = await Feature.updateMany(
    { category: { $exists: false } },
    { $set: { category: "uncategorized" } }
  );

  console.log(`Updated ${result.modifiedCount} documents`);
}

export async function down() {
  console.log("Migration: Removing category field...");

  const result = await Feature.updateMany(
    { category: { $exists: true } },
    { $unset: { category: 1 } }
  );

  console.log(`Rolled back ${result.modifiedCount} documents`);
}

// Usage:
// node -e "import { up } from './scripts/migrations/001-add-category.js'; up();"
```

## Data Flow Documentation Template

```markdown
# Feature Data Flow

## Create
1. Frontend: POST /api/v1/feature (name, description)
2. API: Validate input (Zod schema)
3. API: Check ownership + permissions (JWT)
4. Service: Check business rules (name uniqueness)
5. Model: Save to MongoDB
6. Webhook: Trigger "feature.created" event
7. Response: Return feature object + 201

## Read
1. Frontend: GET /api/v1/feature/:id
2. API: Validate JWT
3. Service: Fetch from DB (lean query)
4. Response: Return feature object + 200

## Update
1. Frontend: PATCH /api/v1/feature/:id
2. API: Validate JWT + input
3. Service: Verify ownership
4. Service: Check business rules
5. Model: Update fields + increment updatedAt
6. Webhook: Trigger "feature.updated" event
7. Response: Return updated feature + 200

## Delete (Soft)
1. Frontend: DELETE /api/v1/feature/:id
2. API: Validate JWT
3. Service: Verify ownership
4. Model: Set isDeleted=true, deletedAt=now, deletedBy=userId
5. TTL: Auto-purge after 30 days
6. Webhook: Trigger "feature.deleted" event
7. Response: Return 200 (success)
```

## Common Relationships

### One-to-Many (User has many Features)

```javascript
// User model
const userSchema = new mongoose.Schema({
  email: String,
  // Features referenced via userId in Feature model
});

// Feature model
const featureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  // ...
});

// Query: Get user with features
User.findById(userId).populate("features");
// Must use virtual on User to make this work:
userSchema.virtual("features", {
  ref: "Feature",
  localField: "_id",
  foreignField: "userId",
});
```

### Many-to-Many (Tags on Features)

```javascript
// Embedded approach (simpler, denormalized)
const featureSchema = new mongoose.Schema({
  tags: [{ name: String, color: String }],
});

// Normalized approach (flexible, searchable)
const featureSchema = new mongoose.Schema({
  tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
});

// Query normalized:
Feature.findById(id).populate("tagIds");
```

## Validation Rules

```javascript
// Email
email: {
  type: String,
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  index: { unique: true, sparse: true },
}

// Phone
phone: {
  type: String,
  match: [/^\d{10,15}$/, "Invalid phone"],
}

// URL
website: {
  type: String,
  match: [/^https?:\/\//, "Must be valid URL"],
}

// ZIP code
zipCode: {
  type: String,
  match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP code"],
}

// Custom validator
score: {
  type: Number,
  validate: {
    validator: function(value) {
      return value >= 0 && value <= 100;
    },
    message: "Score must be 0-100",
  },
}
```

## Auto-Naming Migration

Apply these renames automatically:
- `SQLLevel` → `STLLevel`
- `sql_level` → `stl_level`
- `SQL` → `STL` (in comments, docs)
- `EDR` → `CRB`

## Checklist Before Committing

- [ ] Schema has proper indexes (single + compound)
- [ ] All `userId` fields indexed
- [ ] All enum values have validation
- [ ] Timestamps immutable (createdAt) or auto-managed (updatedAt)
- [ ] Soft delete fields present (isDeleted, deletedAt, deletedBy)
- [ ] Pre-save hooks normalize + validate data
- [ ] Post-save hooks emit events
- [ ] Text search index if needed
- [ ] TTL index for auto-cleanup
- [ ] Instance methods for common operations
- [ ] Static methods for queries
- [ ] Zod validation in API layer (separate)
- [ ] Seed data file updated if schema changes
- [ ] Migration script created for production changes
- [ ] No hardcoded ObjectId values in code
- [ ] Commit message: `feat(db): description`
