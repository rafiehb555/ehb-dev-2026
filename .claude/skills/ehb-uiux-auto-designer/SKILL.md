# EHB UI/UX Auto-Designer Skill

> **Version:** 2.0 — Production-Complete  
> **Last updated:** 2026-04-12  
> **Owner:** EHB Technologies (Pvt.) Ltd.  
> **Purpose:** Every AI agent (Claude, Cursor, Copilot, Aider, etc.) MUST read this skill top-to-bottom before designing or coding ANY EHB interface. This is the single source of truth for UI/UX decisions across the entire platform.

---

## §1 — Company Identity

- **Company:** EHB Technologies (Pvt.) Ltd.
- **Tagline:** Education · Health · Business
- **Mission:** Unify 32 industries in one global super-app with AI + blockchain trust.
- **Product:** A futuristic, premium-grade platform — every screen must look like Apple, Stripe, or Tesla designed it.
- **Language:** Code & comments in English. Dev communication bilingual (English + Roman Urdu). UI copy in English (with i18n hooks for Urdu/Arabic later).

---

## §2 — Brand Colors (from EHB Logo)

The EHB logo contains four primary brand colors. These are the **root identity colors** — every theme, accent, gradient, and industry palette derives from or complements these:

| Color   | Hex       | Usage                                        |
|---------|-----------|----------------------------------------------|
| Red     | `#E53935` | Alerts, urgent status, critical actions, CRB  |
| Blue    | `#29ABE2` | Primary brand accent, links, CTAs, headers    |
| Green   | `#22B14C` | Success, verified, trust badges, STL positive |
| Orange  | `#F59E0B` | Warnings, pending states, franchise, wallet   |

### Brand Gradient (hero / splash)
```css
background: linear-gradient(135deg, #E53935 0%, #F59E0B 25%, #22B14C 50%, #29ABE2 75%, #E53935 100%);
```

### Logo Usage Rules
- Minimum size: 32×32px
- Always use the official `ehb-logo.png` from `/public/ehb-logo.png`
- Never stretch, rotate, or recolor the logo
- On dark backgrounds: use as-is. On light backgrounds: use as-is (logo has sufficient contrast).

---

## §3 — Four-Theme System

EHB supports 4 themes, switchable globally via `data-ehb-theme` attribute on `<html>`. The theme persists in `localStorage("ehb-dmo-theme")` and an anti-flash `<script>` in `<head>` applies it before first paint.

### Theme Tokens

| Token           | Dark `default`  | White           | Purple          | Midnight        |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| **bg**          | `#080A14`       | `#ECEDF6`       | `#08021E`       | `#010812`       |
| **surface-1**   | `#0C0E1A`       | `#FFFFFF`       | `#0F0628`       | `#040E1E`       |
| **surface-2**   | `#13162A`       | `#F3F2FC`       | `#160A35`       | `#081828`       |
| **surface-3**   | `#1A1D33`       | `#E8E6F5`       | `#1E1045`       | `#0C2236`       |
| **text-primary**| `#FFFFFF`       | `#12133A`       | `#F0E0FF`       | `#E0F4FF`       |
| **text-body**   | `rgba(255,255,255,0.75)` | `#2A2B50` | `rgba(240,224,255,0.75)` | `rgba(224,244,255,0.75)` |
| **text-muted**  | `rgba(255,255,255,0.45)` | `#6B6D8A` | `rgba(240,224,255,0.45)` | `rgba(224,244,255,0.45)` |
| **border**      | `rgba(255,255,255,0.08)` | `rgba(18,19,58,0.12)` | `rgba(240,224,255,0.08)` | `rgba(224,244,255,0.08)` |
| **accent**      | `#29ABE2`       | `#1A73BA`       | `#A078F0`       | `#29ABE2`       |
| **sidebar-bg**  | `#0C0E1A`       | `#FFFFFF`       | `#0A0420`       | `#020A16`       |
| **topbar-bg**   | `rgba(12,14,26,0.85)` | `rgba(255,255,255,0.92)` | `rgba(8,2,30,0.85)` | `rgba(1,8,18,0.85)` |
| **card-shadow** | `0 2px 12px rgba(0,0,0,0.4)` | `0 2px 12px rgba(0,0,0,0.08)` | `0 2px 12px rgba(0,0,0,0.5)` | `0 2px 12px rgba(0,0,0,0.5)` |

