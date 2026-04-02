# Vercel vs Local Route Inventory

Compared on `2026-04-02` using:

- Local: `http://localhost:3000`
- Deployed: `https://ehb-dev-rafi.vercel.app`

Canonical production URL for future parity checks:

- `https://ehb-dev-rafi.vercel.app`

Scope for this inventory:

- `/`
- `/home`
- `/landing`
- `/development`
- `/admin`
- `/admin/jps-import`
- `/dmo`
- `/dmo/stl`
- `/franchise`
- `/franchise/bookings`

## Comparison method

- Fetched the same route from local and deployed to compare live status codes and top-level visible headings.
- Checked for route-specific marker text to confirm whether both environments were rendering the same experience or a different page on the same path.
- Queried key JSON endpoints behind franchise, STL, and JPS screens to verify whether the visible differences were caused by missing routes, fallback data, or failing APIs.

## Executive summary

- `/` is currently the only clearly aligned route in this assigned surface.
- `/home`, `/landing`, `/dmo`, and `/franchise` all return `200` in both environments but render different visible experiences.
- `/admin/jps-import`, `/dmo/stl`, and `/franchise/bookings` work locally but return deployed `404` pages.
- Every checked deployed API route under `/api/*` returned `404`, which means the deployed host is not exposing the same route handlers as local for this surface.
- Local franchise pages are currently driven by demo/fallback API data.
- Local JPS and STL API endpoints are not healthy right now, so parity is blocked on both sides for different reasons.

## Route-by-route inventory

| Route | Local | Deployed | Inventory result | Visible difference summary | Likely cause |
| --- | --- | --- | --- | --- | --- |
| `/` | `200` | `200` | Match | Both sides render `EHB – Earn, Hire, and Grow in One Global Platform` and include shared landing markers such as `How EHB Works` and `Start Your Journey with EHB Today`. | Static content aligned |
| `/home` | `200` | `200` | Mismatch | Local renders the newer home hub with markers like `Where Do You Want to Go?`, `What Is EHB?`, `Getting Started Is Easy`, and `Platform Status`. Deployed resolves to a different page and does not contain those markers. | Same path mapped to older or different deployed content |
| `/landing` | `200` | `200` | Mismatch | Local renders the Pakistan-focused landing experience with `Business Platform`, testimonials, and CTA markers such as `Register for Free` and `View Franchise Info`. Deployed resolves to a different `EHB Landing` experience and does not contain those markers. | Same path mapped to older or different deployed content |
| `/development` | `200` | `200` | Match | Both sides expose the current development dashboard with `Platform Structure`, `Development Progress`, `System Flow Monitor`, and `Next Milestones`. | Static content aligned |
| `/admin` | `200` | `200` | Partial mismatch | Both sides load `EHB Global Super Admin`, but deployed did not expose the `JPS Import Management` marker that is present locally. The admin shell exists in both places, but the feature surface is not fully aligned. | Partial deploy drift inside admin surface |
| `/admin/jps-import` | `200` | `404` | Missing on deployed | Local loads `JPS Data Import Manager`, `Import Payload`, `Validation Preview`, and `Backup History`. Deployed shows `Page not found`. | Route not deployed |
| `/dmo` | `200` | `200` | Mismatch | Local renders the newer DMO experience with `The Engine of EHB Behind the Platform`, tabbed modules/phases/governance content, and `Explore the EHB Platform`. Deployed resolves to a different DMO page and does not contain those markers. | Same path mapped to older or different deployed content |
| `/dmo/stl` | `200` | `404` | Missing on deployed | Local loads `Service Trust Level`, `Manual STL Calculation`, `STL Ranking Table`, and `STL History`. Deployed shows `Page not found`. | Route not deployed |
| `/franchise` | `200` | `200` | Mismatch | Local renders the new franchise operations dashboard headed by `EHB Franchise Home` and `Franchise Control Center`. Deployed resolves to a different marketing-style page headed `GoSellr GSM Franchise Model`. | Same path mapped to older or different deployed content |
| `/franchise/bookings` | `200` | `404` | Missing on deployed | Local loads the `Service Booking Queue` workflow. Deployed shows `Page not found`. | Route not deployed |

## Key route evidence

### Routes that match

- `/`
  - Local h1: `EHB – Earn, Hire, and Grow in One Global Platform`
  - Deployed h1: `EHB – Earn, Hire, and Grow in One Global Platform`
- `/development`
  - Local and deployed both expose the same development-center sections and labels.

