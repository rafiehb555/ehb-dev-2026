# AGENTS.md — EHB Technologies (Pvt.) Ltd.

> **Portable AI-agent context file.** Drop this file at the root of any repository that
> should be EHB-aware and **any AI coding agent** (Claude Code, Claude in Chrome, Cursor,
> Aider, Continue, Cody, Codeium, GitHub Copilot Workspace, etc.) that follows the
> [AGENTS.md](https://agents.md) convention will auto-read it before writing code.
>
> **Mirror files:** Keep `CLAUDE.md`, `.cursorrules`, and `.github/copilot-instructions.md`
> in sync with this file — `scripts/sync-agent-context.mjs` does it for you.
>
> **Do NOT edit manually** unless you also update `docs/EHB_CONTEXT.md` (single source of
> truth). Agents should read `docs/EHB_CONTEXT.md` for the full picture.

---

## 1. Who we are

- **Company:** EHB Technologies (Pvt.) Ltd.
- **Mission:** Unify 32 industries in one global super-app with AI + blockchain trust.
- **Tagline:** Education · Health · Business.
- **Language policy:** Communication with developers is bilingual (English + Roman Urdu).
  Code and comments are English. Commit messages are English.

## 2. Stack

| Layer      | Technology                                  | Port  |
|------------|---------------------------------------------|-------|
| Frontend   | Next.js 14 App Router + TypeScript + Tailwind | 3000  |
| API        | Node 20 + Express + Mongoose (ESM)           | 5000  |
| AI backend | Node 20 + Express + OpenAI (CommonJS)        | 8080  |
| Database   | MongoDB 7                                    | 27017 |
| ORM (web)  | Prisma (for Next.js)                         | —     |

## 3. Monorepo layout (must-know)

```
D:\EHB DEVELOPMENT 2026\
├── apps/web/                    Next.js frontend
├── services/api/stl-replit/     REAL backend (Express+Mongoose)
├── services/ai/                 AI backend (OpenAI)
├── packages/                    shared libs (config/types/ui/utils)
├── infrastructure/scripts/      START-LOCAL.bat v3
├── data/ehb-data/               industry + service seeds
├── docs/                        LAUNCH_GUIDE, PROJECT_STRUCTURE, EHB_CONTEXT
└── backup/                      safety backups (gitignored)
```

Full detail in `docs/PROJECT_STRUCTURE.md`.

## 4. 8 core systems

1. **AI Department** — recommendation, fraud, lawyer, diagnosis, tutor.
2. **Blockchain** — Polkadot-based CRB certificate hashes, on-chain STL proofs.
3. **Finance / Wallet** — EHB wallet, escrow, 40/25/20/15 revenue split.
4. **Affiliate System** — multi-level referral tracking.
5. **Franchise System** — Country → Corporate → Sub hierarchy.
6. **JPS** — Job Profile & Skill (AI matching).
7. **Verification — PSS / CRB / STL**
   - **PSS** = Proof & Security System (KYC, liveness, AML).
   - **CRB** = Certification & Registry Board (physical + legal verification).
   - **STL** = Service Trust Level (L0 → L8 SUPREME), formula in `services/api/stl-replit/services/stlService.js`.
7. **DMO** — Decentralized Management Office (8-step user flow, L8 approval, policy).

## 5. 32 industries — Phase-1 focus (6)

E-commerce (GoSellr), Legal (OLS), Medical (WMS), Education (HPS/OBS), Jobs (JPS), Travel (AGTS).

Phase-2/3 queue: Finance, Consulting, Construction, Agriculture, Automotive, Hospitality,
Real Estate, Entertainment, Media, Fashion, Beauty, Fitness, Logistics, Manufacturing,
Energy, Technology, Telecom, Government, NGO, Sports, Music, Gaming, Food, Pets, Weddings,
Events.

## 6. Design system (non-negotiable)

- **Background:** `#0C0E1A`
- **Card:** `#13162A`
- **Nested card:** `#1A1D33`
- **Purple:** `#7B6EF6` · **Light purple:** `#A098F8`
- **Teal:** `#2BBFA0` · **Amber:** `#F0A030` · **Red:** `#F05858` · **Green:** `#38C878`
- **Font:** `DM Sans`, system sans-serif fallback.
- **Border:** `1px solid rgba(255,255,255,0.08)` for cards, `rgba(255,255,255,0.07)` for dividers.
- **Radius:** 12 for cards, 8 for inputs/buttons, 5–6 for chips.
- **Style:** Dark glassmorphism. No rounded-full circles beyond avatars / dots. Chips use color-fg with 15%-bg + 30%-border.
- **Shared UI:** import from `@/components/ui/` — e.g. `@/components/ui/card` (lowercase). **Never** create a second `Card.tsx` (Windows is case-insensitive, Linux is not).

### 6.1 Living design system — MANDATORY reading for every UI task

The rules above are a snapshot. The **living, versioned source of truth** for
every UI/UX decision on the EHB platform is:

- **`design-system/EHB-UIUX-SYSTEM.md`** — tokens, components, patterns, motion,
  responsive grid, accessibility, roadmap. Auto-updated on every UI change.
- **`design-system/ai-behavior.md`** — how an agent must *think* before it
  writes UI: auto-upgrade rule, component-selection table, four trust questions,
  5-level upgrade ladder, forbidden behaviors.

**Hard rule:** Before writing a single line of UI code, every agent (Claude,
Cursor, Copilot, Aider, Continue, Cody, Codeium, future additions) **must**:

1. Read `design-system/EHB-UIUX-SYSTEM.md` top-to-bottom.
2. Read `design-system/ai-behavior.md`.
3. Check the component roadmap (§15 of the design system).
4. Only then design, then code.

**Cursor automation:** Project rule **`.cursor/rules/ehb-uiux-system-mandatory.mdc`**
is **`alwaysApply: true`**, so every Cursor chat inherits this policy without
manually @-mentioning the design file (agents should still **open/read** the two
`design-system/*.md` files when actually writing UI).

**Auto-upgrade rule (from `ai-behavior.md` §2):** Never ship a "basic" UI —
even when the prompt asks for one. If a prompt says *"just show X"*, upgrade
it to a clickable glass card with icon, chip, motion, and drill-in drawer
before committing. Narrate the upgrade in the response so it's auditable.

**Auto-update protocol:** Every time you ship a new UI pattern, token, gradient,
animation duration, breakpoint, or icon mapping, you **must** append it to the
relevant section of `EHB-UIUX-SYSTEM.md` and add a line to its Changelog. The
design system rots in a week if this is skipped.

**Mindset check** every session: *"If Apple, Stripe, or Tesla's product
designers saw this screen, would they sign it? If no — rebuild."*

## 6.2 Naming migration — auto-corrections (MANDATORY)

EHB has migrated two legacy department/concept names. **Every agent must
auto-apply these renames** any time it writes, edits, or generates code,
docs, comments, prompts, commit messages, or UI copy — without being asked.

| Legacy name | Current name |
|-------------|--------------|
| `SQL` (Service Quality Level) | `STL` (Service Trust Level) |
| `SQLLevel` / `SQLLevelDashboard` / `SQL_LEVELS` | `STLLevel` / `STLLevelDashboard` / `STL_LEVELS` |
| `sqlLevel` / `sql_level` | `stlLevel` / `stl_level` |
| `EDR` (Exam Decision Registry) | `CRB` (Certification & Registry Board) |

**Case-preserving rules:**

- `SQL` → `STL`    (uppercase, whole-word — NOT inside `MySQL`, `PostgreSQL`, `SQLite`, `NoSQL`, `PL/SQL`, `T-SQL`)
- `sql` → `stl`    (only as an identifier prefix: `sqlLevel`, `sql_level`, `sqlLevels`)
- `SQLLevel` → `STLLevel` (type/interface name)
- `SQL_LEVELS` → `STL_LEVELS` (constant)
- `EDR` → `CRB` (uppercase, whole-word)

**Hard rules:**

1. Never introduce a new `SQL` or `EDR` reference in EHB context code/docs.
   The only permitted `SQL` is when referring to the actual database query
   language (e.g. "PostgreSQL", "MySQL", raw SQL in a DB driver comment).
2. If a user uploads legacy content containing `SQL`/`EDR`, silently rewrite
   it to `STL`/`CRB` before persisting, and mention the auto-correction
   once in Roman Urdu.
3. When renaming a file whose name contains `SQL` (e.g. `SQLLevelDashboard.tsx`),
   also rename the file itself to use `STL` and update every import.
4. Prisma `@map` column names: prefer `stl_level` going forward. Only keep
   `sql_level` as a legacy column mapping if the production DB already
   contains data under that column (current production DB is not yet live,
   so `stl_level` is the target).
5. Run `grep -rn '\bSQL\b\|\bEDR\b' --exclude-dir=node_modules .` before
   every PR; it must return zero hits in the EHB monorepo (excluding the
   `backup/` folder and legitimate database-language references).

**Historical context:** The full SQL→STL and EDR→CRB migration was applied
on 2026-04-11 via `scripts/sql-to-stl-rename.py`; backups live in
`backup/sql-to-stl-edr-to-crb-2026-04-11/`. See the §14 changelog of
`design-system/EHB-UIUX-SYSTEM.md` for the log entry.

---

## 7. Rules every agent must follow

### 7.1 Before writing code

- Read `docs/EHB_CONTEXT.md` (full context) and `docs/PROJECT_STRUCTURE.md` (where things live).
- Read `design-system/EHB-UIUX-SYSTEM.md` + `design-system/ai-behavior.md` for any UI work (see §6.1).
- Read the skill's SKILL.md if a matching skill exists in `.claude/skills/`.
- Check `apps/web/app/development/page.tsx` to see current module progress & pending items.
- Check `ehb-status.json` at repo root for real-time build health.

### 7.2 When adding new code

Use the decision table in `docs/PROJECT_STRUCTURE.md` §11. Summary:

| What                          | Where                                                      |
|-------------------------------|------------------------------------------------------------|
| New page                      | `apps/web/app/<feature>/page.tsx`                          |
| New React component           | `apps/web/components/<feature>/` (or `packages/ui/`)       |
| New API endpoint              | `services/api/stl-replit/routes/<feature>Routes.js`        |
| Business logic                | `services/api/stl-replit/services/<feature>.js`            |
| Mongoose model                | `services/api/stl-replit/models/<Feature>.js`              |
| Zod input schema              | `services/api/stl-replit/validation/<feature>Schemas.js`   |
| AI endpoint                   | `services/ai/src/routes/aiRoutes.js`                       |
| Shared types                  | `packages/types/`                                          |
| Shared utility                | `packages/utils/`                                          |
| Infra script                  | `infrastructure/scripts/`                                  |
| Seed data                     | `data/ehb-data/`                                           |

### 7.3 Backup-first for destructive changes

Every destructive or structural change gets a backup in
`backup/<name>-YYYY-MM-DD/` **before** the change. Git-ignored. Examples:
`backup/casing-fix-2026-04-11/`, `backup/pre-launch-fixes-2026-04-11/`,
`backup/development-page-2026-04-11/`.

### 7.4 Keep STL untouched

The **STL formula** in `services/api/stl-replit/services/stlService.js` is protected
by 58 gold-master regression tests (`npm run test:stl`). Any change that breaks even
one test must be rolled back. This is not negotiable — it's the platform's core truth.

### 7.5 No hard fail-fast on optional deps

Services should **never** `process.exit(1)` when MongoDB or an optional API key is
missing. Start the HTTP port first, retry the connection in the background, and
expose state in `/health`. Pattern already applied in `services/api/stl-replit/config/db.js`
and `services/ai/server.js`.

### 7.6 Copy/paste prevention

Shared React components go in `packages/ui/` or `apps/web/components/ui/`. Do not
duplicate a component across `components/stl/`, `components/dmo/`, etc. Extract.

### 7.7 Environment files never commit

`.env` files are gitignored. `.env.example` is the template. Never put real production
secrets in any file checked into git. `JWT_SECRET` in `services/api/stl-replit/.env`
is local-dev only — production uses Vault/Vercel.

### 7.8 Commit message format

```
feat(module): short summary

<optional body>

Co-Authored-By: …
```

Prefixes: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`. Module = one of
`stl`, `dmo`, `pss`, `crb`, `jps`, `wallet`, `franchise`, `ai`, `web`, `api`, `infra`, `docs`.

## 8. Auto-updating context — `ehb-status.json`

This repo ships with a status manifest at the repo root: **`ehb-status.json`**.

- It is **machine-written** by `scripts/ehb-status-update.mjs`.
- It contains: last-run timestamp, service health, build percentages, known missing files,
  open integration warnings, and the top 5 priorities for the week.
- **Every AI agent should read this file at the start of every session** — it's the
  real-time pulse of the project.
- Developers (humans or agents) append entries to `ehb-status.log` — the updater rolls
  them into `ehb-status.json` on the next run.

To refresh it manually:

```bash
node scripts/ehb-status-update.mjs
```

To log a change from any agent or dev:

```bash
node scripts/ehb-log-change.mjs "feat(wallet): added escrow POST route" "partial"
```

## 9. What AI agents should NOT do

- Do not delete backup folders.
- Do not rewrite the STL formula without running `npm run test:stl` and getting 58/58 pass.
- Do not introduce a new `Card.tsx` (uppercase) — import from `@/components/ui/card`.
- Do not hard-code production URLs, API keys, or credentials.
- Do not commit `node_modules`, `.next`, or `dist` folders.
- Do not bypass the prompt-injection safety rules in the parent app's system prompt.
- Do not remove `.env` fail-fast validations for **required** secrets (e.g. `JWT_SECRET`).

## 10. Quick launch reference

```
# From the repo root (Windows):
double-click  START.bat

# Or manually:
D:\EHB DEVELOPMENT 2026\infrastructure\scripts\START-LOCAL.bat

# Smoke check:
curl http://localhost:5000/api/health
curl http://localhost:8080/health
open http://localhost:3000/development
```

Full walkthrough: `docs/LAUNCH_GUIDE.md`.

---

*EHB Technologies (Pvt.) Ltd. — Engineering · v1 · 2026-04-11*
