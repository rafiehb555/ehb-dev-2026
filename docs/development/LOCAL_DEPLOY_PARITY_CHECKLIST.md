# Local vs Deployed Parity Checklist

Use this checklist before rollout when local work must match the deployed Vercel experience.

## Goal

Confirm that `http://localhost` and the active deployed app show the same content, the same major counts, and the same data source behavior for the routes that currently mix static content, demo fallbacks, and live data.

Canonical deployed URL for this project:

- `https://ehb-dev-rafi.vercel.app`

## Preconditions

- Local branch is the same branch connected to the active Vercel deployment.
- Local repo has the latest remote changes pulled before verification starts.
- A local production-like run is available for comparison:
  - `npm run build`
  - `npm run start`
- The deployed URL for the same branch is known and reachable.
- Default parity target is `https://ehb-dev-rafi.vercel.app` unless a deliberate branch-specific preview is being checked.
- Any user credentials needed for protected routes are available in both environments.

## CI-aligned commands (main landing app)

The GitHub workflow for `EHB landing-2026/` runs `npm ci` → informational `npm audit --audit-level=high` → `tsc --noEmit` → `npm test` → `npm run lint` → `npm run build` (see [INDEX.md](../INDEX.md), **CI (landing app)**). After `npm install` locally, mirror the non-install steps with:

| Step | Command |
|------|---------|
| Audit (same flags as CI; may exit non-zero while known highs remain) | `npm run audit:info` |
| Rest of pipeline (single script) | `npm run ci:local` |

## Optional — Law OLS reference app (separate package)

The law industry **OLS** Next.js demo under [`EHB landing-2026/content/industries/law/ols-law-source/nextjs-app/`](../../EHB%20landing-2026/content/industries/law/ols-law-source/nextjs-app) is **not** the same deploy as the main Vercel landing app unless you wire it explicitly. Use it only when checking law reference UI parity.

| Check | Command / note |
|------|----------------|
| Production build | From `nextjs-app/`: `npm ci` → `npm run build` |
| Monorepo | [`next.config.ts`](../../EHB%20landing-2026/content/industries/law/ols-law-source/nextjs-app/next.config.ts) sets `outputFileTracingRoot` so Next does not pick the wrong workspace root when multiple `package-lock.json` files exist |
| ESLint during `next build` | `eslint.ignoreDuringBuilds: true` avoids a known ESLint 9 + `react-hooks/rules-of-hooks` (`a.getScope is not a function`) failure; run `npm run lint` manually after toolchain upgrades |

## Environment Parity

Record the values or source for these settings before comparing UI:

| Check | Local | Deployed | Notes |
|------|------|----------|-------|
| Git branch is the same | ☐ | ☐ | Use the same integration branch for both checks |
| `DATABASE_URL` points to the intended dataset | ☐ | ☐ | Avoid comparing local seeded DB to empty production DB |
| `EHB_AUTH_SECRET` is configured | ☐ | ☐ | Required for protected routes in production |
| `EHB_DMO_DEMO_MODE` is intentionally set | ☐ | ☐ | Demo mode must be deliberately on or off, not accidental |
| Required public assets are present | ☐ | ☐ | Missing assets create false parity failures |

## Route-by-Route Parity Checks

For each route, compare local and deployed side-by-side and capture screenshots when the content is expected to stay stable.

### 1. Public landing surfaces

| Route | Verify |
|------|--------|
| `/` | Hero copy, CTA buttons, section order, and major section presence match |
| `/` | `LiveActivityTicker`, marketplace blocks, recommendations, roadmap, and trust sections render in both environments |
| `/home` and `/landing` | Alternate landing pages do not show older or missing content compared with `/` |

Expected result:

- No section exists only in one environment.
- Visible counts, cards, and marketing copy are aligned.
- Public pages do not depend on hidden local-only assets or imports.

### 2. Franchise workflow surfaces

| Route | Verify |
|------|--------|
| `/franchise` | KPI counts, assigned franchise cards, next due task, and action plan are materially the same |
| `/franchise/bookings` | Queue length, status labels, and empty states match expected live data |
| `/franchise/inspections` | Inspection lists, due states, and escalation-related UI are consistent |
| `/dmo/franchise` | Franchise-facing DMO summaries reflect the same task/report state |

Expected result:

- No page silently falls back to demo data because API fetches fail.
- If the environment intentionally uses demo data, both environments show the same demo records.

### 3. DMO workflow surfaces

| Route | Verify |
|------|--------|
| `/dmo` | Public DMO overview content matches exactly, including module cards and phase copy |
| `/dmo/applications` | Application counts, statuses, and assignee behavior match |
| `/dmo/stl` and key `/dmo/[section]` views | Lists, counters, filters, and empty states behave the same |
| `/api/dmo/applications`, `/api/dmo/approvals`, `/api/dmo/audit`, `/api/dmo/registry`, `/api/dmo/users` | Response shape and record counts match the intended source |

Expected result:

- Demo application records are either visible in both environments or disabled in both.
- No environment shows `ehb.local` demo identities unless that is the deliberate parity baseline.

### 4. Admin and JPS data surfaces

| Route | Verify |
|------|--------|
| `/admin` | Admin summary cards and navigation match |
| `/admin/jps-import` | Imported/fallback source indicator matches expected state |
| `/api/jps` and `/api/jps/export` | Returned profile counts and payload shape match |

Expected result:

- Imported JPS data is not only stored in a local file if deployed parity is required.
- Backup/restore behavior does not create a local-only state that Vercel cannot reproduce.

## Fallback Detection Checks

These checks are required because several routes can look healthy while actually reading fallback data.

| Risk area | What to verify |
|----------|----------------|
| `fetchJson()` fallback behavior | Browser network responses are successful; parity is not being masked by client fallback objects |
| Franchise dashboard API fallback | `/api/franchise/dashboard` is not returning demo data only because `DATABASE_URL` is missing or the session user id is not a Mongo ObjectId |
| DMO demo mode | `isDmoDemoMode()` is intentionally enabled or disabled in both environments |
| Middleware/auth drift | Protected routes do not work locally only because middleware bypasses auth in non-production |
| JPS file storage drift | Data saved through JPS import is backed by storage that both environments can read |

## Evidence To Capture

Collect the same evidence for local and deployed before sign-off:

- Screenshot of `/`
- Screenshot of `/franchise`
- Screenshot of one protected DMO screen
- Screenshot of `/admin/jps-import`
- Copy of key API responses or record counts for franchise, DMO, and JPS endpoints
- Notes for any intentional differences still allowed at rollout time

## Sign-Off Checklist

| Item | Status |
|------|--------|
| Public landing content is identical enough for release | ☐ |
| Franchise KPIs and queue state come from the intended shared source | ☐ |
| DMO pages are not hiding missing data behind demo mode | ☐ |
| Protected routes behave correctly with production-like auth | ☐ |
| JPS data source is durable and matches the expected deployed state | ☐ |
| No critical route depends on local-only files, assets, or env defaults | ☐ |
| Local and deployed smoke test evidence has been saved | ☐ |
| Deployment finished successfully in Vercel after final push | ☐ |

## Release Rule

Do not roll out if any critical route only matches because of fallback data, demo-mode shortcuts, local file persistence, or missing auth enforcement. Fix the data source or environment drift first, then rerun this checklist.
