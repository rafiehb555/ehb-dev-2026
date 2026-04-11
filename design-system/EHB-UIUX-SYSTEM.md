# EHB-UIUX-SYSTEM.md — Living Design System

> **Single source of truth for all UI/UX decisions on the EHB platform.**
>
> Every AI agent (Claude, Cursor, Copilot, Aider, Continue, Cody, Codeium) **must**
> read this file before writing a single line of UI code, and **must** append to it
> whenever a new pattern, token, or component is introduced.
>
> This file is co-authored by humans and agents. It is versioned, auditable, and
> the only document that can override agents' default "basic UI" instincts.
>
> **Mindset:** Think like Apple, Stripe, and Tesla designers. We are building a
> billion-dollar SaaS super-app — never a basic dashboard.

### Enforcement (automation)

- **Cursor:** `.cursor/rules/ehb-uiux-system-mandatory.mdc` — `alwaysApply: true` so every session states this policy; agents must still **read** this file and `ai-behavior.md` before editing UI.
- **Claude / Copilot / other agents:** Root **`AGENTS.md`** §6.1 (mirrored to **`CLAUDE.md`**, **`.cursorrules`**, **`.github/copilot-instructions.md`** via `node scripts/sync-agent-context.mjs`).
- **Skill:** `.cursor/skills/ui-design-system-agent/SKILL.md` points here first.

---

## 0. Who this system serves

- **Company:** EHB Technologies (Pvt.) Ltd.
- **Product:** EHB Global Super-App — 32 industries, AI + blockchain trust.
- **Users:** End customers, service providers, franchise partners, admins, and
  the 8 internal departments (AI, Blockchain, Finance, Affiliate, Franchise, JPS,
  Verification, DMO).
- **Design goal:** Every pixel should feel premium, trustworthy, and futuristic —
  because trust is the product.

---

## 1. Core design philosophy (non-negotiable)

1. **Trust > Cleverness.** We are selling verified service quality (STL L0–L8).
   Never let animation or 3D get in the way of "who is this, can I trust them,
   what does it cost, is it verified?"
2. **Dark by default, silver by exception.** Dark glassmorphism is the house
   style. Silver 3D backgrounds are used only for hero / control-center pages
   where a premium "unboxing" feel is needed.
3. **Hierarchy comes from depth, not size.** We use shadow, blur, and layered
   backgrounds to create hierarchy — not huge headlines or aggressive color.
4. **Motion is a trust signal.** Every hover, click, and state change should
   reward the user with a 120–240 ms micro-animation. No motion = "is it broken?"
5. **Verified content gets a halo.** Anything verified by PSS/CRB/STL renders
   with a teal or purple glow. Unverified = gray. This is a contract the user
   learns in 5 seconds.
6. **Icons are required, not decorative.** Every row, card, chip, and stat must
   carry an icon. Icons are our second alphabet.
7. **Responsive first, always.** Every layout uses `clamp()`, `minmax()`, and
   `auto-fit` grids. No fixed widths under 1600 px. No horizontal scroll on
   mobile. Ever.

---

## 2. Color tokens (the only palette that ships)

### 2.1 Surfaces

| Token              | Hex         | Usage                                   |
|--------------------|-------------|-----------------------------------------|
| `bg-root-dark`     | `#0C0E1A`   | Default app background (dark mode)      |
| `bg-card`          | `#13162A`   | Primary card fill                       |
| `bg-card-nested`   | `#1A1D33`   | Nested card / inner panel               |
| `bg-glass-dark`    | `rgba(19,22,42,0.92)` | Glassmorphism card on silver/hero |
| `bg-glass-soft`    | `rgba(19,22,42,0.88)` | Secondary glass panels            |
| `bg-root-silver`   | Silver 3D multi-gradient (see §6) | Premium hero / control-center bg |
| `bg-root-light`    | `#F4F5F9`   | Light-mode surface (future)             |

### 2.2 Brand colors

| Token           | Hex        | Purpose                                    |
|-----------------|------------|--------------------------------------------|
| `brand-purple`  | `#7B6EF6`  | Primary EHB brand, AI & trust signals      |
| `brand-purple-light` | `#A098F8` | Text on dark, chip foregrounds          |
| `brand-teal`    | `#2BBFA0`  | Verified / success / live status           |
| `brand-amber`   | `#F0A030`  | Warning / pending / attention              |
| `brand-red`     | `#F05858`  | Critical / blocked / health risk           |
| `brand-green`   | `#38C878`  | Money in / passed / healthy                |

### 2.3 Gradients (ship these — never flat brand colors on buttons)

