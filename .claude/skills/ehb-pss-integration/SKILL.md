---
name: ehb-pss-integration
description: Generates PSS client boilerplate to integrate any platform with @ehb/pss-client shared lib
type: developer-tool
tags: [pss, integration, scaffold, pss-client]
---

# EHB PSS Integration Helper

## When to Use

- **English:** "Help me integrate PSS into a new platform module"
- **Roman Urdu:** "Naya platform PSS se connect karna hai"
- **Trigger:** Adding a new industry/platform that needs STL verification via PSS

---

## Purpose

Scaffolds complete PSS integration boilerplate for any new EHB platform (e.g., HMS, SOT, WMS).
Generates wrapper client, request schemas, handler logic, MIN-chain application, and health checks.

---

## Inputs

1. **Platform name** (e.g., "HMS", "SOT", "WMS")
2. **Entity type** (e.g., "doctor", "shop", "lawyer")
3. **Base backend path** (default: `services/api/<platform>-backend/`)

---

## Workflow

### Step 1: Detect Platform Metadata

```bash
# Ask developer for:
# - Platform code (3-4 letters)
# - Entity type (what entity gets STL?)
# - Backend framework (Express assumed)
```

### Step 2: Generate PSS Client Wrapper

**File:** `services/api/<platform>-backend/src/lib/pssClient.ts`

```typescript
import { PSSClient, PSSScoringRequest, PSSWebhookPayload } from "@ehb/pss-client";
import crypto from "crypto";

const pssClient = new PSSClient({
  backendUrl: process.env.PSS_BACKEND_URL || "http://localhost:5000",
  webhookSecret: process.env.PSS_WEBHOOK_SECRET,
});

export async function requestPSSVerification(
  userId: string,
  entityType: string, // e.g., "doctor", "shop"
  criteria: Record<string, any>
): Promise<{ requestId: string; status: string }> {
  const payload: PSSScoringRequest = {
    userId,
    entityType,
    platform: "<PLATFORM_CODE>",
    criteria,
    callbackUrl: `${process.env.API_BASE_URL}/api/<platform>/pss-webhook`,
  };

  return pssClient.submitVerification(payload);
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const computed = crypto
    .createHmac("sha256", process.env.PSS_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");
  return computed === signature;
}

export async function parsePSSWebhookResponse(
  payload: PSSWebhookPayload
): Promise<{ stlScore: number; verified: boolean }> {
  const { scoreData } = payload;
  return {
    stlScore: scoreData?.totalPoints || 0,
    verified: scoreData?.verified || false,
  };
}
```

### Step 3: Generate Request Schema (Zod)

**File:** `services/api/<platform>-backend/src/validation/<platform>Schemas.js`

```javascript
import { z } from "zod";

export const PSSVerificationRequestSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  entityType: z.enum(["doctor", "shop", "lawyer", "educator"]),
  criteria: z.record(z.any()).default({}),
  platform: z.literal("<PLATFORM_CODE>"),
});

export const PSSWebhookSchema = z.object({
  requestId: z.string(),
  userId: z.string(),
  scoreData: z.object({
    totalPoints: z.number().min(0).max(40),
    verified: z.boolean(),
    details: z.record(z.any()).optional(),
  }),
  timestamp: z.string().datetime(),
});
```

### Step 4: Generate Handler Route

**File:** `services/api/<platform>-backend/src/routes/<platform>Routes.js`

