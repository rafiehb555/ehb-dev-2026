# EHB Folder Flow — MASTER (Auto-Enforced)

> **SINGLE SOURCE OF TRUTH for project folder architecture.**
> Every AI agent (Claude, Cursor, Copilot, Aider, Continue, Cody, Codeium) **must read this file first** before creating, moving, or renaming any folder / file in this repository. This file is **the contract**. Human-written `docs/FOLDER_ARCHITECTURE.md` and `docs/PROJECT_STRUCTURE.md` are supporting references — this file wins if there's conflict.
>
> **Maintainer:** `scripts/folder-flow-validate.mjs` runs on every commit and fails the build if the on-disk structure drifts from the spec in §3 below.
>
> **Last architectural update:** 2026-04-14 — Hybrid Architecture v1 (locked).
> **File version:** v1.0

---

## 0. Golden Rules (never break)

1. **Single deploy unit per app** — ONE Next.js (`apps/web`), ONE admin (`apps/admin`), ONE API gateway (`services/api`), ONE AI service (`services/ai`). Never create per-industry Next apps or per-industry API services.
2. **Industries plug in via registry** — a new industry is added by appending to `data/ehb-data/industries.json` + running `scripts/add-industry.mjs <code>`. Never hardcode industry routes, nav items, or imports.
3. **Core ≠ Industry** — Core platform modules (Home, Dashboard, JPS, AI Marketplace, Franchise, Wallet, DMO, PSS, CRB, STL, Affiliate) live under `(core)/` and `modules/core/`. Industries (GoSellr, OLS, WMS, HPS, AGTS, +27) live under `(industries)/` and `modules/industries/`.
4. **Shared code in `packages/`** — anything imported by 2+ places goes in `packages/ui`, `packages/types`, `packages/utils`, `packages/trust-engine`, or `packages/industry-registry`. Never duplicate.
5. **Backup before destructive moves** — any structural change creates `backup/<change>-YYYY-MM-DD/` first. Git-ignored. Non-negotiable.
6. **STL formula protected** — `services/api/stl-replit/services/stlService.js` is read-only to AI agents except via `npm run test:stl` 58/58 pass gate.
7. **Case-sensitive** — all folders & files lowercase-kebab-case except React components (PascalCase.tsx). Windows is forgiving, Linux is not. Never create `Card.tsx` if `card.tsx` exists.
8. **No `node_modules`, `.next`, `dist`, `.env`** in git — already gitignored, keep it that way.

---

## 1. Architecture Summary (Hybrid)

```
                 ┌─────────────────────────────────┐
                 │       apps/web (Next.js)        │   ← single frontend
                 │   (core) + (industries) + admin │
                 └───────────────┬─────────────────┘
                                 │ RTK Query / fetch
                                 ▼
                 ┌─────────────────────────────────┐
                 │    services/api (NestJS path)   │   ← single API gateway
                 │   modules/core + modules/industries │
                 └───────────────┬─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   MongoDB (data)         services/ai (OpenAI)    blockchain (Polkadot)

   Shared by ALL: packages/ui, packages/types, packages/trust-engine,
                  packages/industry-registry, packages/utils
```

**Why Hybrid:** industry-level isolation **inside** a monorepo — each industry has its own folder (frontend + backend), but all packaged as one deploy unit. Best of "industry-per-folder" feel + monorepo reliability.

---

## 2. Root Folder Map (canonical)