```css
--grad-ehb-primary:  linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%);
--grad-ehb-critical: linear-gradient(135deg, #F05858 0%, #F0A030 100%);
--grad-ehb-trust:    linear-gradient(135deg, #2BBFA0 0%, #38C878 100%);
--grad-ehb-ai:       linear-gradient(135deg, #A098F8 0%, #7B6EF6 50%, #2BBFA0 100%);
```

### 2.4 Industry color accents (only for industry hub pages)

| Industry              | Accent         | Icon   |
|-----------------------|----------------|--------|
| GoSellr / E-commerce  | `#7B6EF6`      | 🛒    |
| OLS / Legal           | `#A098F8`      | ⚖️    |
| WMS / Medical         | `#2BBFA0`      | 🏥    |
| HPS·OBS / Education   | `#F0A030`      | 🎓    |
| JPS / Jobs            | `#38C878`      | 💼    |
| AGTS / Travel         | `#F05858`      | ✈️    |

Use these **only** on the industry landing pages. Core platform UI stays brand
purple + teal.

### 2.5 Borders & dividers

- Card border: `1px solid rgba(255,255,255,0.08)`
- Glass card border: `1px solid rgba(255,255,255,0.14)`
- Inner divider: `1px solid rgba(255,255,255,0.07)`
- Inner highlight (top edge of glass): `0 1px 0 rgba(255,255,255,0.16) inset`

---

## 3. Typography

- **Family:** `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`
- **Weights in use:** 400 (body), 600 (labels), 700 (headings), 800 (stat values)
- **Letter-spacing:** `-0.3px` on hero h1, `0.06em` on uppercase labels, `0.12em`
  on micro-labels
- **Fluid sizes:** Use `clamp()` for anything bigger than 16 px:
  ```css
  h1-hero:   clamp(20px, 3vw, 28px)
  h2-section: clamp(16px, 2vw, 20px)
  h3-card:   14px
  body:      12px
  meta:      10px
  micro:     9px
  ```
- **Never** use pure white (`#fff`) on silver backgrounds. Use `#1a1d2e` or darker.
- On dark glass, body text is `#C8CCDF`, micro-labels are `#8890B0`, muted is `#555A78`.

---

## 4. Spacing & radius

- **Radius scale:** `5` (chip), `6` (button), `8` (input), `10–12` (card), `14–16` (hero)
- **Spacing scale:** `4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32` (px)
- **Responsive padding:** `clamp(10px, 2vw, 24px)` for page, `clamp(18px, 2.6vw, 28px)` for hero
- **Max content width:** `1600` px (was 1400 — widened in v4.2)
- **No rounded-full** on anything except avatars, status dots, and numeric chips

---

## 5. Shadows, blur & depth

```css
--shadow-card-dark:    0 10px 28px rgba(20,26,48,0.28), 0 1px 0 rgba(255,255,255,0.15) inset;
--shadow-card-raised:  0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset;
--shadow-hero:         0 18px 44px rgba(20,26,48,0.40), 0 1px 0 rgba(255,255,255,0.18) inset;
--shadow-critical:     0 0 24px rgba(240,88,88,0.35), 0 10px 28px rgba(240,88,88,0.22);
--shadow-verified:     0 0 20px rgba(43,191,160,0.28);

--blur-glass:          blur(12px);   /* cards */
--blur-glass-strong:   blur(14px);   /* nav, hero */
```

Every glass surface must also set `WebkitBackdropFilter` for Safari.

---

## 6. The Silver 3D background recipe (premium pages only)

Used on `/development`, `/control-center`, `/admin`, and future founder-facing
pages where a physical "premium unboxing" feel is required.

```css
background: 
  radial-gradient(ellipse 70% 45% at 18% 12%, rgba(255,255,255,0.75), transparent 55%),
  radial-gradient(ellipse 55% 38% at 82% 22%, rgba(255,255,255,0.55), transparent 55%),
  radial-gradient(ellipse 65% 50% at 50% 55%, rgba(90,100,130,0.45), transparent 65%),
  radial-gradient(ellipse 75% 55% at 28% 88%, rgba(200,208,220,0.55), transparent 60%),
  radial-gradient(ellipse 60% 45% at 85% 92%, rgba(120,130,160,0.45), transparent 60%),
  linear-gradient(135deg,
    #d7dbe4 0%, #eef0f5 12%, #b7bdcb 26%, #e1e5ec 40%,
    #a6acbb 54%, #dde1e9 68%, #9ea4b3 82%, #cfd3dc 100%
  );
background-attachment: fixed;   /* critical — gives the 3D satin-scroll feel */
```

When silver is the background, **all cards must become dark glass** (§2.1
`bg-glass-dark`) to create the dark-on-light contrast. Never put silver cards
on a silver background.

---

## 7. Component patterns (the only ones we ship)

### 7.1 Card primitive