### 5-Layer Surface Hierarchy
Each theme has 5 surface levels with ≥15% brightness difference:
1. **Page background** — deepest layer
2. **Surface-1** — main containers, sidebar
3. **Surface-2** — cards, panels
4. **Surface-3** — nested cards, inner elements
5. **Surface-4** — hover states, active elements

### White Theme Special Rules
- All pastel accents must be darkened for readability:
  - `#A098F8` → `#5B4ED6` (purple)
  - `#2BBFA0` → `#0D8A72` (teal)
  - `#38C878` → `#1A8F54` (green)
  - `#F0A030` → `#B87514` (amber)
  - `#F05858` → `#C03030` (red)
  - `#C3BCFC` → `#6B5FD6` (light purple)
  - `#5FDCBF` → `#1F9C80` (light teal)
  - `#F5BB66` → `#B87A14` (light amber)
  - `#FF8A80` → `#C04040` (light red)
  - `#81D4FA` → `#0D6EAD` (light blue)
- Text on white cards must be dark (`#12133A`)
- Text on dark cards (if any) must be light
- Minimum text opacity equivalent: 60% (boost low-alpha values)

### Anti-Flash Script (in `<head>`)
```js
try {
  var t = localStorage.getItem("ehb-dmo-theme");
  if (t && ["dark","white","purple","midnight"].includes(t))
    document.documentElement.setAttribute("data-ehb-theme", t);
  else
    document.documentElement.setAttribute("data-ehb-theme", "dark");
} catch(e) {
  document.documentElement.setAttribute("data-ehb-theme", "dark");
}
```

### ThemeCSSInjector Pattern
- Standalone `"use client"` component in root `layout.tsx`
- Renders a `<style>` tag with ALL theme CSS overrides
- Uses `background: X !important` (shorthand, NOT `background-color`) to override inline gradients
- Covers: cards, sidebar, topbar, hero, glass panels, text colors, accents, borders, shadows

---

## §4 — 32 Industries with Accent Colors

Each of the 32 industries has its own accent color used for: page headers, sidebar highlights, progress indicators, chips, and section borders within that industry's module.

### Phase 1 — Active (6 industries)

| # | Industry     | Module  | Accent Color | Hex       |
|---|-------------|---------|--------------|-----------|
| 1 | E-Commerce  | GoSellr | Ocean Blue   | `#29ABE2` |
| 2 | Legal       | OLS     | Crimson Red  | `#E53935` |
| 3 | Medical     | WMS     | Emerald Green| `#22B14C` |
| 4 | Education   | HPS/OBS | Royal Purple | `#7B6EF6` |
| 5 | Jobs        | JPS     | Amber Gold   | `#F59E0B` |
| 6 | Travel      | AGTS    | Coral Pink   | `#FF6B6B` |

### Phase 2 — Queued (13 industries)

| #  | Industry      | Accent Color   | Hex       |
|----|--------------|----------------|-----------|
| 7  | Finance      | Deep Teal      | `#0D9488` |
| 8  | Consulting   | Steel Blue     | `#4A90D9` |
| 9  | Construction | Concrete Gray  | `#6B7280` |
| 10 | Agriculture  | Leaf Green     | `#65A30D` |
| 11 | Automotive   | Chrome Silver  | `#94A3B8` |
| 12 | Hospitality  | Warm Burgundy  | `#9F1239` |
| 13 | Real Estate  | Brick Red      | `#DC2626` |
| 14 | Entertainment| Electric Violet| `#8B5CF6` |
| 15 | Media        | Slate Indigo   | `#6366F1` |
| 16 | Fashion      | Rose Gold      | `#F472B6` |
| 17 | Beauty       | Soft Magenta   | `#EC4899` |
| 18 | Fitness      | Lime Green     | `#84CC16` |
| 19 | Logistics    | Navy Blue      | `#1E40AF` |

