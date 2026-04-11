# Fallback And Runtime Parity Audit

This audit maps the current code paths that can make `http://localhost` show a more complete or different experience than the deployed Vercel app.

## Executive Summary

Local development is not a reliable production-parity baseline right now. The largest divergence points are:

- non-production auth bypass in `ehb-landing-demo/lib/rbac.ts` and `ehb-landing-demo/middleware.ts`
- environment-driven DMO demo mode in `ehb-landing-demo/lib/dmo/demoStore.ts`
- silent client fallback replacement in `ehb-landing-demo/lib/fetchJson.ts`
- demo franchise payloads returned when the session user is not a Mongo ObjectId
- local file-backed JPS overrides in `ehb-landing-demo/lib/jps/store.ts`

Because several of these branches intentionally return successful-looking payloads, local can appear healthy even when production would show auth errors, empty data, or different records.

## Audit Findings

| Risk area | Local behavior | Deployed/Vercel behavior | Trigger for divergence | Main affected files/routes | Parity risk |
|------|------|------|------|------|------|
| Session auth fallback | Protected APIs can authenticate as demo `SUPER_ADMIN` in non-production when no session exists | Production requires a real session | `NODE_ENV !== "production"` and no logged-in user | `ehb-landing-demo/lib/rbac.ts`, many `/api/*` routes using `requireSession()` | Critical |
| Middleware auth bypass | `/dmo`, `/admin`, and `/api/dmo` are allowed through locally even without session cookies | Production enforces cookie + JWT validation and role checks | `NODE_ENV !== "production"` | `ehb-landing-demo/middleware.ts` | Critical |
| DMO demo mode default | DMO APIs and auth-me can serve in-memory demo users, apps, approvals, and audit logs | Production defaults to live data unless explicitly enabled | `EHB_DMO_DEMO_MODE` unset outside production | `ehb-landing-demo/lib/dmo/demoStore.ts`, `/api/dmo/*`, `/api/auth/me` | Critical |
| Client fetch fallback masking | UI quietly swaps failed API calls for hardcoded fallback objects | Production may fail or show different live data, but local page still looks complete | Any fetch/network/API error | `ehb-landing-demo/lib/fetchJson.ts`, `/franchise`, `/profile`, `/jobs`, `components/dmo/DmoSectionWorkspace.tsx` | Critical |
| Franchise demo payload branch | Franchise dashboard and booking APIs return demo data when DB is missing or auth user id is not a Mongo ObjectId | Production with real ids reads Prisma data | Missing `DATABASE_URL` or dev demo user id like `ehb-demo-admin` | `/api/franchise/dashboard`, `/api/franchise/bookings`, `/api/franchise/bookings/[id]` | High |
| Automation demo/fallback execution | Automation returns demo dashboard data, skips durable event records, and can execute fallback actions when tables/migrations are missing | Production should use persisted automation rules/events | DMO demo mode, missing DB, or automation table errors | `ehb-landing-demo/app/api/automation/route.ts`, `ehb-landing-demo/lib/automation/engine.ts` | High |
| JPS local file override | JPS imports are stored in local filesystem JSON and backups | Vercel serverless storage is not a durable shared source | Import/save/restore actions using local filesystem | `ehb-landing-demo/lib/jps/store.ts`, `/api/jps`, `/api/jps/import`, `/api/jps/export`, `/api/jps/backups` | High |
| Secondary API fallback payloads | Notifications and refilling endpoints return demo rows on auth, DB, or runtime failure | Production may return empty/live results instead | Auth failure, missing DB, catch blocks | `/api/notifications`, `/api/refilling` | Medium |

## Detailed Notes

### 1. Auth and middleware create a local-only access model

`requireSession()` in `ehb-landing-demo/lib/rbac.ts` fabricates a demo `SUPER_ADMIN` user whenever the app is not running in production and no real session exists. That means many protected APIs can succeed locally without a browser login flow.

`middleware.ts` goes further by bypassing protection entirely for `/dmo`, `/admin`, and `/api/dmo` whenever `NODE_ENV !== "production"`. As a result:

- local protected pages can render even if auth is misconfigured
- local DMO/admin screens can appear complete without a valid cookie
- production parity checks performed in dev mode can produce false positives

### 2. DMO demo mode is enabled by default outside production

`isDmoDemoMode()` returns `true` by default whenever `NODE_ENV !== "production"` unless `EHB_DMO_DEMO_MODE=0` is set.

That demo mode is consumed by:

- `/api/auth/me`
- `/api/dmo/applications`
- `/api/dmo/applications/[id]`
- `/api/dmo/approvals`
- `/api/dmo/approvals/bulk`
- `/api/dmo/audit`
- `/api/dmo/users`
- automation-related code paths