Location: `apps/web/components/ui/card.tsx` (lowercase). **Never** create a
second `Card.tsx`.

```tsx
const cardStyle: React.CSSProperties = {
  background: "rgba(19,22,42,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
};
```

### 7.2 Clickable card wrapper

Every card that reveals more info **must** be rendered as a `<button type="button">`
(for a11y) with:

- `cursor: pointer`
- `textAlign: left`
- `fontFamily: inherit`
- Hover: translate Y by `-2px`, boost shadow
- Focus: 2px outline in `brand-purple`

### 7.3 Critical / red theming

When any card represents a blocker, missing file, or health-critical warning,
the whole card turns red — background, border, text, and inner chips:

```css
background:  rgba(240,88,88,0.17);
border:      1px solid #F05858;
color:       #FFCACA;
box-shadow:  0 0 24px rgba(240,88,88,0.35), 0 14px 36px rgba(240,88,88,0.22);
```

### 7.4 Chips

```tsx
// Always color-fg + 15%-bg + 30%-border
<Chip color="teal">Verified</Chip>
<Chip color="amber">Pending</Chip>
<Chip color="red">Blocked</Chip>
<Chip color="purple">AI</Chip>
<Chip color="green">Passed</Chip>
```

### 7.5 Stat cards

- Icon (20 px emoji or Lucide) on the left of a 24 px bold value
- Label at 11 px, sub-label at 9 px
- Always wrapped in a clickable button for drill-down
- Responsive grid: `repeat(auto-fit, minmax(170px, 1fr))`

### 7.6 Priority queue rows

- 26 × 26 icon box
- 20 × 20 numeric chip
- Meta text (THIS WEEK / NEXT / LATER) in 9 px letterspaced uppercase
- Critical priorities (`level === "high"`) → red card theme (§7.3)

### 7.7 Detail drawer (click-to-view modal)

All cards that are clickable open the same `DetailDrawer` component. It renders:

- A fixed overlay at `z-index: 9999`
- Glass modal at `max-width: 720 px`
- Title + subtitle + severity chip
- Fields grid (`repeat(auto-fit, minmax(260px, 1fr))`)
- Red gradient when `severity === "high"`

### 7.8 Quick Action banner

Top-of-page banner that surfaces the single most urgent action this session.
If `data.urgent.length > 0`, shows red gradient + pulse animation. If none,
shows a muted "All systems nominal" state.

### 7.9 Progress bars

```tsx
// Animated, rounded 6-8 px height, gradient fill
<div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
  <div style={{
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg, #7B6EF6, #2BBFA0)',
    borderRadius: 4,
    transition: 'width 400ms ease-out',
  }} />
</div>
```

### 7.11 Bento Mission Control (dashboard hero pattern)

Used on `/development` and future control-center pages where the user needs to
see "what's critical now + overall health + key metrics" in a single glance
without scrolling.

```
┌──────────────────────────────────────┬───────────────────┐
│                                      │  HEALTH RING      │
│  PRIORITY QUEUE (wide, 2-col inner)  │  (radial SVG)     │
│                                      │                   │
│  ┌──────────┐ ┌──────────┐           ├───────────────────┤
│  │ high #1  │ │ high #2  │           │  STATS MINI-GRID  │
│  └──────────┘ └──────────┘           │  (2x2 sub-cards)  │
│  ┌──────────┐ ┌──────────┐           │                   │
│  │ med  #3  │ │ low  #4  │           │  [🏭 32] [🌍 50+] │
│  └──────────┘ └──────────┘           │  [⭐ 8]  [🤖100+] │
└──────────────────────────────────────┴───────────────────┘
```

**Grid contract:**

```css
display: grid;
grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
gap: 14px;
align-items: stretch;
```

**Rules for this layout:**

1. Left column carries **exactly one** wide panel — the most urgent context
   (priority queue, blockers, incidents). Never a chart, never a form.
2. Right column is always a vertical stack of **2–3** stacked widgets. Top
   widget must be a `HealthRing` (see below). Bottom is a dense data grid
   (stats mini-grid or KPIs).
3. Both columns must `align-items: stretch` so heights match.
4. On viewports < 900 px, the grid collapses to a single column. Priority
   queue first, health ring second, stats third.
5. Priority cards inside the left panel use an **inner** `auto-fit` grid with
   `minmax(240px, 1fr)` so they re-flow from 4 → 2 → 1 cols as width shrinks.
6. Priority cards must show **three counts** in the header: `N HIGH`, `N MED`,
   `N LOW` — color-coded red / amber / green, no exceptions.
7. Priority card colors are level-differentiated (from §7.6):
   - high → red bg + red border + red glow
   - med  → amber bg + amber border + amber glow
   - low  → green bg + green border + green glow

