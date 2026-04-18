---
name: ehb-department-scaffold
description: Scaffolds a brand-new EHB department with canonical file, types, routes, and DMO panel
type: developer-tool
tags: [scaffold, department, new-system, canonical]
---

# EHB Department Scaffold

## When to Use

- **English:** "I need to create a new department in EHB"
- **Roman Urdu:** "Naya department banwana hai EHB mein"
- **Trigger:** Adding a completely new system (e.g., HMS, SOT, WMS, etc.) to the platform

---

## Purpose

Scaffolds all required files and directories for a new EHB department:
- Canonical department specification (`ehb-info/departments/<CODE>.md`)
- TypeScript interfaces (`packages/types/src/<code>.ts`)
- Route stubs (`services/api/pss-backend/src/routes/<code>Routes.js`)
- DMO panel skeleton (`apps/web/app/dmo/<code>/page.tsx`)
- Registration in EHB-DEPARTMENTS-MAP

---

## Inputs

1. **Department code** (3-4 letters, e.g., "HMS" for Hospital Management System)
2. **Department name** (full human-readable name)
3. **Owner team** (e.g., "Product Team", "Engineering")
4. **Brief description** (1-2 sentences)

---

## Workflow

### Step 1: Gather Metadata

```bash
# Ask developer:
# Code: HMS
# Name: Hospital Management System
# Owner: Product Team
# Description: Manages hospitals, doctors, and patient records
```

### Step 2: Create Canonical Department File

**File:** `ehb-info/departments/<CODE>.md`

```markdown
---
code: HMS
name: Hospital Management System
status: Draft
version: 1.0
owner: Product Team
created: 2026-04-15
---

# HMS — Hospital Management System

## Purpose

Manages hospitals, doctors, patient records, and appointment scheduling in the EHB platform.

## Roles

- **Hospital Admin** — Manages hospital profile, doctors, settings
- **Doctor** — Manages patient appointments, records
- **Patient** — Books appointments, views medical history
- **Supervisor** — Compliance and audit oversight

## STL Impact

- Hospital entity can reach up to **L8 VIP** (Franchise source max)
- Doctor entity can reach up to **L5 ADVANCED** (PSS source max)
- Patient records protected at all STL levels

### Source Caps (Immutable)

| Source | Max Level | Points |
|--------|-----------|--------|
| PSS (KYC/liveness) | L5 ADVANCED | 20 |
| CRB (license verification) | L9 ELITE | 36 |
| DMO (manual approval) | L10 SUPREME | 40 |
| Franchise (hospital chain) | L8 VIP | 32 |

## Data Flows

1. **Onboarding:** Hospital → PSS verification → CRB license check → STL assigned
2. **Doctor registration:** Doctor profile → PSS KYC → Hospital assignment
3. **Appointment:** Patient books → Escrow held → Doctor confirms → Payment released

## Verification Rules

- Hospital license must be current (CRB verified)
- Doctor must have medical degree (CRB verified)
- Patient KYC required for sensitive record access

## Open Questions

- [ ] Define patient data retention policy (HIPAA compliance)
- [ ] Clarify telehealth vs in-clinic appointment flow
- [ ] Define prescription integration (if any)

## Changelog

- **v1.0 (2026-04-15):** Initial draft — roles, STL impact, data flows defined

---

*HMS v1.0 · Created 2026-04-15*
```

**Template (12 lines, copy-paste friendly):**

```markdown
---
code: <CODE>
name: <NAME>
status: Draft
version: 1.0
owner: <OWNER>
created: 2026-04-15
---

# <CODE> — <NAME>

## Purpose

[1-2 sentence description]
```

### Step 3: Create TypeScript Types

**File:** `packages/types/src/<code>.ts`

```typescript
export interface <Code>Entity {
  id: string;
  code: "<CODE>";
  name: string;
  owner: string;
  stlLevel: number; // L1–L10
  createdAt: Date;
  updatedAt: Date;
}

export interface <Code>User {
  id: string;
  <code>EntityId: string;
  role: "<CODE>_ADMIN" | "<CODE>_USER" | "<CODE>_VIEWER";
  stlLevel: number;
}

export interface <Code>VerificationRequest {
  userId: string;
  entityType: "<code>";
  criteria: Record<string, any>;
  platform: "<CODE>";
}
```

### Step 4: Create Route Stub

