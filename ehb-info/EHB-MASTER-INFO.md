# EHB MASTER INFO — Single Source of Truth

**Company:** EHB Technologies (Pvt.) Ltd.
**Document version:** 1.0
**Created:** 2026-04-11
**Maintained by:** EHB engineering + AI agents
**Scope:** Company-wide reference for product, platform, departments, and governance

> This file is the **portable master brief** for EHB. Every AI agent (Claude,
> Cursor, Copilot, Aider, Continue, Cody) should read this file before writing
> any new code, plan, or doc. It merges every piece of legacy information
> found across the repo into a single, re-structured, gap-fixed document.
>
> **Rule:** Whenever new authoritative information is added by the user, it
> is merged here and the *Changelog* at the bottom gets a new entry. Legacy
> docs stay in `/docs/` for history; this file stays canonical.

---

## 0. How to read this file

1. **Section 1–3** = who we are, what we build, why.
2. **Section 4** = the 8 core systems (PSS, CRB, STL, DMO, JPS, Wallet, AI, Blockchain).
3. **Section 5–6** = 32 industries + shared-tools map.
4. **Section 7** = franchise hierarchy and revenue split.
5. **Section 8** = stack, ports, monorepo layout.
6. **Section 9** = design system non-negotiables.
7. **Section 10** = 8-step user flow + 70-day roadmap.
8. **Section 11** = agent rules (the hard "do not" list).
9. **Section 12** = open gaps and integration warnings.
10. **Section 13** = glossary + renaming history (SQL→STL, EDR→CRB).
11. **Section 14** = advanced planning suggestions (added by Claude).
12. **Changelog** = who changed what, when, why.

---

## 1. Company at a glance

| Field | Value |
|-------|-------|
| Legal name | EHB Technologies (Pvt.) Ltd. |
| Tagline | Education · Health · Business |
| Pillars | 3 (Education, Health, Business) — hence "EHB" |
| Vision | One unified global super-app uniting **32 industries** across **50+ countries** |
| Trust backbone | AI + Polkadot blockchain |
| Target scale | 1M+ users · $500M+ economic volume · multi-level franchise network |
| Language policy | Roman Urdu + English for conversation; English for code, commits, UI |
| Primary HQ | Pakistan (with regional hubs in Asia/Europe/Americas) |

**One-line identity:**
EHB is a vertically-integrated super-platform that bundles 32 regulated +
unregulated industries under a single AI-verified trust score, a single
wallet, and a single 4-tier franchise network, so that any user in any
country can access any service with one identity and one economic record.

---

## 2. What problem EHB solves

Every industry today is fragmented: separate logins, separate KYCs, separate
trust scores, separate payment rails, separate governance. A Pakistani
shopkeeper, a Dubai doctor, an EU lawyer, and a US student share zero
infrastructure. EHB collapses that into **one trust stack**:

1. **One identity** (PSS) — KYC/KYB done once, reused everywhere.
2. **One physical proof** (CRB) — verified in person, hashed on-chain.
3. **One trust score** (STL L0–L8) — computed from PSS + CRB + behaviour + earnings.
4. **One governance brain** (DMO) — enforces policy, resolves disputes, audits everyone.
5. **One wallet** (EHB Wallet + EHBGC) — multi-currency, escrow-ready, split-paying.
6. **One skill engine** (JPS) — AI-matched jobs, resumes, and designations.
7. **One AI stack** — 100+ modules on top of OpenAI/Claude for legal, medical, education, commerce.
8. **One immutable log** (Polkadot) — every certificate, every STL milestone, every dispute settled.

When all 8 click together, any new industry can launch in weeks instead of
years because ~70% of the building blocks are already live.

---

## 3. Target scale and phasing

| Metric | Goal |
|--------|------|
| Industries (total) | 32 |
| Industries (Phase-1) | 6 |
| Countries (Phase-1) | Pakistan, UAE (expanding into UK, US, EU, India) |
| Countries (long-term) | 50+ |
| Users (launch target) | 1M+ |
| Economic volume (launch target) | $500M+ |
| AI modules planned | 100+ |
| Core platform departments | 8 |
| Shared-tools reuse | ~70% across industries |
| Franchise model | Country → Corporate → Sub |
| Revenue split | 40% provider / 25% sub / 20% corporate / 15% country |

---

## 4. The 8 core systems

### 4.1 PSS — Proof & Security System
KYC / KYB, liveness detection, AML screening, fraud detection, document
authenticity, address verification, behavioural risk monitoring. Every user
passes PSS on signup. PSS is the **first gate** before anything else.

**Key APIs:** `/api/pss/status`, `/api/pss/submit`, `/api/pss/review`.
**Owner of final review:** DMO PSS panel.

### 4.2 CRB — Certification & Registry Board
(Previously: EDR — "Exam Decision Registry". Renamed on 2026-04-11.)
Physical office verification, professional certification (doctors, lawyers,
engineers), legal compliance, product/service authentication. Every
certificate hash goes on-chain (Polkadot). **6-month refilling cycle**.
CRB success boosts STL by **+15**.

**Physical verification is what makes EHB bank-level trustworthy** — it is
the hardest competitor moat because it requires a franchise network on the
ground.

### 4.3 STL — Service Trust Level
(Previously: SQL — "Service Quality Level". Renamed on 2026-04-11.)
A multi-level scoring system computed from PSS + CRB + DMO actions +
earnings + behaviour. Formula lives in
`services/api/stl-replit/services/stlService.js` and is **protected by
58 gold-master regression tests**. Every commit runs `npm run test:stl` —
58 pass / 0 fail is non-negotiable.

> ⚠️ **CONTRADICTION PENDING** (2026-04-11, Batch-1): Legacy code +
> tests use **L0 → L8 SUPREME (9 levels)**. Batch-1 user input
> introduces **L1 → L10 SUPREME (10 levels)** with coin-lock ladder,
> refill cadence, and complaint caps. Migration plan drafted in
> `departments/DMO.md §23.3 S1` (feature flag `STL_V2_ENABLED`).
> **Blocking resolution** — see `departments/DMO.md §24 row 1` and §25.1.
> Until user confirms, the legacy 9-level model remains canonical for
> code + tests.

**Final rule (legacy):** `STL = MIN(score, lock, pss, crb, dmo)` — the
weakest link wins. You cannot fake your way up.

**Final rule (Batch-1 master anti-fraud, awaiting confirmation):**
`FINAL EHB-STL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)` —
extends the weakest-link principle across the full seller chain so a
fake company or compromised owner instantly caps every product listed
under it. Surface API planned: `POST /api/stl/validate-product`
returning `{ finalStl, blockingLayer }`. Canonical spec in
`departments/DMO.md §22.2`.

**Canonical 10-level ladder (Batch-2 confirmed 2026-04-11):**

| Level | Name     | Score band | Min locked EHBGC |
|-------|----------|-----------:|-----------------:|
| L1    | FREE     |       0–20 |                0 |
| L2    | BASIC    |      21–40 |               20 |
| L3    | NORMAL   |      41–60 |               40 |
| L4    | STANDARD |      61–75 |              100 |
| L5    | ADVANCED |      76–85 |              200 |
| L6    | HIGH     |      86–92 |              400 |
| L7    | PRO      |      93–96 |              800 |
| L8    | VIP      |      97–98 |             2000 |
| L9    | ELITE    |         99 |             4000 |
| L10   | SUPREME  |        100 |          10000+ |

Full spec (upgrade/downgrade conditions, composite formula, decay, multi-entity MIN rule) is in `ehb-info/departments/STL.md`. Legacy docs used a 5-tier FREE/BASIC/MEDIUM/HIGH/VIP model — that is **deprecated**. Production code still uses a 9-level L0–L8 ladder protected by 58 gold-master tests — migration plan documented in `DMO.md §23.3 S1`.

STL is **multi-entity** — users, sellers, products, franchises each have
their own score, with the rule `Product ≤ Seller ≤ User`.

### 4.4 DMO — Decentralized Management Office
The central governance authority. **DMO is the brain of EHB**. It does not
run operations — it approves, monitors, enforces, audits, and routes.

DMO owns:
- The 8-step user flow (Registration → JPS → STL → PSS → CRB → DMO → Score → Active)
- The L8 SUPREME manual approval
- The 40/25/20/15 revenue split enforcement
- Platform policy
- Suspension / restoration authority over every service

See `ehb-info/departments/DMO.md` for the full DMO plan.

### 4.5 JPS — Job Profile & Skill
AI-powered job/skill matching, professional profiles, designations, exam
system, 6-month contract cycles, employer ↔ employee connection engine.
Builds on top of PSS identity + CRB certification.

### 4.6 Wallet / Finance
EHB wallet + EHBGC, escrow, multi-currency (50+ countries), franchise revenue
distribution, affiliate commissions, AML monitoring, fee engine, payout engine.
Escrow **must** be wired into every paid booking flow before that industry
can go live — this is currently the **largest blocker for Phase-1 paid launches**.

Wallet types: **Main**, **Earnings**, **Lock**.
Income types: Commission, Franchise, Referral, Product bonus, AI services.

### 4.7 AI Department
6 flagship AI modules (Phase-1 focus):

| Module | Industry | Function |
|--------|----------|----------|
| AI Lawyer         | Legal      | Case triage, document drafting, risk analysis |
| AI Diagnosis      | Medical    | Symptom triage, report explanation |
| AI Resume Builder | Jobs       | CV generation and optimization |
| AI Course Tutor   | Education  | Adaptive learning paths |
| AI Business Advisor | Commerce | SME services |
| AI Fraud Detector | DMO        | Transaction + review abuse detection |

**Rule:** AI is an **advisor**, the platform is the **final authority**.
AI never writes STL directly — it proposes, DMO/system confirms.

### 4.8 Blockchain
Polkadot-based. Stores **immutable hashes** for CRB certificates, STL
milestone snapshots, franchise contracts, high-risk DMO actions (bans,
freezes). Currently ~10% complete; contract work pending in Phase-3.

---

## 5. 32 industries

### 5.1 Phase-1 (active — 6)

| Code     | Industry              | Build % | Notes |
|----------|-----------------------|---------|-------|
| GSM      | E-commerce (GoSellr)  | 60      | Marketplace backbone |
| OLS      | Legal Services        | 30      | AI Lawyer integration |
| WMS      | Medical & Health      | 20      | HIPAA-aligned, AI Diagnosis |
| HPS/OBS  | Education & Learning  | 15      | LMS, AI Course Tutor |
| JPS      | Jobs & HR             | 30      | Identity + skill stack |
| AGTS     | Travel & Tourism      | 10      | Cross-border bookings |