```
EHB DEVELOPMENT 2026/
│
├── apps/
│   ├── web/                                  # Public-facing Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── layout.tsx                    # Root layout (TopBar + AI widget)
│   │   │   ├── page.tsx                      # → redirects to (core)/page.tsx
│   │   │   ├── (core)/                       # Core platform routes (no URL prefix)
│   │   │   │   ├── page.tsx                  # EHB Home   ( / )
│   │   │   │   ├── dashboard/                # User Dashboard
│   │   │   │   ├── ai-marketplace/           # AI Marketplace (32-industry AI hub)
│   │   │   │   ├── jps/                      # Job Profile & Skill
│   │   │   │   ├── franchise/                # Franchise model
│   │   │   │   ├── wallet/                   # EHB Wallet
│   │   │   │   ├── dmo/                      # DMO workflow + L8 approvals
│   │   │   │   ├── pss/                      # Identity verification
│   │   │   │   ├── crb/                      # Central Record Blockchain
│   │   │   │   ├── stl/                      # Service Trust Level viewer
│   │   │   │   ├── affiliate/                # Affiliate / referral
│   │   │   │   └── development/              # Live project health dashboard
│   │   │   │
│   │   │   ├── (industries)/                 # 32 industries — auto-scaled
│   │   │   │   ├── gosellr/                  # E-commerce  (Group A)
│   │   │   │   ├── ols/                      # Legal       (Group A)
│   │   │   │   ├── wms/                      # Medical     (Group A)
│   │   │   │   ├── hps/                      # Education   (Group A)
│   │   │   │   ├── agts/                     # Travel      (Group A)
│   │   │   │   └── ... 27 more (auto-generated from industries.json)
│   │   │   │
│   │   │   └── api/                          # Next.js route handlers (BFF only)
│   │   │
│   │   ├── components/
│   │   │   ├── core/                         # TopBar, AIWidget, Footer, Nav
│   │   │   ├── industries/<code>/            # Industry-specific components
│   │   │   └── shared/                       # Local helpers (not promoted yet)
│   │   │
│   │   ├── lib/                              # Client-side utilities
│   │   ├── public/                           # Static assets
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── admin/                                # Admin panel (Next.js, single app)
│       └── app/
│
├── services/
│   ├── api/                                  # API gateway (NestJS target)
│   │   └── src/
│   │       ├── main.ts                       # Swagger + global pipes
│   │       ├── app.module.ts                 # Imports core + industries
│   │       ├── modules/
│   │       │   ├── core/                     # Core platform backend modules
│   │       │   │   ├── auth/
│   │       │   │   ├── wallet/
│   │       │   │   ├── dmo/
│   │       │   │   ├── pss/
│   │       │   │   ├── crb/
│   │       │   │   ├── stl/                  # 🔒 protected (58 tests gate)
│   │       │   │   ├── jps/
│   │       │   │   ├── franchise/
│   │       │   │   ├── ai-marketplace/
│   │       │   │   └── affiliate/
│   │       │   └── industries/               # Per-industry modules
│   │       │       ├── gosellr/
│   │       │       ├── ols/
│   │       │       └── ...
│   │       ├── common/                       # Shared decorators, filters, pipes
│   │       └── config/
│   │   └── stl-replit/                       # LEGACY Express backend — keep until migrated
│   │
│   ├── ai/                                   # AI service (Express + OpenAI)
│   └── workers/                              # Background jobs (BullMQ etc.)
│
├── packages/                                 # Shared libs (monorepo workspaces)
│   ├── ui/                                   # React components used everywhere
│   ├── types/                                # Shared TypeScript types
│   ├── utils/                                # Pure helpers
│   ├── trust-engine/                         # PSS + CRB + DMO + STL logic
│   ├── industry-registry/                    # 🔑 auto-scale source
│   └── config/                               # tsconfig, eslint, tailwind bases
│
├── data/
│   └── ehb-data/
│       ├── industries.json                   # 🔑 single source of truth (32 entries)
│       ├── categories.json
│       └── seeds/
│
├── scripts/
│   ├── add-industry.mjs                      # Scaffold a new industry end-to-end
│   ├── folder-flow-validate.mjs              # Enforces this document
│   ├── ehb-status-update.mjs
│   ├── sync-agent-context.mjs
│   └── test-stl.mjs                          # 58 gold-master tests
│
├── infrastructure/
│   └── scripts/                              # START-LOCAL.bat, deploy, infra
│
├── docs/                                     # Human docs (not enforced)
│   ├── PROJECT_STRUCTURE.md
│   ├── FOLDER_ARCHITECTURE.md
│   ├── EHB_CONTEXT.md
│   └── LAUNCH_GUIDE.md
│
├── ehb-info/                                 # Master plan + specs
│   ├── EHB-MASTER-INFO.md
│   └── EHB-MASTER-DEVELOPMENT-PLAN.md
│
├── design-system/                            # Living UI/UX system
│   ├── EHB-UIUX-SYSTEM.md
│   └── ai-behavior.md
│
├── tests/                                    # Cross-package integration tests
│
├── backup/                                   # Pre-change snapshots (gitignored)
│
├── AGENTS.md                                 # Mirror of CLAUDE.md for AGENTS.md-aware tools
├── CLAUDE.md                                 # Primary AI agent instructions
├── EHB-FOLDER-FLOW-MASTER.md                 # ← YOU ARE HERE
├── ehb-status.json                           # Auto-updated project health
├── package.json                              # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml                       # Workspaces declaration
├── turbo.json                                # Turborepo pipeline
└── tsconfig.base.json                        # Root TS config
```