**File:** `services/api/pss-backend/src/routes/<code>Routes.js`

```javascript
import express from "express";
import { <Code>Service } from "../services/<code>Service.js";

const router = express.Router();

// GET /api/<code>/:id
router.get("/:id", async (req, res) => {
  try {
    const entity = await <Code>Service.getById(req.params.id);
    if (!entity) return res.status(404).json({ error: "Not found" });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/<code>/create
router.post("/create", async (req, res) => {
  try {
    const newEntity = await <Code>Service.create(req.body);
    res.status(201).json(newEntity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/<code>/health
router.get("/health", (req, res) => {
  res.json({ status: "ok", module: "<CODE>" });
});

export default router;
```

### Step 5: Create DMO Panel Skeleton

**File:** `apps/web/app/dmo/<code>/page.tsx`

```typescript
import { ReactNode } from "react";

export default function <Code>Panel(): ReactNode {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-400 mb-6">
        <CODE> Management — DMO Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-4 border border-white/8">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <p className="text-gray-400">
            Module <CODE> is in development. Check back soon.
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 border border-white/8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <button className="bg-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
            New <CODE> Entity
          </button>
        </div>
      </div>

      {/* TODO: Add entities table, STL levels, verification status */}
    </div>
  );
}
```

### Step 6: Register in EHB-DEPARTMENTS-MAP

**File:** `ehb-info/EHB-DEPARTMENTS-MAP.md` (append between delimiters)

```markdown
<!-- AUTO:DEPARTMENTS-START -->

## <CODE> — <NAME>

**Canonical file:** `ehb-info/departments/<CODE>.md` (v1.0)
**Types:** `packages/types/src/<code>.ts`
**Routes:** `services/api/pss-backend/src/routes/<code>Routes.js`
**DMO panel:** `apps/web/app/dmo/<code>/page.tsx`
**Status:** Draft

<!-- AUTO:DEPARTMENTS-END -->
```

### Step 7: Run Canonical Sync

```bash
# Propagate new department into master docs
node scripts/ehb-canonical-sync.mjs

# Output:
# 📋 EHB Canonical Auto-Sync — Starting...
# ✓ Updated EHB-PSS-MASTER-PLAN.md
# ✓ Updated EHB-MASTER-DEVELOPMENT-PLAN.md
# ✓ Updated CLAUDE.md
# ✨ Auto-sync complete!
```

---

## Validation Checks

Before committing:

- [ ] `ehb-info/departments/<CODE>.md` exists with YAML frontmatter
- [ ] `packages/types/src/<code>.ts` has main entity interface
- [ ] `services/api/pss-backend/src/routes/<code>Routes.js` has GET/POST/health
- [ ] `apps/web/app/dmo/<code>/page.tsx` renders without errors
- [ ] `ehb-info/EHB-DEPARTMENTS-MAP.md` updated with new entry
- [ ] `node scripts/ehb-canonical-sync.mjs` runs without warnings
- [ ] No hardcoded STL levels (always use source caps)

---

## Output

Files created:

1. `ehb-info/departments/<CODE>.md` — Canonical spec
2. `packages/types/src/<code>.ts` — TypeScript interfaces
3. `services/api/pss-backend/src/routes/<code>Routes.js` — Express routes
4. `apps/web/app/dmo/<code>/page.tsx` — DMO management panel
5. Entry added to `ehb-info/EHB-DEPARTMENTS-MAP.md`

Sync automatically propagates the new department into:
- `ehb-info/EHB-MASTER-DEVELOPMENT-PLAN.md`
- `CLAUDE.md` (updated AUTO:CANONICAL-COUNTS)

---

## References

- **Departments directory:** `ehb-info/departments/`
- **Existing departments:** STL.md, PSS.md, CRB.md, DMO.md, Industries.md, Franchise.md
- **Canonical sync script:** `scripts/ehb-canonical-sync.mjs`
- **Department map:** `ehb-info/EHB-DEPARTMENTS-MAP.md`
- **STL source caps:** `ehb-info/departments/STL.md`

---

## Roman Urdu Script

- **"Naya department create karo"** = Scaffold new department
- **"Canonical file banwao"** = Create department spec
- **"Types likhwao"** = Generate TypeScript interfaces
- **"DMO panel setup karo"** = Create management UI

---

*EHB Department Scaffold — v1.0 · 2026-04-15*