### 5.2 Phase-2 / Phase-3 queue (26)

Finance, Consulting, Construction, Agriculture, Automotive, Hospitality,
Real Estate, Entertainment, Media, Fashion, Beauty, Fitness, Logistics,
Manufacturing, Energy, Technology, Telecom, Government, NGO, Sports, Music,
Gaming, Food, Pets, Weddings, Events.

**Pattern:** Every new industry plugs into the same 8 core systems, so the
delta to launch is only (a) industry-specific UI, (b) industry-specific
compliance rules, (c) industry-specific AI prompts, (d) industry-specific
CRB checklist.

### 5.3 Industry-verification STL impact

(From `industry-stl-impact-system.md`, legacy docs.)

| Industry          | STL boost | Security tier |
|-------------------|-----------|---------------|
| Healthcare        | +5 | Premium |
| Legal             | +5 | Premium |
| Electrical        | +5 | High |
| Solar Installation| +5 | High |
| Construction      | +4 | High |
| Security          | +4 | High |
| IT & Electronics  | +4 | Medium |
| Automotive        | +3 | Medium |
| Plumbing          | +3 | Medium |
| HVAC              | +3 | Medium |

**Security tiers:**
- **Basic Secure** — document upload only
- **Medium Secure** — documents + on-site audit
- **High Secure** — CRB physical inspection + certificate
- **Premium Secure** — multi-industry certifications combined

**Audit cadence examples:**
- Healthcare: 3 months (7-day grace)
- Electrical / Solar / Construction / IT: 6 months (14-day grace)
- Legal: 12 months (30-day grace)

---

## 6. Shared tools map

### 6.1 Cross-industry (~70% reuse)
- Booking engine (Medical, Legal, Education, Travel, Local services)
- Payment gateway + EHB Wallet (all industries)
- Messaging + notifications (all industries)
- Reviews + ratings (marketplace + services)
- Analytics dashboards (DMO, franchise, affiliate)

### 6.2 Industry-specific extensions
- **Medical** — prescriptions, lab reports, medical records (HIPAA)
- **Legal** — contracts, case files, court documents
- **Education** — LMS, exams, assignments, course builder
- **Travel** — flight/hotel search, itineraries, visa flows
- **Commerce** — inventory, returns, shipping

### 6.3 Trust badge system (on every user/provider card)

| Icon | Meaning | Source |
|------|---------|--------|
| 🛡️ | PSS Verified (green) | PSS |
| 🏛️ | CRB Certified (blue) | CRB |
| ⭐ | STL Level (gold)    | STL  |
| 🌐 | DMO Registered (purple) | DMO |
| 🏢 | Franchise Verified (orange) | Franchise |
| 🔁 | Refilling Count (grey) | CRB refill |
| ⚠ | Complaints (red/green) | Complaint system |

---

## 7. Franchise hierarchy

```
Global Super Admin (EHB Board)
        ↓
Country Franchise   (country-level operations + validation)
        ↓
Corporate Franchise (city / sector operations)
        ↓
Sub Franchise       (local onboarding, inspections, support)
```

**Revenue split:** `40 / 25 / 20 / 15`
- 40% → service provider
- 25% → sub franchise
- 20% → corporate franchise
- 15% → country franchise

**DMO enforcement rule:** Any paid transaction that cannot compute this
split cleanly is **rejected** at the wallet layer. This is the most
important economic invariant in the platform.

---

## 8. Stack, ports, monorepo

### 8.1 Runtime stack

| Layer      | Tech                                            | Port  | Folder                          |
|------------|-------------------------------------------------|-------|---------------------------------|
| Frontend   | Next.js 14 App Router + TS + Tailwind + Prisma  | 3000  | `apps/web/`                     |
| API        | Node 20 + Express + Mongoose (ESM)              | 5000  | `services/api/stl-replit/`      |
| AI backend | Node 20 + Express + OpenAI (CommonJS)           | 8080  | `services/ai/`                  |
| Database   | MongoDB 7 (logical DBs: `ehb_dev`, `ehb_ai_memory`) | 27017 | external                     |

Future (planned in DMO architecture docs): PostgreSQL primary, Redis cache,
Kafka event bus, Elasticsearch, IPFS, Polkadot, Kubernetes (EKS/GKE), AWS
KMS / HashiCorp Vault for keys.

### 8.2 Monorepo layout

```
EHB DEVELOPMENT 2026/
├── apps/web/                    Next.js 14 frontend
├── services/api/stl-replit/     Main API (Express+Mongoose)
├── services/ai/                 AI backend (OpenAI)
├── services/workers/            Background jobs (CRB escalation, fraud)
├── packages/{ui,types,utils,config}   Shared libraries
├── infrastructure/scripts/      START-LOCAL.bat v3, deploy scripts
├── data/ehb-data/               Industry + service seeds (32 industries)
├── docs/                        LAUNCH_GUIDE, PROJECT_STRUCTURE, EHB_CONTEXT, DMO plans
├── design-system/               EHB-UIUX-SYSTEM.md, ai-behavior.md
├── ehb-info/                    *** THIS folder — master merged brief ***
└── backup/                      Safety backups (gitignored)
```

Decision table for "where does new code go" → `docs/PROJECT_STRUCTURE.md` §11.

### 8.3 Canonical APIs (subset)

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
| GET    | /api/franchise/list   | Franch.| PENDING |

Full live list is rendered at `/development` tab **APIs** and in `ehb-status.json`.

---

## 9. Design system (non-negotiable)

**Palette (brand-locked):**
- Background: `#0C0E1A` (main) · `#13162A` (cards) · `#1A1D33` (nested)
- Purple (primary): `#7B6EF6` · Light purple: `#A098F8`
- Teal (success / live): `#2BBFA0`
- Amber (warning / partial): `#F0A030`
- Red (error / pending): `#F05858`
- Green (confirmed): `#38C878`

**Typography:** `DM Sans`, system sans-serif fallback.
**Borders:** `1px solid rgba(255,255,255,0.08)` for cards, `rgba(255,255,255,0.07)` for dividers.
**Radii:** 12 for cards, 8 for inputs/buttons, 5–6 for chips.
**Style:** Dark glassmorphism. No rounded-full circles beyond avatars / status dots.
**Chips:** 15% background + 30% border + full-colour foreground.

**Living source of truth:** `design-system/EHB-UIUX-SYSTEM.md` +
`design-system/ai-behavior.md`. Every UI task must read those two files
top-to-bottom before writing code. The auto-upgrade rule is hard: a plain
"just show X" brief must be upgraded to a clickable glass card with icon,
chip, motion, and drill-in drawer before commit.

**Admin theme override:** The DMO admin UI (`/admin/*`) uses a light-mode
admin palette (`#f8fafc` bg, `#1e293b` sidebar, `#3b82f6` primary). This
is the only allowed divergence from the dark brand palette — it is
documented in `docs/ui-ux/dmo-admin-system.md`.

---

## 10. Flows and roadmap

### 10.1 8-step user flow (DMO-owned)

```
Registration → JPS profile → STL init → PSS verify → CRB certify →
  DMO approval → Score calculation → Active (service access)
```

### 10.2 Provider flow

```
Provider signup → PSS identity verification → CRB skill certification →
  STL level assignment → Service listing (via DMO) → Orders + earnings
```

### 10.3 Franchise flow

```
Country franchise → Corporate franchise → Sub franchise →
  Providers onboarding → Local orders management
```

### 10.4 70-day phased roadmap

| Phase | Days  | Title                              | %   |
|-------|-------|------------------------------------|-----|
| 0     | 1–3   | Local stack bring-up               | 100 |
| 1     | 4–14  | System hardening + auth            | 75  |
| 2     | 15–28 | STL + DMO production-ready         | 35  |
| 3     | 29–42 | Wallet, escrow, franchise          | 10  |
| 4     | 43–56 | AI layer + fraud detection         | 5   |
| 5     | 57–70 | Production launch + scale          | 0   |

Live percentages are tracked in `ehb-status.json` (machine-written) and
rendered on `/development`.

### 10.5 MASTER ROADMAP (legacy, 8 phases)

1. Foundation (DMO, PSS, CRB, STL, Wallet)
2. Marketplace (GoSellr, Products, Services)
3. Professional Network (JPS, Jobs, Freelance)
4. Service Platforms (WMS, AGTS, OLS, SOT, HPS)
5. Digital Governance (Applications, Licenses)
6. Global Expansion (Multi-country)
7. AI Ecosystem (ML, Fraud Detection, NLP)
8. Blockchain Governance (Trust Network, Smart Contracts)

---

## 11. Rules for AI agents (hard list)

1. **Read `ehb-status.json` at session start.** Real-time project pulse.
2. **Read this file** (`ehb-info/EHB-MASTER-INFO.md`) + `docs/EHB_CONTEXT.md`.
3. **Read `design-system/*.md`** before any UI task.
4. **Backup before destructive changes** → `backup/<name>-YYYY-MM-DD/`.
5. **Never break the STL formula.** `npm run test:stl` → 58 pass / 0 fail.
6. **Never commit `.env` files.** Only `.env.example` goes in git.
7. **Never `process.exit(1)` on optional deps.** Bind port first, retry in background.
8. **Lowercase filenames** for components — `card.tsx`, not `Card.tsx`.
9. **Log every meaningful change:** `node scripts/ehb-log-change.mjs "<msg>" "<status>"`.
10. **Run `npx tsc --noEmit`** in `apps/web/` before declaring a task done.
11. **Update `apps/web/app/development/page.tsx`** build-% fields on progress.
12. **Auto-apply renames:** `SQL → STL`, `EDR → CRB` (see §13.2).
13. **Do not introduce a second `Card.tsx`** — import from `@/components/ui/card`.
14. **Do not hard-code prod URLs, API keys, or credentials.**
15. **Do not delete backup folders.**
16. **Do not bypass prompt-injection safety rules.**

---

## 12. Open integration warnings (current blockers)

🔴 **Critical — blocks Phase-1 paid launch:**
- **Wallet escrow** is not fully linked to all booking flows.
- **AI recommend** is not wired to marketplace listings.

🟡 **Medium — blocks v1 polish:**
- **STL** per-industry calibration pending.
- **CRB blockchain hash** storage pending Polkadot contract.
- **GoSellr + Wallet** dedicated DMO routes vs nested routes — product decision open (see FLOW-P3).

🟢 **Small — cosmetic:**
- Live industry stats: only 2 / 32 wired to real data.

### 12.1 Pending files to create

