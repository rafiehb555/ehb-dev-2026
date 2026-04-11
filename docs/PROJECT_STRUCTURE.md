# EHB 2026 — Project Folder Structure

**Company:** EHB Technologies (PVT LTD)
**Last updated:** 2026-04-11
**Repo root:** `D:\EHB DEVELOPMENT 2026`

This document is the single source of truth for the monorepo layout. Read this before creating any new file or folder so you know exactly where it belongs.

---

## 1. High-level map

```
D:\EHB DEVELOPMENT 2026\
│
├── START.bat                    ← ONE-CLICK LAUNCHER (double-click to go live)
├── .gitignore
├── .git/                        ← Git history
├── .github/                     ← CI workflows, issue templates
├── .cursor/                     ← Cursor IDE rules (industry configs, coding rules)
│
├── apps/                        ← USER-FACING APPLICATIONS
│   ├── web/                     ← Next.js 14 frontend  (port 3000)
│   └── admin/                   ← Reserved for future admin panel (empty)
│
├── services/                    ← BACKEND SERVICES
│   ├── api/                     ← Main REST API (Node + Express + Mongoose)
│   │   ├── STRUCTURE.md         ← Source-of-truth marker
│   │   └── stl-replit/          ← ⭐ REAL backend code (port 5000)
│   ├── ai/                      ← AI backend (port 8080)
│   └── workers/                 ← Background workers (DMO, CRB escalation)
│
├── packages/                    ← SHARED LIBRARIES (monorepo workspaces)
│   ├── config/                  ← Shared env/config helpers
│   ├── types/                   ← Shared TypeScript types
│   ├── ui/                      ← Shared React components
│   └── utils/                   ← Shared utility functions
│
├── infrastructure/              ← DEPLOYMENT + LOCAL DEV
│   ├── scripts/                 ← START-LOCAL.bat, deploy scripts
│   ├── docker/                  ← Dockerfiles, docker-compose stacks
│   ├── k8s/                     ← Kubernetes manifests
│   ├── assets/                  ← Logos, icons for infra dashboards
│   └── logs/                    ← Runtime log output (gitignored)
│
├── data/                        ← SEED DATA + FIXTURES
│   └── ehb-data/                ← Industry configs, service catalogs, user seeds
│
├── docs/                        ← PROJECT DOCUMENTATION
│   ├── LAUNCH_GUIDE.md          ← How to run the stack locally
│   ├── PROJECT_STRUCTURE.md     ← This file
│   ├── EHB_PROJECT_ANALYSIS.docx← 8-step architecture analysis
│   ├── SYSTEM_FIX_REPORT.md     ← Phase 1 hardening report
│   └── MIGRATION_REPORT.md      ← 2026-04-11 monorepo migration log
│
├── tests/                       ← CROSS-SERVICE INTEGRATION TESTS
│   └── (unit tests live inside each service/package)
│
└── backup/                      ← SAFETY BACKUPS (gitignored)
    ├── pre-phase1-fixes-2026-04-11/
    ├── pre-launch-fixes-2026-04-11/
    ├── casing-fix-2026-04-11/
    └── consolidation-2026-04-11/
```

---

## 2. `apps/` — User-facing applications

### `apps/web/` — Next.js 14 Frontend (port 3000)

This is the main customer-facing app. App Router, TypeScript, Tailwind, Prisma.

```
apps/web/
├── app/                         ← Next.js App Router pages
│   ├── layout.tsx               ← Root layout (fonts, nav, top bar)
│   ├── page.tsx                 ← Landing page (delegates to home/page)
│   ├── home/                    ← Microsoft Store-style homepage
│   ├── dmo/                     ← DMO dashboard, fraud queue, work queue
│   ├── stl/                     ← STL score & admin screens
│   ├── auth/                    ← Login, signup, password reset
│   └── api/                     ← Next.js server API routes (proxy layer)
├── components/                  ← React components (by feature)
│   ├── ui/                      ← Design system primitives (Button, card, etc.)
│   ├── stl/                     ← STL-specific widgets
│   ├── dmo/                     ← DMO dashboard widgets
│   ├── growth/                  ← Invite, leaderboard, rewards cards
│   ├── monetization/            ← Wallet, income, upgrade cards
│   └── admin/                   ← Admin console widgets
├── lib/                         ← Client + server utilities, validators
├── hooks/                       ← Custom React hooks
├── middleware.ts                ← Global middleware (auth, rate limit)
├── prisma/                      ← Prisma schema + migrations
│   └── schema.prisma
├── public/                      ← Static assets served as-is
├── .env                         ← Local secrets (gitignored)
├── package.json                 ← npm scripts: dev / build / test / prisma
└── next.config.mjs              ← Next.js config
```

