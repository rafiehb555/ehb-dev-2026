# EHB Super-App Screen Map

**Figma + Development blueprint · Phases 19–30 · 50+ screens**

---

## Phase 19 — Public Screens (No Login)

User login se pehle yeh screens.

| # | Screen | Route | Purpose |
|---|--------|--------|---------|
| 1 | EHB Landing Page | `/` | Main entry – hero, KPIs, 32 industries bar, verification ecosystem |
| 2 | Industry Landing Page | `/landing/[industry]` | Universal landing per industry (same UI, content change) |
| 3 | Industry Home Page | `/industry/[industry]` | Industry hub – services, providers, jobs, AI suggestions |
| 4 | Marketplace Page | `/ai-marketplace`, `/services`, `/gosellr` | Services + Products + Jobs marketplaces |
| 5 | Service Provider Profile | `/profile/[userId]` or `/provider/[slug]` | JPS profile – name, picture, SQL level, verification, skills, rating |
| 6 | Product Page | `/product/[productId]` | Single product (GoSellr) – image, price, seller, cart |
| 7 | Job Page | `/job/[jobId]` | Single job – title, company, location, apply |
| 8 | Franchise Page | `/franchise` | Franchise opportunities, city dashboard, apply |
| 9 | About EHB | `/about` | Platform story, vision, team |
| 10 | Contact | `/contact` | Contact form, support |

---

## Phase 20 — Industry Screen System

Har industry ka **same URL structure**. Same UI, data change.

**Base path:** `/industry/[industry]` (e.g. `/industry/health`, `/industry/education`, `/industry/it`)

| Screen | Route | Purpose |
|--------|--------|---------|
| Industry Home | `/industry/[industry]` | Home – trending, providers, AI, jobs |
| Services List | `/industry/[industry]/services` | All services in this industry |
| Service Providers | `/industry/[industry]/providers` | Verified providers list |
| Jobs | `/industry/[industry]/jobs` | Jobs in this industry |
| Products | `/industry/[industry]/products` | Products (if applicable) |
| Companies | `/industry/[industry]/companies` | Top companies / organizations |

**Rule:** Agar EHB landing me koi section hai, sab industries me bhi same section (e.g. AI Insights, Franchise).

---

## Phase 21 — User Profile System (JPS Core)

Sab users **JPS (Job Profile & Skill)** se.

**Base path:** `/profile/[userId]` or `/p/[username]`

| Screen | Route | Purpose |
|--------|--------|---------|
| Profile Overview | `/profile/[id]` | Name, picture, headline, location |
| Skills | `/profile/[id]/skills` | Skills, SQL level, endorsements |
| Services | `/profile/[id]/services` | Services offered by this provider |
| Portfolio | `/profile/[id]/portfolio` | Work samples, projects |
| Verification | `/profile/[id]/verification` | PSS/CRB/STL badges |
| Reviews | `/profile/[id]/reviews` | Ratings and reviews |

**Profile card (reusable):** Name, Profile picture, SQL level, Verification badge, Skills, Rating.

---

## Phase 22 — Service Creation System

User dashboard se **service add** karega.

**Flow (steps):**

| Step | Screen / Action | Purpose |
|------|------------------|---------|
| 1 | Select Industry | Industry dropdown (32) |
| 2 | Select Service | Service type (e.g. Web Development) |
| 3 | Add Details | Title, description, price, location (e.g. Rawalpindi) |
| 4 | Verification | PSS/STL check if required |
| 5 | Publish | Go live in marketplace |

**Example:** Industry: IT → Service: Web Development → Price: $200 → Location: Rawalpindi.

**Route:** `/dashboard/services/new` or `/dashboard/my-services/create`.

---

## Phase 23 — Marketplace System (3 Types)

### 1️⃣ Services Marketplace

**Route:** `/services` or `/marketplace/services`, plus `/industry/[industry]/services`

- Web Development, Delivery, Consulting, Teaching, etc.
- Filters: industry, location, price, rating.

### 2️⃣ Product Marketplace (GoSellr)

**Route:** `/gosellr` or `/marketplace/products`, plus `/industry/[industry]/products`

- Electronics, Fashion, Home, Beauty, etc.
- Product card: image, price, seller, rating, Add to cart.

### 3️⃣ Jobs Marketplace (JPS)

**Route:** `/jobs` or `/marketplace/jobs`, plus `/industry/[industry]/jobs`