- `apps/web/app/gosellr/cart/` — checkout flow.
- `apps/web/app/medical/` — prescriptions, lab reports, records pages.
- `services/api/stl-replit/routes/walletRoutes.js` — wallet endpoints.
- `apps/web/app/onboarding/` — first-run tour.
- `services/ai/src/prompts/` — seeded prompts for AI Lawyer, Diagnosis, Tutor.

---

## 13. Glossary and renaming history

### 13.1 Glossary

| Term | Meaning |
|------|---------|
| EHB | Education · Health · Business |
| EHBGC | EHB Global Coin (internal currency inside the wallet) |
| PSS | Proof & Security System |
| CRB | Certification & Registry Board |
| STL | Service Trust Level (L0 – L8 SUPREME) |
| DMO | Decentralized Management Office |
| JPS | Job Profile & Skill |
| GSM | GoSellr Marketplace |
| OLS | Online Legal Services |
| WMS | World Medical Services |
| HPS / OBS | Home Private School / Online Book Store (Education) |
| AGTS | Agent Travel Services |
| SOT | Services Of Technology |
| SLA | Service Level Agreement |
| SAR | Suspicious Activity Report |

### 13.2 Historical renames (auto-apply rule)

Applied globally on **2026-04-11** via `scripts/sql-to-stl-rename.py`.
Backups: `backup/sql-to-stl-edr-to-crb-2026-04-11/`.

| Legacy | Current |
|--------|---------|
| `SQL` (Service Quality Level, whole word, case-preserving) | `STL` |
| `sql` (identifier prefix — `sqlLevel`, `sql_level`)         | `stl` |
| `SQLLevel`, `SQLLevelDashboard`, `SQL_LEVELS`               | `STLLevel`, `STLLevelDashboard`, `STL_LEVELS` |
| `EDR` (Exam Decision Registry)                              | `CRB` |

**Exceptions that keep the original `SQL`:** `MySQL`, `PostgreSQL`, `SQLite`,
`NoSQL`, `PL/SQL`, `T-SQL`, and raw database-language comments. These are
the real SQL, not the legacy EHB acronym.

---

## 14. Advanced planning (AI-added suggestions)

These are structural improvements that are **not** in the legacy docs but
follow logically from the rest of the platform. Each one is tagged
`[SUGGESTION]` so it is easy to distinguish from user-authored content.

### 14.1 `[SUGGESTION]` Trust contract (cross-department invariant)
Publish a single `packages/types/src/trust-contract.ts` that encodes
`MIN(score, lock, pss, crb, dmo)` as a TypeScript type + runtime validator.
Every service (STL, DMO, Wallet, AI, Franchise) imports from it. Then the
gold-master test suite can assert "no service bypasses the trust contract".

### 14.2 `[SUGGESTION]` DMO event bus
DMO owns governance but has no canonical event bus today. Add a
`dmo.events.*` namespace on the future Kafka / EventBridge layer:
`dmo.events.pss.flagged`, `dmo.events.crb.approved`, `dmo.events.stl.dropped`,
`dmo.events.wallet.amlflagged`, `dmo.events.franchise.terminated`. Every
panel in the DMO dashboard becomes a consumer of the same event stream;
new modules just subscribe.

### 14.3 `[SUGGESTION]` Revenue-split machine-readable source of truth
The `40 / 25 / 20 / 15` split is documented in prose. Extract it into
`packages/config/src/revenue-split.ts` so:
- Wallet enforces it on every paid txn.
- DMO dashboard reports drift automatically.
- Country-specific overrides can be layered without code changes (e.g. EU
  might require a VAT slice).

### 14.4 `[SUGGESTION]` Incident channel → DMO alert pipeline
Today's `DMOAlert` table is internal. Wire it to Slack / Email / WhatsApp
with severity-based routing (critical → PagerDuty, high → Slack #dmo-war-room,
medium → ticket queue). Response-time SLAs are already in the security doc
(15 min critical → 24h low) — this just operationalises them.

### 14.5 `[SUGGESTION]` CRB refilling calendar as a platform primitive
The 6-month refilling cycle is mentioned in multiple docs but has no UI
primitive. Add a `RefillingCalendar` component (red = overdue, amber = within
grace, green = fresh) that every industry card reuses. DMO inspectors get
the same component scoped to their assigned franchises.

### 14.6 `[SUGGESTION]` AI decision-assistant telemetry
The AI Decision Assistant proposes → DMO confirms. Log every
`{proposed, confirmed, reason}` tuple in a `dmo_ai_decisions` table. After
90 days, compute agreement rate per module — if DMO consistently overrides
the AI in (say) CRB, the AI model for CRB is miscalibrated and needs
retraining. This is the only way to stop AI drift from silently rotting
the platform.

### 14.7 `[SUGGESTION]` Blockchain-anchor batching
Writing every certificate to Polkadot individually is expensive. Batch
hashes Merkle-tree style and commit the root once per hour. The
per-certificate proof is a Merkle path (cheap), so downstream verification
stays constant-time. This is standard in rollup/anchor systems; it reduces
gas cost by 2–3 orders of magnitude.

### 14.8 `[SUGGESTION]` "DMO diff" feature
Every DMO action (override, approve, ban, freeze) produces a diff between
the previous and new state of the target entity. Surface those diffs in
the audit-trail viewer with side-by-side colouring. Regulators and
franchise auditors can read the platform's governance history like a
Git log. This is cheap to build and extremely valuable for compliance
conversations (GDPR, PECA, DIFC).

### 14.9 `[SUGGESTION]` Franchise scorecard → STL feedback loop
Franchises already have a performance score. Feed that score back into
the STL of the providers they onboard (bad franchise → slight STL ceiling
for its providers). This penalises lazy franchises without punishing
individual providers, and creates an economic incentive for sub-franchises
to vet their providers carefully.

### 14.10 `[SUGGESTION]` Kill-switch pattern
Every paid industry gets a `dmo.kill-switch.<industry>` config key. If DMO
Director flips it, all writes in that industry pause with a friendly
"temporarily paused for audit" banner, but reads keep working. This
protects the platform during an incident without nuking the user experience.

---

## 15. Departments index

Per-department detailed plans live under `ehb-info/departments/`. Each
department file merges its legacy docs, fixes gaps, and holds
`[AWAITING USER INPUT]` markers where the user is expected to fill in
specifics during planning.

| Department | File | Status |
|------------|------|--------|
| DMO — Decentralized Management Office  | `ehb-info/departments/DMO.md`         | **v1.2 — Batch-1 + Batch-2 merged** |
| STL — Service Trust Level              | `ehb-info/departments/STL.md`         | **v1.0 — Batch-2 merged** |
| PSS — Personal Security System         | `ehb-info/departments/PSS.md`         | **v1.0 — Batch-2 merged** |
| CRB — Certification & Refill Board     | `ehb-info/departments/CRB.md`         | **v1.0 — Batch-2 merged** (naming C1 flagged) |
| Wallet / Trusty Wallet                 | `ehb-info/departments/Wallet.md`      | **v1.0 — Batch-2 merged** |
| Blockchain                             | `ehb-info/departments/Blockchain.md`  | **v1.0 — Batch-2 merged** |
| GoSellr — Marketplace                  | `ehb-info/departments/GoSellr.md`     | **v1.0 — Batch-2 merged** |
| Franchise Network                      | `ehb-info/departments/Franchise.md`   | **v1.0 — Batch-2 merged** |
| Finance                                | `ehb-info/departments/Finance.md`     | **v1.0 — Batch-2 merged** |
| Affiliate                              | `ehb-info/departments/Affiliate.md`   | **v1.0 — Batch-2 merged** |
| Industries catalogue                   | `ehb-info/departments/Industries.md`  | **v1.0 — Batch-2 merged** |
| JPS — Job Profile & Skill              | *(pending — see Industries.md §4 Q3)* | — |
| AI Department                          | *(pending)*                           | — |

---

## Changelog

| Date       | Author | Change |
|------------|--------|--------|
| 2026-04-11 | Claude | v1.0 — initial merge of `docs/EHB_CONTEXT.md`, `docs/development/EHB_DMO_PLAN.md`, `docs/architecture/dmo-master-architecture.md`, `docs/architecture/dmo-blueprint.md`, `docs/architecture/dmo-data-flow.md`, `docs/architecture/dmo-global-data-flow.md`, `docs/architecture/dmo-ai-decision-engine.md`, `docs/architecture/dmo-bank-level-security.md`, `docs/database/dmo-master-database.md`, `docs/ui-ux/dmo-admin-system.md`, `docs/flows/FLOW-P3-dmo-governance.md`, `docs/ehb-dmo-and-home-data-snapshot.md`, `docs/ehb-info/EHB_stl 0.md`, `CLAUDE.md`, `design-system/EHB-UIUX-SYSTEM.md` into one re-structured master file. Added §14 advanced planning suggestions. |
| 2026-04-11 | Claude | v1.1 — Batch-1 merge (see `departments/DMO.md §22`). §4.3 flagged STL 9↔10 contradiction + added master MIN rule `MIN(product, seller, company, owner)`. |
| 2026-04-11 | Claude | v1.2 — **Batch-2 merge** (13 uploaded `.md` files). §4.3 replaced with canonical 10-level ladder + coin lock minimums. §15 departments index expanded — 11 of 13 department files now live under `ehb-info/departments/` (DMO v1.2, STL/PSS/CRB/Wallet/Blockchain/GoSellr/Franchise/Finance/Affiliate/Industries each v1.0). Only JPS + AI Department remain pending. |

---

---

## 16. MASTER PLAN — Complete Business Flow & User Journeys

> **Added:** 2026-04-12 — v2.0 Master Plan Edition
> **Sources:** All collected data from D:\EHB 1, D:\EHB, D:\ehb ui ux, Downloads\ehb .md files, project docs (100+ files analyzed)
> **See also:** `ehb-info/uploaded-information.md` for raw collected data

### 16.1 Company Legal Identity

| Field | Value |
|-------|-------|
| Legal Name | EHB Technologies (SMC-Private) Limited |
| Corporate UID | 0179621 |
| Registration | Section 16, Companies Act 2017 (XIX of 2017) |
| AJK Registration | No. 285 MZD, Companies Ordinance 1984 |
| AJK Name | EHB- Education Health and Business (PVT) Limited |
| Founded | 2008 (by Muhammad Rafi) |
| Registered | 2010 (applied), 2015 (public survey), 2016 (approved) |
| Active Since | 2017+ |
| Founder | Muhammad Rafi |
| Managing Director | Mohammad Tufail |
| HQ Address | Creative Minds College, Main Simly Dam Road, Bharakahu, Islamabad, 44000, Punjab, Pakistan |
| Contact | +92 346 4385 703 |
| Email | ehb.rafi@gmail.com / rafi.ehb@gmail.com |
| Full Form | Education, Health, and Business |