### Phase 3 — Future (13 industries)

| #  | Industry      | Accent Color   | Hex       |
|----|--------------|----------------|-----------|
| 20 | Manufacturing| Industrial Gray| `#475569` |
| 21 | Energy       | Solar Yellow   | `#EAB308` |
| 22 | Technology   | Neon Cyan      | `#06B6D4` |
| 23 | Telecom      | Signal Blue    | `#3B82F6` |
| 24 | Government   | Official Navy  | `#1E3A5F` |
| 25 | NGO          | Hope Green     | `#10B981` |
| 26 | Sports       | Victory Orange | `#F97316` |
| 27 | Music        | Rhythm Purple  | `#A855F7` |
| 28 | Gaming       | Neon Pink      | `#F43F5E` |
| 29 | Food         | Appetizing Red | `#EF4444` |
| 30 | Pets         | Warm Brown     | `#A16207` |
| 31 | Weddings     | Blush Pink     | `#FDA4AF` |
| 32 | Events       | Festival Gold  | `#D97706` |

### How to Apply Industry Accent
```tsx
// In any industry page:
const INDUSTRY_ACCENT = "#29ABE2"; // GoSellr example
// Use for: section headers, active sidebar item, progress bars, chip backgrounds (15% opacity)
// Chip pattern: bg-[${accent}]/15 border border-[${accent}]/30 text-[${accent}]
```

---

## §5 — 8 Core Systems

Every EHB page may reference one or more of these core systems. The agent must understand what each does to design correct UI flows.

### 5.1 AI Department
- **Purpose:** Recommendation engine, fraud detection, legal AI, medical diagnosis, tutoring
- **UI Elements:** AI confidence badges, recommendation cards, fraud alert banners, AI chat widget
- **Data Flow:** User action → AI service (port 8080) → prediction/recommendation → display in relevant module

### 5.2 Blockchain / Trust Chain
- **Purpose:** Polkadot-based CRB certificate hashes, on-chain STL proofs
- **UI Elements:** Certificate verification badges, blockchain hash links, trust chain visualization
- **Data Flow:** Verification event → blockchain hash → store in CRB model → display badge on profile

### 5.3 Finance / Wallet
- **Purpose:** EHB Wallet, escrow, 40/25/20/15 revenue split
- **UI Elements:** Wallet balance card, transaction history table, escrow status, revenue split visualization
- **Revenue Split:** Platform 40% / Service Provider 25% / Franchise 20% / Affiliate 15%
- **Currency:** EHBGC (EHB Global Coin) — displayed as `850.00 EHBGC` in header

### 5.4 Affiliate System
- **Purpose:** Multi-level referral tracking
- **UI Elements:** Referral tree visualization, commission breakdown, invite link generator, tier badges
- **Data Flow:** Referral link → new user signup → track chain → calculate commissions → wallet credit

### 5.5 Franchise System
- **Purpose:** Country → Corporate → Sub hierarchy
- **UI Elements:** Franchise map, hierarchy tree, territory assignment, performance dashboard
- **Levels:** Country Franchise → Corporate Franchise → Sub Franchise
- **Data Flow:** Franchise application → CRB verification → territory assignment → revenue tracking

### 5.6 JPS — Job Profile & Skill
- **Purpose:** AI-powered job matching
- **UI Elements:** Skill radar chart, job match cards, profile completeness ring, interview scheduler
- **Data Flow:** User skills → AI matching → job recommendations → application tracking

### 5.7 Verification — PSS / CRB / STL
- **PSS** (Proof & Security System): KYC, liveness detection, AML checks
  - UI: ID upload, selfie capture, verification status badges, AML alert cards
