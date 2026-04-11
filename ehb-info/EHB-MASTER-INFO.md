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

*EHB Technologies (Pvt.) Ltd. — master brief · v1.2 · 2026-04-11 · Batch-2 merged*