When this branch is active, local DMO behavior is driven by in-memory demo state such as:

- `ehb-demo-admin`
- `ehb-demo-franchise`
- `demo-admin@ehb.local`
- seeded demo applications and approvals

This makes local DMO flows look functional even when deployed production is reading a completely different source.

### 3. `fetchJson()` hides failures by design

`ehb-landing-demo/lib/fetchJson.ts` catches every failure and returns the provided fallback object without surfacing the error.

This affects UI parity on:

- `ehb-landing-demo/app/franchise/page.tsx`
- `ehb-landing-demo/app/profile/page.tsx`
- `ehb-landing-demo/app/jobs/page.tsx`
- `ehb-landing-demo/components/dmo/DmoSectionWorkspace.tsx`

The DMO section workspace is the largest parity masking surface because it contains hardcoded fallback datasets for applications, approvals, audit logs, PSS, CRB, franchise tasks, STL, industry, automation, refilling, affiliate, notifications, penalty, and settings.

If any of the backing APIs fail locally or on Vercel, the page can still render a polished table, which obscures whether real data was actually loaded.

### 4. Franchise APIs switch to demo mode on id shape

Franchise routes do not only depend on `DATABASE_URL`. They also check whether the authenticated user id is a Mongo ObjectId.

If the user id is not a Mongo-style id, these routes return demo responses:

- `ehb-landing-demo/app/api/franchise/dashboard/route.ts`
- `ehb-landing-demo/app/api/franchise/bookings/route.ts`
- `ehb-landing-demo/app/api/franchise/bookings/[id]/route.ts`

Because `requireSession()` can inject `ehb-demo-admin` locally, the Mongo ObjectId check will fail and the franchise pages will use demo data even if the rest of the stack seems operational.

### 5. Automation has multiple parity shortcuts

`ehb-landing-demo/app/api/automation/route.ts` returns a demo payload when:

- auth fails
- `DATABASE_URL` is missing
- DMO demo mode is on
- runtime errors happen during DB access

`ehb-landing-demo/lib/automation/engine.ts` also contains fallback behavior:

- demo actions are executed when DMO demo mode is on
- event persistence is skipped when running in demo mode
- if automation tables are unavailable, built-in actions still run through a fallback path
- some actions use compatibility fallbacks, such as downgrading to `type: "PSS"` when enum migration state is behind

This means local automation can report success while production durability and migration-readiness remain unverified.

### 6. JPS parity is currently filesystem-dependent

`ehb-landing-demo/lib/jps/store.ts` stores imported JPS data in:

- `data/jps/overview.json`
- `data/jps/backups/*.json`

This is a local machine storage model, not a shared deployment-safe source of truth. The effective JPS overview is:

- imported file override, if present
- otherwise `getJpsOverview()` demo/docs fallback

Consequences:

- local imports can make `/api/jps` show richer data than Vercel
- backup/restore flows can create state that only exists on one machine
- the admin import screen can appear correct locally while production still serves fallback content

### 7. Secondary APIs also hide real runtime differences

`/api/notifications` and `/api/refilling` both return fallback/demo datasets when auth, DB access, or runtime logic fails. Those responses are intentionally valid and user-friendly, but they are not safe parity indicators.

## Current Parity Verdict

The following local conditions are enough to invalidate a local-vs-Vercel comparison:

- running in development mode without `EHB_DMO_DEMO_MODE=0`
- relying on local access to protected pages without a real session
- viewing pages that use `fetchJson()` fallback objects after an API failure
- using local JPS imports stored only in `data/jps`
- testing franchise pages with demo-auth user ids that are not Mongo ObjectIds

## Recommended Controls Before Parity Verification

1. Run local parity checks against a production-like local build, not `next dev`.
2. Set `EHB_DMO_DEMO_MODE=0` locally when comparing against Vercel live data.
3. Use a real authenticated user whose id exists in the shared database and matches production expectations.
4. Treat any page backed by `fetchJson()` as "unknown source" unless network responses are inspected.
5. Record whether each checked route is reading live data, demo data, or local file override data.
6. Do not treat JPS import parity as complete until both environments read from the same durable store.
7. For franchise parity, verify both `DATABASE_URL` presence and the authenticated user id shape before trusting counts.
8. For automation parity, verify that automation tables and enum migrations exist before accepting local success.

## Suggested Next Actions

- Add visible source/status indicators on high-risk screens such as DMO, franchise, and JPS.
- Make `fetchJson()` optionally report when fallback content was used.
- Add a strict parity mode that fails loudly instead of returning demo objects.
- Replace JPS filesystem persistence with database or another shared durable store.
- Decide whether DMO demo mode should ever default to on outside explicitly named demo environments.
