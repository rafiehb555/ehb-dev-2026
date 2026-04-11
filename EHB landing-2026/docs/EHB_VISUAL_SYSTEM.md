# EHB Landing Page Visual System

**World-class UI · Unique brand look · Stripe / Apple Vision / Web3 level**

Yeh doc **background, colors, cards, icons, illustrations, animations, typography, spacing** aur **component library** define karta hai — sab landing pages (EHB + 32 industries) isi system par. **32 industry unique accent colors** aur **landing → home → dashboard → global** phases ke liye: **EHB_INDUSTRY_PHASES.md**.

---

## Phase 1 — Background Visual System

Background **simple color nahi** — layered, depth wala.

**Layers (order):**

| Layer | Content | Effect |
|-------|--------|--------|
| 1 | Dark gradient | Base #020617 |
| 2 | Mesh grid | Subtle line grid (e.g. 60px), low opacity |
| 3 | Floating particles / blobs | Soft movement, blur |
| 4 | Blur glow lights | Radial gradients (cyan, blue, violet) |

**Implementation:**  
- `page-mesh` (gradient + grid)  
- `fluid-bg-blob`, `fluid-bg-blob-1/2/3` (floating blobs)  
- Section-level radial overlays where needed  

**Feel:** AI operating system / deep space.

---

## Phase 2 — Color Identity (EHB Official) · Logo + Theme Merge

**Strategy:** Base theme = current dark AI theme. Accent colors = **EHB logo colors**. Brand strong + UI premium.

### Logo colors (4)

| Color | Meaning | Hex | Tailwind |
|-------|--------|-----|----------|
| Red | Education / highlight | #E53935 | `ehb.highlight` |
| Blue | Health / AI / technology | #00AEEF | `ehb.primary` |
| Green | Business / success / growth | #22C55E | `ehb.secondary` |
| Orange | Connection / ecosystem | #F59E0B | `ehb.accent` |

### Base theme (unchanged)

| Role | Hex | Usage |
|------|-----|--------|
| **Background** | #020617 | Page base |
| **Surface** | #020c1b | Cards, panels |
| **Panels (glass)** | rgba(255,255,255,0.05) | Glassmorphism |
| **Footer** | #010409 | Footer background |

### Glow effects (AI futuristic)

| Role | Hex | Usage |
|------|-----|--------|
| **AI glow** | #00EAFF | Neon highlights, CTAs |
| **Purple glow** | #8B5CF6 | Alternate accent |

**Rule:** Har landing page par same. Tailwind: `ehb.primary`, `ehb.secondary`, `ehb.accent`, `ehb.highlight`, `ehb.neonBlue`, `ehb.violetGlow`, `ehb.background`, `ehb.surface`, `ehb.footer`.

### Landing page color usage

- **Navbar:** Glass dark. Active industry → green glow (`ehb.secondary`). Hover → blue glow (`ehb.primary`).
- **Hero primary button:** Gradient blue → green (`bg-gradient-to-r from-ehb-primary to-ehb-secondary` or `gradient-btn-primary`). Secondary: dark glass + border glow.
- **Industry cards:** Subtle border by industry (red / blue / green / orange). Hover: soft neon glow. See **EHB_INDUSTRY_CARD_SYSTEM.md**.
- **Feature cards:** AI Marketplace → blue glow; GoSellr → orange; JPS Profiles → green; Franchise → red.
- **32 Industry section:** Icon + title + description + **colored underline** (match industry accent).
- **Hero background (optional):** Gradient `#020617 → #001B2E → #020617`; glow lights blue / green / orange. Class: `hero-bg-ecosystem`.
- **Card hover:** `translateY(-6px)`, `scale(1.03)`, border glow = **match industry color**.
- **Footer:** Background `#010409`. Links hover → green. Icons → blue glow. Class: `footer-ehb`.
- **Logo:** Navbar left = Logo + EHB. Hero badge = “Powered by EHB Ecosystem”.

---

## Phase 3 — Card Visual Style

**Design language:**

- Glass panel: `rgba(255,255,255,0.05)` + backdrop blur  
- Soft border: `1px solid rgba(148,163,184,0.2)` or `rgba(255,255,255,0.1)`  
- Glow shadow: subtle neon on hover  

**Layout (example):**  
Icon (top) → Title → Description  

**Hover:**