- **CRB** (Certification & Registry Board): Physical + legal verification
  - UI: Certificate upload, inspector assignment, approval workflow, blockchain hash display
- **STL** (Service Trust Level): L0 → L8 SUPREME progressive trust
  - UI: Trust level badge, level progress bar, requirements checklist, level-up animation
  - Formula is in `services/api/stl-replit/services/stlService.js` — NEVER modify without running tests

### 5.8 DMO — Decentralized Management Office
- **Purpose:** 8-step user flow, L8 approval, policy management
- **UI Elements:** Step progress wizard, policy cards, approval queue, management dashboard
- **8 Steps:** Registration → KYC (PSS) → Basic Verification → CRB Submission → STL Assessment → Service Activation → Performance Review → L8 Supreme Application

---

## §6 — Global Layout Architecture (ALL Pages)

Every single page in the EHB platform MUST follow this layout structure. No exceptions.

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (always visible, sticky, z-50)                              │
│  Logo | Search (contextual) | Nav Tabs | Theme Switcher | Wallet     │
├──────────────────────────────────────────────────────────────────────┤
│  INDUSTRIES BAR (horizontal scroll, all 32 industries)               │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│ SIDEBAR  │  PAGE CONTENT                                             │
│ (if      │  (varies by module)                                       │
│  module  │                                                           │
│  page)   │                                                           │
│          │                                                           │
├──────────┴───────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
                                                    ┌─────────┐
                                                    │ AI      │
                                                    │ Agent   │  ← Always visible
                                                    │ Widget  │     bottom-right
                                                    └─────────┘