### 16.2 The Big Picture — How EHB Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EHB GLOBAL SUPER-APP                             │
│                                                                     │
│  "One Platform. 32 Industries. 700+ Services. Infinite Trust."     │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │   PSS    │  │   CRB    │  │   STL    │  │   DMO    │           │
│  │Identity &│→ │Certify & │→ │Trust     │→ │Govern &  │           │
│  │Security  │  │Verify    │  │Score     │  │Control   │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│       ↕              ↕             ↕              ↕                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Wallet  │  │Franchise │  │Affiliate │  │    AI    │           │
│  │EHBGC Coin│  │Territory │  │Referral  │  │Advisory  │           │
│  │& Escrow  │  │Network   │  │Network   │  │& Fraud   │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│       ↕              ↕             ↕              ↕                │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │              32 INDUSTRY MODULES                         │       │
│  │  GoSellr | WMS | OLS | HPS | JPS | AGTS | HMS | ...    │       │
│  └─────────────────────────────────────────────────────────┘       │
│       ↕                                                            │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │              BLOCKCHAIN (Immutable Ledger)               │       │
│  │  BSC → Mosaic → Polkadot (3-phase migration)            │       │
│  └─────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

### 16.3 Complete User Journey — From Registration to Active Use

```
STEP 1: REGISTRATION
  User downloads EHB app / visits website
  → Creates account (email + phone)
  → Receives welcome + wallet initialization (L1 FREE, 0 EHBGC)
  → Directed to complete profile

STEP 2: JPS PROFILE SETUP
  → Fill personal info, skills, education, experience
  → Select industry categories of interest
  → AI suggests matching services/jobs

STEP 3: STL INITIALIZATION
  → System assigns L1 FREE (score 0-20)
  → Shows upgrade path: "Lock 20 EHBGC → reach L2 BASIC"
  → Displays benefits ladder for each level

STEP 4: PSS VERIFICATION (Identity)
  → Basic: Upload CNIC/ID + phone OTP (→ Basic Verified)
  → Full: Liveness face match + address proof (→ Fully Verified)
  → Trust score calculated (0-100)
  → PSS-STL component updated

STEP 5: CRB CERTIFICATION (Skills)
  → Select service category
  → Take category exam (theory + practical, 70% pass)
  → Upload multimedia proofs (degrees, certificates, videos)
  → Inspector review (physical if Advanced/Professional)
  → CRB-STL component updated

STEP 6: DMO APPROVAL
  → DMO reviews composite profile (PSS + CRB + JPS)
  → AI pre-screens for fraud flags
  → DMO Manager approves/rejects
  → If approved → proceed to activation

STEP 7: SCORE CALCULATION
  → STL = weighted(PSS_trust, CRB_verify, DMO_activity, coin_lock) − complaint_penalty
  → Master rule: FINAL = MIN(product, seller, company, owner)
  → Level assigned based on score band

STEP 8: ACTIVE — SERVICE ACCESS
  → Can now list services/products in their industry
  → Can buy from marketplace
  → Can earn commissions
  → Can apply for franchise
  → Ongoing: CRB refills (6-month cycle), STL recalculation
```

### 16.4 Franchise Business Model — Complete Flow

```
FRANCHISE HIERARCHY:
┌──────────────────────────────┐
│  EHB GLOBAL HQ (Super Admin) │
│  → Platform development       │
│  → Policy creation            │
│  → Global strategy            │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│  COUNTRY FRANCHISE (L1)      │
│  → Country-level ops          │
│  → Regulatory compliance      │
│  → Receives 15% of revenue    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│  CORPORATE FRANCHISE (L2)    │
│  → City/sector operations     │
│  → Business development       │
│  → Receives 20% of revenue    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│  SUB FRANCHISE (L3)          │
│  → Local onboarding           │
│  → Physical inspections (CRB) │
│  → Helpline / complaint desk  │
│  → Receives 25% of revenue    │
└──────────────────────────────┘

FRANCHISE APPLICATION FLOW:
1. Apply for territory (online form)
2. CRB verification of franchise applicant
3. STL assessment (minimum L4 STANDARD required)
4. DMO approval
5. Territory assignment (exclusive by area)
6. Training & onboarding
7. Activation — start operations
```

### 16.5 Revenue & Earnings Model

#### GoSellr Order Revenue Split (Outer)
```
Customer pays $100 for a product:
  → Seller receives: $70 (70%)
  → Rider receives:  $10 (10%)
  → Franchise share: $10 (10%)
  → Platform fee:    $10 (10%)
```

#### Platform Fee Cascade (Inner — the 10%)
```
Platform's $10 splits into:
  → Country Franchise: $4.00 (40%)
  → Corporate Franchise: $2.50 (25%)
  → Sub Franchise: $2.00 (20%)
  → EHB HQ: $1.50 (15%)
```

#### Service Charges by Department
| Department | Charge Type | Range |
|-----------|-------------|-------|
| GoSellr | Per transaction | 5-10% of sale amount |
| CRB | Exam + certification | Per exam/verification |
| PSS | Profile verification | Per verification type |
| DMO | Business management | Based on tools used |
| AI Services | Per use / subscription | TBD |

#### Wallet Economics
- FREE users: Limited access, no protection guarantee
- BASIC+ users: Full guarantee, company responsible for quality
- Coin lock creates "skin in the game" — higher lock = higher trust = more business

### 16.6 GoSellr — Complete E-Commerce Flow

```
BUYER FLOW:
1. Open app → nearest stores displayed
2. Browse products (STL badges visible on every product/seller)
3. Add to cart → review order
4. Select delivery boy (multiple shown with charges)
5. Choose payment (EHBGC wallet / external)
6. Place order → escrow locks payment
7. Track delivery (real-time)
8. Receive product → confirm delivery
9. Escrow releases payment to seller
10. Rate & review (impacts STL)

SELLER FLOW:
1. Register business → PSS verify → CRB certify
2. List products (each product gets STL badge)
3. Receive order notification
4. Prepare & hand to rider
5. Track delivery status
6. Receive payment (after escrow release)
7. View analytics (sales, ratings, STL trends)

RIDER FLOW:
1. Register → PSS verify → CRB certify (delivery category)
2. Go online in app
3. Receive delivery task (priority by STL level)
4. Accept → navigate to pickup
5. Confirm pickup → navigate to dropoff
6. Deliver → get proof of delivery
7. Earn delivery fee → wallet credit
8. View stats (speed rating, customer rating, franchise rating)

DELIVERY PROMISES:
- 15 minutes to 1 hour (nearest store)
- Max 12 hours (basic service)
- Replacement within 1 day (Basic+ STL)
- Complaint response within 15 minutes
- Franchise office in every city for physical support
```

### 16.7 Trust-Based Economy — How STL Drives Everything

```
THE TRUST LOOP:
┌─────────────────────────────────────────────┐
│                                             │
│   Verify Identity (PSS)                     │
│        ↓                                    │
│   Certify Skills (CRB)                      │
│        ↓                                    │
│   Lock Coins (Wallet)                       │
│        ↓                                    │
│   Calculate STL Score                       │
│        ↓                                    │
│   Higher STL = Better Visibility            │
│        ↓                                    │
│   More Orders = More Earnings               │
│        ↓                                    │
│   Good Reviews = STL Upgrade                │
│        ↓                                    │
│   Refill CRB every 6 months                │
│        ↓                                    │
│   Loop continues → Trust compounds          │
│                                             │
└─────────────────────────────────────────────┘

TRUST PROTECTION GUARANTEE:
- FREE level: Company NOT responsible (no verification)
- BASIC level: Company guarantees product quality
- NORMAL+: Full protection — delivery, quality, money
- VIP/ELITE/SUPREME: Premium protection + priority support

WHY STL MATTERS:
- Buyers see STL badges → choose higher-trust sellers
- Sellers invest in verification → get more business
- Fraudsters can't game it → MIN rule (weakest link)
- Coin lock = financial commitment → reduces fraud
- CRB refills = continuous quality → prevents degradation
```

### 16.8 AI Department — Complete System

```
6 FLAGSHIP AI MODULES:
┌──────────────────────────────────────────────┐
│  1. AI LAWYER (Legal/OLS)                    │
│     → Case triage, document drafting          │
│     → Risk analysis, legal research           │
│     → Contract review                         │
│                                              │
│  2. AI DIAGNOSIS (Medical/WMS)               │
│     → Symptom triage with confidence scoring  │
│     → Report explanation                      │
│     → Emergency protocol (severity detection) │
│                                              │
│  3. AI RESUME BUILDER (Jobs/JPS)             │
│     → CV generation & optimization            │
│     → Skill gap analysis                      │
│     → Job match recommendations               │
│                                              │
│  4. AI COURSE TUTOR (Education/HPS)          │
│     → Adaptive learning paths                 │
│     → Progress tracking                       │
│     → Personalized study plans                │
│                                              │
│  5. AI BUSINESS ADVISOR (Commerce)           │
│     → SME consulting                          │
│     → Market analysis                         │
│     → Growth recommendations                  │
│                                              │
│  6. AI FRAUD DETECTOR (DMO)                  │
│     → Transaction pattern analysis            │
│     → Review abuse detection                  │
│     → Up-Guard automated monitoring           │
└──────────────────────────────────────────────┘

CRITICAL RULE: AI advises → DMO/Platform confirms
AI NEVER makes final decisions alone.

AI WIDGET (on every page):
- Fixed bottom-right, always visible
- Text + voice input (Web Speech API)
- Contextual help based on current page
- Can navigate user to any section
- Shows STL status on request
```

### 16.9 Blockchain Integration — 3-Phase Plan

```
PHASE 1 — Binance Smart Chain (Current)
  → EHBGC as BEP-20 token
  → Basic transactions + coin locks
  → Smart contracts for escrow

PHASE 2 — Mosaic Blockchain (EHB Proprietary)
  → Permissioned/hybrid chain
  → Full STL audit trail
  → CRB certificate hash storage
  → Franchise validations

PHASE 3 — Polkadot Parachain (Full Decentralization)
  → Cross-chain bridges
  → True decentralized governance
  → International regulatory compliance

WHAT GOES ON-CHAIN:
- All financial transactions
- Coin lock/unlock events
- STL level changes
- CRB certificate hashes
- Franchise territory validations
- Merkle-batched hourly (reduce gas costs)

FLOW: User Action → DMO Validation → MongoDB state update → Blockchain record (async)
```

### 16.10 Complete Page Map & Content Architecture