**Health Ring widget (§7.11.1):**

- SVG radial, 132 px square, 11 px stroke
- Rotation `-90deg` so it starts at 12 o'clock
- `strokeLinecap: round`
- Fill is a linear gradient `health-color → #A098F8`
- Animates via `strokeDashoffset` with `800ms cubic-bezier(.2,.8,.2,1)`
- Pct in center at 30 px bold, label ("Healthy" / "Fair" / "At risk") below
- Color thresholds: `≥60 → green #38C878`, `≥30 → amber #F0A030`, `<30 → red #F05858`
- Outer glow box-shadow uses the health color at 35 % opacity
- Implementation: `HealthRing({ data, onClick })` in `apps/web/app/development/page.tsx`

**Stats mini-grid widget (§7.11.2):**

- 2-col grid (`repeat(2, minmax(0, 1fr))`, gap 8)
- Each stat is a 10 × 11 px padded button with icon (14 px) + value (17 px
  bold) + label (9 px)
- Nested card background: `rgba(26,29,51,0.85)` with `border: rgba(255,255,255,0.08)`
- Hover: translate Y -1 px, border → purple 35 %

### 7.10 Navigation shell

- Nav padding: `clamp(10px, 1.6vw, 14px) clamp(12px, 2vw, 24px)`
- `navInner: flex, flex-wrap, justify-between, gap 12`
- `navLinks: flex-wrap, center-align, gap 3` — so links collapse gracefully
  on narrow viewports instead of overflowing
- EHB logo tile: 38 × 38, `radius: 10`, `linear-gradient(135deg,#7B6EF6,#2BBFA0)`

---

### 7.12 Cinematic Hero (landing + mission control pattern)

> **Purpose.** The cinematic hero is the first thing a user sees on any
> marquee surface (`/development`, `/home`, `/admin`). It answers the
> four trust questions in one glance: *who is this, what's the pulse,
> what should I do now, is it live?* — Tesla/Apple-grade minimalism:
> enormous empty space, enormous numbers, ultra-subtle gradients.
> **Never use on dense inner pages** — use stat cards (§7.5) instead.

**Anatomy (top → bottom, required order):**

1. **Eyebrow row** — breadcrumb (uppercase, 10 px, 0.18em tracked) left;
   live-status pill (pulsing dot + `LIVE`/`STATIC` + timestamp) right.
2. **Headline** — `clamp(44px, 6.2vw, 96px)`, DM Sans 800, `letter-spacing -1.4px`,
   `line-height 1.02`. Two lines max. Line 1 pure white; line 2 gradient clip
   using `--grad-ehb-primary` (purple → teal) — but 100deg, not 135deg,
   to match the horizontal reading flow.
3. **Subhead** — `clamp(13px, 1.05vw, 15px)` · color `#8890B0` · max-width 640 ·
   line-height 1.7 · regular weight. Never more than 2 sentences.
4. **Metric row (4-up)** — animated number counters, each ~`clamp(36px, 4.8vw, 68px)`.
   Use `font-feature-settings: "tnum" 1, "lnum" 1` so digits stay monospace
   during count-up. Each metric = big number + 10 px uppercase 0.14em label
   in an accent color + 11 px `#555A78` sub-caption. Responsive: collapses
   to 2-up < 900 px, 1-up < 560 px.
5. **AI Copilot ribbon** — full-width clickable bar with 🤖 gradient tile +
   10 px uppercase `AI Copilot · Mission Brief` eyebrow + live 13 px brief
   message (pulled from data, not hard-coded) + `Open →` pill right. Bottom
   1 px animated gradient bar via `.ehb-ai-bar` keyframes.
6. **Gradient action strip** — primary CTA uses `.ehb-cta-primary` (6s linear
   shimmer across `--grad-ehb-primary` extended palette, 220% bg size) + ghost
   secondary CTA + right-aligned chip row (phase + wallet balance).

**Surface spec:**

- Surface background: near-black gradient —
  ```
  radial-gradient(ellipse 55% 60% at 18% 0%, rgba(123,110,246,0.18), transparent 60%),
  radial-gradient(ellipse 50% 55% at 92% 10%, rgba(43,191,160,0.15), transparent 60%),
  linear-gradient(180deg, rgba(8,10,22,0.96) 0%, rgba(12,14,28,0.98) 55%, rgba(10,12,26,0.98) 100%)
  ```
- Border: `1px solid rgba(255,255,255,0.08)`.
- Radius: `20` (bigger than §7.1 cards — hero is the marquee).
- Shadow: `0 32px 80px rgba(10,12,24,0.55), 0 1px 0 rgba(255,255,255,0.10) inset`.
- Padding: `clamp(34px, 5vw, 68px) clamp(26px, 3.2vw, 56px) clamp(28px, 3.6vw, 44px)`.
- `overflow: hidden` + `isolation: isolate` so the orbs below can't leak.

