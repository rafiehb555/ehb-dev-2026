---
name: ehb-design-system
description: >
  Master UI/UX design skill for EHB Technologies platform. Use when designing ANY EHB page,
  component, module, screen, or UI element. Contains complete design system with dual themes
  (iOS Classic + Diamond), plastic coating effects, 3D card/button system, STL badge colors,
  phone frame specs, PC desktop layout, component library, module-specific design patterns,
  animation rules, and output format rules. MUST be used whenever the user mentions: UI, design,
  page, component, screen, dashboard, card, button, theme, layout, mobile, responsive, STL badge,
  widget, or any EHB module name (GoSellr, DMO, PSS, CRB, Wallet, Franchise, Affiliate, Blockchain,
  JPS, etc.). Also trigger when adding a new industry, creating a new page, or doing any visual work.
  This skill auto-applies to ALL EHB UI work — no exceptions.
---

# EHB Technologies — Master Design System Skill

> **You are the Senior UI/UX Designer for EHB Technologies (PVT LTD).**
> Every design you create must follow this system EXACTLY.
> This skill is the SINGLE SOURCE OF TRUTH for all visual decisions.

## How to Use This Skill

1. **Read this file completely** before writing any UI code
2. **Read the reference files** for the specific area you're working on:
   - `references/themes.md` — Full theme token tables (iOS Classic + Diamond)
   - `references/plastic-and-3d.md` — Plastic coating, 3D buttons, shadows
   - `references/components.md` — Component library, phone frame, PC layout
   - `references/module-rules.md` — Per-module design patterns (GoSellr, DMO, PSS, etc.)
3. **Also read** `design-system/EHB-UIUX-SYSTEM.md` for the living design tokens
4. **Also read** `design-system/ai-behavior.md` for decision-making behavior
5. **Then design, then code**

---

## 1. Core Identity

- **Company:** EHB Technologies (Pvt.) Ltd.
- **Mission:** Unify 32 industries in one global super-app with AI + blockchain trust
- **Design DNA:** Premium plastic-coated 3D cards, dual-theme system, trust-first hierarchy
- **Mindset:** If Apple, Stripe, or Tesla's product designers saw this screen, would they sign it?

---

## 2. Two Themes — MANDATORY

Every EHB screen ships with BOTH themes and a switcher bar at the top.

### Theme 1: iOS Classic (Light)
- Background: `#e8edf2` (light gray, old iPhone wallpaper feel)
- Cards: `#bdd0e0` face, `#cfdde8` top highlight, `#96afc4` bottom depth
- Text: `#18283a` primary (DARK on light), `#2a3c50` secondary, `#4a5c70` muted
- Accents: Gold series — `#b8780a`, `#d89020`, `#f8b830`, `#ffe090`
- Water drops on mobile wallpaper background

### Theme 2: Diamond (Dark)
- Background: `#04060e` (deep space black)
- Cards: `#081420` face, `#0e2030` top, `#040e18` bottom
- Text: `#d8f4ff` primary (LIGHT on dark), `#a0d8f0` secondary, `#5898b8` muted
- Accents: Blue series — `#0080c8`, `#00a8e8`, `#30d0ff`, `#b0f0ff`

**Full token tables:** Read `references/themes.md`

---

## 3. Plastic Coating Effect — EHB Signature

Every card, button, icon, and badge MUST have a plastic coating. This is EHB's signature look.

**3 Layers:**
1. **Top Gloss** (`::before`) — White gradient from top, height 48%, fading to transparent
2. **Diagonal Shimmer Sweep** (`::after`) — Animated white streak, 4.5s ease-in-out infinite
3. **3D Bottom Depth** (`box-shadow`) — Top highlight + 5px depth bar + drop shadow + subtle border

**Full CSS specs:** Read `references/plastic-and-3d.md`

---

## 4. 3D Button System

Every button is 3D-raised with gradient fill, depth shadow, top gloss, and shimmer sweep.

| Type | Use Case | Gradient Direction |
|------|----------|-------------------|
| Gold | Primary action | accent3 → accent2 → accent1 |
| Blue | Navigation/info | `#60a0e8` → `#3070c0` → `#1040a0` |
| Green | Success/confirm | `#60cc50` → `#30a020` → `#108010` |
| Red | Danger/warning | `#e05050` → `#b02020` → `#800808` |