```
GLOBAL LAYOUT (applies to ALL pages):
┌──────────────────────────────────────────────────────────┐
│  TOP BAR (sticky, always visible)                         │
│  [Logo] [Contextual Search] [Nav Tabs] [Theme] [Wallet]  │
├──────────────────────────────────────────────────────────┤
│  INDUSTRIES BAR (horizontal scroll, 32 industries)        │
├─────────┬────────────────────────────────────────────────┤
│ SIDEBAR │  PAGE CONTENT                                   │
│ (module │  (varies by page)                               │
│  pages) │                                                 │
├─────────┴────────────────────────────────────────────────┤
│  FOOTER                                                   │
└──────────────────────────────────────────────────────────┘
                                          [AI Widget ↗]

PAGE MAP:
/                          → Home (hero, featured industries, how-it-works)
/marketplace               → All services/products across 32 industries
/gosellr                   → GoSellr e-commerce (products, cart, checkout)
/gosellr/seller            → Seller dashboard (orders, analytics, inventory)
/gosellr/rider             → Rider dashboard (deliveries, earnings, routes)
/medical (wms)             → Doctors, clinics, appointments, prescriptions
/legal (ols)               → Lawyers, cases, documents, AI Lawyer
/education (hps)           → Courses, tutors, certifications, AI Tutor
/jobs (jps)                → Job listings, skill matching, AI Resume
/travel (agts)             → Flights, hotels, packages, bookings
/books (obs)               → Digital & physical books, publishers
/technology (sot)          → Web/app dev services, AI tools
/media (ehb-tube)          → Verified video platform
/machinery (hms)           → Industrial machinery services
/dmo                       → DMO Dashboard (governance overview)
/dmo/stl                   → STL Level management & ladder
/dmo/crb                   → CRB Certification & refill tracker
/dmo/pss                   → PSS KYC verification & trust scores
/dmo/wallet                → Wallet (balance, transactions, escrow)
/dmo/franchise             → Franchise management (hierarchy, territory)
/dmo/affiliate             → Affiliate/referral program
/dmo/complaints            → Complaint management queue
/dmo/analytics             → Platform-wide analytics
/profile                   → User profile (multi-role: buyer/seller/rider/franchise)
/onboarding                → First-time user flow (8 steps)
/settings                  → Account settings, theme, notifications
/ai                        → AI Marketplace (plugins, agents, tools)
```

### 16.11 How Different Roles Experience the Platform

```
BUYER EXPERIENCE:
- Sees: marketplace, products, STL badges, AI recommendations
- Actions: browse, buy, book, rate, refer
- Dashboard: orders, wallet, bookings, AI suggestions, STL progress

SELLER EXPERIENCE:
- Sees: seller dashboard, order queue, analytics, inventory
- Actions: list products, fulfill orders, manage store, view earnings
- Dashboard: active orders, revenue, wallet, conversion rate, STL level

RIDER EXPERIENCE:
- Sees: delivery dashboard, task queue, route map
- Actions: accept deliveries, navigate, confirm pickup/dropoff
- Dashboard: active tasks, earnings today, speed/customer/franchise ratings

FRANCHISE OWNER EXPERIENCE:
- Sees: territory dashboard, user growth, revenue, complaints
- Actions: onboard users, coordinate CRB inspections, resolve complaints
- Dashboard: territory map, performance KPIs, revenue split, compliance

ADMIN/DMO EXPERIENCE:
- Sees: governance dashboard, all module panels, fraud alerts
- Actions: approve/reject applications, enforce policies, manage STL
- Dashboard: 7 module panels (PSS/CRB/STL/GoSellr/Wallet/Franchise/Complaint)
```

### 16.12 Quality Guarantee by STL Level

| STL Level | Company Guarantees | Protection |
|-----------|-------------------|------------|
| FREE (L1) | Nothing — use at own risk | No protection |
| BASIC (L2) | Product quality | Basic replacement |
| NORMAL (L3) | Quality + correct pricing | Replacement + partial refund |
| STANDARD (L4) | Quality + delivery + pricing | Full refund within policy |
| ADVANCED (L5) | All above + fast resolution | Priority support |
| HIGH (L6) | All above + dedicated support | Premium protection |
| PRO (L7) | All above + insurance | Insured transactions |
| VIP (L8) | All above + personal manager | White-glove service |
| ELITE (L9) | All above + legal support | Full legal protection |
| SUPREME (L10) | Everything — zero risk | Complete guarantee |

### 16.13 Data Flow Architecture

```
COMPLETE DATA FLOW FOR A GOSELLR ORDER:

1. BUYER places order
   → Frontend: POST /api/orders/create
   → Validates: buyer STL, product STL, seller STL
   → Master rule: MIN(all STLs) determines protection level
   → Escrow: POST /api/wallet/escrow (locks payment)

2. SELLER receives notification
   → WebSocket push to seller dashboard
   → Seller accepts → status: IN_PROGRESS
   → Prepares product → calls rider

3. RIDER assigned
   → AI matches nearest available rider (STL-weighted priority)
   → Rider accepts → navigates to pickup
   → Confirms pickup → POST /api/delivery/pickup

4. DELIVERY in progress
   → Real-time tracking (GPS updates every 10s)
   → Buyer sees rider on map
   → Franchise monitors delivery timing

5. DELIVERY complete
   → Rider confirms → POST /api/delivery/complete
   → Buyer confirms receipt
   → Escrow released: POST /api/wallet/release

6. REVENUE DISTRIBUTION
   → Outer split: Seller 70%, Rider 10%, Franchise 10%, Platform 10%
   → Inner split (platform's 10%): Country 40%, Corporate 25%, Sub 20%, HQ 15%
   → All credits to respective wallets
   → Blockchain: transaction hash recorded

7. POST-ORDER
   → Buyer rates seller + rider (impacts their STL)
   → Complaint window opens (dispute period)
   → If complaint: DMO Up-Guard investigates
   → STL recalculated for all parties
   → CRB activity logged (toward refill requirements)
```

### 16.14 Open Questions Requiring Business Decisions

**Source:** `D:\ehb ui ux\EHB Questions.docx`

1. **Wallet:** Will earnings be paid to internal wallet first, or directly to bank/Easypaisa/JazzCash?
2. **Affiliate:** What are exact bonus amounts, level depth, percentage rates, abuse caps?
3. **Blockchain:** Is it required for MVP or Phase 2/3 only?
4. **AI Sophistication:** What level of AI is expected in first 3 months?
5. **Franchise Territory:** Are territories exclusive by city/region?
6. **Multi-Role:** How does the UI handle one person being buyer + seller + franchise owner simultaneously?
7. **Document Verification:** Manual admin, AI-assisted, or NADRA integration?
8. **Payment Gateway:** Stripe, Easypaisa, JazzCash — which for MVP?

---

## 18. Affiliate Program — Complete Structure

> **Added:** 2026-04-12 — from Google Docs upload

### Bonus Types
1. **Direct Bonus** — One-time on referral signup
2. **Indirect Bonus** — From indirect network activity
3. **Level Bonus** — 15 levels deep
4. **Rank & Reward** — Achievement-based rewards
5. **Promotion Bonus** — Promotional incentives
6. **Fast Bonus** — Early action rewards
7. **Franchise Installment System** — Installment payments for franchise booking

### Key Rules
- ALL percentages are admin-configurable (changeable anytime)
- Generation plan: unlimited legs/downlines
- One joining link per user (works for all programs)
- One-click attach affiliate to any new EHB service
- E-commerce affiliate: only verified companies/brands
- Company sets affiliate amount per product → system auto-distributes

### Wallet Structure (Affiliate)
| Wallet | Purpose | Transfer Rules |
|--------|---------|----------------|
| P-Wallet | Package earnings | No user-to-user ($1 fee if allowed) |
| E-Wallet | General earnings | User-to-user transfers OK |
| Level Wallet | Level bonus income | Transfer to E-Wallet only ($1 fee) |
| Auto Pool Wallet | Pool earnings | Transfer to E-Wallet only ($1 fee) |
| Main Wallet | Aggregated balance | Used for purchases, deposits, withdrawals |

### Fees
- P-Wallet → E-Wallet: $1
- Level Wallet → E-Wallet: $1
- Pool Wallet → E-Wallet: $1
- E-Wallet → Bank/USDT withdrawal: 5%

---

## 19. Franchise Booking — Detailed Flow

> **Added:** 2026-04-12 — from Google Docs upload

### Booking System
- 3 Rounds, after every 100 franchises sold → 20% price increase
- 3 Phases, 100 franchises per phase
- Promo system with start/end dates

### Post-Purchase Activation
1. After purchase → email sent with activation link
2. Owner generates security code
3. Code required to activate franchise + enable withdrawals
4. Without code: NO withdrawals possible

### Training Schedule
- Sub Franchise: Daily 10pm + Weekly Monday 10pm (via Master Franchise)
- Master Franchise: Weekly/monthly 11pm (via Corporate, admin-set)
- Seller: Daily/weekly (via Corporate or Company)

---

## 20. GoSellr Delivery Timer System

> **Added:** 2026-04-12 — from Google Docs upload

### Delivery Rules
- Timer starts after order packed
- Minimum: 5 minutes, Maximum: 30 minutes
- Seller gives ETA when accepting order
- Must leave shop within ETA → else franchise notification
- Buyer sees: rider profile + live Google Maps ETA
- Late delivery → franchise notified → calls rider → confirms new time to buyer

### Order Notifications (go to 3 parties)
1. Seller
2. Delivery Rider
3. Area Franchise
- If nobody picks up → franchise resolves or rejects
- If no franchise in area → forward to nearest franchise

### AI Auto Complaint System (Normal+ STL)
- Auto-complaints generated for: delay, non-delivery, wrong product, damaged, replacement needed
- Escalation: Store Owner → Sub Franchise → Brand Company (12hr) → Master Franchise

---

## 21. OLS — Online Law Services Detail

> **Added:** 2026-04-12 — from Google Docs upload

### Features (visible after 5000+ registered users)
- Filter: service type, city/nearby, category, STL level, country, price range
- Types: Licensed-based, Practice-based
- Contracts: Monthly, Yearly, Contract-based
- Daily office lawyer (set hours), Remote, Online consultant

### Lawyer Rules
- Free registration (FREE STL)
- Above FREE: must register with licensed lawyer OR provide own license
- Max 22 monthly clients per lawyer
- Minimum monthly fee: 25,000 PKR
- Registration duration: 6 months (then re-register/re-verify)
- 3 complaints → client shifted to different lawyer

### Fully Secure Service
- User pays full fee in advance → escrow holds
- Released to lawyer on case completion
- Refunded if not completed
- Requires BASIC+ profile

---

## 22. Seller Types & Registration

