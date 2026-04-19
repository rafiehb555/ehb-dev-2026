# EHB_CONTEXT.md — Single Source of Truth for AI Agents

**Company:** EHB Technologies (Pvt.) Ltd.
**Version:** 1.0
**Last updated:** 2026-04-11

> This is the **portable** context file. Drop this file + `AGENTS.md` into any project
> and any AI coding agent that reads `AGENTS.md` (Claude, Cursor, Copilot, Aider, etc.)
> will pick up full EHB context automatically.
>
> **For humans:** This file is the condensed "what is EHB" reference. For the full
> master dev file, see the archived `scratch/ehb-dev-page-extract/EHB_MASTER_DEV_FILE.md`.
>
> **For agents:** Read this file in full before writing any EHB-related code. Also
> check `ehb-status.json` at repo root for real-time build state.

---

## 1. Company at a glance

- **Legal name:** EHB Technologies (Pvt.) Ltd.
- **Pillars:** Education · Health · Business (hence "EHB").
- **Vision:** One unified global super-app connecting **32 industries** across **50+ countries**,
  backed by **AI** + **Polkadot blockchain** trust verification.
- **Target:** 1M+ users, $500M+ economic volume, multi-level franchise network.
- **Communication language:** English + Roman Urdu for dev conversations. Code + commits in English.

## 2. Platform at a glance

| Metric         | Value                              |
|----------------|------------------------------------|
| Industries     | 32 (6 in Phase-1)                  |
| Countries      | 50+ (global rollout)               |
| Core depts     | 8 (PSS, CRB, STL, DMO, JPS, Wallet, AI, Blockchain) |
| STL levels     | L0 (new) → L8 (SUPREME)            |
| AI modules     | 100+ planned                       |
| Shared-tools reuse | ~70% across industries         |
| Franchise model | Country → Corporate → Sub         |
| Revenue split   | 40 / 25 / 20 / 15                 |

## 3. The 8 core systems

### 3.1 PSS — Proof & Security System
KYC/KYB, liveness detection, AML screening, fraud detection, document authenticity,
address verification, behavioural risk monitoring. Every user passes PSS on signup.

### 3.2 CRB — Central Record Blockchain
Physical office verification, professional certification (doctors, lawyers, engineers),
legal compliance, product/service authentication. Certificate hashes go on-chain (Polkadot).
6-month renewal cycle. Boosts STL by +15.

### 3.3 STL — Service Trust Level
Scoring formula combining PSS + CRB + DMO actions + earnings + behavior. 9 levels
(L0 → L8 SUPREME). L8 requires manual DMO approval. The formula itself is in
`services/api/stl-replit/services/stlService.js` and protected by **58 gold-master
regression tests** — `npm run test:stl` must return `58 pass, 0 fail` on every commit.

### 3.4 DMO — Decentralized Management Office
The central governance authority. Owns the 8-step user flow
(Registration → JPS → STL → PSS → CRB → DMO → Score → Active), the L8 SUPREME
manual approval, the 40/25/20/15 revenue split enforcement, and platform policy.
Can suspend or restore any service.

### 3.5 JPS — Job Profile & Skill
AI-powered job/skill matching, professional profiles, employer-employee connection
engine. Builds on top of PSS identity + CRB certification.

### 3.6 Wallet / Finance
EHB wallet, escrow, multi-currency (50+ countries), franchise revenue distribution,
affiliate commissions. Escrow must be wired into all booking flows before paid
services can go live — currently **not fully wired** (see pending items).

### 3.7 AI Department
6 flagship AI modules:
- **AI Lawyer** (Legal) — case triage, document drafting, risk analysis.
- **AI Diagnosis** (Medical) — symptom triage, report explanation.
- **AI Resume Builder** (Jobs) — CV generation & optimization.
- **AI Course Tutor** (Education) — adaptive learning paths.
- **AI Business Advisor** (Commerce) — SME services.
- **AI Fraud Detector** (DMO) — transaction + review abuse detection.

### 3.8 Blockchain
Polkadot-based. Stores immutable hashes for CRB certificates, STL milestone
snapshots, franchise contracts. Currently ~10% complete — contract work pending
in Phase-3.