Scripts you will use most:
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npx prisma generate` — regenerate Prisma client after schema change
- `npm test` — Vitest unit tests

### `apps/admin/` — Reserved

Empty placeholder. Future standalone admin panel will live here so it can be deployed separately from the main web app.

---

## 3. `services/` — Backend services

### `services/api/stl-replit/` ⭐ — Main REST API (port 5000)

The **real** production backend. Node 20 + Express + Mongoose + JWT. ESM (`"type": "module"`).

```
services/api/stl-replit/
├── server.js                    ← Entry point (node server.js)
├── package.json                 ← type: module, scripts: dev / test / test:stl
├── .env                         ← Local secrets (gitignored)
│
├── config/
│   └── db.js                    ← Mongoose connect with retry-in-background
│
├── routes/                      ← 16 Express routers, all mounted at /api
│   ├── authRoutes.js            ← /api/auth/*
│   ├── stlRoutes.js             ← /api/stl/*
│   ├── userRoutes.js            ← /api/users/*
│   ├── pssRoutes.js             ← KYC / verification
│   ├── crbRoutes.js             ← Complaint Resolution Board
│   ├── dmoRoutes.js             ← Daily Minimum Output (+ fraud)
│   ├── franchiseRoutes.js       ← Franchise model
│   ├── chatRoutes.js            ← In-app messaging
│   ├── aiRoutes.js              ← AI adjustment endpoints
│   ├── taskRoutes.js
│   ├── uploadRoutes.js
│   ├── logRoutes.js
│   ├── notificationRoutes.js
│   ├── systemRoutes.js
│   ├── earningRoutes.js
│   └── adminRoutes.js
│
├── controllers/                 ← Route handlers (one per route file)
├── services/                    ← Business logic (STL formula, wallet, etc.)
│   ├── stlService.js            ← The STL scoring formula
│   └── ai.service.js            ← Optional Anthropic/OpenAI layer
├── models/                      ← Mongoose schemas
├── middleware/                  ← auth, error, rate limit, sanitize, perUserRateLimit
├── validation/                  ← Zod schemas (financialSchemas.js)
├── utils/                       ← Response helpers (ok/fail/badRequest/...)
├── tests/                       ← Test suites
│   └── stl/                     ← 58 STL gold-master tests (Jest + node:test)
├── jobs/                        ← Cron/worker jobs (CRB escalation)
├── jest.config.js               ← Jest ESM config
└── uploads/                     ← File upload destination (gitignored)
```

Scripts:
- `npm run dev` — start API on port 5000
- `npm run test:stl` — run 58 zero-dep STL regression tests (node:test)
- `npm run test:jest` — run full Jest suite (needs `npm install --save-dev jest`)

> **Why `stl-replit/` name?** Historical. The early backend was prototyped on Replit with the module name "stl-replit". A rename is scheduled for Phase 2 (requires updating 50+ import paths, deferred).

### `services/ai/` — AI Backend (port 8080)

CommonJS Express service dedicated to AI operations. Talks to OpenAI (gpt-4.1-mini) and stores conversation memory in Mongo.

```
services/ai/
├── server.js                    ← Entry point (fixed 2026-04-11: listens first, retries Mongo in background)
├── package.json                 ← Scripts: dev (node --watch), start
├── .env                         ← PORT, MONGODB_URI, OPENAI_API_KEY, rate limits
├── ai-system/
│   └── memory/
│       ├── memoryStore.js       ← Mongoose connectDb + memory CRUD
│       └── memoryModel.js       ← Mongo schema for memories
└── src/
    ├── routes/aiRoutes.js       ← /ai/* endpoints
    ├── controllers/
    └── services/
```

Scripts:
- `npm run dev` — start AI backend on port 8080 with file watcher
- `npm start` — production start

Key endpoint: `GET /health` — returns service status + Mongo connection state. Always responds even when Mongo is down (degraded mode).

### `services/workers/` — Background workers

Reserved for long-running background processes (DMO automation, CRB escalation, fraud detection pipelines). Currently most workers still run inside the API backend under `services/api/stl-replit/jobs/`.

---

## 4. `packages/` — Shared libraries

Workspace packages that multiple apps import. Single source of truth for cross-cutting concerns.

| Package          | Purpose                                       |
|------------------|-----------------------------------------------|
| `config/`        | Shared runtime config (env loader, constants) |
| `types/`         | Shared TypeScript type definitions            |
| `ui/`            | Shared React components (used by web + admin) |
| `utils/`         | Shared pure-JS utilities                      |

Currently thin — most shared code still lives inside `apps/web/` and is copy-pasted. Phase 2 plan: promote shared components into `packages/ui/`.

---

## 5. `infrastructure/` — Deployment + local dev

```
infrastructure/
├── scripts/
│   ├── START-LOCAL.bat          ← Real launcher (called by root START.bat)
│   └── (other shell/ps1 scripts)
├── docker/                      ← Dockerfiles + compose files
├── k8s/                         ← Kubernetes manifests (prod deploy)
├── assets/                      ← Infra dashboard graphics
└── logs/                        ← Runtime log output (gitignored)
```

---

## 6. `data/` — Seed data and fixtures

```
data/
└── ehb-data/
    ├── industries/              ← 32 industry configs (health, education, ...)
    ├── services/                ← Service catalog seeds
    └── users/                   ← Demo user seeds
```

Used for local dev seeding (`prisma db seed`) and first-run bootstrapping. Do **not** put real customer data here — this folder is checked into git.

---

## 7. `docs/` — Project documentation

| File                          | What it is                                            |
|-------------------------------|-------------------------------------------------------|
| `LAUNCH_GUIDE.md`             | Step-by-step guide to run everything locally          |
| `PROJECT_STRUCTURE.md`        | This file — repo layout reference                     |
| `EHB_PROJECT_ANALYSIS.docx`   | 8-step architecture analysis (Word format, for execs) |
| `SYSTEM_FIX_REPORT.md`        | Phase 1 system hardening report                       |
| `MIGRATION_REPORT.md`         | Log of the 2026-04-11 monorepo migration              |

---

## 8. `backup/` — Safety backups

Every time a destructive or structural change is made, the original files are copied here first. Git-ignored so they don't bloat history. Current contents:

| Folder                            | What it is                                       |
|-----------------------------------|--------------------------------------------------|
| `pre-phase1-fixes-2026-04-11/`    | Backups before Phase 1 hardening changes         |
| `pre-launch-fixes-2026-04-11/`    | Backups before local-launch fixes                |
| `casing-fix-2026-04-11/`          | Backups before Card/card casing fix              |
| `consolidation-2026-04-11/`       | Orphan `services/api/src/` starter template      |

To revert any fix, copy the corresponding `.bak` file back into place.

---

## 9. Folder layout quirks you should know

### 9.1 There was a duplicate `backend/` folder — removed

Before 2026-04-11, the repo had both `backend/stl-replit/` AND `services/api/stl-replit/`. The `backend/` folder was an **empty shell** left over from the monorepo migration. It was removed on 2026-04-11 after confirming it contained zero files.

### 9.2 There was an orphan `services/api/src/` starter — archived

`services/api/src/` contained a tiny 9-file "starter template" backend (one User module) that was never used by anything. The real backend is `services/api/stl-replit/`. The orphan starter was moved to `backup/consolidation-2026-04-11/` on 2026-04-11.

### 9.3 `services/api/` vs `services/api/stl-replit/`

Currently the real code lives one level deeper than the service name suggests. `services/api/` has only `STRUCTURE.md` + `stl-replit/`. When Phase 2 happens, `stl-replit/` contents will be promoted up one level and the `stl-replit/` name retired.

### 9.4 Two test runners in the API backend

`services/api/stl-replit/tests/stl/` has two copies of the same STL test suite:
- `stlService.test.js` — Jest syntax (requires `npm install --save-dev jest`)
- `stlService.node.test.js` — `node --test` syntax (zero dependencies)

Both assert identical behaviour. The `node --test` version is the one that actually runs in CI because it has no install step. Use `npm run test:stl` to run it.

---

## 10. Ports at a glance

| Port   | Service             | URL                                   |
|--------|---------------------|---------------------------------------|
| 3000   | Frontend (Next.js)  | http://localhost:3000                 |
| 5000   | API backend         | http://localhost:5000/api/health      |
| 8080   | AI backend          | http://localhost:8080/health          |
| 27017  | MongoDB             | mongodb://127.0.0.1:27017             |

---

## 11. When you are adding new code, use this decision table

| What are you adding                         | Where it goes                                       |
|---------------------------------------------|-----------------------------------------------------|
| New page / route UI                         | `apps/web/app/<feature>/page.tsx`                   |
| New React component (web-only)              | `apps/web/components/<feature>/`                    |
| New React component (shared web + admin)    | `packages/ui/`                                      |
| New API endpoint                            | `services/api/stl-replit/routes/<feature>Routes.js` |
| Business logic                              | `services/api/stl-replit/services/<feature>.js`     |
| Mongoose model                              | `services/api/stl-replit/models/<Feature>.js`       |
| Zod input validation                        | `services/api/stl-replit/validation/<feature>Schemas.js` |
| AI-specific endpoint                        | `services/ai/src/routes/aiRoutes.js`                |
| Shared TypeScript types                     | `packages/types/`                                   |
| Shared utility function                     | `packages/utils/`                                   |
| Infra / deployment script                   | `infrastructure/scripts/`                           |
| Seed data / fixtures                        | `data/ehb-data/`                                    |
| Documentation                               | `docs/`                                             |

---

*Maintained by EHB Technologies (PVT LTD) — Engineering.*
