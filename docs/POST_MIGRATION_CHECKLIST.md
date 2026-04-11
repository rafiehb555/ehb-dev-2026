# EHB 2026 — Post-Migration Verification Checklist

**Use this checklist AFTER the monorepo restructure on 2026-04-11.**
**Do not mark a step done until it actually passes.**

Company: EHB Technologies (PVT LTD)
Related: [MIGRATION_REPORT.md](./MIGRATION_REPORT.md)

---

## Phase 0 — Pre-Verification (safety)

- [ ] **Git backup exists**
      `git branch --list "backup/pre-restructure-2026-04-11"` returns the branch
- [ ] **Git tag exists**
      `git tag --list "pre-restructure-baseline"` returns the tag
- [ ] **Backup folder exists**
      `ls backup/` shows `BACKUP_README.md`, `configs/`, `legacy/`
- [ ] **Auto-GitHub-Sync scheduled task is DISABLED**
      Open Task Scheduler → locate "EHB Auto GitHub Sync" → Disable
      _(This is critical — do not run any other step until done.)_
- [ ] **Empty `backend/` shell** at root removed (or acknowledged)
      Issue #1 in MIGRATION_REPORT. Delete via Windows Explorer if desired.

---

## Phase 1 — Frontend (Next.js) smoke test

Location: `apps/web/`

- [ ] `cd apps/web && npm install` completes without errors
- [ ] `npm run lint` passes (or shows only pre-existing warnings)
- [ ] `npx tsc --noEmit` — no **new** TypeScript errors vs baseline
- [ ] `npm run dev` starts on port 3000
- [ ] `http://localhost:3000/` — landing page renders
- [ ] `http://localhost:3000/dashboard` — dashboard renders
- [ ] `http://localhost:3000/ai-marketplace` — AI marketplace renders
- [ ] `http://localhost:3000/industries` — industries list renders
- [ ] `http://localhost:3000/franchise` — franchise page renders
- [ ] `http://localhost:3000/dmo` — DMO system renders
- [ ] `npm run build` succeeds (production build)
- [ ] Browser console shows no **new** runtime errors vs baseline

## Phase 2 — API Backend (Express) smoke test

Location: `services/api/`

- [ ] `cd services/api && npm install` completes without errors
- [ ] `npm run dev` starts (nodemon) on the configured port
- [ ] `GET /health` (or equivalent) returns 200 OK
- [ ] MongoDB connection logs show "connected"
- [ ] `npm start` (production mode) also starts without crash

## Phase 3 — AI Backend smoke test

Location: `services/ai/`

- [ ] `cd services/ai && npm install` completes
- [ ] `node server.js` or `npm run dev` starts
- [ ] AI server responds to a ping endpoint
- [ ] No missing module errors

## Phase 4 — STL system integration test

_STL is one of EHB's core 5 systems (PSS, CRB, STL, DMO, JPS)._

- [ ] `apps/web/modules/core/stl/` exists and is untouched
- [ ] STL UI routes respond:
      - [ ] `http://localhost:3000/stl` (if present)
      - [ ] STL-related widgets load in dashboard
- [ ] `apps/web/services/stl.service.ts` still imports correctly
- [ ] If `services/api/stl-replit/` has a separate server, verify it boots

## Phase 5 — DMO + Fraud Queue

- [ ] `http://localhost:3000/dmo` loads
- [ ] `http://localhost:3000/dmo/fraud` loads
- [ ] `http://localhost:3000/dmo/queue` loads
- [ ] Queue processes at least one synthetic job without error

## Phase 6 — Docker / Containerization

Location: `apps/web/`

- [ ] `docker-compose.yml` still references valid paths (no `../backend`)
- [ ] `docker compose build` succeeds for the `web` service
- [ ] `docker compose up -d` brings services up
- [ ] Containers reach steady state — no crash loops

## Phase 7 — CI / GitHub Actions

- [ ] `.github/workflows/ehb-landing-ci.yml` — path filters updated to `apps/web/**` ✅ (done during migration)
- [ ] Open a test branch, push, confirm the workflow triggers on `apps/web/` changes
- [ ] Workflow job passes on the new path

## Phase 8 — Automation scripts

Location: `infrastructure/scripts/`

- [ ] `START-LOCAL.bat` — paths updated to `apps\web` and `services\ai` ✅ (done during migration)
- [ ] Double-click `START-LOCAL.bat` → frontend + AI backend both launch
- [ ] `auto-github-sync.ps1` — run manually and confirm it still commits correctly
      _(After manual verification, re-register the scheduled task via `register-auto-github-sync-task.ps1` — note the new path may need updating in the task trigger.)_
- [ ] `upload-to-github.ps1` — test run (dry-run mode if available)

## Phase 9 — Documentation integrity

- [ ] `docs/FOLDER_ARCHITECTURE.md` — review and update to reflect monorepo
      _(Old layout referenced `ehb-landing-demo`; new layout is `apps/web`.)_
- [ ] `docs/INDEX.md` — links still resolve
- [ ] `docs/devops/*.md` — references to old paths updated
- [ ] Internal markdown links in `docs/**/*.md` — spot-check any that referenced `EHB landing-2026/` or `backend/`

## Phase 10 — Git hygiene

- [ ] `.gitignore` includes `backup/`, `data/ehb-data/`, `infrastructure/logs/*.log` ✅
- [ ] `git status` — clean or only expected changes
- [ ] `git log --oneline -5` — shows the restructure commit
- [ ] Create a review branch: `git checkout -b restructure/monorepo-2026-04-11`
- [ ] **Do NOT push directly to `main` on origin** until team review

## Phase 11 — Team review gates

- [ ] Architecture lead reviews `docs/MIGRATION_REPORT.md`
- [ ] Frontend lead runs Phase 1 checks
- [ ] Backend lead runs Phase 2 + 3 checks
- [ ] DevOps lead runs Phase 6 + 7 + 8 checks
- [ ] Sign-off recorded in `docs/CHANGELOG.md`

## Phase 12 — Cleanup

_Only after Phases 0–11 pass._

- [ ] Delete empty `backend/` shell at root (Issue #1)
- [ ] Move `backup/legacy/ehb-dev-2026/` to an external archive if no longer needed
- [ ] Remove `backup/` from local workspace after archiving externally
- [ ] Re-enable `auto-github-sync` scheduled task with updated paths
- [ ] Update `docs/FOLDER_ARCHITECTURE.md` to match the new monorepo layout

---

## Rollback Triggers

**Immediately `git reset --hard pre-restructure-baseline` if:**

- Phase 1 — frontend won't build or start
- Phase 2 or 3 — backend won't start
- Phase 4 — STL system broken
- Any core route returns 500 that was working before
- Any test that was green before the migration is now failing for a move-related reason

**Do not rollback for:**

- Pre-existing lint warnings / TypeScript errors
- Playwright flakiness unrelated to paths
- Missing `.env` values (these are environment setup, not migration fault)

---

## Quick Commands Reference

```bash
# Frontend
cd apps/web && npm install && npm run dev

# AI backend
cd services/ai && npm install && npm run dev

# API backend
cd services/api && npm install && npm run dev

# Full rollback (destructive)
git reset --hard pre-restructure-baseline

# Inspect old file without rolling back
git show pre-restructure-baseline:"EHB landing-2026/package.json"

# Compare before/after
git diff pre-restructure-baseline..HEAD -- apps/web/package.json
```

---

_Checklist generated on 2026-04-11 by the restructure migration._
