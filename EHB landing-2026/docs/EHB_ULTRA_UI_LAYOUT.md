# EHB Ultra UI Layout System

**Apple / Stripe / Web3 level premium landing · Cursor / Replit exact build spec**

---

## Phase 1 — Global Page Layout

| Token | Value | Usage |
|-------|--------|--------|
| Container width | 1400px | `.container-ultra` |
| Grid | 12 columns | `.grid-12` or `grid grid-cols-12` |
| Section padding | 120px top/bottom | `.section-pad-ultra` (60px on mobile) |
| Card gap | 24px | `.card-gap-ultra` or `gap-6` |

**Page flow:** Navbar → Hero → Features → Industries → AI → Marketplace → Franchise → Stats → Vision → CTA → Footer.

---

## Phase 2 — Top Navigation

- **Style:** Floating glass navbar, blur, bottom neon border (`nav-glass`).
- **Layout:** Logo | Industries (bar or dropdown) | Login | Dashboard.
- **Industries:** Education, Health, Law, IT, Finance, Travel, Retail, Delivery (full 32 in bar).

---

## Phase 3 — Hero Section

| Item | Spec |
|------|------|
| Height | 80vh (`min-h-hero`) |
| Layout | 12-col grid: 6 cols text, 6 cols visual |
| Left | Title, description, buttons (Explore Industries, Create Profile) |
| Right | Illustration / 3D / floating cards placeholder |
| Animation | Floating cards, soft glow, background particles (fluid blobs) |

---

## Phase 4 — Features Section

- **Grid:** 3 columns × 2 rows (6 cards).
- **Cards:** AI Marketplace, GoSellr Commerce, JPS Profiles, Franchise Ecosystem, AI Analytics, Global Ecosystem.
- **Card style:** Glass panel, hover lift, glow border (`glass-card`, `card-hover`).

---

## Phase 5 — Industries Section

- **Grid:** 4 columns; 8+ cards visible.
- **Card:** icon, title, short description.
- **Hover:** scale, neon glow, cursor highlight.
- **Click:** Open `/landing/[industry]`.

---

## Phase 6 — AI System Section

- **Layout:** Left = AI description + 4 points; Right = animated data viz placeholder.
- **Points:** AI demand prediction, smart matching, affiliate insights, fraud detection.

---

## Phase 7 — Marketplace Preview

- **Grid:** 3 columns.
- **Card types:** Service card, Product card, Provider card.
- **Examples:** Web Developer, Laptop Store, Delivery Service (+ one more).

---

## Phase 8 — Franchise Section

- **Layout:** Title, description, city cards.
- **Grid:** 3 columns.
- **Card:** City, Investment, Potential income.

---

## Phase 9 — Statistics Section

- **Layout:** 4 columns.
- **Content:** 32 Industries, 700+ Services, Global Franchise Network, AI Powered Platform.
- **Animation:** Number counting (client component).

---

## Phase 10 — Vision Section

- **Layout:** Centered.
- **Content:** Title + paragraph (+ optional illustration).

---

## Phase 11 — Call To Action

- **Size:** Big section.
- **Title:** Join EHB Today / Start Your Journey with EHB.
- **Buttons:** Create Profile, Explore Services, Become Franchise Partner.
- **Background:** Glow gradient.

---

## Phase 12 — Footer

- **Columns:** Industries | Marketplace | Company | Support (or Help Center).
- **Links:** Education, Health, IT, Law under Industries; etc.

---

## Global Theme

| Role | Value |
|------|--------|
| Background | #020617 |
| Surface | #020c1b |
| Primary glow | #00eaff |
| Secondary glow | #3b82f6 |
| Accent glow | #8b5cf6 |
| Cards | rgba(255,255,255,0.05), blur, thin neon border |

---

## Interactions & Animation

- **Card:** Hover lift (`translateY(-6px)`), scale 1.03, neon border glow.
- **Button:** Glow sweep on hover (`btn-glow`).
- **Section:** Fade-in (opacity + translateY); use `animate-fade-in` where needed.
- **Performance:** Prefer `transform` and `opacity`; avoid layout shift.

---

## Background System

- **Style:** Deep space gradient, mesh grid, floating particles (fluid blobs).
- **Classes:** `page-mesh`, `fluid-bg-blob`, `fluid-bg-blob-1/2/3`.

---

## Reusable Components

| Component | Use |
|-----------|-----|
| GlassCard | Generic glass panel + hover |
| FeatureCard | Feature block (icon, title, desc) |
| IndustryCard | Industry tile → `/landing/[slug]` |
| ServiceCard | Marketplace service |
| StatsCard | Animated stat (LandingStats) |
| CTASection | Join / CTA block |

---

## Tailwind / CSS Reference

- **Container:** `container-ultra` (max 1400px, horizontal padding).
- **Section padding:** `section-pad-ultra` (120px vertical).
- **Grid:** `grid grid-cols-12 gap-6` or `grid-12`; `grid-cols-3` / `grid-cols-4` for cards.
- **Hero height:** `min-h-hero` (80vh).
- **Animations:** `animate-fade-in`, `animate-float`; keyframes in tailwind.
- **Spacing:** `spacing.section` = 120px, `spacing.card-gap` = 24px; `maxWidth.ultra` = 1400px.

---

*Rafi bhai — Landing page isi layout system se build karo; same template 32 industry pages par use karna.*