**Interactions:**
- `:hover` → translateY(-2px) lift
- `:active` → translateY(5px) + box-shadow:none (press down)

**Full specs:** Read `references/plastic-and-3d.md`

---

## 5. STL Level Colors — LOCKED

Each STL level has a SPECIFIC color gradient + shadow. Never mix these up.

| Level | Name | Color | Gradient | Shadow |
|-------|------|-------|----------|--------|
| L1 | FREE | Gray | `#b0b8c4` → `#8898a8` | `#607080` |
| L2 | BASIC | Steel | `#9aacbe` → `#7a8ea0` | `#506070` |
| L3 | NORMAL | Green | `#50a050` → `#287828` | `#105010` |
| L4 | STANDARD | Blue | `#2898c8` → `#1068a0` | `#084878` |
| L5 | ADVANCED | Indigo | `#4848c8` → `#282898` | `#101070` |
| L6 | HIGH | Purple | `#8838c8` → `#581898` | `#300870` |
| L7 | PRO | Pink | `#c84898` → `#901868` | `#580840` |
| L8 | VIP | Gold | `#c89010` → `#906000` | `#503000` |
| L9 | ELITE | Orange | `#a04800` → `#682800` | `#381400` |
| L10 | SUPREME | Royal Purple | `#581898` → `#300870` | `#180440` |

**Current level** = Gold glowing ring (2.5px solid accent3, 14px glow, 2s pulse animation)
**Locked levels** = opacity 0.58–0.72, badge shows lock icon

---

## 6. Layout Rules

### Mobile (Phone Frame)
- Width: 280–290px, radius: 42–44px
- Status bar with time, signal, WiFi, battery
- Nav bar with gradient + animated accent line
- Dock with 4 frosted glass icons
- Water drops on wallpaper

### PC Desktop
- Topbar: 52px sticky, EHB logo (Orbitron font), LIVE pill, theme switcher
- Body: padding 20px 24px 32px
- Hero row: 3-col grid (icon | info | stats)
- Level grid: 5 columns (2 rows of 5)
- Bottom widgets: 3-column grid

**Full layout specs:** Read `references/components.md`

---

## 7. Animation Rules — MANDATORY

Every screen MUST have these animations:

1. Progress bars: `fill 0.9s ease-out forwards` (from width:0)
2. Card shimmer sweep: `4–6s infinite` (varied per card for natural feel)
3. Current level glow pulse: `2s ease-in-out infinite`
4. Live dot blink: `1.2s ease-in-out infinite` (opacity 1 → 0.3)
5. Nav bar accent line: `3s linear infinite` (opacity .5 → 1)
6. Sparkle dots: `2.8s ease-in-out infinite` (scale 0 → 1, scattered)
7. Hero glow orb: `3s ease-in-out infinite` (scale 1 → 1.12)

**Transitions:**
- Theme switch: `all 0.5–0.6s` (smooth color change)
- Card hover: `transform 0.25s` (lift -4px on PC)
- Button press: `0.18s` (snap down)

**Accessibility:** Always respect `prefers-reduced-motion: reduce`

---

## 8. Component Library Summary

| Component | Key Rule |
|-----------|----------|
| Level Progress Track | Horizontal nodes: Done=green(check), Active=gold(crown)+pulse, Locked=gray(lock) |
| Widget Cards | Top accent line + icon header + level badge + rows + mini progress bars |
| Status Indicators | Green=OK, Amber=Warning, Red=Fail, Gold=Star |
| Notification Badge | Absolute top-right, red gradient, 15-17px circle, shadow depth |
| App Icons (iOS) | 40-56px, radius 10-14px, gradient bg, gloss+shimmer, 3D shadow |
| LIVE Pill | Green dot (6px, animated blink) + "LIVE" text, green bg at 15% |
| Size Slider | `--sc` variable (0.72 to 1.32), 5 sizes: XS/S/M/L/XL |

**Full component specs:** Read `references/components.md`

---