```javascript
import express from "express";
import {
  requestPSSVerification,
  verifyWebhookSignature,
  parsePSSWebhookResponse,
} from "../lib/pssClient.ts";
import { applyMinChain } from "../lib/stlHelper.ts";

const router = express.Router();

// POST /api/<platform>/request-verification
router.post("/request-verification", async (req, res) => {
  const { userId, entityType, criteria } = req.body;

  try {
    const { requestId, status } = await requestPSSVerification(
      userId,
      entityType,
      criteria
    );
    res.json({ success: true, requestId, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/<platform>/pss-webhook (from PSS backend)
router.post("/pss-webhook", async (req, res) => {
  const signature = req.headers["x-pss-signature"];

  if (!verifyWebhookSignature(JSON.stringify(req.body), signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { userId, scoreData } = req.body;
  const entityStlScore = scoreData.totalPoints;

  // Apply MIN-chain: FINAL = MIN(product, seller, company, owner)
  const finalSTL = applyMinChain(userId, entityStlScore, "<PLATFORM_CODE>");

  // Save final STL to entity record
  // await Entity.updateOne({ userId }, { stlLevel: finalSTL });

  res.json({ success: true, finalSTL });
});

export default router;
```

### Step 5: Apply MIN-Chain Helper

**File:** `services/api/<platform>-backend/src/lib/stlHelper.ts`

```typescript
export function applyMinChain(
  userId: string,
  pssScore: number,
  platform: string
): number {
  // MIN-chain formula: FINAL_EHB_STL = MIN(product, seller, company, owner)
  // For now, PSS contributes up to L5 ADVANCED (20 points)
  // Other sources (Franchise→L8, CRB→L9, DMO→L10) come from separate endpoints

  const sourceCaps = {
    pss: 20, // L5 ADVANCED
    franchise: 32, // L8 VIP
    crb: 36, // L9 ELITE
    dmo: 40, // L10 SUPREME
  };

  const capped = Math.min(pssScore, sourceCaps.pss);
  return Math.max(1, Math.ceil((capped / 40) * 10)); // Map to L1–L10
}
```

### Step 6: Wire Health Check + Audit Log

**File:** `services/api/<platform>-backend/src/routes/<platform>Routes.js` (append)

```javascript
// GET /api/<platform>/health
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    pss_connected: !!process.env.PSS_BACKEND_URL,
    version: "1.0",
  });
});

// Audit middleware
function auditLog(req, res, next) {
  const { userId, entityType } = req.body || {};
  console.log(`[AUDIT] ${new Date().toISOString()} | PSS request | userId=${userId} | type=${entityType}`);
  next();
}

router.use(auditLog);
```

---

## Validation Checks

Before finalizing integration:

- ✅ `@ehb/pss-client` is installed in `packages/pss-client/`
- ✅ Environment variables set: `PSS_BACKEND_URL`, `PSS_WEBHOOK_SECRET`
- ✅ Webhook route is POST, expects HMAC signature in header
- ✅ STL score capped at L5 (20 points max from PSS)
- ✅ MIN-chain applied before saving to entity
- ✅ Health endpoint returns pss_connected status

---

## Output

Files created:
1. `services/api/<platform>-backend/src/lib/pssClient.ts` — PSS client wrapper
2. `services/api/<platform>-backend/src/lib/stlHelper.ts` — MIN-chain logic
3. `services/api/<platform>-backend/src/validation/<platform>Schemas.js` — Zod schemas
4. `services/api/<platform>-backend/src/routes/<platform>Routes.js` — Express handlers

Environment variables to add:
```bash
PSS_BACKEND_URL=http://localhost:5000
PSS_WEBHOOK_SECRET=<32-char-hex>
API_BASE_URL=http://localhost:5000
```

---

## References

- **Package:** `packages/pss-client/` (shared lib)
- **Master plan:** `ehb-info/EHB-PSS-MASTER-PLAN.md`
- **STL ladder:** `ehb-info/departments/STL.md` (L1–L10, source caps)
- **MIN-chain rule:** `ehb-info/EHB-MASTER-DEVELOPMENT-PLAN.md`

---

## Roman Urdu Script

- **"PSS integration karo"** = Set up PSS for this platform
- **"Webhook verify karo"** = Validate webhook signature
- **"STL score apply karo"** = Apply MIN-chain to final STL

---

*EHB PSS Integration Helper — v1.0 · 2026-04-15*