**Ambient orbs (mandatory — this is what sells the cinematic feel):**

Two drifting, blurred gradient circles behind the content layer:

- Orb A: top-left, 520×520, `rgba(123,110,246,0.42)` radial, `filter: blur(8px)`,
  14 s drift loop via `@keyframes ehb-orb-drift-a`.
- Orb B: bottom-right, 560×560, `rgba(43,191,160,0.36)` radial, `filter: blur(10px)`,
  18 s drift loop via `@keyframes ehb-orb-drift-b`.

Both `aria-hidden` + `pointerEvents: none` + `zIndex: 0`. Content layer at `zIndex: 2`.
Scan line at `zIndex: 1`.

**Scan line:**

A 1 px-tall sweep across the top edge — `width: 40%`, gradient `transparent → #7B6EF6 → #2BBFA0 → transparent`,
`@keyframes ehb-scan` (4.2 s ease-in-out infinite) translating -100% → 100%.

### 7.12.1 Animated number counter

The big-number metric pattern used in the hero metric row. Per-digit tnum +
blur-in rise animation:

```css
@keyframes ehb-num-rise {
  0%   { opacity: 0; transform: translateY(14px); filter: blur(6px); letter-spacing: 0; }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0);    filter: blur(0); letter-spacing: -0.5px; }
}
.ehb-num { animation: ehb-num-rise 900ms cubic-bezier(.2,.8,.2,1) both; }
.ehb-num-d1 { animation-delay: 120ms; }
.ehb-num-d2 { animation-delay: 240ms; }
.ehb-num-d3 { animation-delay: 360ms; }
.ehb-num-d4 { animation-delay: 480ms; }
```

Stagger each metric in the 4-up row with `d1 → d4`. Numbers are derived from
live data (e.g. `data.coreSystems` average, `data.industries.phase1.length`) —
never hard-coded copy.

### 7.12.2 Live status orb

A small pulsing dot + label pill. Teal `#2BBFA0` when `source === "live"`,
amber `#F0A030` when `source === "fallback"`. The outer halo breathes via:

```css
@keyframes ehb-live-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(43,191,160,0.55), 0 0 14px rgba(43,191,160,0.45); }
  50%      { box-shadow: 0 0 0 6px rgba(43,191,160,0.00), 0 0 22px rgba(43,191,160,0.65); }
}
.ehb-live-dot { animation: ehb-live-pulse 2200ms ease-in-out infinite; }
```

Label pill: 10 px uppercase 0.1em tracked, 6/12 px padding, 999 px radius,
matching color background at 10% and border at 28%.

### 7.12.3 AI Copilot ribbon

The clickable bar that bridges the hero metrics and the action strip. It's a
**live data source**, not decoration — its message is computed from current
critical counts. If `criticalFixes + criticalBugs > 0`, show the count and
route to the Quality queue; otherwise show a forward-looking focus message.

- Background: `linear-gradient(135deg, rgba(160,152,248,0.08), rgba(43,191,160,0.08))`
- Border: `1px solid rgba(160,152,248,0.22)`
- Icon tile: 38 × 38, radius 10, `--grad-ehb-ai` gradient, 🤖
- Bottom shimmer: 1 px `.ehb-ai-bar` keyframe (5 s ease-in-out).
- Must be `type="button"` (not `<a>`) and fire `openDetail()` with the
  same quick-action detail used by `QuickActionBanner` — single source of truth.

### 7.12.4 Gradient CTA shimmer

Primary hero CTA uses a slow horizontal shimmer across an extended brand
gradient. **Never** a solid brand color — that violates §13.

```css
.ehb-cta-primary {
  background-image: linear-gradient(
    100deg,
    #7B6EF6 0%, #A098F8 22%, #2BBFA0 50%, #A098F8 78%, #7B6EF6 100%
  );
  background-size: 220% 100%;
  animation: ehb-cta-shimmer 6s linear infinite;
}
@keyframes ehb-cta-shimmer {
  0%   { background-position: 0% 50%;   }
  100% { background-position: 200% 50%; }
}
```

Hover: `filter: brightness(1.08); transform: translateY(-1px);`
Shadow: `0 14px 34px rgba(123,110,246,0.40), 0 0 0 1px rgba(255,255,255,0.12) inset`.

### 7.12.5 Reduced-motion compliance

Every keyframe introduced by §7.12 (`ehb-orb-drift-a/b`, `ehb-live-pulse`,
`ehb-num-rise`, `ehb-headline-rise`, `ehb-cta-shimmer`, `ehb-scan`, `ehb-ai-bar`)
**must** be added to the `@media (prefers-reduced-motion: reduce)` block with
`animation: none !important`. No exceptions — see §8.4.