## 4. 32 Industries

### 4.1 Phase-1 (6 — active now)

| Code   | Industry                | Build % |
|--------|-------------------------|---------|
| GSM    | E-commerce (GoSellr)    | 60      |
| OLS    | Legal Services          | 30      |
| WMS    | Medical & Health        | 20      |
| HPS/OBS| Education & Learning    | 15      |
| JPS    | Jobs & HR               | 30      |
| AGTS   | Travel & Tourism        | 10      |

### 4.2 Phase-2 / Phase-3 queue (26)

Finance, Consulting, Construction, Agriculture, Automotive, Hospitality, Real Estate,
Entertainment, Media, Fashion, Beauty, Fitness, Logistics, Manufacturing, Energy,
Technology, Telecom, Government, NGO, Sports, Music, Gaming, Food, Pets, Weddings, Events.

## 5. Shared tools map

**Cross-industry (reused ~70% of the time):**
- Booking engine (Medical, Legal, Education, Travel, Local services)
- Payment gateway + EHB Wallet (all industries)
- Messaging + notifications (all industries)
- Reviews & ratings (marketplace + services)
- Analytics dashboards (DMO, franchise, affiliate)

**Industry-specific extensions:**
- Medical — prescriptions, lab reports, medical records
- Legal — contracts, case files, court documents
- Education — LMS, exams, assignments, course builder
- Travel — flight/hotel search, itineraries, visa flows

## 6. Franchise hierarchy

1. **Global Super Admin** — overall control & policy.
2. **Country Franchise** — country-level operations & validation.
3. **Corporate Franchise** — city / sector operations.
4. **Sub Franchise** — local onboarding, inspections, support.

Revenue split: **40% provider / 25% sub / 20% corporate / 15% country**.

## 7. 8-step user flow (DMO-owned)

Registration → JPS profile → STL init → PSS verify → CRB certify → DMO approval →
Score calculation → Active (service access).

## 8. Stack & ports

| Layer      | Tech                                            | Port  | Path                          |
|------------|-------------------------------------------------|-------|-------------------------------|
| Frontend   | Next.js 14 App Router + TS + Tailwind + Prisma  | 3000  | `apps/web/`                   |
| API        | Node 20 + Express + Mongoose (ESM)              | 5000  | `services/api/stl-replit/`    |
| AI backend | Node 20 + Express + OpenAI (CommonJS)           | 8080  | `services/ai/`                |
| Database   | MongoDB 7                                       | 27017 | (external)                    |

Two logical DBs inside the one Mongo: `ehb_dev` (API) + `ehb_ai_memory` (AI).

## 9. Monorepo map (essential folders only)

```
apps/web/                     Next.js 14 frontend
services/api/stl-replit/      Main API (Express+Mongoose)
services/ai/                  AI backend (OpenAI)
services/workers/             Background jobs (CRB escalation, fraud)
packages/{ui,types,utils,config}   Shared libraries
infrastructure/scripts/       START-LOCAL.bat (v3), deploy scripts
data/ehb-data/                Industry & service seeds (32 industries)
docs/                         LAUNCH_GUIDE, PROJECT_STRUCTURE, this file
backup/                       Safety backups (gitignored)
```

Decision table for "where does new code go" → see `docs/PROJECT_STRUCTURE.md` §11.

## 10. Design system

- **Background:** `#0C0E1A` (main), `#13162A` (cards), `#1A1D33` (nested cards).
- **Purple:** `#7B6EF6` (primary), `#A098F8` (light).
- **Accent:** `#2BBFA0` teal (success/live), `#F0A030` amber (warning/partial),
  `#F05858` red (error/pending), `#38C878` green (confirmed).
- **Font:** `DM Sans` system fallback.
- **Borders:** `rgba(255,255,255,0.08)` for cards, `rgba(255,255,255,0.07)` for dividers.
- **Radii:** 12 cards, 8 inputs/buttons, 5–6 chips.
- **Style:** Dark glassmorphism. Chips = 15% bg + 30% border + full-color foreground.

