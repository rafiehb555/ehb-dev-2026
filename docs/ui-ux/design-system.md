# EHB Design System & UI/UX Specification

> Official design guidelines for EHB Platform

## Default Theme Reference
- **Image:** `assets/ui-default-theme-dark.png`
- **Status:** DEFAULT THEME (auto-selected)

---

# COLOR PALETTE

## Primary Theme: Dark Blue (DEFAULT)

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background Primary | `#0a0e1a` | Main background |
| Background Secondary | `#111827` | Sidebar, cards |
| Background Tertiary | `#1a2235` | Elevated cards |
| Background Hover | `#1e293b` | Hover states |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#3b82f6` | Primary buttons, links |
| Primary Blue Light | `#60a5fa` | Hover states |
| Cyan Accent | `#06b6d4` | Highlights, badges |
| Green Success | `#10b981` | Success states, "Add" buttons |
| Purple Accent | `#8b5cf6` | Premium/VIP badges |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#ffffff` | Headings |
| Text Secondary | `#94a3b8` | Body text |
| Text Muted | `#64748b` | Placeholder, hints |

### Border Colors
| Name | Hex | Usage |
|------|-----|-------|
| Border Default | `#1e293b` | Card borders |
| Border Focus | `#3b82f6` | Focus states |

---

# TYPOGRAPHY

## Font Family
```css
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
```

## Font Sizes
| Element | Size | Weight |
|---------|------|--------|
| H1 (Page Title) | 28px | 700 |
| H2 (Section Title) | 20px | 600 |
| H3 (Card Title) | 16px | 600 |
| Body | 14px | 400 |
| Small | 12px | 400 |
| Caption | 11px | 500 |

---

# LAYOUT STRUCTURE

## Sidebar (Left)
- Width: 240px (expanded) / 64px (collapsed)
- Background: `#111827`
- Logo at top
- Navigation items with icons
- Wallet display at bottom

### Sidebar Menu Items
1. AI Marketplace (Home)
2. Home
3. AI Tools
4. Products
5. Sellers
6. Orders
7. Franchise
8. Trusty Wallet
9. Verification (STL)
10. Analytics
11. Settings

## Top Header
- Height: 64px
- Search bar (centered)
- Wallet balance display (right)
- User avatar (right)

## Main Content
- Padding: 24px
- Max-width: 1400px
- Grid: 12 columns

---

# COMPONENTS

## Cards (Product/Tool)
```
┌─────────────────────────┐
│      Image (16:9)       │
│  [Badge: VIP/Free/etc]  │
├─────────────────────────┤
│  Product Name           │
│  ★★★★☆ (rating)        │
│  $5.99    [Add Button]  │
└─────────────────────────┘
```

- Border radius: 12px
- Background: `#1a2235`
- Hover: slight elevation + border glow

## Buttons

### Primary Button (Green)
```css
background: #10b981;
color: white;
border-radius: 8px;
padding: 8px 16px;
```

### Secondary Button (Blue)
```css
background: #3b82f6;
color: white;
border-radius: 8px;
```

### Ghost Button
```css
background: transparent;
border: 1px solid #3b82f6;
color: #3b82f6;
```

## Badges
| Type | Color |
|------|-------|
| VIP | Purple `#8b5cf6` |
| Verified | Blue `#3b82f6` |
| Free | Green `#10b981` |
| New | Cyan `#06b6d4` |

---

# THEME OPTIONS

## Available Themes

| Theme | Status | Description |
|-------|--------|-------------|
| **Dark Blue** | DEFAULT | Deep blue/slate dark theme |
| Dark Purple | Optional | Purple accent dark theme |
| Light | Optional | Clean light theme |
| High Contrast | Optional | Accessibility theme |

## Theme Selection
- User can select theme from Settings
- Default: Dark Blue (as shown in reference image)
- Preference saved in user profile
- System preference detection (optional)

---

# RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640px - 1024px | 2 columns, collapsed sidebar |
| Desktop | 1024px - 1440px | Full layout |
| Large | > 1440px | Full layout, max-width container |

---

# ICONS

## Icon Library
- Primary: Lucide Icons
- Alternative: Heroicons

## Icon Sizes
| Context | Size |
|---------|------|
| Navigation | 20px |
| Card | 24px |
| Button | 16px |
| Inline | 14px |

---

# ANIMATIONS

## Transitions
```css
transition: all 0.2s ease-in-out;
```

## Hover Effects
- Cards: translateY(-2px) + shadow
- Buttons: brightness(1.1)
- Links: color change

---

# SPECIAL ELEMENTS

## EHB Wallet Display
```
┌─────────────────────┐
│ 🔷 EHB Wallet       │
│    850.0 EHBGC      │
└─────────────────────┘
```
- Always visible in sidebar (bottom)
- Shows current balance
- Click to open wallet details

## Search Bar
- Width: 400px (centered in header)
- Placeholder: "Search apps, games, education, franchises..."
- Icon: Search (left)
- Background: `#1a2235`

## Product Sections
- "Trending AI Verified Products"
- "Top Trusted Free Tools"
- "Essential Marketplace Items"
- "See all" link on right

---

# TAILWIND CSS CONFIG

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ehb-bg': '#0a0e1a',
        'ehb-card': '#111827',
        'ehb-card-hover': '#1a2235',
        'ehb-border': '#1e293b',
        'ehb-primary': '#3b82f6',
        'ehb-success': '#10b981',
        'ehb-accent': '#06b6d4',
        'ehb-vip': '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

*Design System Version: 1.0 | March 2026*
*Default Theme: Dark Blue*
