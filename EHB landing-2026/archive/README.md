# Archive

Files here are **not wired into production routes or imports** (verified by import scan before move). Each file starts with:

`Archived - not used in production`

## Do not relocate without review (production / dev tooling)

| Item | Reason |
|------|--------|
| `lib/dmo/stlDashboardDemo.ts`, `stlDemoEngine.ts` | Fallback + engine for `/dmo/ehb-stl-level` and STL experience |
| `lib/demo/*` | Used by `app/api/search`, `lib/marketplace/engine` when demo dataset is on |
| `lib/industry/demoIndustries.ts` | Used by `app/api/industries` |
| `lib/pss/pssDemoCases.ts` | Used by `app/dmo/pss/page.tsx` |
| `app/local-demo/`, `components/local-demo/` | Linked from layout, auth, marketplace, search, DMO PSS |
| `content/industries/law/ols-law-source/` | Included in `tailwind.config.ts` content paths |
| `components/MarketplaceSection.tsx` (root) | Used by `app/page.tsx` — **not** the duplicate under `marketplace/` |

## What was moved (full list)

| Path under `archive/` | Notes |
|------------------------|--------|
| `components/Breadcrumb.tsx` | No app imports |
| `components/DmoLandingSection.tsx` | No app imports |
| `components/EHBHowItWorksSystem.tsx` | No app imports |
| `components/FranchiseIndustryMarquee.tsx` | No app imports |
| `components/GlobalAiStatus.tsx` | No app imports |
| `components/PageSwitch.tsx` | No app imports |
| `components/dmo/ActionPanel.tsx` | No app imports (relied on sibling `types`/`ui` in live tree) |
| `components/dmo/ActivityFeed.tsx` | Same |
| `components/dmo/AiInsightsPanel.tsx` | No app imports |
| `components/dmo/ApplicationDrawer.tsx` | Same |
| `components/dmo/ApplicationsTable.tsx` | Same |
| `components/dmo/DmoKpiCard.tsx` | No app imports |
| `components/dmo/PriorityQueueTabs.tsx` | No app imports |
| `components/dmo/Toast.tsx` | No app imports |
| `components/dmo/stl-dashboard/StlDashboardSidebar.tsx` | Superseded by main DMO sidebar; unused |
| `components/layout/RouteConditional.tsx` | No app imports |
| `components/marketplace/MarketplaceSection.tsx` | **Duplicate** — see below |
| `components/pss/PSSCasesTable.tsx` | No app imports (PSS page uses other UI) |
| `components/pss/PSSVerificationDrawer.tsx` | No app imports |
| `components/ui/DmoCard.tsx` | No app imports |
| `components/ui/skeleton.tsx` | No app imports |
| `OPEN_DEMO.md` | Doc only |

TypeScript: the main app `tsconfig.json` **excludes** `archive/` so these snapshots are not typechecked as part of CI (some files reference `./types`, `./ui`, `./motion` that were never moved).

## Duplicate code note

Two different `MarketplaceSection` implementations existed; the one under `components/marketplace/` had **zero** imports. The active implementation remains at `components/MarketplaceSection.tsx`.