> **Added:** 2026-04-12 — from Google Docs upload

### 5 Seller Types
1. Company / Own Products
2. Dealer
3. Distributor
4. Trader
5. Store Owner

### Store Owner Registration Requirements
- PSS KYC verified
- Store info: area size, total products, start date, employees
- Minimum 10 store photos (inside + outside)
- Minimum 5 store videos
- Employee list with JPS IDs (auto-pull data)

### Stock Management
- Below 500 units → red warning
- Near empty → notification to owner + brand company + sub franchise
- Empty → auto notification to restock

---

## 23. Naming Legacy Reference

| Legacy Name | Current Name | First Used | Changed To |
|-------------|-------------|-----------|------------|
| SQL (Service Quality Level) | STL (Service Trust Level) | 2022 | 2026-04-11 |
| EDR (Exam Decision Registry) | CRB (Certification & Registry Board) | 2022 | 2026-04-11 |
| EMO (Easy Management Office) | DMO (Decentralized Management Office) | 2022 | 2026 |
| Ali Dad | GoSellr | 2022 | 2023 |

---

## 24. EHB AD System (Web 3.0 Verified Advertising)

**Concept:** Blockchain-backed verified advertisement platform with smart contract fee locking.

**Ad Verification Chain:** Ad Submission → Fee Lock (smart contract) → Physical Verification (Sub-Franchise, 1-month validity) → Ads Responsive Review (AI-assigned) → Ads Sub-Responsive 1 & 2 → Master Franchise + 10 JPS Experts (if needed) → Final Decision

**Fee Distribution:** Master Franchise 5%, Corporate 1%, Ads Dept 60%, JPS Reviewers 20%, EHB Company 14%

**Penalty for incorrect approvals:** 5% locked balance loss. Rejection requires resubmission within 7 days. One free resubmission after corrections.

---

## 25. GoSellr 7-Level Supply Chain Hierarchy

| Level | Type | Role |
|-------|------|------|
| 1 | Manufacturer/Company | Product creator, brand owner |
| 2 | Authorized Dealer | Direct from company, regional |
| 3 | Distributor | Large quantity, multi-dealer supply |
| 4 | Wholesaler | Bulk sales to retailers |
| 5 | Trader | Buy & sell, flexible sourcing |
| 6 | Storekeeper/Retailer | Direct to customer (main visible seller) |
| 7 | Online Seller | Virtual store, dropshipping |

**Multi-Level Pricing:** Base → +10% (Dealer) → +15% (Distributor) → +20% (Wholesaler) → +30% (Retailer)

**Dynamic pricing:** High STL = lower commission, Low STL = higher charges

**Store Types:** Single Store, Multi-Branch, Franchise Store, Virtual Store

**Order Commission Split:** Seller 70%, Company 10%, Franchise 10%, Affiliate 10%

---

## 26. Blockchain 5-Phase Roadmap (Detailed)

| Phase | Timeline | Focus | Key Tech |
|-------|----------|-------|----------|
| 1 | 2025 Q3 | Affiliate + Wallet + Order | BSC + Moonbeam + Polkadot |
| 2 | 2025 Q4 | Fine + Badge + NFT + EHBGC Launch | Polkadot + Subchain |
| 3 | 2026 Q1 | Validator + Staking + Governance | Mosaic Blockchain (Substrate) |
| 4 | 2026 Q2 | Cross-Chain Bridge + G6 Identity | Highway + G6 + Parachains |
| 5 | 2026-27 | AI + Blockchain Merge | Mosaic + Polkadot + AI Layer |

**Architecture:** EHB Core → Mosaic Galaxy (Base) → Parachain Layer → Mosaic Highway Relay (Decentralized) → Centralized Relay (Fast) → EHB Wallet

**Tokens:** EHBGC (main: payments, staking, governance), EHBSC (stablecoin: daily transactions, salary)

**Validators:** 2000-3000 planned, stake EHBGC to run node, earn transaction fees + block rewards

**Parachains:** GoSellr = Commerce Chain, JPS = Job Chain, STL = Trust Chain, Wallet = Finance Chain

---

## 27. Additional Industry Services (from ehb docs2)

### 27.1 AGTS (Advanced Global Traveling Services)
- Verified booking: Flights, Hotels, Transport, Tour Packages, Travel Agents
- STL-based access tiers (Free=view only → VIP=first class+global emergency)
- AI trip planner, multilingual AI translation, geo-based emergency button
- Backend: agts_users, agts_flights, agts_hotels, agts_agents, agts_tours, agts_bookings

### 27.2 EHB Tube (Verified Media Platform)
- AI + franchise verified video content platform
- Proof-based uploads, STL-tagged visibility, Watch-and-Earn model
- Monetization: Ad income + reward tokens + affiliate
- STL tiers: Free=2 videos/month → VIP=global spotlight+sponsor priority
- Backend: etube_users, etube_channels, etube_videos, etube_earnings

### 27.3 OBS (Online Book Store)
- Global book/educational content platform with AI libraries + blockchain copyright
- AI Book Reader (summary + Q&A + voice), Verified Author badges
- STL tiers: Free=previews → VIP=resell+global publish
- Institution libraries for schools
- Backend: obs_users, obs_books, obs_authors, obs_institutions

### 27.4 SOT (Services of Technology)
- Developer tool marketplace + tech service platform
- Verified tool uploads, project-based hiring (Upwork/Fiverr model)
- Code AI assistant, bug reporting center, tool version management
- STL tiers: Free=1 tool → VIP=unlimited+AI SEO+global sales

---

## 28. STL Governance Deep Model (from ehb docs2)

### Level Up Factors (Max Score Impact)
- PSS Verification: +40
- CRB Certification: +20
- Performance: +20
- Behavior: +20
- Reviews: +10
- Industry Verification: +10

### Level Down Penalties
| Action | Score Impact |
|--------|-------------|
| Fake product/fraud | -50 |
| Valid complaint | -10 |
| Late delivery | -5 |
| Order cancellation | -5 |
| Inactive 30 days | -5 |
| Inactive 60 days | -10 |
| Inactive 90 days | -20 |
| Failed inspection | -30 |

**Auto-downgrade:** STL < 40 → Auto L1 + Fraud Monitoring ON

### Complaint Lock System
- 1-2 complaints: Warning
- 3 complaints: Level Up Block (cannot upgrade STL)
- 5+ complaints: STL Drop
- Until ALL complaints resolved: No STL upgrade, premium features locked

### CRB Anti-Corruption Rotation
Different franchise assigned for each verification/refilling cycle. Same franchise never repeats consecutively. If no franchise in area → nearest area. If no franchise in country → STL locked at L1-L2.

---

## 29. 50+ Industry Master List (from ehb docs2 database schema)

**Core (6):** Education (EDU), Health (WMS), E-Commerce (GSM), Law (OLS), Jobs (JPS), Travel (AGTS)

**Lifestyle (8):** Real Estate, Automotive, Fashion, Beauty, Sports, Entertainment, Music, Food

**Technical (5):** Information Technology (SOT), Construction, Agriculture, Logistics, Manufacturing

**Professional (3):** Human Resource Management, Freelancing, Consulting

**Security (3):** Security Services, Telecom, Energy

**Social (4):** Environmental, Research, Non-Profit/NGO, Government

**Future (5):** Robotics, IoT, Biotechnology, Space Technology, Quantum Technology

**Total: 34+ industries (expandable to 50+ with sub-industries)**

**Structure:** Each industry → 3 categories (Basic, Advanced, Premium) → 20+ services per category = 700+ total services

---

## 30. Complete Bonus Types (19+ from Urdu docs)

1. Direct Referral (5%, instant)
2. Team Performance (8%, level-distributed)
3. Rank Achievement (2%, milestone-based)
4. Passive Income (3%, franchise lifetime)
5. Global Pool (2%, quarterly, 5% company profit shared)
6. Generational Wealth (2%, preserved for family, 5-year minimum)
7. Service-Based (2%, per sale)
8. Leadership (1%, mentoring)
9. Auto-Reinvestment (1% auto-reinvested)
10. Dynamic Level (2% at L10, 4% at L20)
11. AI Performance (AI-determined based on activity)
12. Education & Training ($50 per session)
13. Anniversary (1% extra per anniversary)
14. Product/Service-Specific (varies by industry)
15. DeFi Token Rewards (10 tokens per $100 commission)
16. Sustainability ($50 per 10 eco-actions)
17. AI Gamification (points for challenges)
18. Infinity (unlimited depth earning)
19. Lifetime Loyalty

---

## §31 — Complete Industries with Services & Microservices (50+)

> Every industry below runs on **14 shared EHB microservices** (stl-service, pss-integration-service, crb-integration-service, payment-service, wallet-service, review-rating-service, notification-service, analytics-service, ai-recommendation-service, dispute-service, affiliate-service, franchise-service, search-service, dmo-compliance-service). Only industry-specific services/microservices are listed per industry.

### 31.1 — GoSellr — powered by EHB (E-Commerce Marketplace)

**Services:** Product Listing & Catalog Management, 7-Level Seller Hierarchy (Manufacturer → Online Seller), Multi-Level Pricing Engine (+10% to +30%), Order Management System (OMS), Cart & Checkout, Payment Gateway (Fiat + Crypto), Delivery & Shipping Management, Returns & Refund Processing, Seller Dashboard & Analytics, Buyer Dashboard & Order Tracking.

**Microservices:** product-catalog-service, pricing-engine-service, inventory-service, order-service, cart-service, payment-service, shipping-service, review-rating-service, seller-onboarding-service, search-service, notification-service, dispute-service, analytics-service, trusty-wallet-routing-service.

### 31.2 — JPS — powered by EHB (Job Profile & Skill)

**Services:** Job Posting & Application, AI-Based Job Matching, Skill Assessment & Testing, Resume/CV Builder, Company Hiring Dashboard, Inspector Hiring & Training Pipeline, Freelancer Marketplace, Interview Scheduling.

**Microservices:** job-posting-service, application-service, ai-matching-service, skill-assessment-service, resume-service, company-dashboard-service, inspector-pipeline-service, freelancer-service, interview-service, notification-service, analytics-service.

### 31.3 — OLS — powered by EHB (Online Legal Services)

**Services:** Lawyer Directory & Search, Online Legal Consultation (Video/Chat), Document Drafting & Review, Case Management, Legal AI Assistant, Court Filing Assistance, Contract Generator, Dispute Resolution (ADR).

**Microservices:** lawyer-directory-service, consultation-service, document-service, case-management-service, legal-ai-service, court-filing-service, contract-generator-service, adr-service, billing-service, notification-service.