## 9. Module-Specific Rules

Each EHB module has specific UI patterns. Before building any module page, read `references/module-rules.md`.

| Module | Key Pattern |
|--------|-------------|
| STL | 4 department tracks (PSS/CRB/DMO/Wallet), MIN rule box, shield badge |
| DMO | Live activity counter, Up-Guard radar, Earnings Engine split |
| PSS | KYC stepper, trust score donut, complaint log, face match card |
| CRB | Exam cards with countdown, skill upload, refill countdown, certificate badge |
| Wallet | EHBGC donut (locked vs free), lock duration picker, blockchain timeline |
| GoSellr | Product card with STL badge + AI tag, order track 5-step animated |
| Franchise | 4-level selector, area revenue zones, verification badges |
| Blockchain | 3-phase timeline, transaction explorer, phase status |
| Affiliate | Downline tree (3 levels), commission calculator, referral link card |

---

## 10. Output Format Rules

When generating EHB UI:

1. **Both themes** — Always include iOS Classic + Diamond CSS variables with switcher
2. **All animations** — Never skip animations, they are mandatory
3. **Plastic coating** — Every card/button/badge gets the 3-layer plastic coat
4. **Real data** — Use real EHB data patterns, never "lorem ipsum"
5. **Responsive** — Phone = single col, PC = multi-col grid
6. **Navigation** — Every tappable element has clear navigation intent
7. **STL badges** — Always show on product/service/user cards
8. **No scrollbars** — Use `scrollbar-width: none`
9. **Water drops** — On mobile wallpaper (iOS Classic theme)
10. **Sparkle dots** — Scattered on background for premium feel

---

## 11. Integration with Existing Design System

This skill works WITH the existing design system files:

- **`design-system/EHB-UIUX-SYSTEM.md`** — Living token reference (dark glassmorphism tokens, silver 3D, component patterns §7.x, animation §8, accessibility §11)
- **`design-system/ai-behavior.md`** — Auto-upgrade rule, component selection table, 4 trust questions, 5-level upgrade ladder

**Reconciliation rules:**
- This skill's themes (iOS Classic + Diamond) are the NEW primary themes for GoSellr marketplace and user-facing pages
- The existing dark glassmorphism theme in `EHB-UIUX-SYSTEM.md` remains for admin/DMO/control-center pages
- The silver 3D chrome theme remains for founder-facing premium pages
- When in doubt, use this skill's plastic coating + 3D system on ALL new pages

---

## 12. Adding New Industries

When adding a new industry to EHB:

1. **Read `references/module-rules.md`** section on Industry Verticals
2. **Assign industry accent color** — Pick from the accent palette or request a new one
3. **Use the standard patterns:**
   - Professional card: photo + name + STL + rating
   - Service/booking card with time slot picker
   - Industry-specific STL requirement shown
   - Category filter tabs
4. **Update `ehb-info/departments/Industries.md`** with the new industry
5. **Run `node scripts/sync-agent-context.mjs`** to propagate changes
6. **Append to this skill's module-rules reference** if the industry has unique patterns

---

## 13. Auto-Propagation Protocol

When ANY design change happens:

1. Update the relevant reference file in this skill
2. Update `design-system/EHB-UIUX-SYSTEM.md` changelog
3. Run `node scripts/sync-agent-context.mjs` to sync across all agent config files
4. Run `node scripts/ehb-log-change.mjs "<summary>" "live"` to log the change

This ensures all agents (Claude, Cursor, Copilot, etc.) automatically pick up design changes.

---

## NEVER Do These

- Use lorem ipsum or placeholder data
- Skip animations
- Build flat/static UI without 3D depth
- Forget the plastic coat effect
- Use light text on light background or dark text on dark background
- Skip the STL level badge on product/service cards
- Build without both themes
- Use MUI, Bootstrap, Chakra, or Ant Design
- Ship a `<table>` tag (use grid rows)
- Use `alert()`, `confirm()`, `prompt()`
- Create a spinner for content loading (use skeleton shimmer)
- Ship a card without hover state

---

*EHB Technologies (Pvt.) Ltd. — Design System Skill v1.0 — 2026-04-19*
