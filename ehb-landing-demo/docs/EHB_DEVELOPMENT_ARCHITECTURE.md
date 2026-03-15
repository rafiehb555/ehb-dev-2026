# EHB Super-App Development Architecture

**Cursor / Replit / React direct development blueprint**

Yeh doc **screen map** (Phase 19–30) ko **routes, components, modules** se link karta hai taake development seedha start ho sake.

---

## 1. Tech Stack (Current & Suggested)

| Layer | Current | Suggested (Backend) |
|-------|---------|---------------------|
| Frontend | Next.js 14 (App Router), React, Tailwind | Same |
| State | (local) | React Query / SWR + Context |
| Auth | — | NextAuth / Clerk / custom JWT |
| API | — | Next.js Route Handlers or Replit/Node API |
| DB | — | PostgreSQL / MySQL + Prisma or Drizzle |
| Design | EHB design system (globals.css, tailwind) | Same |

---

## 2. Folder Structure (Next.js App)

```
ehb-landing-demo/
├ app/
│  ├ layout.tsx                 # Root layout + 32 industries bar
│  ├ page.tsx                   # EHB Landing (Phase 19 #1)
│  ├ not-found.tsx
│  ├ landing/
│  │  ├ page.tsx                 # Alt landing
│  │  └ [industry]/page.tsx      # Industry Landing (Phase 19 #2)
│  ├ industry/
│  │  └ [industry]/
│  │     ├ page.tsx              # Industry Home (Phase 19 #3, Phase 20)
│  │     ├ services/page.tsx     # Phase 20: Services List
│  │     ├ providers/page.tsx    # Phase 20: Service Providers
│  │     ├ jobs/page.tsx         # Phase 20: Jobs
│  │     ├ products/page.tsx     # Phase 20: Products
│  │     └ companies/page.tsx    # Phase 20: Companies
│  ├ profile/
│  │  └ [id]/
│  │     ├ page.tsx              # Phase 21: Profile Overview
│  │     ├ skills/page.tsx
│  │     ├ services/page.tsx
│  │     ├ portfolio/page.tsx
│  │     ├ verification/page.tsx
│  │     └ reviews/page.tsx
│  ├ services/                   # Phase 23: Services Marketplace
│  │  ├ page.tsx
│  │  └ [serviceId]/page.tsx
│  ├ gosellr/                    # Phase 23: Product Marketplace
│  │  ├ page.tsx
│  │  └ product/[productId]/page.tsx
│  ├ jobs/                       # Phase 23: Jobs Marketplace
│  │  ├ page.tsx
│  │  └ [jobId]/page.tsx
│  ├ dashboard/
│  │  ├ page.tsx                 # Phase 28: Widgets
│  │  ├ wallet/page.tsx          # Phase 26
│  │  ├ affiliate/page.tsx
│  │  ├ services/
│  │  │  ├ page.tsx
│  │  │  └ new/page.tsx          # Phase 22: Service Creation
│  │  └ ...
│  ├ franchise/                  # Phase 25
│  │  ├ page.tsx
│  │  └ [city]/page.tsx or dashboard/page.tsx
│  ├ ai-marketplace/
│  ├ admin/
│  ├ development/
│  ├ dmo/
│  ├ about/page.tsx              # Phase 19 #9
│  └ contact/page.tsx            # Phase 19 #10
├ components/
│  ├ IndustriesBar.tsx
│  ├ ui/
│  │  ├ KpiCard.tsx
│  │  ├ EhbHomeCard.tsx
│  │  └ ...
│  ├ profile/                    # Phase 21
│  │  └ ProfileCard.tsx
│  ├ ai/                         # Phase 24
│  │  └ AIInsightCard.tsx
│  └ ...
├ lib/
│  ├ industries.ts               # 32 industries config
│  ├ api.ts                      # (future) API client
│  └ ...
├ docs/                          # Blueprints
└ public/
```

---

## 3. Route → Phase Mapping

