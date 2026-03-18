# EHB Development Roadmap (0 → Launch)

**Phase 61–75 · Replit + Cursor AI + Next.js + Node.js · Step-by-step**

Yeh roadmap **realistic launch order** follow karta hai: GoSellr base, franchise earnings, JPS, SQL levels, dashboard cards, AI marketplace.

---

## Phase 61 — Project Initialization

**Already done in `ehb-landing-demo`.** Agar naya repo ho to:

- Next.js app: `npx create-next-app@latest ehb-platform --ts --tailwind --app`
- Folder structure:
  - `app/` — routes
  - `components/` — UI
  - `lib/` — config, api client, industries
  - `modules/` (optional) — industry, marketplace, gosellr, jps, wallet, franchise, ai

---

## Phase 62 — Global Design System

**Status:** Done (globals.css, tailwind.config.ts, KpiCard, EhbHomeCard, IndustriesBar).

**Core components:**

- GlassCard / glass-panel, glass-card
- StatsCard → KpiCard
- ServiceCard (marketplace)
- ProductCard (GoSellr)
- AIInsightCard (dashboard)
- DashboardWidget

**Rules:** Dark theme, glass panels, neon glow, smooth animations (card-hover, btn-glow).

---

## Phase 63 — Industry Navigation System

**Status:** Done.

- Top bar: EHB Home + 32 industries (`IndustriesBar.tsx`).
- Routes: `/industry/[slug]`, `/landing/[industry]`.
- Same layout for all industries; data from `lib/industries.ts`.

---

## Phase 64 — EHB Landing Page

**Status:** Done.

- `/` — Hero, Industries, KPIs, Verification ecosystem, links to Development/Admin.
- Sections: Hero, Industries, AI Marketplace, Trending (via links), Franchise, Join.

---

## Phase 65 — JPS Profile System

**To do:**

- Profile fields: name, photo, skills, sql_level, verification_status, rating, bio.
- Route: `/profile/[username]` or `/profile/[id]`.
- Component: `ProfileCard` (name, photo, SQL level, verification badge, skills, rating).
- Pages: Overview, Skills, Services, Portfolio, Verification, Reviews (see Screen Map).

**Backend:** profiles table + GET /api/profiles/:username.

---

## Phase 66 — Service Creation System

**To do:**

- Flow: Select Industry → Select Service → Add Details (price, location) → Submit.
- Route: `/dashboard/services/new` or `/dashboard/my-services/create`.
- Backend: POST /api/provider-services (or /api/services with provider link).

**Example:** Industry: IT, Service: Web Development, Price: $200, City: Rawalpindi.

---

## Phase 67 — GoSellr Marketplace

**To do:**

- Pages: `/gosellr` (list), `/gosellr/product/[id]` (detail), `/cart`, `/orders`.
- Product card: image, price, seller, rating, Add to cart.
- Backend: products, orders APIs (Phase 50).

---

## Phase 68 — Main Dashboard

**Status:** Partial (`/dashboard` exists).

**To do:**

- Sidebar: Dashboard, Industries, My Services, Products, Jobs, Wallet, Affiliate, Franchise, AI Insights, Settings.
- Widgets: Wallet Balance, Orders Today, AI Suggestions, Affiliate Earnings (Phase 28).
- Industry activation (select industries); My Services (add/manage).

---

## Phase 69 — AI Recommendation System

**To do:**

- Component: `AIInsightCard` — message + CTA (e.g. "Delivery demand increased in Rawalpindi. Activate delivery service.").
- Show on Dashboard and Industry Home.
- Backend: GET /api/ai/insights, /api/ai/recommendations (Phase 54).

---

## Phase 70 — Wallet & Earnings

**To do:**

- Route: `/dashboard/wallet` or `/wallet`.
- Display: balance, affiliate_income, service_income, product_income.
- Transactions list.
- Backend: GET /api/wallet, GET /api/wallet/transactions (Phase 53).

---

## Phase 71 — Franchise Dashboard

**To do:**

- For franchise owners: city analytics, orders, providers, revenue, commission.
- Route: `/franchise/dashboard` or `/franchise/[city]`.
- Example card: Islamabad Franchise — Orders today: 450, Revenue: $12,000.
- Backend: GET /api/franchise/dashboard (Phase 52).

---

## Phase 72 — Location-Based System

**Structure:** Country → State → City.

**Use in:** Franchise cities, provider search, job location, service area.

**To do:** DB/cache for locations; filters on marketplace APIs (location, city_id).

---

## Phase 73 — API Integration

**To do:**

- Frontend API client: `lib/api.ts` (fetch/axios) with base URL, auth header.
- Replace mock/static data with:
  - GET /api/industries, /api/services, /api/products, /api/jobs
  - POST /api/auth/login, /api/providers, /api/orders
- Use React Query or SWR for caching and loading states.

---

## Phase 74 — Security System

**To do:**

- JWT in cookie or header; refresh flow.
- Rate limiting on auth and public APIs.
- API validation (e.g. Zod) for request body.
- CORS and env-based secrets.

---

## Phase 75 — First Launch Version (MVP)

**Launch checklist:**

- [x] EHB landing page
- [x] Industry pages (landing + home)
- [ ] JPS profiles (view + edit)
- [ ] Service marketplace (list + create service)
- [ ] GoSellr products (list + product page + cart/orders)
- [x] Main dashboard (widgets + sidebar)
- [ ] Wallet (balance + transactions)
- [ ] Affiliate (earnings display)
- [ ] Franchise (opportunities + dashboard for owners)

**Start with 5 industries:** IT, Delivery, Education, Health, Retail. Phir expand.

---

## Implementation Order (Suggested)

1. **Phase 65** — ProfileCard + `/profile/[id]` (mock or API).
2. **Phase 66** — Service creation form + API.
3. **Phase 67** — GoSellr list + product detail + cart/orders (API).
4. **Phase 69** — AIInsightCard on dashboard (mock then API).
5. **Phase 70** — Wallet page (API).
6. **Phase 71** — Franchise dashboard (API).
7. **Phase 73–74** — API client + auth + security.

---

*Rafi bhai — Cursor me "Add JPS profile page" ya "Add service creation form" bol kar isi roadmap se implement kara sakte ho. Next: Prisma schema for DB.*