- `transform: scale(1.03)`  
- Lift: `translateY(-6px)`  
- Neon border glow (e.g. #00eaff / #3b82f6)  

**Classes:** `glass-card`, `glass-panel`, `card-hover` (see globals.css). **Industry cards:** See **EHB_INDUSTRY_CARD_SYSTEM.md** (layout, accent colors, icons, 32-industry mapping).

---

## Phase 4 — Icon System

**Style:** Line icons, gradient glow or solid primary, soft shadow where needed.

**Library options:** Lucide React, Heroicons, Phosphor Icons.

**Industry → icon mapping (examples):**

| Industry | Icon idea |
|----------|-----------|
| Education | Graduation cap |
| Health | Medical cross / heart |
| IT | Code bracket / terminal |
| Law | Scale of justice |
| Finance | Chart / wallet |
| Travel | Plane / map |
| Retail | Shopping bag |
| Delivery | Truck / package |

**Usage:** Feature cards, industry cards, section headers. Same style across all landings.

---

## Phase 5 — Illustration System

**3 main types:**

### 1. Hero illustration

- **Concept:** Global AI network, services connected across industries.  
- **Mood:** Futuristic, connected nodes, soft glow.  
- **Placeholder:** Gradient orb + “EHB” / “AI Network” text (current); replace with SVG/PNG when ready.

### 2. AI system illustration

- **Concept:** Data network, AI “brain” visualization, analytics graphs.  
- **Mood:** Data flows, nodes, charts.  
- **Placeholder:** Animated bars / simple graph (current).

### 3. Marketplace illustration

- **Concept:** Service cards, product cards, user profiles in a grid or flow.  
- **Mood:** Marketplace as a connected grid.  
- **Placeholder:** Card grid or list; replace with custom illustration later.

**Rule:** Same illustration *types* and placement on EHB + industry landings; swap art per industry if needed (e.g. Health hero = health-specific visual).

---

## Phase 6 — Animation System

**Principles:** Subtle, smooth, 250–400ms.

| Animation | Trigger | Spec |
|-----------|---------|------|
| Section fade-in | Scroll (or page load) | opacity 0→1, translateY(12px→0) |
| Card hover lift | Hover | translateY(-6px), scale(1.03) |
| Button glow sweep | Hover | box-shadow bloom, scale(1.02) |
| Background particles | Always | Slow float (e.g. 6s ease-in-out infinite) |

**Performance:** Use `transform` and `opacity` only; avoid layout thrash.

**Classes:** `animate-fade-in`, `animate-float`, `card-hover`, `btn-glow`.

---

## Phase 7 — Cursor Interaction (Optional)

**Ideas:**

- Cursor glow: soft light near pointer (needs JS).  
- Card highlight: cursor near card → card border/glow strengthen (JS + distance check).  

**Implementation:** Optional; add as enhancement. CSS-only: rely on `:hover` for card/button.

---

## Phase 8 — Typography System

**Fonts (recommended):**

- **Current:** Sora (headings + body).  
- **Alternates:** Inter, Satoshi, Plus Jakarta Sans (document for future swap).

**Scale:**

| Use | Size | Tailwind / class |
|-----|------|-------------------|
| Hero title | 64px | `text-5xl` / `text-6xl` (3rem–4rem) |
| Section title | 36px | `text-3xl` (1.875rem–2.25rem) |
| Card title | 20px | `text-lg` / `text-xl` |
| Body | 16px | `text-base` |
| Small / meta | 12–14px | `text-xs` / `text-sm` |

**Weights:** Semibold (600) for titles, medium (500) for body emphasis, normal (400) for body.

---

## Phase 9 — Spacing System

**Scale:** 8px · 16px · 24px · 40px · 80px · 120px  

**Usage:**

- Sections: **120px** vertical (`section-pad-ultra`).  
- Cards gap: **24px** (`card-gap-ultra`, `gap-6`).  
- Internal card padding: 16–24px (`p-4`–`p-6`).  

Tailwind: `spacing.section`, `spacing.card-gap`; custom `section-pad-ultra` in globals.

---

## Phase 10 — UI Component Library

**Reusable components (same on all landings):**

| Component | Purpose |
|-----------|--------|
| HeroSection | Hero block: title, subtitle, buttons, visual slot |
| FeatureCard | Icon + title + description, glass, hover |
| IndustryCard | Icon + title + short desc, link to `/landing/[industry]` |
| AISection | Left copy + 4 points, right viz placeholder |
| MarketplacePreview | Grid of service/product/provider cards |
| StatsSection | Animated counters (32+, 700+, etc.) |
| CTASection | Title, short copy, 2–3 buttons, glow gradient |
| FooterSection | Columns: Industries, Marketplace, Company, Support |

**Rule:** EHB + 32 industry pages same components; only **content** (text, images, services) changes.

---

## Phase 11 — Multi-Industry Consistency

**Rule:**

- EHB main landing and every industry landing (`/landing/[industry]`) use:  
  **same layout, same animations, same theme, same components.**  

**Different per page:**

- Images / illustrations (optional per industry).  
- Text (headlines, descriptions, services).  
- Industry-specific services list.  

**Same:** Colors, card style, spacing, typography, section order, navbar, footer.

---

## Final Visual Result

**Target feel:**

- Stripe dashboard (clarity, hierarchy).  
- Apple Vision (premium, depth, glass).  
- Modern Web3 (glow, neon, dark).  

**User takeaway:** “This platform is futuristic and powerful.”

---

## Implementation Checklist

- [x] Background: page-mesh + fluid blobs  
- [x] Colors: ehb.* in tailwind + globals  
- [x] Cards: glass-card, card-hover  
- [ ] Icons: Lucide/Heroicons + industry mapping (when adding icons)  
- [x] Hero/AI/Marketplace placeholders in place  
- [x] Animations: fade-in, float, hover lift, btn-glow  
- [x] Typography: Sora + scale (text-3xl, text-lg, etc.)  
- [x] Spacing: section 120px, card gap 24px  
- [x] Components: Hero, FeatureCard, IndustryCard, AISection, etc. (in page; extract to components when needed)  

---

*Rafi bhai — Next: **EHB Landing Page Content Strategy** (exact text per section, image sources, icon set, illustration design) taake Cursor se complete landing generate ho.*
