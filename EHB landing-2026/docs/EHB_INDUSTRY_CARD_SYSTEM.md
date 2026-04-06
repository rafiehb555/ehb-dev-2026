# EHB 32 Industry Card Design System

**Entry point for all industry landing pages · Same layout, icons, hover, unique color per industry**

Yeh blueprint **Cursor AI se instantly build** ho sakta hai. Sab industry cards isi system par: layout, hover, icon. **Har industry ka unique accent color (hex)** — `industry.accentColor` — borders, glow, underline, icons ke liye. Full 32 color map: **EHB_INDUSTRY_PHASES.md** Phase 1.

---

## 1. Card layout (single industry card)

**Structure (top → bottom):**

```
┌─────────────────────────────┐
│  [Icon]                     │  ← industry accent color
│  Title                      │  ← card title (e.g. "Education")
│  Short description          │  ← 1–2 lines
│  ───────────── (underline)  │  ← colored bar (accent)
└─────────────────────────────┘
```

**Specs:**

- **Container:** `glass-card` + `card-hover`. Border/glow color = **`industry.accentColor`** (unique hex per industry — see EHB_INDUSTRY_PHASES.md Phase 1). Use inline style or CSS var: e.g. `style={{ borderColor: industry.accentColor }}`, `boxShadow` with accentColor.
- **Icon:** Top, size ~40px (or 24px compact). Line icon, **color = industry.accentColor**.
- **Title:** `text-card-title` (20px), semibold.
- **Description:** `text-body` or smaller, 1–2 lines, muted (e.g. `ehb.slate`).
- **Colored underline:** 3–4px height bar at bottom (or under title), full width or 40% width, border-radius 2px. **Color = industry.accentColor**.

**Spacing:** Padding 16px–24px (`p-4`–`p-6`). Gap between icon and title 12px, title and description 8px. Card gap in grid: 24px.

---

## 2. Hover animation

**Default:**

- Border: soft (e.g. `border border-ehb-borderSoft` or industry accent at low opacity).
- No glow.

**Hover:**

- `transform: translateY(-6px) scale(1.03)`.
- `transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease`.
- Border: **industry.accentColor**.
- Box-shadow: soft neon using **industry.accentColor** (e.g. `0 0 20px ${accentColor}40`).

**Implementation:** Use `card-hover` + dynamic style: `style={{ ['--accent']: industry.accentColor } as React.CSSProperties}` and `borderColor: 'var(--accent)'`, or inline `borderColor` / `boxShadow` with `industry.accentColor`. Legacy 4-color classes (`industry-accent-red` etc.) optional fallback; prefer unique hex for visual power.

---

## 3. Icon system (Lucide)

**Style:** Line icons, 24px or 32px. **Color = industry.accentColor** (unique hex per industry).

**32 industries → Lucide icon name:**

| # | Industry (slug) | Lucide icon name |
|---|-----------------|-------------------|
| 1 | education | GraduationCap |
| 2 | health | Heart |
| 3 | law | Scale |
| 4 | it | Code2 |
| 5 | ai | Brain |
| 6 | blockchain | Link |
| 7 | finance | Landmark |
| 8 | insurance | ShieldCheck |
| 9 | real-estate | Building2 |
| 10 | construction | HardHat |
| 11 | automotive | Car |
| 12 | agriculture | Sprout |
| 13 | manufacturing | Factory |
| 14 | logistics | Truck |
| 15 | travel | Plane |
| 16 | hospitality | UtensilsCross |
| 17 | beauty | Sparkles |
| 18 | fitness | Dumbbell |
| 19 | entertainment | Film |
| 20 | gaming | Gamepad2 |
| 21 | marketing | Megaphone |
| 22 | consulting | Briefcase |
| 23 | hr | Users |
| 24 | freelancing | Laptop |
| 25 | security | Shield |
| 26 | telecom | Radio |
| 27 | energy | Zap |
| 28 | environment | Leaf |
| 29 | research | FlaskConical |
| 30 | retail | ShoppingCart |
| 31 | ngo | HeartHandshake |
| 32 | government | Building |

**Usage:** `import { GraduationCap, Heart, ... } from "lucide-react"`. Render icon with `className="text-ehb-highlight"` (or primary/secondary/accent) per mapping below.

---

## 4. Color mapping (32 industries → unique accent hex)

**Har industry ka unique accent color (hex)** — `industry.accentColor` in `lib/industries.ts`. Full table: **EHB_INDUSTRY_PHASES.md** Phase 1.

**Usage:** Card border, hover glow, icon color, underline bar = `industry.accentColor`. Example: `style={{ borderColor: industry.accentColor, boxShadow: \`0 0 20px \${industry.accentColor}40\` }}`.

**Legacy:** `accent` (red/blue/green/orange) ab bhi hai grouping ke liye; UI me prefer **accentColor** for visually powerful per-industry look.

---

## 5. Grid layout (32 industry section)

- **Desktop:** 4 columns (8 cards per row × 4 rows) or 3 columns (11+11+10).
- **Tablet:** 2–3 columns.
- **Mobile:** 1–2 columns.
- **Gap:** 24px (`card-gap-ultra`, `gap-6`).
- **Section padding:** 120px vertical (`section-pad-ultra`).

---

## 6. Link behavior

- Card = link to `/landing/[industry]` (or `/industry/[industry]`).
- Whole card clickable (wrap in `<Link>` or use `useRouter` on click).
- Accessible: `aria-label="View {Industry name} services"`, focus visible border.

---

## 7. Implementation checklist (Cursor)

- [ ] Add `accent` (or derive from slug) to industry config if needed.
- [ ] Create `IndustryCard` component: props `industry`, render icon (from mapping), title, description, colored underline, `industry-accent-*` + `card-hover`.
- [ ] Use Lucide icons: import only used icons or map slug → icon name and render dynamically.
- [ ] 32 Industry section: grid of `IndustryCard`, same spacing and section padding as per EHB_VISUAL_SYSTEM.md.
- [ ] Ensure hover uses correct glow (red/blue/green/orange) per industry.

---

*Rafi bhai — Is system se 32 industry cards consistent, professional, aur brand-aligned rahenge. Next: content strategy ya direct implementation in `app/page.tsx` + components.*