---

## 3. Authoritative Path Spec (AI must honor)

| I want to add...                    | Go to                                                    |
|-------------------------------------|----------------------------------------------------------|
| A new **industry**                  | Run `node scripts/add-industry.mjs <code> "<name>" <cat>` — **never hand-create folders** |
| A new **core platform page**        | `apps/web/app/(core)/<feature>/page.tsx`                 |
| A new **industry page**             | `apps/web/app/(industries)/<code>/<feature>/page.tsx`   |
| A **shared React component**        | `packages/ui/src/<Component>.tsx`                        |
| A **local, one-use component**      | `apps/web/components/core/` or `.../industries/<code>/`  |
| A **new API endpoint — core**       | `services/api/src/modules/core/<feature>/...`            |
| A **new API endpoint — industry**   | `services/api/src/modules/industries/<code>/...`         |
| A **shared type**                   | `packages/types/src/`                                    |
| A **shared helper**                 | `packages/utils/src/`                                    |
| **Trust logic** (PSS/CRB/DMO/STL)   | `packages/trust-engine/src/` — STL formula stays 🔒       |
| **Seed data**                       | `data/ehb-data/seeds/<name>.json`                        |
| **Infra script**                    | `infrastructure/scripts/`                                |
| **Docs**                            | `docs/<topic>/` — never at project root                  |

Anything not listed above → **pause and ask the user**. Do not improvise a new top-level folder.

---

## 4. Auto-Scale Flow — Adding a New Industry

**The only supported method:**

```bash
node scripts/add-industry.mjs <code> "<name>" "<category>" [group] [accent-hex]
# Example:
node scripts/add-industry.mjs petcare "PetCare+" "Pets" C "#F59E0B"
```

**What the script does automatically (in one atomic run):**

1. Creates `backup/industry-add-<code>-YYYY-MM-DD/` snapshot
2. Appends entry to `data/ehb-data/industries.json` (validated against schema)
3. Creates `apps/web/app/(industries)/<code>/page.tsx` from template
4. Creates `apps/web/components/industries/<code>/` skeleton
5. Creates `services/api/src/modules/industries/<code>/` (module + controller + service + schema stubs)
6. Updates `packages/industry-registry/generated.ts` (auto-regenerated, never hand-edit)
7. Adds nav item (rendered from registry, no manual TopBar edit)
8. Adds sitemap entry
9. Runs `scripts/folder-flow-validate.mjs` — must pass
10. Runs `npm run test:stl` — 58/58 must pass
11. Runs `tsc --noEmit` — must pass
12. Appends changelog line to `ehb-status.log`

**If ANY step fails → automatic rollback from the backup.** User never sees a half-broken state.

**Runtime auto-pickup:** TopBar, Home cards, Dashboard grid, AI assistant context, sitemap, and search index all read from `packages/industry-registry`. Zero code changes needed for them to "see" the new industry.

---

## 5. Registry Contract — `packages/industry-registry`

Every consumer of industry data must use this API. Never import `industries.json` directly.

```typescript
// packages/industry-registry/src/index.ts
import industries from '../../data/ehb-data/industries.json';

export type Industry = {
  code: string;            // "gosellr"
  name: string;            // "GoSellr"
  category: string;        // "E-commerce"
  group: 'A'|'B'|'C'|'D'|'E'|'F'|'G';
  accent: string;          // "#29ABE2"
  icon: string;            // lucide-react icon name
  status: 'active'|'beta'|'coming-soon';
  trustMinStl: number;     // minimum Seller STL to list
  phase: 1|2|3;
};

export const INDUSTRIES: readonly Industry[] = industries;
export const getIndustry = (code: string) => INDUSTRIES.find(i => i.code === code);
export const byGroup = (g: Industry['group']) => INDUSTRIES.filter(i => i.group === g);
export const activeIndustries = () => INDUSTRIES.filter(i => i.status === 'active');
export const industryExists = (code: string) => !!getIndustry(code);
```