| Route | Phase | Screen Map # |
|-------|--------|----------------|
| `/` | 19 | EHB Landing |
| `/landing/[industry]` | 19, 20 | Industry Landing |
| `/industry/[industry]` | 19, 20 | Industry Home |
| `/industry/[industry]/services` | 20 | Services List |
| `/industry/[industry]/providers` | 20 | Service Providers |
| `/industry/[industry]/jobs` | 20 | Jobs |
| `/industry/[industry]/products` | 20 | Products |
| `/industry/[industry]/companies` | 20 | Companies |
| `/profile/[id]` | 21 | Profile Overview |
| `/profile/[id]/skills` etc. | 21 | Skills, Services, Portfolio, Verification, Reviews |
| `/dashboard/services/new` | 22 | Service Creation flow |
| `/services`, `/services/[id]` | 23 | Services Marketplace |
| `/gosellr`, `/gosellr/product/[id]` | 23 | Product Marketplace |
| `/jobs`, `/jobs/[id]` | 23 | Jobs Marketplace |
| `/dashboard` | 24, 28 | Dashboard + AI Insights + Widgets |
| `/franchise`, `/franchise/dashboard` | 25 | Franchise |
| `/dashboard/wallet`, `/wallet` | 26 | Wallet & Earnings |
| `/about`, `/contact` | 19 | About, Contact |

---

## 4. Reusable Components (Design System)

| Component | Use in | Notes |
|-----------|--------|--------|
| `KpiCard` | Landing, Dashboard, Industry | Label, value, detail |
| `EhbHomeCard` | Home, Development | EHB modules |
| `IndustriesBar` | Layout | 32 industries + EHB Home |
| `ProfileCard` (to add) | Phase 21 | Name, picture, SQL, verification, skills, rating |
| `AIInsightCard` (to add) | Phase 24 | Message + CTA |
| `ServiceCard` | Marketplace, Industry | Service tile |
| `ProductCard` | GoSellr | Image, price, seller, cart |
| `JobCard` | Jobs | Title, company, location, apply |
| Glass panels | Everywhere | `glass-panel`, `glass-card`, `card-hover`, `btn-glow` |

---

## 5. Platform Core Modules (Phase 27) → Code

| Engine | Frontend (routes/components) | Backend (future) |
|--------|------------------------------|-------------------|
| Industry Engine | `app/industry/[industry]/**`, `lib/industries.ts` | industries table, industry APIs |
| Service Engine | `app/services/**`, `app/dashboard/services/**` | services, provider_services |
| Product Engine | `app/gosellr/**` | products, cart |
| Job Engine | `app/jobs/**` | jobs, applications |
| Marketplace Engine | Aggregation of services + products + jobs | Search, filters APIs |
| Franchise Engine | `app/franchise/**` | franchise_cities, franchise_analytics |
| Wallet Engine | `app/dashboard/wallet/**` | wallet, transactions, earnings |
| AI Engine | AIInsightCard, recommendation APIs | demand, suggestions, insights |

---

## 6. Implementation Order (Suggested)

1. **Phase 19 public gaps:** `/about`, `/contact` (static).
2. **Phase 20:** `/industry/[industry]/services` (and optionally providers, jobs, products, companies) – same template, data from config or API.
3. **Phase 21:** `ProfileCard` component + `/profile/[id]` (static or mock data).
4. **Phase 22:** `/dashboard/services/new` – multi-step form (industry → service → details → publish).
5. **Phase 23:** Consolidate `/services`, `/gosellr`, `/jobs` with shared layout; add `/product/[id]`, `/job/[id]`.
6. **Phase 24:** `AIInsightCard` on dashboard and industry home; later connect to API.
7. **Phase 25–26:** Franchise city dashboard, Wallet/earnings pages with charts (same design system).
8. **Phase 28:** Dashboard widgets (Wallet, Orders, AI Insight, Nearby Requests, Affiliate) in grid.

---

## 7. Backend Readiness (Next Step)

Jab bolo **“Create EHB database architecture”** tab yeh bana sakta hai:

- **Tables:** industries, services, users, profiles (JPS), provider_services, products, jobs, applications, franchise_cities, wallet, transactions, ai_insights, etc.
- **Relations:** industry → services, user → profile, profile → services/jobs, franchise → city.
- **API shape:** REST or tRPC; Replit/Node ya Next.js Route Handlers.
- **Auth:** JWT/session, role (user, provider, franchise, admin).

Isse **Replit + Node.js backend** ke liye direct development blueprint mil jayega.

---

*Rafi bhai — Cursor me “Add About and Contact pages” ya “Add industry services list page” bol kar isi doc se step-by-step implement kara sakte ho.*