### Routes that resolve to different visible pages

- `/home`
  - Local h1: `Education • Health • Business one platform for the full ecosystem`
  - Deployed h1: `Single home for industries, trust systems, finance, AI & governance.`
- `/landing`
  - Local h1: `Pakistan's Largest Business Platform`
  - Deployed h1: `EHB Landing`
- `/dmo`
  - Local h1: `The Engine of EHB Behind the Platform`
  - Deployed h1: `Core operating layer connecting verification, trust, wallet and governance.`
- `/franchise`
  - Local h1: `EHB Franchise Home`
  - Deployed h1: `GoSellr GSM Franchise Model`

### Routes that only exist locally in this surface

- `/admin/jps-import`
- `/dmo/stl`
- `/franchise/bookings`

Each of those returned a local `200` and a deployed `404`.

## API inventory behind the visible pages

| Endpoint | Local result | Deployed result | Inventory result | Notes |
| --- | --- | --- | --- | --- |
| `/api/franchise/dashboard` | `200` | `404` | Mismatch | Local returns `stats`, `profile`, and `suggestions` using demo-style data. |
| `/api/franchise/bookings?take=100` | `200` | `404` | Mismatch | Local returns `2` booking items. Deployed route is missing. |
| `/api/stl/calculate?take=100&skip=0&logsTake=100` | `500` | `404` | Broken on both sides | Local currently fails with a Prisma datasource protocol error. Deployed route is missing. |
| `/api/jps/import` | `500` | `404` | Broken on both sides | Local currently fails with a Prisma datasource protocol error on `appDataRecord`. Deployed route is missing. |
| `/api/jps/backups` | `500` | `404` | Broken on both sides | Local currently fails with a Prisma datasource protocol error on `appDataRevision`. Deployed route is missing. |
| `/api/jps` | `500` | `404` | Broken on both sides | Local endpoint is not healthy; deployed route is missing. |

## Visible data findings

### Franchise surface

Local franchise data is currently visible through fallback/demo responses:

- `/api/franchise/dashboard` returns:
  - `openTasks: 4`
  - `inProgress: 2`
  - `completed: 12`
  - `escalated: 1`
  - `pendingBookings: 6`
  - `activeBookings: 3`
- `/api/franchise/bookings?take=100` returns `2` items locally.

Impact on route parity:

- Local `/franchise` and `/franchise/bookings` look operational because fallback/demo data exists.
- Deployed cannot match that experience because the visible route and API surface are not present there.

### STL surface

Local `/dmo/stl` loads, but its backing API currently fails with a Prisma datasource protocol error.

Impact on route parity:

- Local has the screen and controls.
- Deployed does not have the route at all.
- Even locally, the live data layer is not healthy right now.

### JPS surface

Local JPS pages are not fully healthy:

- `/admin/jps-import` route exists locally.
- The backing JPS endpoints are failing locally with Prisma datasource protocol errors.

Impact on route parity:

- Local exposes the screen shell, but the API state behind it is broken.
- Deployed is further behind because the route itself returns `404`.

## Difference categories

### Production-only drift on shared paths

These paths exist in both environments but do not render the same experience:

- `/home`
- `/landing`
- `/dmo`
- `/franchise`

### Local-only routes

These paths are currently available locally but missing from the deployed app:

- `/admin/jps-import`
- `/dmo/stl`
- `/franchise/bookings`

### Local-only API availability

These APIs exist locally but are missing from deployed:

- `/api/franchise/dashboard`
- `/api/franchise/bookings`
- `/api/stl/calculate`

### Broken parity blockers

- Deployed `/api/*` parity blocker: every checked endpoint returned `404`.
- Local Prisma parity blocker: JPS and STL endpoints currently fail with `500`.

## Priority blockers to resolve before parity verification can pass

1. Deploy the missing route surface to Vercel:
   - `/admin/jps-import`
   - `/dmo/stl`
   - `/franchise/bookings`
   - matching `/api/*` handlers
2. Replace deployed older-route content on shared paths:
   - `/home`
   - `/landing`
   - `/dmo`
   - `/franchise`
3. Fix the local Prisma datasource configuration so JPS and STL APIs become healthy locally.
4. Decide whether local franchise data should stay demo-driven or be replaced with the same persistent source Vercel will use.

## Suggested canonical mismatch labels

Use these labels in follow-up parity work:

- `aligned`
- `shared-path-different-content`
- `local-only-route`
- `local-api-only`
- `local-api-broken`
- `deployed-api-missing`
