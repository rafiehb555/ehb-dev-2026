# services/api — Source of Truth (Post-Phase 1)

**Last updated:** 2026-04-11
**Owner:** EHB Technologies (PVT LTD) — Backend team
**Status:** Transitional — real backend lives in `stl-replit/` subfolder until Phase 2 rename

---

## TL;DR for new developers

> **The real production backend is `services/api/stl-replit/`.**
> The parent `services/api/` folder is a transitional wrapper left over from the 2026-04-11 monorepo migration. Do not add new code directly to `services/api/` root — add it under `stl-replit/`.

---

## Why this confusing layout exists

During the 2026-04-11 monorepo restructure (see `docs/MIGRATION_REPORT.md`), the legacy `backend/stl-replit/` folder was moved to `services/api/stl-replit/` using `cp -a` (copy) rather than `mv` due to a Windows filesystem permission quirk on certain folders. The plan was to then promote the `stl-replit/` contents up one level — but doing so safely requires updating 50+ import paths and rerunning the full test suite, which is deferred to Phase 2.

Until Phase 2, this file serves as the **single authoritative marker**: when in doubt, trust `stl-replit/`.

---

## Canonical folder map (current state — 2026-04-11)

```
services/api/
├── STRUCTURE.md                    ← you are here
└── stl-replit/                     ← ⭐ MAIN PRODUCTION BACKEND
    ├── server.js                   ← entry point (node server.js)
    ├── package.json                ← type: module, ESM throughout
    ├── .env                        ← local secrets (gitignored)
    │
    ├── config/                     ← DB connection, env loader
    │   └── db.js                   ← Mongoose connect
    │
    ├── routes/                     ← Express routers (~16 files)
    │   ├── authRoutes.js           ← login, signup, password reset
    │   ├── stlRoutes.js            ← STL score APIs
    │   ├── pssRoutes.js            ← KYC / verification
    │   ├── crbRoutes.js            ← certification, exam flow
    │   ├── dmoRoutes.js            ← earnings, rewards
    │   ├── franchiseRoutes.js      ← 4-tier franchise system
    │   ├── earningRoutes.js        ← wallet earnings credits
    │   ├── adminRoutes.js          ← admin actions
    │   └── ...
    │
    ├── controllers/                ← route handlers
    │
    ├── services/                   ← business logic
    │   ├── stlService.js           ← ⭐ STL calculation engine
    │   ├── multiStlService.js      ← multi-entity STL (seller/product)
    │   ├── crbEscalationService.js
    │   ├── earningService.js
    │   ├── logService.js
    │   ├── notificationService.js
    │   └── ai.service.js           ← Anthropic Claude client
    │
    ├── models/                     ← Mongoose schemas
    │
    ├── middleware/
    │   ├── auth.js                 ← requireAuth (JWT via jsonwebtoken)
    │   ├── validate.js             ← validateBody(zodSchema)
    │   ├── sanitize.js             ← request body sanitizer
    │   ├── error.js                ← notFound + errorHandler
    │   ├── adminSecurity.js
    │   └── perUserRateLimit.js     ← ⭐ NEW (Phase 1 hardening)
    │
    ├── validation/
    │   └── financialSchemas.js     ← ⭐ NEW (Phase 1 hardening)
    │
    ├── utils/
    │   ├── level.utils.js          ← STL level thresholds
    │   └── apiResponse.js          ← ⭐ NEW (Phase 1 standardization)
    │
    ├── jobs/
    │   └── crbEscalationWorker.js  ← background escalation cron
    │
    ├── tests/                      ← ⭐ NEW (Phase 1 STL regression safety net)
    │   └── stl/
    │       ├── stlService.test.js         ← Jest suite
    │       └── stlService.node.test.js    ← node:test fallback (zero deps)
    │
    ├── jest.config.js              ← ⭐ NEW Jest config (ESM mode)
    ├── ai/
    ├── frontend-connect/
    ├── uploads/                    ← multer destination (gitignored content)
    └── node_modules/
```

---

## Phase 1 additions (2026-04-11)

These files were **added only** (no existing files deleted):

| File | Purpose |
|---|---|
| `stl-replit/tests/stl/stlService.test.js` | Jest regression suite for STL engine |
| `stl-replit/tests/stl/stlService.node.test.js` | Zero-dep `node:test` fallback |
| `stl-replit/jest.config.js` | Jest ESM configuration |
| `stl-replit/middleware/perUserRateLimit.js` | Per-user rate limiter middleware |
| `stl-replit/validation/financialSchemas.js` | Zod schemas for money-moving endpoints |
| `stl-replit/utils/apiResponse.js` | Standardized API response envelope |
| `services/api/STRUCTURE.md` | This file |

### Files modified (backed up first)

| File | Change | Backup |
|---|---|---|
| `stl-replit/package.json` | Added `test`, `test:stl`, `test:jest` scripts | `backup/pre-phase1-fixes-2026-04-11/package.json.bak` |

---

## How to run the STL tests

```bash
cd services/api/stl-replit

# Zero-dependency (works out of the box on any Node 18+):
npm run test:stl
# or directly:
node --test tests/stl/stlService.node.test.js

# Full Jest suite (requires `npm install --save-dev jest` once):
npm run test:jest
```

Expected: **58 tests, all passing.** If any test fails, the change that caused it must be reviewed — STL is the trust economy, silent regressions are catastrophic.

---

## Phase 2 plan (do NOT execute yet)

The Phase 2 goal is to promote `stl-replit/` contents up to `services/api/` directly:

1. Create feature branch `refactor/services-api-flatten`.
2. Run `git mv stl-replit/* .` (may require manual handling on Windows).
3. Update any imports referencing `stl-replit/` explicitly (there should be none outside this folder).
4. Update `infrastructure/scripts/START-LOCAL.bat` to use the new path.
5. Update `apps/web` `next.config.mjs` and any proxy targets.
6. Run full smoke test: auth flow, STL recalc, PSS upload, CRB exam, DMO claim, wallet payout.
7. Update `docs/MIGRATION_REPORT.md` with Phase 2 addendum.
8. Delete `services/api/STRUCTURE.md` (this file) once the wrapper is gone.

**Do not** attempt this in the same session as other fixes — it is a dedicated sprint on its own.

---

## Security contacts

For security issues relating to any route under `stl-replit/routes/`, contact the backend team lead via the internal EHB Technologies (PVT LTD) channels. Do not file security issues in public GitHub.