## 11. Canonical APIs (subset)

| Method | Path                  | Tag    | Status  |
|--------|-----------------------|--------|---------|
| POST   | /api/auth/register    | Auth   | LIVE    |
| POST   | /api/auth/login       | Auth   | LIVE    |
| GET    | /api/stl/:userId      | STL    | LIVE    |
| POST   | /api/stl/recalc       | STL    | LIVE    |
| GET    | /api/pss/status       | PSS    | PARTIAL |
| POST   | /api/crb/submit       | CRB    | PARTIAL |
| GET    | /api/dmo/queue        | DMO    | LIVE    |
| POST   | /api/dmo/fraud        | DMO    | LIVE    |
| GET    | /api/wallet/balance   | Wallet | PENDING |
| POST   | /api/wallet/escrow    | Wallet | PENDING |
| POST   | /api/ai/adjust        | AI     | PARTIAL |
| GET    | /api/franchise/list   | Fran.  | PENDING |

Full live list is rendered at `/development` tab **APIs** and in `ehb-status.json`.

## 12. Critical integration warnings (open)

- 🔴 **AI recommend** not yet wired to marketplace listings.
- 🔴 **Wallet escrow** not fully linked to all booking flows — blocks paid Phase-1 launches.
- 🟡 **STL scoring** per-industry calibration pending.
- 🟡 **CRB blockchain hash** storage pending Polkadot contract.
- 🟢 Live industry stats — only 2/32 wired to real data.

## 13. Pending files to create (agent to-do)

- `apps/web/app/gosellr/cart/` — checkout flow.
- `apps/web/app/medical/` — prescriptions, lab reports, records pages.
- `services/api/stl-replit/routes/walletRoutes.js` — wallet endpoints.
- `apps/web/app/onboarding/` — first-run tour.
- `services/ai/src/prompts/` — seeded prompts for AI Lawyer, Diagnosis, Tutor.

## 14. 70-day phased roadmap

| Phase   | Days     | Title                              |  %  |
|---------|----------|------------------------------------|-----|
| Phase 0 | 1–3      | Local stack bring-up               | 100 |
| Phase 1 | 4–14     | System hardening + auth            |  75 |
| Phase 2 | 15–28    | STL + DMO production-ready         |  35 |
| Phase 3 | 29–42    | Wallet, escrow, franchise          |  10 |
| Phase 4 | 43–56    | AI layer + fraud detection         |   5 |
| Phase 5 | 57–70    | Production launch + scale          |   0 |

Live percentages are tracked in `ehb-status.json` (machine-written) and rendered
on the `/development` page.

## 15. Rules for AI agents (strict)

1. **Always read `ehb-status.json`** at session start. It's the real-time project pulse.
2. **Backup before destructive changes** — copy originals to `backup/<name>-YYYY-MM-DD/` first.
3. **Never break the STL formula** — run `npm run test:stl` after any touch, 58/58 must pass.
4. **Never commit `.env` files** — only `.env.example` goes in git.
5. **Never `process.exit(1)` on optional deps** — bind port first, retry in background.
6. **Follow the decision table** in `docs/PROJECT_STRUCTURE.md` §11 for file placement.
7. **Use lowercase filenames** for components — e.g. `card.tsx` not `Card.tsx`.
8. **Log every meaningful change** via `node scripts/ehb-log-change.mjs "<msg>" "<status>"`.
9. **Run `npx tsc --noEmit`** in `apps/web` before declaring a task done.
10. **Update `apps/web/app/development/page.tsx`** build-% fields when a module's progress changes.

## 16. How to refresh the context

- Human edits: update THIS file (`docs/EHB_CONTEXT.md`) + run
  `node scripts/sync-agent-context.mjs` to sync to `AGENTS.md`, `CLAUDE.md`,
  `.cursorrules`, and `.github/copilot-instructions.md`.
- Machine updates: `scripts/ehb-status-update.mjs` writes `ehb-status.json`
  without touching this file.

---

*EHB Technologies (Pvt.) Ltd. — Engineering · AI-agent context · v1.0 · 2026-04-11*