```

### 6.1 Top Bar (Always Visible)
- **Position:** `sticky top-0 z-50` with `backdrop-blur-xl`
- **Left:** EHB logo + company name
- **Center:** Contextual search bar
- **Right:** Navigation tabs, Theme switcher (4 dots), Notifications bell, Wallet balance
- **Search Behavior:** Contextual — shows results relevant to the current page:
  - On Home → searches all industries, services, products
  - On GoSellr → searches products, sellers, categories
  - On DMO → searches policies, users, STL levels
  - On Legal (OLS) → searches lawyers, cases, documents
  - On Medical (WMS) → searches doctors, clinics, appointments
  - On any module → filters results to that module first, then shows global results

### 6.2 Industries Bar
- Horizontal scrollable row of 32 industry icons/labels
- Current active industry is highlighted with its accent color
- Click navigates to that industry's landing page

### 6.3 AI Assistant Widget (Always Visible)
- **Position:** `fixed bottom-4 right-4 z-50`
- **Appearance:** Floating circular button (56px) with EHB brand gradient, pulsing glow
- **Expanded state:** Chat panel (360×480px) slides up from the button
- **Input modes:** Text input + Voice button (microphone icon)
- **Capabilities:**
  - Answer questions about EHB platform
  - Navigate user to any page ("take me to GoSellr")
  - Show STL level status
  - Explain verification steps
  - Provide industry-specific help based on current page
- **Voice:** Uses Web Speech API for voice-to-text, with visual waveform animation during listening
- **Behavior:** Widget persists across ALL page navigations (rendered in root layout, not per-page)

### 6.4 Sidebar (Module Pages Only)
- Appears on module pages (DMO, GoSellr, OLS, etc.)
- Width: 272px, hidden on mobile (< 640px)
- Grouped navigation with collapsible sections
- Active item highlighted with module accent color
- Glass morphism background matching current theme

---

## §7 — Page Content Map

This section defines WHAT content goes WHERE on each major page. Agents must follow this when designing any page.

### 7.1 Home Page (`/`)
```
┌─ Hero Section ────────────────────────────────────────────┐
│  Headline: "One Platform. 32 Industries. Infinite Trust." │
│  Subline: "AI-powered verification. Blockchain trust."    │
│  CTA: "Explore Platform" | "Start Verification"          │
│  Background: Animated gradient mesh with brand colors     │
└───────────────────────────────────────────────────────────┘
┌─ Trust Stats Bar ─────────────────────────────────────────┐
│  Users: 12,450+ | Verified: 8,200+ | Industries: 32      │
│  STL Average: L4.2 | Transactions: $2.4M+                │
└───────────────────────────────────────────────────────────┘
┌─ Featured Industries (6 Phase-1) ─────────────────────────┐
│  [GoSellr Card] [OLS Card] [WMS Card]                     │
│  [HPS Card]     [JPS Card] [AGTS Card]                    │
│  Each card: Icon + Name + Description + "Enter" CTA       │
└───────────────────────────────────────────────────────────┘
┌─ How It Works (3-step) ──────────────────────────────────┐
│  1. Register & Verify (PSS/KYC)                           │
│  2. Build Trust Level (STL L0→L8)                         │
│  3. Access All 32 Industries                              │
└───────────────────────────────────────────────────────────┘
┌─ AI Marketplace Preview ─────────────────────────────────┐
│  Top trending services from all industries                │
│  Filterable by industry, trust level, rating              │
└───────────────────────────────────────────────────────────┘
┌─ Testimonials / Trust Badges ────────────────────────────┐
│  Verified user testimonials with STL badges               │
└───────────────────────────────────────────────────────────┘
```

### 7.2 Marketplace Page (`/marketplace`)
- **Header:** Search + filter bar (industry, price range, STL level, rating)
- **Grid:** Service/product cards — each showing:
  - Thumbnail, Title, Provider name + STL badge, Price, Rating, Industry tag
- **Sidebar filters:** Industry checkboxes, Price slider, Min STL level, Location
- **Data source:** All active services/products across all 32 industries
- **Sort options:** Newest, Price low→high, Price high→low, Highest rated, Highest STL

### 7.3 DMO Dashboard (`/dmo`)
- **Hero:** Obsidian glass panel with:
  - Platform overview stats (users, verified, revenue, STL average)
  - Real-time status indicators
- **Metric cards row:** 4 key metrics with sparkline trends
- **Sections:**
  - STL Level Distribution (chart)
  - Recent Verifications (table)
  - Franchise Network (map/tree)
  - Revenue Analytics (charts)
  - Active Alerts (fraud, pending approvals)
  - Policy Updates (cards)

### 7.4 STL Dashboard (`/dmo/stl`)
- **User's current level:** Large badge + progress ring
- **Requirements table:** What's needed for next level (checkmarks)
- **Level ladder:** Visual L0→L8 progression with user's position
- **History:** Past level changes with timestamps
- **Leaderboard:** Top verified users by STL level

### 7.5 CRB Page (`/dmo/crb`)
- **Pending applications:** Table with status, date, type
- **Certificate viewer:** Upload preview, blockchain hash, inspector notes
- **Approval workflow:** Step indicators (Submitted → Reviewing → Inspector Assigned → Verified → Blockchain Recorded)
- **Expiry tracker:** Certificates nearing expiration with renewal CTA

### 7.6 Wallet Page (`/dmo/wallet`)
- **Balance card:** EHBGC balance with fiat equivalent
- **Quick actions:** Send, Receive, Escrow, Convert
- **Transaction history:** Filterable table (date, type, amount, status, counterparty)
- **Revenue split visualization:** Pie/bar chart showing 40/25/20/15 breakdown
- **Escrow section:** Active escrows with release/dispute buttons

### 7.7 Franchise Page (`/dmo/franchise`)
- **Hierarchy tree:** Country → Corporate → Sub visualization
- **Territory map:** Geographic coverage with color-coded franchise zones
- **Performance table:** Revenue, users, STL average per franchise
- **Application section:** New franchise application form + status tracker

### 7.8 GoSellr (`/gosellr`)
- E-commerce module — product listings, seller profiles, cart, checkout
- Seller dashboard: Sales analytics, inventory, order management
- Product page: Images, description, price, seller STL badge, reviews, add-to-cart

### 7.9 Industry Landing Pages (`/[industry]`)
- Each of 32 industries gets a landing page with:
  - Hero with industry accent color
  - Featured services/providers in that industry
  - Industry-specific search
  - Top-rated providers with STL badges
  - "How it works" for that specific industry

---

## §8 — Typography System

| Role        | Font           | Size (desktop) | Weight | Line Height |
|-------------|---------------|----------------|--------|-------------|
| H1          | DM Sans       | 36px           | 700    | 1.2         |
| H2          | DM Sans       | 28px           | 600    | 1.3         |
| H3          | DM Sans       | 22px           | 600    | 1.3         |
| H4          | DM Sans       | 18px           | 600    | 1.4         |
| Body        | DM Sans       | 15px           | 400    | 1.6         |
| Body Small  | DM Sans       | 13px           | 400    | 1.5         |
| Caption     | DM Sans       | 11px           | 400    | 1.4         |
| Code/Mono   | JetBrains Mono| 13px           | 400    | 1.5         |
| Metric/Stat | DM Sans       | 32–48px        | 700    | 1.1         |

### Responsive Scaling
- Desktop (≥1280px): Base sizes above
- Tablet (768–1279px): Scale to 90%
- Mobile (<768px): Scale to 85%, H1 caps at 28px

---

## §9 — Component Patterns

### 9.1 Glass Card (Primary container)
```css
background: rgba(19, 22, 42, 0.85);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 12px;
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
```

### 9.2 Chip / Tag
```css
background: rgba(accent, 0.15);
border: 1px solid rgba(accent, 0.30);
color: accent;
border-radius: 6px;
padding: 4px 10px;
font-size: 12px;
font-weight: 500;
```

### 9.3 Button Hierarchy
1. **Primary:** Solid accent color, white text, hover darken 10%
2. **Secondary:** Ghost/outline, accent border, accent text, hover fill 10%
3. **Destructive:** Red background, white text
4. **Ghost:** No border, text only, hover subtle bg

### 9.4 Trust Badge (STL)
- Circular badge with level number (L0–L8)
- Color progression: Gray(L0) → Blue(L1-2) → Green(L3-4) → Gold(L5-6) → Purple(L7) → Diamond(L8)
- Glow effect on L5+ badges
- Tooltip shows full level name on hover

### 9.5 Stat / Metric Card
```
┌──────────────────────┐
│  📊 Label            │
│  ████████░░ 78%      │
│  1,234               │  ← Large number
│  +12.5% ↑            │  ← Delta chip (green=up, red=down)
└──────────────────────┘
```

### 9.6 Data Table
- Header: `surface-3` background, uppercase 11px labels
- Rows: Alternating subtle stripe, hover highlight
- Pagination: Bottom-right, show 10/25/50 options
- Search: Top-right inline filter
- Sort: Click column headers

---

## §10 — Animation & Motion

| Animation          | Duration | Easing                    | Usage                   |
|--------------------|----------|---------------------------|-------------------------|
| Page transition    | 300ms    | `ease-out`                | Route changes           |
| Card hover lift    | 200ms    | `ease-in-out`             | Cards, buttons          |
| Fade in            | 400ms    | `ease-out`                | Content load            |
| Slide up           | 350ms    | `cubic-bezier(.4,0,.2,1)` | Modals, drawers        |
| Pulse glow         | 2000ms   | `ease-in-out` (infinite)  | AI widget, live badges |
| Number count-up    | 800ms    | `ease-out`                | Statistics, metrics    |
| Skeleton shimmer   | 1500ms   | `linear` (infinite)       | Loading states         |

### Ambient Effects (DMO/Module pages)
- Drifting orbs: 2 large gradient blurs, 20–30s float cycle, opacity 0.12–0.20
- Scan line: Horizontal light sweep, 8s cycle, opacity 0.03
- These are purely decorative and use `pointer-events-none`

### Reduced Motion
Always wrap animations in `@media (prefers-reduced-motion: no-preference)`. Disable ambient effects entirely for `prefers-reduced-motion: reduce`.

---

## §11 — Responsive Breakpoints

| Breakpoint | Min Width | Tailwind | Layout Changes                          |
|------------|-----------|----------|-----------------------------------------|
| Mobile     | 0px       | default  | Single column, no sidebar, bottom nav   |
| Tablet     | 640px     | `sm:`    | Sidebar appears, 2-col grid             |
| Desktop    | 1024px    | `lg:`    | Full sidebar, 3–4 col grid              |
| Wide       | 1280px    | `xl:`    | Container max-width, comfortable spacing|
| Ultra      | 1536px    | `2xl:`   | Max container, extra padding            |

### Mobile-Specific Rules
- Bottom navigation bar (MobileBottomNav) replaces sidebar
- Cards stack vertically, full-width
- Tables become scrollable or convert to card layout
- AI widget: Smaller (48px button), fullscreen chat panel when open
- Industries bar: Horizontal scroll with momentum

---

## §12 — Tech Stack & File Architecture

| Layer      | Technology                                    | Port  |
|------------|-----------------------------------------------|-------|
| Frontend   | Next.js 14 App Router + TypeScript + Tailwind | 3000  |
| API        | Node 20 + Express + Mongoose (ESM)            | 5000  |
| AI backend | Node 20 + Express + OpenAI (CommonJS)         | 8080  |
| Database   | MongoDB 7                                     | 27017 |

### File Placement Rules

| What                    | Where                                              |
|-------------------------|----------------------------------------------------|
| New page                | `apps/web/app/<feature>/page.tsx`                  |
| New component           | `apps/web/components/<feature>/ComponentName.tsx`  |
| Shared UI component     | `apps/web/components/ui/` (lowercase filenames!)   |
| API route               | `services/api/stl-replit/routes/<feature>Routes.js`|
| Business logic          | `services/api/stl-replit/services/<feature>.js`    |
| Theme tokens            | `apps/web/lib/dmo/theme.ts`                        |
| Theme CSS overrides     | `apps/web/components/ThemeCSSInjector.tsx`          |
| Theme provider          | `apps/web/components/dmo/DmoThemeProvider.tsx`      |
| Global theme switcher   | `apps/web/components/GlobalThemeSwitcher.tsx`       |

### Import Rules
- **NEVER** create a second `Card.tsx` — import from `@/components/ui/card`
- Use `@/` path alias for all imports within `apps/web/`
- Components are PascalCase, files match component name
- Exception: `ui/` folder uses lowercase (`card.tsx`, `button.tsx`)

---

## §13 — Auto-Upgrade Rule

**MANDATORY:** Never ship a "basic" UI — even when the prompt asks for one.

If a prompt says "just show X", upgrade it to:
1. A glass card container with proper surface hierarchy
2. Icon + label header with accent color
3. Chip/tag for status or category
4. Hover animation (lift + subtle glow)
5. Drill-in drawer or modal for details
6. Loading skeleton for async data
7. Empty state with illustration for no-data

**5-Level Upgrade Ladder:**
| Level | Name      | What to add                                        |
|-------|-----------|----------------------------------------------------|
| 1     | Structure | Glass card, proper spacing, surface hierarchy      |
| 2     | Polish    | Icons, accent colors, chips, badges                |
| 3     | Motion    | Hover effects, fade-in, transitions                |
| 4     | Delight   | Micro-interactions, count-up, sparklines           |
| 5     | Premium   | Ambient effects, 3D depth, cinematic feel          |

Every component should reach at least Level 3. Hero sections and dashboards must reach Level 5.

---

## §14 — Data Flow During Design

When designing a page, the agent must understand the complete data flow:

### Frontend → API → Database
```
User Action (click/submit)
  → React component calls API endpoint
  → Express route validates input (Zod schema)
  → Service layer processes business logic
  → Mongoose model reads/writes MongoDB
  → Response flows back through same chain
  → React component updates UI optimistically
