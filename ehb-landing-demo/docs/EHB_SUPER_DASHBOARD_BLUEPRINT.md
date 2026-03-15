# EHB Super Dashboard Blueprint

**Stripe + Apple Vision + Web3-level UI structure for EHB Global AI Super App**

---

## 1. Global App Layout (OS-style)

```
┌─────────────────────────────────────────────────────────────┐
│  TOP NAVBAR (glass, blur, neon bottom border)               │
│  Logo | Search | Notifications | Wallet balance | Profile    │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   SIDEBAR    │              MAIN CONTENT                    │
│   (fixed)    │   Dashboard / Marketplace / Module panels   │
│              │                                              │
│   • Dashboard│   Hero / Stats / AI panel / Widgets         │
│   • AI Market│                                              │
│   • GoSellr  │                                              │
│   • JPS      │                                              │
│   • Franchise│                                              │
│   • Wallet   │                                              │
│   • Services │                                              │
│   • AI Insights                                             │
│   • Settings │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

- **Navbar:** Global search, AI quick actions, notifications, wallet balance (EHBGC), profile. Use `nav-glass`.
- **Sidebar:** Collapsible on mobile; always visible on desktop. Active item = neon border + soft glow.
- **Main area:** No full-page background override; use global `page-mesh` (space gradient + subtle grid).

---

## 2. Screen Map (Routes & Purpose)

| Route | Purpose | Top sections |
|-------|---------|--------------|
| `/` | Landing (public) | Hero, value prop, CTA, industries |
| `/home` or `/dashboard` | Main dashboard (post-login) | Welcome card, AI suggestions, notifications, stats row, AI recommendation panel, widgets |
| `/ai-marketplace` | AI Marketplace | Search, AI filter, category cards, service providers, trending/free tools |
| `/gosellr` | GoSellr Marketplace | Trending products, nearby sellers, AI recommended, flash deals |
| `/jps` | JPS Profile System | Profile card (picture, frame, SQL level, verification, skills, rating), services, jobs |
| `/wallet` | Wallet + Earnings | Balance, affiliate income, service earnings, pending withdraw, locked tokens, charts (neon line / animated bars) |
| `/franchise` | Franchise Dashboard | City performance, active sellers, orders volume, commission earnings |
| `/services` | Services hub | Service categories, my services, bookings |
| `/ai-insights` | AI Intelligence | AI suggested services/affiliates, fraud/demand insights, actionable cards |
| `/settings` | Settings | Account, notifications, theme, security |

---

## 3. Design System (Figma-level summary)

### Colors
- **Background:** `#020617` (base), `#020c1b` (surface)
- **Panel/glass:** `rgba(255,255,255,0.05)` with backdrop blur
- **Primary glow:** `#00eaff` (neon blue)
- **Secondary glow:** `#3b82f6` (electric blue)
- **Accent glow:** `#8b5cf6` (violet)
- **Text:** `#e5e7eb` (body), `#94a3b8` (muted), white (headings)

### Spacing & typography
- **Container:** `container-ehb` (max-width 75–100rem, responsive padding)
- **Section padding:** `section-pad` (py-4–py-6)
- **Headings:** Strong hierarchy; gradient text for hero (`gradient-text`); uppercase tracking for labels
- **Body:** 11px–14px; line-height snug for cards

### Components (reusable)
- **GlassCard / glass-panel:** Backdrop blur, translucent bg, soft border
- **StatsCard / KpiCard:** Label, value, detail; glass + card-hover
- **ProductCard:** Image area, price, rating, seller, Add to cart; hover scale + neon glow
- **ServiceCard:** Icon, title, rating, distance, price preview; same hover
- **WalletCard:** Balance block, label, value, trend
- **AIInsightCard:** Icon, title, short message, CTA; optional glow accent
- **Nav glass:** `nav-glass` for navbar/footer (blur, thin bottom glow)

### Animations (GPU-friendly)
- **Card hover:** `translateY(-6px)` + `scale(1.03)` + neon box-shadow; 250ms ease
- **Button:** `btn-glow` hover = shadow bloom + slight scale
- **Page:** Optional fade-in; no layout shift
- Use `transform` and `opacity` only; avoid animating width/height

---

## 4. Main Dashboard (post-login) – Sections

1. **Welcome card**  
   “Welcome back [Name] 👋” + one-line AI suggestion (e.g. “3 new earning opportunities today”).

2. **Stats row**  
   Glass stats cards: Total Earnings, Orders, Services Active, Affiliate Income, Wallet Balance. Each: label, value, optional trend.

3. **AI Recommendation panel**  
   “AI Suggested Services” with list items (e.g. Nearby delivery request, GoSellr seller opportunity, Affiliate product trending). Each item clickable; card style with soft glow.