---

## 6. Forbidden Patterns (AI **must refuse**)

| ❌ Forbidden                                            | ✅ Correct                                    |
|--------------------------------------------------------|-----------------------------------------------|
| `apps/web-gosellr/` (per-industry Next app)           | `apps/web/app/(industries)/gosellr/`          |
| `services/api-ols/` (per-industry API service)        | `services/api/src/modules/industries/ols/`    |
| Hardcoding `<Link href="/gosellr">` in TopBar          | Render from `INDUSTRIES.map(...)`             |
| `import industries from '../../data/ehb-data/...'`    | `import { INDUSTRIES } from 'industry-registry'` |
| Creating `apps/web/components/Card.tsx` (uppercase)    | Use existing `@/components/ui/card`           |
| New top-level folder at repo root                      | Ask user first                                |
| Editing `packages/industry-registry/generated.ts`      | Re-run `scripts/add-industry.mjs`             |
| Touching STL formula without 58/58 pass                | Forbidden — full stop                         |
| Deleting anything in `backup/`                         | Forbidden                                     |

---

## 7. Validator — `scripts/folder-flow-validate.mjs`

Runs on: every commit (pre-commit hook), CI (GitHub Actions), on-demand.

**Checks:**

1. All required top-level folders present (§2 list)
2. Every industry in `industries.json` has matching frontend route + backend module
3. Every frontend industry route has corresponding backend module (and vice versa)
4. No `Card.tsx` duplicates (case-sensitive scan)
5. No new top-level folders not in §2
6. `packages/industry-registry/generated.ts` matches `industries.json` hash
7. No hardcoded industry list outside the registry
8. STL formula file unchanged since last blessed hash (or 58/58 pass logged)

Exit code non-zero on any failure. Output includes the exact fix command.

---

## 8. Migration Path (from current state → Hybrid v1)

Current state (as of 2026-04-14): **~65% Hybrid-compliant**.

**Phase 1 — Scaffold (no delete):**
- Create `packages/industry-registry/`, `packages/trust-engine/`, `packages/types/` skeletons
- Create `data/ehb-data/industries.json` with 32-industry seed
- Create `scripts/add-industry.mjs` + `scripts/folder-flow-validate.mjs`
- Introduce `(core)/` and `(industries)/` route groups in `apps/web/app/` (route groups have **no URL impact**, existing URLs unchanged)

**Phase 2 — Migrate (with backup):**
- Move existing industry pages into `(industries)/<code>/` (Next.js route groups → URLs stay identical)
- Move core pages into `(core)/`
- Create parallel `services/api/src/modules/{core,industries}/` NestJS-ready layout alongside existing `services/api/stl-replit/` (legacy kept, not broken)

**Phase 3 — Harden:**
- Wire pre-commit hook to `folder-flow-validate.mjs`
- Update `CLAUDE.md` and `AGENTS.md` to reference this file
- Add §10 changelog line

**Phase 4 — Cleanup:**
- Remove duplicate `docker/`, `k8s/`, `scripts/` folders inside `apps/web/`
- Clean `apps/web/archive/`
- Fill `packages/config`, `packages/types`, `packages/utils` (currently empty)

---

## 9. AI Enforcement Contract

Every AI agent operating in this repo **commits to the following** on every request:

1. **Before writing any file:** read this document + `CLAUDE.md` + `design-system/EHB-UIUX-SYSTEM.md` + `design-system/ai-behavior.md`.
2. **Before creating a new folder:** consult §3 table. If not listed, ask the user before creating it. Never invent.
3. **Before adding a new industry:** use `scripts/add-industry.mjs`. Never hand-create industry folders.
4. **Before a destructive change:** create `backup/<change>-YYYY-MM-DD/`.
5. **Before commit:** run `scripts/folder-flow-validate.mjs` mentally or actually. If it would fail, fix first.
6. **After a structural change:** append a line to §10 changelog below.

If an AI violates any of the above, the commit must be reverted.

---

## 10. Changelog (append-only)

