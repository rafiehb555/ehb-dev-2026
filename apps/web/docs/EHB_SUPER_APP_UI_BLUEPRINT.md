# EHB Super-App UI Blueprint

**Microsoft Store + Stripe Dashboard + Web3 — EHB as Service Operating System**

EHB ko **app nahi — Operating System UI** banana hai: modular home, 700+ services plug-in style, Figma + Cursor ready.

---

## 1. Visual Mix (3 design ideas)

| Source | Use for |
|--------|--------|
| **Microsoft Store** | Modular cards, grid layout, department tiles, “store” feel |
| **Stripe Dashboard** | Analytics, clean panels, stats, charts |
| **Web3 Dashboard** | Glow effects, glassmorphism, futuristic accents |

---

## 2. Super-App HOME Page Structure (Microsoft Store style)

Order of sections **top to bottom**:

```
1. Top Navbar (glass, search, wallet, profile)
2. Hero AI Banner (full-width, rotating / slider)
3. Trending Services
4. Departments (PSS, CRB, EMO, JPS, WMS, EHB Aid…)
5. AI Marketplace
6. GoSellr Marketplace
7. JPS Profiles
8. Franchise Opportunities
9. EHB Modules (tiles: GoSellr, JPS, AI Market, Wallet, Affiliate, Franchise…)
10. AI Suggestions Panel
11. Footer
```

---

### 2.1 Hero Section (Microsoft Store style)

- **Full-width banner** above the fold.
- **Rotating slider** or single hero: service promotions + AI suggestions.
- Example copy:
  - “AI Suggested Opportunities Today”
  - “Delivery service demand ↑ 24%”
  - “New GoSellr sellers needed”
  - “IT services trending”
- **Design:** Blur glass card, neon glow CTA button, no heavy imagery (or optional gradient only).

---

### 2.2 Trending Services

- Horizontal or grid of **service cards** (icon, name, short stat).
- Hover: glow + lift (same as design system).

---

### 2.3 Departments Section

EHB departments as **cards** (icon + description + “Open dashboard”):

- **PSS** – Proof & Security System  
- **CRB** – (define in product)  
- **EMO** – (define in product)  
- **JPS** – Jobs & Profile System  
- **WMS** – (e.g. Medical/Health)  
- **EHB Aid** – (e.g. support / aid services)  

Each card: icon, one-line description, button → department dashboard.

---

### 2.4 AI Marketplace Section

- **Search services** + **AI filter** (category, distance, rating, demand).
- **Categories:** Education, Health, Law, Delivery, Freelancing, IT, Home Services (grid of category cards).
- **Service cards:** Service icon, provider count, rating, AI demand indicator.
- Hover: glow + lift.

---

### 2.5 GoSellr Marketplace Section

- **Trending products** | **Nearby sellers** | **AI recommended** | **Flash deals**.
- **Product card:** Image, price, seller, rating, Add to cart.
- Hover: quick view affordance, glow, scale.

---

### 2.6 JPS Profiles Section

- **Top freelancers** | **Nearby service providers** | **Verified experts**.
- **Profile card:** Photo, STL level, skills, rating, verification badge (e.g. PSS).
- Same glass + hover system.

---

### 2.7 Franchise Opportunities Section

- **Open cities** with: investment required, expected income.
- Example card: “Islamabad Franchise — Investment: $5,000 — Monthly potential: $2,500”.
- CTA: “Apply” or “Learn more”.

---

### 2.8 EHB Modules (Super-App Tiles)

**Microsoft Store tiles style** — grid of modules:

- GoSellr  
- JPS  
- AI Marketplace  
- Wallet  
- Affiliate  
- Franchise  
- (optional: PSS, WMS, …)

Each tile: **icon + title + “Open module”**. Same card style (glass, hover glow).

---

### 2.9 AI Suggestions Panel

- **AI Insight** block, e.g.:
  - “Delivery demand in Rawalpindi increased 23%. Activate delivery service to earn more.”
- Uses: market demand, location, user skills.
- Design: glass card, optional neon accent, one CTA button.

---

## 3. Dashboard Structure (post-login)

When user logs in → **Dashboard** (same OS-style layout):

- **Sidebar:** Dashboard, AI Marketplace, GoSellr, JPS, Franchise, Wallet, Services, Settings.
- **Top navbar:** Search, notifications, wallet balance, profile.
- **Main area:** Widgets (wallet balance, orders today, AI suggestions, affiliate earnings, nearby requests). Same glass + neon rules.

---

## 4. Modular UI Rule (700+ services)

Har **service / module** plug-in ki tarah add ho. Structure:

```
Module
 ├ Dashboard
 ├ Marketplace (if applicable)
 ├ Analytics
 └ Settings
```

- **Home** = aggregated view (sections 2.1–2.9).
- **Each module** = its own Dashboard + (optional) Marketplace + Analytics + Settings.
- UI components reusable: same cards, same navbar/sidebar, same design tokens.

---

## 5. Full Screen List (25+ screens)