4. **Notifications strip**  
   Compact list or pills; link to full notifications.

5. **Widgets area**  
   Modular blocks: AI Insights, Orders Today, Nearby Requests, Trending Products, Affiliate Stats. User can reorder later (layout first, drag-drop later).

---

## 5. AI Marketplace – Sections

- **Search bar** + AI filter chips (category, distance, rating, price).
- **Category cards:** Education, Health, Law, Delivery, IT, Home Services, etc. Each: icon, label, count; hover glow.
- **Service providers / product grid:** Card = image/icon, title, rating, distance, price preview, Add/Quick view. Hover: lift + neon border.

---

## 6. GoSellr – Sections

- **Trending products** (horizontal or grid)
- **Nearby sellers**
- **AI recommended products**
- **Flash deals**  
Product card: image, price, rating, seller, Add to cart; hover scale + neon + quick view.

---

## 7. JPS Profile – Sections

- **Profile card:** Picture, frame, SQL level badge, verification badge (e.g. PSS), skills tags, rating.
- **Service line:** e.g. “Web Developer”
- **Secondary:** Jobs applied, services offered, reviews (can be separate sections).

---

## 8. Wallet – Sections

- **Balance card:** Main balance (EHBGC), fiat equivalent.
- **Row:** Affiliate Income, Service Earnings, Pending Withdraw, Locked Tokens.
- **Charts:** Monthly earnings, orders growth, affiliate growth — neon line or animated bars; same color system.

---

## 9. Franchise Dashboard – Sections

- **City/territory selector**
- **KPIs:** Orders today, Revenue, Commission
- **Panels:** Active sellers, orders volume, commission breakdown (tables or cards).

---

## 10. AI Intelligence Layer (across app)

- **AI Insight blocks:** Short message + optional CTA (e.g. “Delivery demand in Rawalpindi +23% — activate delivery today”).
- **Placement:** Dashboard, AI Marketplace, GoSellr, Wallet, Franchise (widgets or top banners).
- **Style:** Same glass card + optional neon accent; icon or “AI” badge.

---

## 11. Premium Visual Effects (global)

- **Background:** `page-mesh` = space gradient + subtle grid (no heavy particles in first phase).
- **Hover:** Card lift, glow shadow, consistent 250ms ease.
- **Cursor:** Optional “cursor glow” later (e.g. radial glow follow); use `requestAnimationFrame`, keep subtle.

---

## 12. Performance Rules

- Animations: `transform` + `opacity` only.
- Avoid layout thrashing; prefer `will-change` only on animated elements if needed.
- Images: responsive, lazy-load below fold.
- No full-page background override from pages; rely on layout + `page-mesh`.

---

## 13. Cursor AI Master Prompt (use in Cursor chat)

Copy-paste this when you want Cursor to apply the EHB world-class UI consistently:

```
You are implementing the EHB Super Dashboard UI. Follow the blueprint in docs/EHB_SUPER_DASHBOARD_BLUEPRINT.md.

Rules:
- Use the global layout: sidebar + top navbar + main content. No full-page bg override (no bg-slate-950, bg-black, bg-gray-900 on main/content).
- Use design system: background #020617 / #020c1b, glass rgba(255,255,255,0.05), accent #00eaff, #3b82f6, #8b5cf6.
- Use existing utilities from globals.css: .glass-panel, .glass-card, .card-hover, .card-interactive, .btn-glow, .btn-neon, .nav-glass, .page-mesh, .gradient-text, .container-ehb.
- All cards: glass style, hover = lift (-6px) + scale 1.03 + neon border glow. Transitions 250ms, GPU-friendly (transform + opacity).
- Typography: clear hierarchy; gradient-text for hero headings; uppercase tracking for small labels.
- Output: complete, production-ready React/Next.js components. No placeholder TODOs. Keep existing data/copy; change only layout and styling to match the blueprint.
```

---

**Next steps (implementation order suggested):**

1. Add **persistent sidebar + dashboard layout** (layout or nested layout for `/dashboard`, `/ai-marketplace`, etc.).
2. Implement **Dashboard home** (welcome card, stats row, AI recommendation panel, widgets).
3. Align **AI Marketplace** with blueprint (search, filters, category cards, provider cards).
4. Add **GoSellr**, **JPS**, **Wallet**, **Franchise** pages with sections above.
5. Introduce **AIInsightCard** and place it on dashboard and key modules.
6. Optional: cursor glow, page transition animations, widget drag-drop.

---

*Document: EHB Super Dashboard Blueprint — World-class UI architecture for EHB Technologies.*