| Date       | Version | Change                                                           | By    |
|------------|---------|------------------------------------------------------------------|-------|
| 2026-04-14 | v1.0    | Initial Hybrid Architecture spec. Locked.                        | Claude (on Rafi's confirmation A) |
| 2026-04-14 | v1.1    | **GoSellr end-to-end seller flow** shipped: `(industries)/gosellr/seller-onboarding`, `(industries)/gosellr/my-journey`, `/dmo/gosellr` queue, APIs `/api/gosellr/flow`, `/api/gosellr/dmo/queue`, `/api/gosellr/dmo/approve`, `/api/gosellr/franchise/assign`, `/api/pss/submit`. New components: `GoSellrUserFlow`, `GoSellrDmoQueue`, `SellerOnboardingForm`, `ProductQuickViewModal`, `STLUserCard`, `PssVerificationWizard`. | Claude |
| 2026-04-14 | v1.2    | **DMO sidebar updated** — renamed `STL Management` → `EHB STL Management`; added new module **`DMO STL`** at `/dmo/dmo-stl` (consolidated all-STL reference page: 9 levels, formula, 4 STL types, coin-lock tiers, live preview). Updated `apps/web/components/dmo/navigation.tsx`. | Claude |
| 2026-04-14 | v1.3    | **Franchise Manager** — added `/api/franchise/my-sellers` endpoint + `FranchiseSellersPanel` component + `(core)/franchise/my-sellers` page. Lists SELLER-role `FranchiseUser` rows joined with their SELLER_ONBOARDING Applications. Closes the post-DMO loop (DMO approve → auto-assign → franchise sees seller). | Claude |
| 2026-04-14 | v1.4    | **CRB Certification (user-facing)** — added `(core)/crb/certify` page + `CrbCertifyWizard` 3-step wizard (Type → Documents → Review) posting to existing `/api/crb/apply`. Sidebar shows user's own CRB applications with live status. Unlocks the CRB gate in the GoSellr journey. | Claude |
| 2026-04-14 | v1.5    | **GoSellr Storefront** — added public `/api/gosellr/products` (search + category + sort by STL/price) and `(industries)/gosellr/store` page + `GoSellrStorefront` component. Product cards carry live STL trust badges pulled from seller's `Profile.stlLevel`. Quick-view opens `ProductQuickViewModal`. | Claude |

---

## 10a. Auto-Update Rule (MANDATORY — from 2026-04-14)

**Hard rule for every AI agent (Claude, Cursor, Copilot, Aider, Continue, Cody, Codeium, future additions):**

> Any time the user shares new information, requests a rename/move/add,
> changes a naming policy, ships a new module/page/component/API/model/skill,
> or introduces a new convention — the agent **must**, in the same turn,
> append a row to §10 Changelog of this file **AND** update the relevant
> section (§1–§11) if the change alters the architecture contract.

Specifically:
- **Renames** → update the name in-place AND log the rename in §10.
- **New pages/APIs/modules** → add to the path spec (§2, §3) AND log in §10.
- **New rules/policies** → add as their own §N subsection AND log in §10.
- **Industry additions** → `scripts/add-industry.mjs` auto-updates; confirm a §10 row is emitted.
- **Sidebar/navigation changes** → log in §10 with the old → new label mapping.
- **Design tokens / UI conventions** → sync into `design-system/EHB-UIUX-SYSTEM.md`
  AND log the cross-reference row in §10 here.

No silent changes. If it's worth saying in chat, it's worth writing into
the master plan. This file is the single source of truth — it must not rot.

---

## 11. Quick Reference for AI (copy into every prompt)

```
Repo = EHB DEVELOPMENT 2026
Architecture = Hybrid v1 (see EHB-FOLDER-FLOW-MASTER.md §1)
Industry pages = apps/web/app/(industries)/<code>/
Core pages    = apps/web/app/(core)/<feature>/
Industry APIs = services/api/src/modules/industries/<code>/
Core APIs     = services/api/src/modules/core/<feature>/
New industry  = ALWAYS via scripts/add-industry.mjs (never hand-create)
Trust logic   = packages/trust-engine  (STL formula is read-only)
Registry      = packages/industry-registry  (always import, never duplicate)
Validator     = scripts/folder-flow-validate.mjs  (must pass before commit)
```

---

*EHB Technologies (Pvt.) Ltd. — Hybrid Folder Flow Contract · v1.0 · 2026-04-14*