### 31.4 — WMS — powered by EHB (Worldwide Medical Services)

**Services:** Doctor Directory & Appointment Booking, Telemedicine (Video/Chat), E-Pharmacy & Medicine Delivery, Lab Test Booking & Results, AI Diagnosis Assistant, Medical Records (EHR), Hospital/Clinic Management, Emergency Services Locator.

**Microservices:** doctor-directory-service, appointment-service, telemedicine-service, pharmacy-service, lab-service, ai-diagnosis-service, ehr-service, hospital-management-service, emergency-service, insurance-service, notification-service.

### 31.5 — HPS/OBS — powered by EHB (Home & Online Book Store + Education)

**Services:** Book Catalog & E-Commerce, E-Book Reader & Library, Online Courses & LMS, Tutor Marketplace, AI Tutor Assistant, School/University Management, Student Dashboard, Certification & Exams.

**Microservices:** book-catalog-service, ebook-reader-service, course-service, lms-service, tutor-service, ai-tutor-service, school-management-service, exam-service, certification-service, content-service, notification-service.

### 31.6 — AGTS — powered by EHB (AI Global Travel System)

**Services:** Flight Booking & Comparison, Hotel Booking & Reviews, Tour Package Management, Visa Assistance & Processing, Travel Insurance, Car Rental & Transport, AI Travel Planner, Travel Guide & Recommendations.

**Microservices:** flight-service, hotel-service, tour-package-service, visa-service, insurance-service, transport-service, ai-planner-service, review-service, payment-service, notification-service.

### 31.7 — Finance & Banking — powered by EHB

**Services:** Digital Banking Dashboard, Loan & Credit Services, Investment Portfolio Management, Insurance Marketplace, Tax Filing & Advisory, Accounting & Bookkeeping, Payment Processing.

**Microservices:** account-service, loan-service, investment-service, insurance-marketplace-service, tax-service, accounting-service, payment-processing-service, kyc-service, analytics-service.

### 31.8 — Real Estate — powered by EHB

**Services:** Property Listing & Search, Virtual Property Tours, Rental Management, Property Valuation AI, Mortgage Calculator & Assistance, Agent/Broker Directory, Legal Documentation, Construction Progress Tracking.

**Microservices:** property-listing-service, search-service, rental-management-service, valuation-service, mortgage-service, agent-service, document-service, construction-service, notification-service.

### 31.9 — Consulting — powered by EHB

**Services:** Consultant Directory & Booking, Project Management Dashboard, Online Consultation (Video/Chat), Proposal & Contract Management, Business Analysis Tools, Industry-Specific Advisory.

**Microservices:** consultant-directory-service, booking-service, project-service, proposal-service, analytics-service, billing-service, communication-service.

### 31.10 — Construction & Infrastructure — powered by EHB

**Services:** Contractor & Builder Directory, Project Planning & Management, Material Procurement Marketplace, Architectural Design, Building Inspection & Quality, Equipment Rental, Workforce Management.

**Microservices:** contractor-service, project-management-service, procurement-service, design-service, inspection-service, equipment-service, workforce-service, document-service.

### 31.11 — Agriculture & Farming — powered by EHB

**Services:** Crop Marketplace (Farm to Table), Farm Equipment Marketplace, AI Crop Advisory, Weather & Soil Analytics, Livestock Management, Supply Chain Tracking, Agricultural Loans & Insurance.

**Microservices:** crop-marketplace-service, equipment-service, ai-advisory-service, weather-service, livestock-service, supply-chain-service, finance-service, analytics-service.

### 31.12 — Automotive — powered by EHB

**Services:** Vehicle Marketplace (New & Used), Spare Parts & Accessories, Workshop & Service Booking, Vehicle Insurance, Rental & Leasing, AI Vehicle Diagnostics, Driving School Integration.

**Microservices:** vehicle-listing-service, parts-service, workshop-service, insurance-service, rental-service, diagnostics-service, driving-school-service, review-service.

### 31.13 — Hospitality — powered by EHB

**Services:** Hotel & Resort Booking, Restaurant Reservation & Delivery, Event Venue Management, Catering Services, Hospitality Staff Hiring (JPS), Guest Experience Management, Tourism Package Integration.

**Microservices:** hotel-booking-service, restaurant-service, venue-service, catering-service, staff-service, guest-service, tourism-service.

### 31.14 — Fashion — powered by EHB

**Services:** Fashion Marketplace, Designer/Brand Directory, Custom Tailoring Platform, Fashion AI Stylist, Trend Analytics, Size Guide & Virtual Try-On, Sustainable Fashion Section.

**Microservices:** fashion-catalog-service, designer-service, tailoring-service, ai-stylist-service, trend-service, virtual-tryon-service, sustainability-service.

### 31.15 — Beauty & Cosmetics — powered by EHB

**Services:** Beauty Products Marketplace, Salon & Spa Booking, Beauty Professional Directory, Skin Analysis AI, Tutorial & Training Content, Subscription Boxes.

**Microservices:** product-catalog-service, salon-booking-service, professional-service, skin-analysis-service, content-service, subscription-service.

### 31.16 — Fitness & Wellness — powered by EHB

**Services:** Gym & Fitness Center Directory, Personal Trainer Marketplace, Workout & Diet Planning AI, Wellness Product Shop, Mental Health & Meditation, Health Tracking Integration.

**Microservices:** gym-directory-service, trainer-service, workout-service, diet-service, wellness-shop-service, mental-health-service, health-tracking-service.

### 31.17 — Food & Beverages — powered by EHB

**Services:** Restaurant Delivery & Ordering, Grocery Marketplace, Recipe & Cooking Platform, Food Catering, Food Truck & Street Food Directory, Cloud Kitchen.

**Microservices:** restaurant-ordering-service, grocery-service, recipe-service, catering-service, food-truck-service, cloud-kitchen-service, delivery-service, review-service.

### 31.18 — Pets & Animals — powered by EHB

**Services:** Pet Marketplace (Buy/Adopt), Vet Directory & Booking, Pet Products & Food Shop, Pet Grooming & Boarding, Pet Insurance, Lost & Found Pet Network.

**Microservices:** pet-marketplace-service, vet-service, pet-shop-service, grooming-service, boarding-service, insurance-service, lost-found-service.

### 31.19 — Weddings & Events — powered by EHB

**Services:** Event Planning & Management, Vendor Marketplace (Venues, Caterers, Decorators), Wedding Planning AI, Photography & Videography Booking, Invitation & RSVP Management, Budget Planning Tool.

**Microservices:** event-planning-service, vendor-marketplace-service, ai-planner-service, photography-service, invitation-service, budget-service, venue-service.

### 31.20 — Home & Garden — powered by EHB

**Services:** Home Services Marketplace (Plumber, Electrician, etc.), Furniture & Decor Shop, Interior Design Platform, Garden & Landscaping, Smart Home Products, Home Renovation Management.

**Microservices:** home-service-marketplace, furniture-shop-service, interior-design-service, garden-service, smart-home-service, renovation-service.

### 31.21 — Art & Crafts — powered by EHB

**Services:** Art Marketplace (Original & Prints), Artist Directory & Commission, Craft Supplies Shop, Art Classes & Workshops, Art Gallery & Exhibition Platform, NFT Art Integration.

**Microservices:** art-marketplace-service, artist-service, supplies-shop-service, classes-service, gallery-service, nft-service.

### 31.22 — SOT — powered by EHB (School of Technology)

**Services:** Tech Course Marketplace, Coding Bootcamps, Certification Programs, AI/ML Training, Tech Mentor Matching, Hackathon & Competition Platform, Corporate Training.

**Microservices:** course-service, bootcamp-service, certification-service, ai-training-service, mentor-service, hackathon-service, corporate-service.

### 31.23 — EHB Tube — powered by EHB (Video Platform)

**Services:** Video Upload & Streaming, Content Creator Dashboard, Monetization & Ad System, Live Streaming, Video Courses Integration, Community & Comments.

**Microservices:** video-service, creator-dashboard-service, monetization-service, live-stream-service, course-integration-service, community-service, recommendation-service, moderation-service.

### 31.24 — Entertainment — powered by EHB

**Services:** Event Ticketing & Booking, Movie/Show Streaming, Entertainment Venue Directory, Artist & Performer Booking, Fan Community Platform.

**Microservices:** ticketing-service, streaming-service, venue-service, artist-booking-service, community-service.

### 31.25 — Media & Publishing — powered by EHB

**Services:** News & Article Platform, Digital Publishing Tools, Author & Writer Marketplace, Print-on-Demand, Content Syndication, Journalism & Reporting Tools.

**Microservices:** news-service, publishing-service, writer-marketplace-service, print-service, syndication-service, journalism-service.

### 31.26 — Music & Audio — powered by EHB

**Services:** Music Streaming Platform, Artist & Band Profiles, Music Production Marketplace, Podcast Hosting & Distribution, Music Equipment Shop, Event & Concert Management.

**Microservices:** streaming-service, artist-service, production-service, podcast-service, equipment-shop-service, concert-service.

### 31.27 — Gaming & Esports — powered by EHB

**Services:** Game Marketplace (Digital), Esports Tournament Platform, Gaming Community & Social, Game Streaming Integration, Gaming Hardware Shop, Game Development Resources.

**Microservices:** game-marketplace-service, tournament-service, community-service, streaming-service, hardware-shop-service, dev-resources-service.

### 31.28 — Sports & Athletics — powered by EHB

**Services:** Sports Equipment Marketplace, Coaching & Training Platform, Sports Event Management, Athlete Profiles & Scouting, Sports Venue Booking, Fantasy Sports & Predictions.

**Microservices:** equipment-service, coaching-service, event-service, athlete-service, venue-service, fantasy-service.

### 31.29 — Energy & Utilities — powered by EHB

**Services:** Solar & Renewable Energy Marketplace, Utility Bill Management, Energy Audit & Consulting, EV Charging Station Network, Smart Meter Integration, Energy Trading Platform.

**Microservices:** solar-service, bill-management-service, audit-service, ev-charging-service, smart-meter-service, trading-service.

### 31.30 — Telecom — powered by EHB

**Services:** Mobile Plan Comparison & Switching, Internet Service Marketplace, Device Marketplace, Telecom Business Solutions, Network Coverage Checker, Customer Support AI.

**Microservices:** plan-comparison-service, isp-service, device-service, business-service, coverage-service, support-service.

### 31.31 — Manufacturing — powered by EHB

**Services:** B2B Manufacturing Marketplace, Factory & Equipment Directory, Supply Chain Management, Quality Control Platform, Raw Material Sourcing, Custom Manufacturing Orders.