- Remote jobs, Local jobs, Freelance jobs.
- Job card: title, company, location, type, Apply.

---

## Phase 24 — AI Recommendation System

AI **har relevant page** par.

| Placement | Example |
|-----------|---------|
| Dashboard | “Graphic design demand increased 20%. Activate this service.” |
| Industry Home | Trending services, Nearby providers, Best earning opportunities |
| Marketplace | “Recommended for you”, “High demand in your area” |

**AI suggestion card (reusable):** Short message + one CTA (e.g. Activate service, View opportunity).

---

## Phase 25 — Franchise System

| Screen | Route | Purpose |
|--------|--------|---------|
| Franchise Opportunities | `/franchise` | List cities, investment, revenue potential |
| City Dashboard | `/franchise/[city]` or `/franchise/dashboard` | City-level analytics |
| Provider Analytics | (inside dashboard) | Active providers, orders |
| Revenue Reports | (inside dashboard) | Orders today, revenue, commission |

**Example card:** Islamabad Franchise – Orders today: 430, Revenue: $10,200, Commission: $1,020.

---

## Phase 26 — Wallet & Earnings System

| Screen | Route | Purpose |
|--------|--------|---------|
| Wallet Overview | `/dashboard/wallet` or `/wallet` | Balance (EHBGC), fiat equivalent |
| Affiliate Earnings | `/dashboard/affiliate` | Commission, referrals |
| Service Earnings | `/dashboard/earnings` | From services delivered |
| Withdraw | `/dashboard/wallet/withdraw` | Payout flow |
| Transactions | `/dashboard/wallet/transactions` | History |

**Charts:** Monthly income, Service earnings, Affiliate growth (neon line / bars, same design system).

---

## Phase 27 — Platform Core Modules (EHB Core)

```
EHB Core
├ Industry Engine      → 32 industries, landing, home, routes
├ Service Engine       → Service CRUD, mapping, providers
├ Product Engine       → GoSellr, products, cart
├ Job Engine           → JPS jobs, applications
├ Marketplace Engine   → Services + Products + Jobs aggregation
├ Franchise Engine     → City, revenue, providers
├ Wallet Engine        → Balance, earnings, withdraw, tx
└ AI Engine            → Recommendations, demand, insights
```

Har engine = backend module + frontend routes/components.

---

## Phase 28 — Dashboard Widgets

Dashboard **modular** – user customize kar sakta hai.

| Widget | Purpose |
|--------|---------|
| Wallet Balance | EHBGC + fiat |
| Orders Today | Count / list |
| AI Insights | One AI suggestion card |
| Nearby Requests | Location-based requests |
| Affiliate Earnings | This period |

**Route:** `/dashboard` – widgets in grid; later drag-drop reorder.

---

## Phase 29 — Scalability System

Target:

- 32 industries (done in config)
- 700+ services (service mapping in DB)
- Millions of users (auth, profile, JPS)
- Global franchises (country → state → city)

Architecture: stateless API, DB indexing, CDN for static/assets, industry/service as config + DB.

---

## Phase 30 — Global Expansion System

**Location hierarchy:**

```
Country
 → State / Region
   → City
     → Local Providers
```

**Example:** Pakistan → Punjab → Rawalpindi.

**Use in:** Franchise city dashboard, provider search, job location, service area.

---

## Route Summary (All Phases)

| Category | Routes |
|----------|--------|
| Public | `/`, `/landing/[industry]`, `/industry/[industry]`, `/about`, `/contact` |
| Industry sub | `/industry/[industry]/services`, `.../providers`, `.../jobs`, `.../products`, `.../companies` |
| Profile (JPS) | `/profile/[id]`, `.../skills`, `.../services`, `.../portfolio`, `.../verification`, `.../reviews` |
| Marketplace | `/services`, `/gosellr`, `/jobs`, `/product/[id]`, `/job/[id]` |
| Dashboard | `/dashboard`, `/dashboard/wallet`, `/dashboard/affiliate`, `/dashboard/services/new`, etc. |
| Franchise | `/franchise`, `/franchise/dashboard` or `.../[city]` |
| Admin | `/admin`, `/development`, `/dmo` |

---

## Final Platform Vision

EHB = **Microsoft Store + Amazon + LinkedIn + Upwork + Binance** in one global service ecosystem.

---

*Rafi bhai — Figma me isi order me screens bana sakte ho; Cursor/Replit me `EHB_DEVELOPMENT_ARCHITECTURE.md` se direct development start.*
