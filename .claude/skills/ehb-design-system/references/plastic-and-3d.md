# EHB Plastic Coating & 3D System

## 1. Plastic Coating Effect — The EHB Signature

Every card, button, icon, and badge MUST have this 3-layer plastic coating.
This is what makes EHB look premium — like colored glass with reflections.

### Layer 1: Top Gloss (::before pseudo element)

```css
.ehb-plastic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 48%;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.55) 0%,
    rgba(255,255,255,0.08) 60%,
    rgba(255,255,255,0) 100%
  );
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  pointer-events: none;
  z-index: 2;
}
```

### Layer 2: Diagonal Shimmer Sweep (::after pseudo element)

```css
.ehb-plastic::after {
  content: '';
  position: absolute;
  top: -40%;
  left: -60%;
  width: 35%;
  height: 180%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.30),
    transparent
  );
  transform: skewX(-18deg);
  animation: ehb-sweep 4.5s ease-in-out infinite;
  z-index: 3;
  pointer-events: none;
}

@keyframes ehb-sweep {
  0% { left: -60%; }
  100% { left: 140%; }
}
```

### Layer 3: 3D Bottom Depth (box-shadow)

```css
.ehb-plastic {
  position: relative;
  overflow: hidden;
  box-shadow:
    0 1px 0 var(--card-top),          /* top highlight */
    0 5px 0 var(--card-bottom),        /* 3D depth — THIS IS THE KEY */
    0 7px 16px rgba(0,0,0,0.32),       /* drop shadow */
    0 0 0 1px rgba(0,0,0,0.10);        /* subtle border */
}
```

### Combining All Three

```css
.ehb-card {
  position: relative;
  overflow: hidden;
  background: var(--card-face);
  border-radius: 16px;
  padding: 16px;
  box-shadow:
    0 1px 0 var(--card-top),
    0 5px 0 var(--card-bottom),
    0 7px 16px rgba(0,0,0,0.32),
    0 0 0 1px rgba(0,0,0,0.10);
}

/* Add ::before and ::after as shown above */
```

### Important Rules
- Every visible UI element gets plastic coating — no exceptions
- Different shimmer delays per card (multiply index * 0.8s) for natural feel
- Buttons have `height: 52%` on the top gloss (slightly more than cards)
- Badges have smaller gloss and faster shimmer (3s instead of 4.5s)

---

## 2. 3D Button System

### Gold Button (Primary Action)
```css
.ehb-btn-gold {
  position: relative;
  overflow: hidden;
  background: linear-gradient(175deg, var(--a3) 0%, var(--a2) 45%, var(--a1) 100%);
  border: 1px solid var(--a4);
  color: #fff;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow:
    0 5px 0 color-mix(in srgb, var(--a1) 80%, black),
    0 7px 14px rgba(0,0,0,0.38);
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  transition: transform 0.18s, box-shadow 0.18s;
}

.ehb-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow:
    0 7px 0 color-mix(in srgb, var(--a1) 80%, black),
    0 9px 18px rgba(0,0,0,0.42);
}

.ehb-btn-gold:active {
  transform: translateY(5px);
  box-shadow: none;
}
```

### Blue Button (Navigation/Info)
```css
.ehb-btn-blue {
  background: linear-gradient(175deg, #60a0e8, #3070c0, #1040a0);
  border: 1px solid #80c0f8;
  color: #fff;
  box-shadow: 0 5px 0 #082060, 0 7px 14px rgba(0,0,0,0.38);
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  /* Same hover/active pattern as gold */
}
```

### Green Button (Success/Confirm)
```css
.ehb-btn-green {
  background: linear-gradient(175deg, #60cc50, #30a020, #108010);
  border: 1px solid #90e880;
  color: #fff;
  box-shadow: 0 5px 0 #085008, 0 7px 14px rgba(0,0,0,0.38);
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
```

### Red Button (Danger/Warning)
```css
.ehb-btn-red {
  background: linear-gradient(165deg, #e05050, #b02020, #800808);
  border: 1px solid #f08080;
  color: #fff;
  box-shadow: 0 4px 0 #480404, 0 6px 12px rgba(0,0,0,0.35);
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
```

### All Buttons Must Have
- `::before` → top gloss (height 52%)
- `::after` → diagonal shimmer sweep
- `:active` → `transform: translateY(5px); box-shadow: none;` (press down)
- `:hover` → `transform: translateY(-2px);` (lift up)
- `border-radius: 8-12px`
- `font-weight: 700`
- `cursor: pointer`

---

## 3. STL Level Badge 3D Style

```css
.stl-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: linear-gradient(175deg, var(--level-color-1), var(--level-color-2));
  color: #fff;
  box-shadow:
    0 2px 0 rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.32);
}

/* Plastic coat on badges too — smaller, faster */
.stl-badge::before {
  /* Same top gloss but height: 55% */
}
.stl-badge::after {
  /* Same shimmer but animation: ehb-sweep 3s */
}
```

### Current Level Glow Ring
```css
.stl-current {
  border: 2.5px solid var(--a3);
  box-shadow:
    0 0 0 1px var(--a1),
    0 0 14px var(--glow),
    inset 0 0 8px rgba(var(--glow-rgb), 0.3);
  animation: ehb-ring-pulse 2s ease-in-out infinite;
}

@keyframes ehb-ring-pulse {
  0%, 100% {
    box-shadow: 0 0 0 1px var(--a1), 0 0 14px var(--glow), inset 0 0 8px rgba(var(--glow-rgb), 0.3);
  }
  50% {
    box-shadow: 0 0 0 2px var(--a2), 0 0 22px var(--glow), inset 0 0 12px rgba(var(--glow-rgb), 0.5);
  }
}
```

### Locked Level Style
```css
.stl-locked {
  opacity: 0.58;
  filter: grayscale(0.3);
  cursor: not-allowed;
}
.stl-locked .stl-badge::after {
  content: 'LOCKED';
}
```

---

## 4. Card Depth Variations

### Standard Card (16px depth)
```css
box-shadow:
  0 1px 0 var(--card-top),
  0 5px 0 var(--card-bottom),
  0 7px 16px rgba(0,0,0,0.32),
  0 0 0 1px rgba(0,0,0,0.10);
```

### Raised Card (hover state)
```css
box-shadow:
  0 1px 0 var(--card-top),
  0 7px 0 var(--card-bottom),
  0 10px 24px rgba(0,0,0,0.38),
  0 0 0 1px rgba(0,0,0,0.10);
transform: translateY(-4px);
```

### Pressed Card (active state)
```css
box-shadow:
  0 1px 0 var(--card-top),
  0 2px 0 var(--card-bottom),
  0 3px 8px rgba(0,0,0,0.25),
  0 0 0 1px rgba(0,0,0,0.10);
transform: translateY(2px);
```

### Flat Inset Card (nested panels)
```css
box-shadow:
  inset 0 2px 4px rgba(0,0,0,0.15),
  inset 0 -1px 0 rgba(255,255,255,0.08);
```

---

*EHB Technologies — Plastic & 3D Reference v1.0*