**Reference implementation:** `apps/web/app/development/page.tsx` v5.0.

---

## 8. Animation & motion

### 8.1 Durations (use these — no magic numbers)

| Interaction       | Duration | Easing                      |
|-------------------|----------|-----------------------------|
| Hover (lift)      | 160 ms   | `ease-out`                  |
| Click / press     | 120 ms   | `ease-in-out`               |
| Card drill-in     | 240 ms   | `cubic-bezier(.2,.8,.2,1)`  |
| Page enter        | 320 ms   | `cubic-bezier(.2,.8,.2,1)`  |
| Progress fill     | 400 ms   | `ease-out`                  |
| Skeleton shimmer  | 1800 ms  | `linear` infinite           |
| Critical pulse    | 1400 ms  | `ease-in-out` infinite      |

### 8.2 Required animations (ship these everywhere)

- **Card hover:** `transform: translateY(-2px); box-shadow grows`
- **Button hover:** `background brightens 8%, scale 1.02`
- **Page enter:** fade + slide-up (8 px), staggered children 40 ms apart
- **Scroll reveal:** use `IntersectionObserver`, don't re-animate on re-scroll
- **Loading:** skeleton shimmer for data, never a spinner for content
- **Route transition:** fade 200 ms

### 8.3 Animation library

- **Framer Motion** for React component animations
- **Lottie** for icon-scale celebratory moments (verification success, wallet top-up)
- **GSAP** only for complex timeline needs (hero explainer videos)

### 8.4 Accessibility

Always respect `prefers-reduced-motion: reduce` — drop durations to 1 ms and
kill infinite loops.

---

## 9. Iconography

1. **Emoji first.** For dashboards, data tables, and marketing, emojis are
   lightweight design tokens. They're cross-platform and load instantly.
2. **Lucide second.** For button icons, input adornments, and anywhere a
   monochrome stroke icon reads better (`lucide-react`).
3. **Mandatory icon map (keep in sync with fallback data):**

| Section        | Icon   | Section            | Icon   |
|----------------|--------|--------------------|--------|
| AI Department  | 🤖    | Blockchain         | ⛓️    |
| Finance/Wallet | 💰    | Affiliate          | 🔗    |
| Franchise      | 🏢    | JPS / Jobs         | 💼    |
| Verification   | 🔐    | DMO                | 🏛️    |
| STL / Trust    | ⭐    | PSS                | 🔐    |
| CRB            | 📜    | Industries         | 🏭    |
| Countries      | 🌍    | Shared components  | 🧩    |
| GoSellr        | 🛒    | Legal              | ⚖️    |
| Medical        | 🏥    | Education          | 🎓    |
| Travel         | ✈️    | Priority queue     | 🎯    |
| Platform vitals| 📊    | Core systems       | 🧠    |

---

## 10. Layout patterns

