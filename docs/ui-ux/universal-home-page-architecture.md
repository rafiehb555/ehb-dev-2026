## EHB UNIVERSAL HOME & SERVICE PAGE ARCHITECTURE

This document captures the **universal home page structure** you described (Microsoft Store–style), so that all industries and services can reuse the same UX with different data only.

---

## 1️⃣ UNIVERSAL LAYOUT CONCEPT

All main and service home pages share the **same layout and components**; only the **data and labels change**.

Example pages using this layout:

- EHB Main Home (all services)
- Legal Home (lawyers, cases, legal AI tools)
- Medical Home (doctors, hospitals, medical AI tools)
- Jobs Home (jobs, employers, career AI tools)
- Travel Home (flights, hotels, travel AI tools)
- GoSellr Home (products marketplace)

High-level layout:

```text
Top Navbar
Hero Banner / Featured
Trending Section
AI Tools Section
Essential Marketplace Items
Verification / STL Levels
Franchise Section
Roadmap / Future Plans
Footer
```

---

## 2️⃣ SHARED UI COMPONENTS (USED ACROSS INDUSTRIES)

These components are **reused on all home / landing pages**; only props/data differ:

- **Navbar**
  - Logo, global search (AI-powered), notifications, wallet, profile.
  - Main menu links (Marketplace, AI Tools, Products, Services, Orders, Franchise, Verification, Analytics, Settings).

- **HeroBanner**
  - Large featured banner + 2–3 side cards.
  - Content changes per domain:
    - Legal: “AI Divorce Assistant”, “Find Verified Lawyer”, “Generate Legal Documents”.
    - Medical: “AI Health Diagnosis”, “Find Verified Doctors”, “Book Hospital Appointment”.
    - Jobs: “AI CV Builder”, “Find Verified Employers”, “Apply to Top Jobs”.
    - Travel: “AI Travel Planner”, “Find Flights & Hotels”.
    - GoSellr: “Featured Deals”, “New Arrivals”, “Top-Rated Sellers”.

- **TrendingSection**
  - Grid of trending items (services or products) with:
    - Image, title, rating, verification/STL badge, price.
  - Data type per industry:
    - Legal: trending lawyers / law firms.
    - Medical: trending doctors / clinics.
    - Jobs: trending job posts or companies.
    - Travel: trending destinations / packages.
    - GoSellr: trending products.

- **AIToolsSection**
  - List or grid of “Top Trusted AI Tools”, such as:
    - AI Lawyer, AI Doctor, AI Resume Builder, AI Contract Generator, AI Travel Planner.
  - Each page chooses relevant subset for its industry.

- **MarketplaceGrid / EssentialItems**
  - Reusable card layout for “Essential actions”:
    - Hire Lawyer, Book Doctor, Find Job, Buy Product, Book Travel, etc.

- **VerificationLevels / STLSection**
  - Visual display of trust/service levels (e.g. Free, Basic, Normal, High, VIP).
  - Connected to **EHB-STL-LEVEL** system; shows verification level, STL trust score, and quality tier.

- **FranchiseSection**
  - Cards for Sub Franchise, Master Franchise, Corporate Franchise:
    - Investment, benefits, region, “Apply” CTA.

- **RoadmapSection**
  - Timeline of platform evolution (e.g. 2025 Launch, 2026 Expansion, 2027 Blockchain, 2028 AI Ecosystem).

- **RecommendationSection (AI Personalization)**
  - “Recommended for you” based on:
    - Past searches, opened pages, previous bookings/purchases.
  - Shared logic, different content per user and industry.

All these components live in a shared `components/` library and are wired with different `data/*` sources per service.

---

## 3️⃣ DATA CONFIG PER INDUSTRY / SERVICE

Each service home page uses **the same components** but with **different data configs**, for example:

- **Legal Home (`/services/legal`)**
  - Trending: lawyers, law firms, legal templates.
  - AI Tools: AI Lawyer, AI Contract Generator, AI Case Analyzer.
  - Essential Actions: “Hire Lawyer”, “Start Divorce Case”, “Register Company”.

- **Medical Home (`/services/medical`)**
  - Trending: doctors, hospitals, labs.
  - AI Tools: AI Diagnosis, AI Prescription Helper, Medical Report Analyzer.
  - Essential Actions: “Book Doctor”, “Find Hospital”, “Order Lab Test”.

- **Jobs Home (`/services/jobs`)**
  - Trending: jobs, employers, career paths.
  - AI Tools: AI Resume Builder, Interview Coach, Job Match Engine.
  - Essential Actions: “Find Job”, “Post Job”, “Build CV”.

- **Travel Home (`/services/travel`)**
  - Trending: destinations, packages, airlines.
  - AI Tools: AI Travel Planner, Visa Checklist Assistant.
  - Essential Actions: “Search Flights”, “Book Hotel”, “Holiday Packages”.

- **GoSellr Home (`/services/gosellr`)**
  - Trending: products & sellers.
  - AI Tools: Product Recommendation, Price Optimization, AI Upsell.
  - Essential Actions: “Buy Now”, “Sell on GoSellr”, “View Deals”.

Configuration lives in per-domain data files such as:

- `data/legal.ts` / `data/legal.json`
- `data/medical.ts`
- `data/jobs.ts`
- `data/travel.ts`
- `data/gosellr.ts`

Each exports:

- Hero content
- Trending items
- AI tools list
- Essential actions
- Franchise / roadmap text overrides (if needed)

---

## 4️⃣ CORE EHB SYSTEMS BEHIND THESE UI SECTIONS

The same backend “departments” feed these UI components, regardless of industry:

- **DMO (Core Control)**
  - Manages navigation, feature flags, which sections show on which home page.

- **JPS (Job Profile System)**
  - Provides professional data for:
    - Legal (lawyers), Medical (doctors), Jobs (candidates), etc.
  - Powers the “Trending” and “Recommended” professional cards.

- **PSS + CRB + STL**
  - PSS: identity verification data.
  - CRB: certification and industry‑specific approval.
  - STL: trust scores and levels.
  - These systems drive the **VerificationLevels / STL badges** on all cards.

- **Marketplace (GoSellr + Services)**
  - Supplies product listings, service listings, pricing and availability.

- **Affiliate System**
  - Provides:
    - Referral tracking (who invited who).
    - Commission info for CTA buttons and promos (“Shared by your affiliate leader”, etc.).

- **Franchise System**
  - Feeds data into FranchiseSection:
    - Available territories, investment tiers, contact info.

- **AI Systems**
  - AI Matching & Recommendation:
    - Used in search bar, RecommendedSection, AI Tools tiles.
  - AI Analytics:
    - Used to decide what appears in “Trending” and “For You”.

---

## 5️⃣ SUGGESTED NEXT.JS STRUCTURE (IMPLEMENTATION HINT)

Example application structure to keep the universal layout clean:

```text
app/
  home/                      # Main EHB home
  services/
    legal/
    medical/
    jobs/
    travel/
    technology/
    education/
    gosellr/

components/
  HeroBanner.tsx
  TrendingSection.tsx
  AIToolsSection.tsx
  MarketplaceGrid.tsx
  VerificationLevels.tsx
  FranchiseSection.tsx
  RoadmapSection.tsx
  RecommendationSection.tsx

data/
  legal.ts
  medical.ts
  jobs.ts
  travel.ts
  gosellr.ts
```

Every page imports the **same components** but a different `data/*` config, ensuring:

- Development speed
- Visual consistency
- Easy scaling to new industries and services