**Microservices:** b2b-marketplace-service, factory-directory-service, supply-chain-service, quality-service, material-sourcing-service, custom-order-service.

### 31.32 — Logistics — powered by EHB

**Services:** Shipping & Freight Marketplace, Warehouse Management, Fleet Management, Last-Mile Delivery Network, Customs & Documentation, Route Optimization AI.

**Microservices:** shipping-service, warehouse-service, fleet-service, last-mile-service, customs-service, route-service.

### 31.33 — Government Services — powered by EHB

**Services:** E-Government Portal Integration, Document Processing & Verification, Public Complaint System, Citizen Services Directory, Government Job Portal (JPS), Public Tender & Procurement.

**Microservices:** document-service, verification-service, complaint-service, services-directory, tender-service.

### 31.34 — NGO & Non-Profit — powered by EHB

**Services:** Donation & Fundraising Platform, Volunteer Management, Project Impact Tracking, Transparency & Reporting, Community Engagement Tools.

**Microservices:** donation-service, volunteer-service, project-service, transparency-service, community-service.

### 31.35 — Security Services — powered by EHB

**Services:** Security Guard Marketplace, CCTV & Surveillance Solutions, Cybersecurity Services, Access Control Systems, Security Audit & Consulting, Emergency Response System.

**Microservices:** guard-service, surveillance-service, cyber-service, access-control-service, audit-service, emergency-service.

### 31.36 — Space & Aerospace — powered by EHB

**Services:** Satellite Services Marketplace, Aerospace Parts Procurement, Space Education, Drone Services, Aerial Survey Booking.

**Microservices:** satellite-service, parts-procurement-service, education-service, drone-service, aerial-survey-service.

### 31.37 — Insurance — powered by EHB

**Services:** Policy Comparison, Claim Management, AI Risk Assessment, Agent Directory, Digital Policy Issuance.

**Microservices:** policy-comparison-service, claim-service, risk-assessment-service, agent-service, policy-issuance-service.

### 31.38 — Pharmacy — powered by EHB

**Services:** Online Pharmacy, Prescription Management, Medicine Delivery, Drug Interaction Checker, Pharmacy Directory.

**Microservices:** pharmacy-catalog-service, prescription-service, delivery-service, interaction-checker-service, directory-service.

### 31.39 — Cleaning Services — powered by EHB

**Services:** Home Cleaning Booking, Commercial Cleaning, Laundry Services, Pest Control, Disinfection Services.

**Microservices:** home-cleaning-service, commercial-cleaning-service, laundry-service, pest-control-service, disinfection-service.

### 31.40 — Transportation — powered by EHB

**Services:** Ride-Hailing, Bus/Train Booking, Cargo Transport, Vehicle Pooling, Route Planning.

**Microservices:** ride-service, public-transport-service, cargo-service, pooling-service, route-planning-service.

### 31.41 — Childcare & Parenting — powered by EHB

**Services:** Daycare Directory, Babysitter Booking, Parenting Courses, Child Health Tracking, Toy & Kids Marketplace.

**Microservices:** daycare-service, babysitter-service, courses-service, health-tracking-service, kids-marketplace-service.

### 31.42 — Senior Care — powered by EHB

**Services:** Elderly Care Services, Nursing Home Directory, Home Health Aide Booking, Medical Alert Systems, Companionship Services.

**Microservices:** care-service, nursing-home-service, aide-booking-service, alert-service, companionship-service.

### 31.43 — Freelancing — powered by EHB

**Services:** Freelancer Marketplace, Project Bidding, Milestone Payments, Portfolio Showcase, Client Management.

**Microservices:** freelancer-marketplace-service, bidding-service, milestone-payment-service, portfolio-service, client-management-service.

### 31.44 — Printing & Signage — powered by EHB

**Services:** Print-on-Demand, Business Card/Banner Design, Signage Installation, Custom Merchandise, Packaging Design.

**Microservices:** print-service, design-service, signage-service, merchandise-service, packaging-service.

### 31.45 — Recycling & Waste — powered by EHB

**Services:** Waste Collection Scheduling, Recycling Marketplace, E-Waste Management, Composting Services, Environmental Consulting.

**Microservices:** waste-collection-service, recycling-marketplace-service, ewaste-service, composting-service, consulting-service.

### 31.46 — Language & Translation — powered by EHB

**Services:** Translation Marketplace, Interpreter Booking, Language Courses, AI Translation, Document Localization.

**Microservices:** translation-service, interpreter-service, language-course-service, ai-translation-service, localization-service.

### 31.47 — Photography — powered by EHB

**Services:** Photographer Booking, Photo Editing Services, Stock Photo Marketplace, Printing Services, Studio Rental.

**Microservices:** photographer-service, editing-service, stock-photo-service, printing-service, studio-service.

### 31.48 — Moving & Storage — powered by EHB

**Services:** Moving Company Comparison, Packing Services, Storage Unit Rental, Furniture Assembly, International Relocation.

**Microservices:** moving-service, packing-service, storage-service, assembly-service, relocation-service.

### 31.49 — Coworking & Office — powered by EHB

**Services:** Coworking Space Booking, Virtual Office, Meeting Room Rental, Office Supplies, Office Design Services.

**Microservices:** coworking-service, virtual-office-service, meeting-room-service, supplies-service, office-design-service.

### 31.50 — Handyman Services — powered by EHB

**Services:** Home Repair Booking, Appliance Installation, Plumbing/Electrical, Painting, Carpentry.

**Microservices:** repair-service, installation-service, plumbing-electrical-service, painting-service, carpentry-service.

### 31.51 — 14 Shared EHB Microservices (Common to ALL Industries)

Every industry above automatically includes these platform-wide microservices:

1. **stl-service** — Industry-specific STL scoring & level management (STL — EHB Department)
2. **pss-integration-service** — User/business verification (PSS — EHB Department)
3. **crb-integration-service** — Physical inspection & certification (CRB — EHB Department)
4. **payment-service** — Fiat + EHBGC coin payment processing (Wallet — EHB Department)
5. **wallet-service** — Trusty wallet, locked/free balance, escrow (Wallet — EHB Department)
6. **review-rating-service** — User reviews & star ratings
7. **notification-service** — Push, email, SMS notifications
8. **analytics-service** — Dashboard & reporting per industry
9. **ai-recommendation-service** — AI-based suggestions & personalization (AI — EHB Department)
10. **dispute-service** — Complaint handling & resolution (DMO — EHB Department)
11. **affiliate-service** — Referral tracking & bonus calculation (Affiliate — EHB Department)
12. **franchise-service** — Franchise area management & order routing (Franchise — EHB Department)
13. **search-service** — Full-text search with filters & AI
14. **dmo-compliance-service** — Governance & policy enforcement (DMO — EHB Department)

---

## Changelog

| Date       | Author | Change |
|------------|--------|--------|
| 2026-04-11 | Claude | v1.0 — initial merge of `docs/EHB_CONTEXT.md`, `docs/development/EHB_DMO_PLAN.md`, `docs/architecture/dmo-master-architecture.md`, `docs/architecture/dmo-blueprint.md`, `docs/architecture/dmo-data-flow.md`, `docs/architecture/dmo-global-data-flow.md`, `docs/architecture/dmo-ai-decision-engine.md`, `docs/architecture/dmo-bank-level-security.md`, `docs/database/dmo-master-database.md`, `docs/ui-ux/dmo-admin-system.md`, `docs/flows/FLOW-P3-dmo-governance.md`, `docs/ehb-dmo-and-home-data-snapshot.md`, `docs/ehb-info/EHB_stl 0.md`, `CLAUDE.md`, `design-system/EHB-UIUX-SYSTEM.md` into one re-structured master file. Added §14 advanced planning suggestions. |
| 2026-04-11 | Claude | v1.1 — Batch-1 merge (see `departments/DMO.md §22`). §4.3 flagged STL 9↔10 contradiction + added master MIN rule `MIN(product, seller, company, owner)`. |
| 2026-04-11 | Claude | v1.2 — **Batch-2 merge** (13 uploaded `.md` files). §4.3 replaced with canonical 10-level ladder + coin lock minimums. §15 departments index expanded — 11 of 13 department files now live under `ehb-info/departments/` (DMO v1.2, STL/PSS/CRB/Wallet/Blockchain/GoSellr/Franchise/Finance/Affiliate/Industries each v1.0). Only JPS + AI Department remain pending. |
| 2026-04-12 | Claude | v2.1 — **Google Docs batch.** Added §18 Affiliate Program (15-level, 7 bonus types, wallet structure, fees), §19 Franchise Booking (rounds/phases/activation flow), §20 GoSellr Delivery Timer (5-30min, AI auto-complaint), §21 OLS Law Services (lawyer registration, 22 client limit, escrow), §22 Seller Types & Registration (5 types, stock management). Updated `uploaded-information.md` with PART 22 (9 uploaded .docx files + pasted Google Docs text). |
| 2026-04-12 | Claude | v2.0 — **MASTER PLAN Edition.** Collected ALL information from 7 folders (D:\EHB 1, D:\EHB, D:\ehb ui ux, Downloads\ehb .md file, Downloads\ehb-global-ai-marketplace, Downloads\ui design example, EHB DEVELOPMENT 2026 project). Added §16 Master Plan (company legal identity, big picture diagram, complete user journey, franchise flow, revenue model, GoSellr complete flows, trust-based economy, AI department, blockchain 3-phase plan, page map, role experiences, STL guarantees, data flow architecture, open questions). Added §17 naming legacy reference. Created `ehb-info/uploaded-information.md` with raw collected data. |

---

| 2026-04-12 | Claude | v2.2 — **ehb docs2 batch (43 files).** Added §24 EHB AD System (Web 3.0 verified advertising), §25 GoSellr 7-Level Supply Chain, §26 Blockchain 5-Phase Roadmap (detailed), §27 Industry Services (AGTS, EHB Tube, OBS, SOT), §28 STL Governance Deep Model (level up/down factors, complaint lock, CRB rotation), §29 50+ Industry Master List, §30 Complete Bonus Types (19+). Updated `uploaded-information.md` with PART 22 (ehb docs2 batch). |

---

| 2026-04-13 | Claude | v2.3 — **Industries Deep Dive.** Added §31 Complete Industries with Services & Microservices (50 industries + 14 shared platform microservices). Each industry includes core services list and specific microservices breakdown. Updated `uploaded-information.md` with PART 23 (same data). Naming convention applied: industries use "powered by EHB", departments use "EHB Department". |

---

*EHB Technologies (Pvt.) Ltd. — master brief · v2.3 · 2026-04-13 · Master Plan + ehb docs2 + Industries Edition*