### 10.1 Bento grid (dashboard hero)

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
grid-auto-rows: minmax(140px, auto);
gap: 14px;
```

Feature cards can span 2 columns / 2 rows for emphasis. Never use fixed grid
positions — always auto-fit so it survives any viewport.

### 10.2 Three-column dashboard

- Left rail: 260 px (nav + filters)
- Main: `1fr`
- Right rail: 320 px (drawer / context / chat)

On viewports < 1200 px, right rail collapses into a floating panel. On < 860 px,
left rail becomes a hamburger.

### 10.3 Data tables

Never use a raw HTML `<table>`. Use a grid-based row list where each row is a
full-height clickable card. This lets rows show icons, chips, progress bars, and
actions without the cramped table feel.

### 10.4 Responsive breakpoints

| Name       | Min width | Purpose                           |
|------------|-----------|-----------------------------------|
| `mobile`   | 0         | Default (phone)                   |
| `tablet`   | 720 px    | 2-col grids, drawer collapses     |
| `laptop`   | 1024 px   | 3-col grids, side rail appears    |
| `desktop`  | 1440 px   | Full bento layout                 |
| `ultrawide`| 1800 px   | Max content width holds at 1600   |

Use these via `@media` or `clamp()` — never inline pixel queries.

---

## 11. Accessibility (WCAG 2.1 AA minimum)

- **Contrast:** All body text ≥ 4.5:1 on its background.
- **Focus:** Every interactive element has a visible `:focus-visible` outline
  (2 px `brand-purple`).
- **Touch targets:** 44 × 44 px minimum on any tap target.
- **ARIA:** Clickable cards get `role="button"` + `aria-label` describing the
  drill-in action.
- **Screen readers:** Icons that carry meaning get `aria-label`, decorative
  icons get `aria-hidden="true"`.
- **Keyboard:** Tab order follows visual order. Drawer closes on `Esc`. Modal
  traps focus.

---

## 12. Tech stack (mandatory)

| Layer          | Tool                              |
|----------------|-----------------------------------|
| Framework      | Next.js 14 App Router + TS        |
| Styling        | Inline CSS-in-JS (current) → migrating to Tailwind for new components |
| Components     | shadcn/ui (Radix primitives) + `apps/web/components/ui/` |
| Icons          | `lucide-react` + emoji            |
| Animation      | Framer Motion                     |
| Charts         | Recharts                          |
| 3D             | Three.js (r128) / react-three-fiber |
| Lottie         | `lottie-react`                    |
| Complex motion | GSAP                              |

**No raw HTML controls** — always go through the `@/components/ui/*` layer.
**No Material UI, Chakra, Ant Design.** We own our look.

---

## 13. Do NOTs (agent hard-stops)

Never ship any of the following on the EHB platform:

1. ❌ A flat card with no shadow, blur, or inset highlight
2. ❌ A solid brand color on a button (use a gradient)
3. ❌ A raw HTML `<table>`
4. ❌ A spinner for content loading (use skeleton shimmer)
5. ❌ Pure white text on a silver background
6. ❌ Fixed pixel widths that don't survive 360-px mobile
7. ❌ A modal without a focus trap
8. ❌ A row without an icon
9. ❌ `alert()`, `confirm()`, `prompt()` — use the drawer
10. ❌ Duplicate `Card.tsx` at a new path (Windows case-insensitive trap)
11. ❌ Hard-coded strings without i18n readiness (even if i18n is phase-2)
12. ❌ Basic MUI/Bootstrap-looking UI — instant rollback

---

## 14. Auto-update protocol (for agents)

**Every agent must append to this file** when any of the following happen:

1. A new UI pattern is introduced → add a §7.x entry
2. A new color / gradient is shipped → add to §2.x
3. A new animation duration → add to §8.1
4. A new icon is added to a section → add to §9 map
5. A new breakpoint is needed → add to §10.4
6. A design decision changes → mark the old rule `~~strikethrough~~` and add
   the new one with a ✱ and a date stamp

**Changelog footer at the bottom of this file is mandatory.** Every edit gets a
new line.

**Before editing, agents must:**

1. Read this file top to bottom
2. Read `design-system/ai-behavior.md`
3. Check the component under discussion against §7
4. Only then write code

---

## 15. Component roadmap (what we're building, in order)

| #  | Component               | Status  | Owner       | Notes |
|----|-------------------------|---------|-------------|-------|
| 1  | Card primitive          | ✅ live | apps/web    | §7.1  |
| 2  | Clickable card          | ✅ live | apps/web    | §7.2 — used on /development |
| 3  | Detail drawer           | ✅ live | apps/web    | §7.7  |
| 4  | Quick Action banner     | ✅ live | apps/web    | §7.8  |
| 5  | Priority queue row      | ✅ live | apps/web    | §7.6  |
| 6  | Silver 3D background    | ✅ live | apps/web    | §6, used on /development |
| 7  | Bento Mission Control   | ✅ live | apps/web    | §7.11 — hero dashboard pattern |
| 8  | Health Ring (SVG radial)| ✅ live | apps/web    | §7.11.1 — inside Bento |
| 9  | Stats mini-grid widget  | ✅ live | apps/web    | §7.11.2 — inside Bento |
| 10 | Bento grid (generic)    | 🚧 next | packages/ui | §10.1 — extract from /development |
| 11 | Wallet card + balance   | 📝 spec | apps/web    | §7.x TBD |
| 12 | STL badge (L0–L8)       | 📝 spec | packages/ui | Halo glow per level |
| 13 | AI assistant panel      | 📝 spec | apps/web    | Sidebar drawer |
| 14 | Franchise hierarchy     | 📝 spec | apps/web    | Tree view |
| 15 | Verified seal halo      | 📝 spec | packages/ui | PSS/CRB/STL combined |

---

## 16. How to use this file

### From a Claude Code / Claude in Chrome session

Before any UI work, run:

```bash
cat design-system/EHB-UIUX-SYSTEM.md
cat design-system/ai-behavior.md
```

Then design, then write code, then append to §14 changelog.

### From Cursor

`.cursorrules` (auto-generated from AGENTS.md) already points here. Cursor will
read this file on every prompt that touches UI code.

### From a human designer

This is your spec. If a screen doesn't match it, it's the screen that's wrong.

---

## Changelog

- **2026-04-11 · v1.4** — Cinematic Hero pattern added as §7.12 (plus
  sub-sections §7.12.1 animated number counter, §7.12.2 live status orb,
  §7.12.3 AI Copilot ribbon, §7.12.4 gradient CTA shimmer, §7.12.5
  reduced-motion compliance). Reference implementation shipped on
  `apps/web/app/development/page.tsx` v5.0. Tesla/Apple minimalist
  aesthetic: near-black glass surface over silver page bg, two drifting
  gradient orbs (14 s + 18 s loops), huge headline `clamp(44px, 6.2vw, 96px)`
  with gradient 2nd line, 4-up animated number counter row (platform build
  %, industries live, core depts, AI modules) with stagger rise-in
  (`ehb-num-rise` 900 ms + `d1..d4` 120/240/360/480 ms delays), AI Copilot
  ribbon bound to live critical-count data (not decorative), primary CTA
  shimmer across extended brand gradient, pulsing live status pill. All
  new keyframes (`ehb-orb-drift-a/b`, `ehb-live-pulse`, `ehb-num-rise`,
  `ehb-headline-rise`, `ehb-cta-shimmer`, `ehb-scan`, `ehb-ai-bar`) are
  gated behind `prefers-reduced-motion: reduce`. Responsive collapses:
  4-up metrics → 2-up <900 px → 1-up <560 px; action strip stacks <900 px.
  Backup of v4.4: `backup/v5.0-cinematic-hero-2026-04-11/`. *Agent:* Claude
  Opus 4.6.
- **2026-04-11 · v1.3** — Naming migration applied platform-wide:
  `SQL` → `STL` (Service Trust Level) and `EDR` → `CRB` (Certification &
  Registry Board). 32 files touched, 112 line-level edits, 2 file renames
  (`SQLLevelDashboard.tsx` → `STLLevelDashboard.tsx`, `sqlLevels.ts` →
  `stlLevels.ts`), Prisma schema field + `@map` column, type aliases,
  enum members, and all imports updated. Backups in
  `backup/sql-to-stl-edr-to-crb-2026-04-11/`. Script:
  `scripts/sql-to-stl-rename.py`. The auto-correction rule is now encoded
  in `AGENTS.md §6.2` and `design-system/ai-behavior.md §9.1` so every
  future agent write auto-applies it without being asked. *Agent:*
  Claude Opus 4.6.
- **2026-04-11 · v1.2** — Bento Mission Control polish pass. Shipped on
  `apps/web/app/development/page.tsx` v4.4. Adds: (a) mobile bento collapse
  — §7.11 rule #4 now enforced via injected `@media (max-width: 900px)`
  rule that drops the grid to 1 col with priority queue first, health ring
  second, stats third; (b) page enter fade + slide-up stagger — §8.2
  implemented via keyframe `ehb-fade-up` (320 ms, `cubic-bezier(.2,.8,.2,1)`,
  40 ms stagger steps `ehb-fade-up-d1..d5`); (c) critical pulse — §8.1
  `1400 ms ease-in-out` loop now auto-applies to Quick Action banner when
  `hasCritical === true` via `ehb-critical-pulse` class; (d) accessibility
  §11: Esc-key closes the drawer + body scroll lock on open, drawer gets
  `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, all
  `ClickableCard` instances carry an `ehb-clickable` class that paints a
  2 px `#7B6EF6` focus-visible outline, aria-labels added to drill-down
  buttons; (e) §8.4 `prefers-reduced-motion: reduce` compliance — all
  injected keyframes and global transitions short-circuit to 1 ms when the
  user opts out. These rules live inside a `<style dangerouslySetInnerHTML>`
  block at the top of the component so the rest of the file stays in
  CSS-in-JS. *Agent:* Claude Opus 4.6.
- **2026-04-11 · v1.1** — Added §7.11 Bento Mission Control dashboard pattern
  (hero layout for control-center pages), §7.11.1 Health Ring SVG radial
  widget, §7.11.2 Stats mini-grid widget. Marked roadmap items 7–9 as ✅ live.
  Shipped on `apps/web/app/development/page.tsx` v4.3 — replaces the previous
  vertical-stack layout (Quick Action → Priority Queue → standalone stats)
  with a single bento grid: Priority queue (left 2-col wide) + Health Ring
  (top-right) + Stats mini-grid (bottom-right). Priority card level
  differentiation now enforced (red/amber/green glows per §7.6).
  *Agent:* Claude Opus 4.6.
- **2026-04-11 · v1.0** — File created. Initial tokens, silver 3D recipe,
  clickable card + detail drawer pattern, priority queue, §14 auto-update
  protocol, §15 roadmap. Extracted from `apps/web/app/development/page.tsx` v4.2.
  *Agent:* Claude Opus 4.6.

---

*EHB Technologies (Pvt.) Ltd. — Design · v1.4 · 2026-04-11*