```

### Real-Time Data
- WebSocket connection for live updates (notifications, chat, status changes)
- Server-Sent Events for dashboard metrics
- Poll fallback: 30s interval for non-critical data

### AI Integration Flow
```
User Query (text/voice from AI Widget)
  → Frontend sends to AI backend (port 8080)
  → AI service processes with OpenAI
  → Returns structured response
  → Widget displays response + suggested actions
  → User clicks action → navigates/executes
```

### Authentication Flow
```
Login → JWT issued → Stored in httpOnly cookie
  → Every API request includes JWT
  → Middleware validates + extracts user
  → User object available in req.user
  → Frontend reads user from /api/auth/me
```

---

## §15 — Trust Questions (Before Every UI Decision)

Before designing any component or page, the agent must answer these 4 questions:

1. **"Would Apple/Stripe/Tesla designers approve this?"** — If no, rebuild.
2. **"Does this respect the 5-layer surface hierarchy?"** — Cards should never be the same color as their parent.
3. **"Is text readable on ALL 4 themes?"** — Test mentally: dark text on white, light text on dark, accent contrast.
4. **"Does this component exist in `ui/` already?"** — Never duplicate. Extract and reuse.

---

## §16 — Hard Stops (Agent MUST NOT)

1. ❌ Use `background-color` to override inline `background` gradients — use `background` shorthand
2. ❌ Create a new `Card.tsx` file — import from `@/components/ui/card`
3. ❌ Modify the STL formula without running `npm run test:stl` (58 tests must pass)
4. ❌ Use `rounded-full` on cards or containers — only on avatars and dots
5. ❌ Hard-code production URLs, API keys, or credentials
6. ❌ Skip the anti-flash script in `<head>`
7. ❌ Place theme CSS in individual pages — use ThemeCSSInjector (root layout)
8. ❌ Use `SQL` or `EDR` — always use `STL` and `CRB`
9. ❌ Forget to update `design-system/EHB-UIUX-SYSTEM.md` after adding new patterns
10. ❌ Ship without checking all 4 themes mentally

---

## §17 — Naming Migration (Auto-Corrections)

| Legacy Name | Current Name | Context |
|-------------|-------------|---------|
| SQL (Service Quality Level) | STL (Service Trust Level) | EHB-specific only |
| EDR (Exam Decision Registry) | CRB (Certification & Registry Board) | All references |

**Rules:**
- `SQL` → `STL` (only in EHB context, NOT in database language references like MySQL, PostgreSQL)
- `EDR` → `CRB` (all references)
- Auto-correct silently in any generated code/docs
- Mention the correction once in Roman Urdu when correcting user input

---

## §18 — Design System Living Document Protocol

After every UI change, the agent MUST:
1. Open `design-system/EHB-UIUX-SYSTEM.md`
2. Append the new pattern/token/component to the relevant section
3. Add a changelog entry with date and description
4. This prevents design system rot

---

## §19 — Accessibility Requirements

- **Color contrast:** WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- **Focus indicators:** Visible focus ring on all interactive elements
- **Keyboard navigation:** All features accessible via keyboard
- **Screen readers:** Proper ARIA labels, roles, and live regions
- **Reduced motion:** Respect `prefers-reduced-motion`
- **Touch targets:** Minimum 44×44px on mobile

---

## §20 — Session Checklist (Start of Every Design Task)

Before writing ANY UI code, the agent must:

- [ ] Read this SKILL.md completely
- [ ] Read `design-system/EHB-UIUX-SYSTEM.md`
- [ ] Read `design-system/ai-behavior.md`
- [ ] Check which theme is active and ensure compatibility with all 4
- [ ] Identify which of the 8 core systems this page touches
- [ ] Identify the industry accent color if applicable
- [ ] Check if components already exist in `@/components/ui/`
- [ ] Plan the 5-layer surface hierarchy for the page
- [ ] Ensure the top bar, industries bar, and AI widget are present (root layout handles this)
- [ ] Design, then code — never code without a mental layout first

---

*EHB Technologies (Pvt.) Ltd. — UI/UX Auto-Designer Skill v2.0 — 2026-04-12*