| # | Route / Screen | Purpose |
|---|----------------|--------|
| 1 | `/` | **Home** – Hero, Trending, Departments, AI Marketplace, GoSellr, JPS, Franchise, Modules, AI Suggestions, Footer |
| 2 | `/dashboard` | **Dashboard** – Welcome, stats row, AI panel, widgets |
| 3 | `/ai-marketplace` | **AI Marketplace** – Search, filters, categories, service cards |
| 4 | `/ai-marketplace/[category]` | Category listing / filters |
| 5 | `/gosellr` | **GoSellr** – Trending, nearby sellers, AI recommended, flash deals |
| 6 | `/gosellr/product/[id]` | Product detail |
| 7 | `/gosellr/cart` | Cart |
| 8 | `/jps` | **JPS** – Profiles, freelancers, verified experts |
| 9 | `/jps/profile/[id]` | Profile detail |
| 10 | `/jps/jobs` | Jobs list |
| 11 | `/franchise` | **Franchise** – Open cities, investment, apply |
| 12 | `/franchise/dashboard` | Franchise owner dashboard (orders, revenue, commission) |
| 13 | `/wallet` | **Wallet** – Balance, affiliate, earnings, withdraw, charts |
| 14 | `/services` | **Services hub** – Categories, my services, bookings |
| 15 | `/services/[category]` | Service category |
| 16 | `/services/[id]` | Service detail / booking |
| 17 | `/ai-insights` | **AI Insights** – Suggestions, demand, fraud insights |
| 18 | `/departments/pss` | PSS dashboard |
| 19 | `/departments/jps` | JPS dashboard (or redirect to /jps) |
| 20 | `/departments/wms` | WMS dashboard |
| 21 | `/affiliate` | **Affiliate** – Campaigns, earnings, links |
| 22 | `/settings` | **Settings** – Account, notifications, theme, security |
| 23 | `/notifications` | Notifications center |
| 24 | `/search` | Global search results |
| 25 | `/admin` | Super Admin (existing) |
| 26 | `/development` | Development map (existing) |

*(Add more as needed: CRB, EMO, EHB Aid dashboards, etc.)*

---

## 6. Design System (short ref)

- **Background:** `#020617`, surface `#020c1b`, glass `rgba(255,255,255,0.05)`.
- **Accents:** `#00eaff`, `#3b82f6`, `#8b5cf6`.
- **Components:** `glass-panel`, `glass-card`, `card-hover`, `card-interactive`, `btn-glow`, `nav-glass`, `page-mesh`, `container-ehb` (see `EHB_SUPER_DASHBOARD_BLUEPRINT.md` for full list).
- **Cards:** Hover = lift -6px, scale 1.03, neon border glow; 250ms ease; GPU-friendly (transform + opacity).

---

## 7. Cursor AI – Full EHB UI generation

Jab bhi Cursor se **full EHB UI** generate karwana ho, ye prompt use karo:

```
You are building the EHB Super-App UI. Follow:

1. docs/EHB_SUPER_APP_UI_BLUEPRINT.md (Microsoft Store style home, sections 2.1–2.9, 25+ screens).
2. docs/EHB_SUPER_DASHBOARD_BLUEPRINT.md (layout, design system, dashboard/widgets).

Rules:
- Home page: Top Navbar → Hero AI Banner → Trending Services → Departments → AI Marketplace → GoSellr → JPS → Franchise → EHB Modules (tiles) → AI Suggestions → Footer. No full-page background override.
- Every module has: Dashboard (+ optional Marketplace, Analytics, Settings). Use sidebar + nav-glass layout for dashboard routes.
- Use only design system: #020617, #020c1b, glass, #00eaff, #3b82f6, #8b5cf6; .glass-panel, .card-hover, .btn-glow, .nav-glass, .container-ehb.
- Cards: hover lift -6px, scale 1.03, neon glow; 250ms ease. No bg-slate-950 or old slate panels.
- Output: complete React/Next.js components; keep existing data/copy; change only layout and styling to match blueprints.
```

---

## 8. Implementation order (suggested)

1. **Home** – Navbar + Hero + sections 2.2–2.9 (reuse existing AI Marketplace / GoSellr blocks where ready).
2. **Dashboard** – Sidebar + navbar + widgets (wallet, orders, AI suggestions).
3. **AI Marketplace** – Search, filters, categories, service cards (align with current page).
4. **GoSellr** – Product grid, product card, cart entry.
5. **JPS** – Profile cards, profile detail, jobs list.
6. **Franchise** – Opportunities + franchise dashboard.
7. **Wallet** – Balance, earnings, charts.
8. **Departments** – PSS, JPS, WMS, EHB Aid dashboards (tiles from home link here).
9. **Settings, Notifications, Search** – Standard screens with same layout/components.

Rafi bhai — jab bolo **“Design full EHB UI system”** ya **“Home page Microsoft Store style bana do”**, isi blueprint ke hisaab se step-by-step implement kiya ja sakta hai (Figma ke liye ye doc hi screen-by-screen spec hai; Cursor ke liye upar wala prompt use karo).
