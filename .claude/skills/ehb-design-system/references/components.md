# EHB Component Library & Layout Specs

## 1. Phone Frame (Mobile View)

### Frame Shell
```css
.phone-frame {
  width: 280px; /* 280-290px */
  border-radius: 44px;
  background: linear-gradient(165deg, #3c3c3e, #1e1e20 45%, #111);
  box-shadow:
    0 0 0 1px #565656,
    0 0 0 3px #222,
    0 6px 50px rgba(0,0,0,0.8);
  padding: 10px;
  position: relative;
}
```

### Side Buttons (Absolute Positioned)
```css
/* Volume Up */
.phone-btn-vol-up {
  position: absolute; left: -7px; top: 84px;
  width: 5px; height: 26px;
  background: linear-gradient(180deg, #464646, #262626);
  border-radius: 3px 0 0 3px;
}

/* Volume Down */
.phone-btn-vol-down {
  position: absolute; left: -7px; top: 118px;
  width: 5px; height: 48px;
  background: linear-gradient(180deg, #464646, #262626);
  border-radius: 3px 0 0 3px;
}

/* Power */
.phone-btn-power {
  position: absolute; right: -7px; top: 104px;
  width: 5px; height: 52px;
  background: linear-gradient(180deg, #464646, #262626);
  border-radius: 0 3px 3px 0;
}
```

### Screen Area
```css
.phone-screen {
  border-radius: 35px;
  overflow: hidden;
  background: var(--bg);
  position: relative;
}
```

### Status Bar
```html
<div class="status-bar">
  <span class="time">12:55</span>
  <div class="right">
    <div class="signal-bars"><!-- 5 bars, flex align-end --></div>
    <span class="wifi">▲</span>
    <div class="battery">
      <!-- 19x9px border, #4cd964 fill, nub on right, ⚡ inside -->
    </div>
  </div>
</div>
```
```css
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: rgba(0,0,0,0.3);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
```

### Navigation Bar
```css
.nav-bar {
  background: linear-gradient(180deg, var(--nav1), var(--nav2));
  padding: 8px 14px;
  position: relative;
}

/* Bottom accent line - animated */
.nav-bar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--a1), var(--a2), var(--a3), var(--a2), var(--a1));
  animation: nav-accent 3s linear infinite;
}

@keyframes nav-accent {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nav-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.nav-subtitle {
  font-size: 10px;
  color: var(--a3);
}

.nav-back {
  font-size: 10px;
  color: var(--a3);
}
```

### Dock (Bottom Bar)
```css
.dock {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 16px;
  background: var(--dock);
  backdrop-filter: blur(12px);
  position: relative;
}

/* Top shine */
.dock::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.26), transparent);
  pointer-events: none;
}

/* Top accent line */
.dock::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: linear-gradient(90deg, var(--a1), var(--a3), var(--a1));
}
```

### Dock Icon
```css
.dock-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 3px 0 rgba(0,0,0,0.28),
    0 5px 10px rgba(0,0,0,0.38);
}

/* Add plastic coat ::before (gloss) and ::after (shimmer) */

.dock-icon:active {
  transform: scale(0.88) translateY(2px);
}
```

---

## 2. PC Desktop Layout

### Top Bar
```css
.pc-topbar {
  height: 52px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(90deg, var(--nav1), var(--nav2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

/* Bottom animated accent line */
.pc-topbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--a1), var(--a2), var(--a3), var(--a2), var(--a1));
  animation: nav-accent 3s linear infinite;
}
```

### Top Bar Content
- **Left:** EHB logo (Orbitron font, gold gradient text) + separator `|` + back button + page title
- **Right:** LIVE pill (green dot + text) + theme switcher buttons

### Body Layout
```css
.pc-body {
  padding: 20px 24px 32px;
  max-width: 1600px;
  margin: 0 auto;
}
```

### Hero Row (3-column)
```css
.hero-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
}
```

### Level Grid
```css
.level-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

/* Mobile: 2 columns */
@media (max-width: 720px) {
  .level-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### Widget Grid (3-column bottom)
```css
.widget-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .widget-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 720px) {
  .widget-grid { grid-template-columns: 1fr; }
}
```

### Hero Stats Boxes
```css
.hero-stat {
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
}

.hero-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.hero-stat-label {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}
```

---

## 3. Component Specifications

### Level Progress Track
```
[●]──›──[●]──›──[●]──›──[★]──›──[🔒]──›──[🔒]
 L1      L2      L3     L4(you)   L5       L6
```

- Each node: circle 26-36px diameter
- Done nodes: green background, white checkmark
- Active node: gold background, crown icon, pulsing glow ring
- Locked nodes: gray background, lock icon, opacity 0.58-0.72
- Between nodes: `›` arrow in muted color
- Label below: 7-9px bold text
- Progress bar below entire track: animated gradient fill

### Widget Cards
```css
.widget-card {
  position: relative;
  overflow: hidden;
  background: var(--card-face);
  border-radius: 14px;
  padding: 14px;
  /* Add plastic coating layers */
}

/* Top accent line */
.widget-card::before {
  /* ... gloss layer ... */
}

.widget-accent-line {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--a2), var(--a3), var(--a2), transparent);
}
```

Widget card anatomy:
1. Top accent gradient line (2px)
2. Header: icon (20px) + title (13px bold) + level badge (top-right)
3. Rows: icon (14px) + label (11px) + value (12px bold) — flex space-between
4. Divider: `1px solid rgba(0,0,0,0.06)` between rows
5. Mini progress bars: 3-5px height, animated gradient fill

### Status Indicators
```css
.status-ok    { color: var(--ok); } /* Green check */
.status-warn  { color: var(--wn); } /* Amber warning */
.status-fail  { color: var(--fl); } /* Red X */
.status-star  { color: var(--go); } /* Gold star */
```

### Notification Badge
```css
.notif-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: linear-gradient(135deg, #ff4040, #cc1020);
  border: 1.5px solid #fff;
  border-radius: 9px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 2px 0 #880808;
}
```

### App Icons (iOS Style)
```css
.app-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  /* Each icon has unique gradient background */
  box-shadow:
    0 3px 0 rgba(0,0,0,0.28),
    0 5px 10px rgba(0,0,0,0.38);
}

/* Add ::before (gloss 50%) and ::after (shimmer) */

.app-icon:active {
  transform: scale(0.88) translateY(2px);
}
```

### LIVE Pill
```css
.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(34,197,94,0.15);
  border: 1px solid rgba(34,197,94,0.35);
  color: #4ade80;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: live-blink 1.2s ease-in-out infinite;
}

@keyframes live-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

### Size Slider System (Mobile Scaling)
```css
:root {
  --sc: 1.0; /* Scale factor */
}

/* 5 sizes */
/* XS: --sc: 0.72 */
/* S:  --sc: 0.86 */
/* M:  --sc: 1.0  (default) */
/* L:  --sc: 1.16 */
/* XL: --sc: 1.32 */

/* All dimensions scale with calc() */
.scaled-text { font-size: calc(14px * var(--sc)); }
.scaled-padding { padding: calc(12px * var(--sc)); }
.scaled-icon { width: calc(24px * var(--sc)); height: calc(24px * var(--sc)); }
```

---

## 4. Sparkle Dots (Background Decoration)

```css
.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--a3);
  animation: sparkle 2.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes sparkle {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 0.7; }
}
```

Scatter 8-12 sparkle dots at random positions across the page background.
Use different `animation-delay` values for each dot (0s to 2.8s range).

---

*EHB Technologies — Component Library Reference v1.0*
