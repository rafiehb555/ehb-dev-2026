# EHB Themes — Complete Token Tables

## Theme 1: iOS Classic (Light Theme)

### Surface Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#e8edf2` | App background |
| `--wallpaper` | `linear-gradient(175deg, #7a9ab2, #5a7a92, #486878)` | Wallpaper behind cards |
| `--card-face` | `#bdd0e0` | Card main fill |
| `--card-top` | `#cfdde8` | Card top highlight (for 3D depth) |
| `--card-bottom` | `#96afc4` | Card bottom shadow (for 3D depth) |
| `--widget-face` | `#b5c8d8` | Widget/inner panel fill |

### Text Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#18283a` | Headings, important text (DARK on light) |
| `--text-secondary` | `#2a3c50` | Body text |
| `--text-muted` | `#4a5c70` | Labels, meta text |

### Accent Tokens (Gold Series)
| Token | Value | Usage |
|-------|-------|-------|
| `--a1` | `#b8780a` | Dark gold (shadows, depth) |
| `--a2` | `#d89020` | Medium gold (gradients mid) |
| `--a3` | `#f8b830` | Bright gold (primary accent) |
| `--a4` | `#ffe090` | Light gold (highlights, text) |
| `--glow` | `rgba(248,184,48,0.5)` | Glow effects |
| `--shine-top` | `rgba(255,255,255,0.55)` | Top shine on plastic coat |

### Chrome Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--nav1` | `rgba(40,55,78,0.98)` | Nav bar gradient start |
| `--nav2` | `rgba(26,38,58,0.98)` | Nav bar gradient end |
| `--dock` | `rgba(160,185,200,0.7)` | Dock frosted glass |

### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--ok` | `#1a7020` | Success/verified |
| `--wn` | `#7a4a00` | Warning/pending |
| `--fl` | `#7a1010` | Fail/error |
| `--go` | `#7a5200` | Star/gold status |

### Water Drops (Wallpaper Effect)
```css
.water-drop {
  position: absolute;
  border-radius: 45% 55% 60% 40% / 50% 40% 60% 50%;
  background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), transparent 65%);
  border: 0.5px solid rgba(255,255,255,0.25);
  z-index: 2; /* above wallpaper, below content */
}
```
Place 6–8 drops with varying sizes (12–40px) at random positions across the wallpaper.

---

## Theme 2: Diamond (Dark Theme)

### Surface Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#04060e` | App background (deep space black) |
| `--wallpaper` | `linear-gradient(175deg, #030510, #060a1a, #040710)` | Wallpaper |
| `--card-face` | `#081420` | Card main fill |
| `--card-top` | `#0e2030` | Card top highlight |
| `--card-bottom` | `#040e18` | Card bottom shadow |
| `--widget-face` | `#060e1c` | Widget/inner panel fill |

### Text Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#d8f4ff` | Headings, important text (LIGHT on dark) |
| `--text-secondary` | `#a0d8f0` | Body text |
| `--text-muted` | `#5898b8` | Labels, meta text |

### Accent Tokens (Blue Series)
| Token | Value | Usage |
|-------|-------|-------|
| `--a1` | `#0080c8` | Dark blue (shadows, depth) |
| `--a2` | `#00a8e8` | Medium blue (gradients mid) |
| `--a3` | `#30d0ff` | Bright blue (primary accent) |
| `--a4` | `#b0f0ff` | Light blue (highlights, text) |
| `--glow` | `rgba(48,208,255,0.6)` | Glow effects |
| `--shine-top` | `rgba(120,220,255,0.5)` | Top shine on plastic coat |

### Chrome Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--nav1` | `rgba(2,6,24,0.99)` | Nav bar gradient start |
| `--nav2` | `rgba(1,3,16,0.99)` | Nav bar gradient end |
| `--dock` | `rgba(2,10,28,0.85)` | Dock frosted glass |

### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--ok` | `#00b050` | Success/verified |
| `--wn` | `#c89000` | Warning/pending |
| `--fl` | `#e04040` | Fail/error |
| `--go` | `#00c0e8` | Star/info status |

---

## Theme Switcher Implementation

```css
/* CSS Variable root setup */
:root, [data-theme="ios-classic"] {
  --bg: #e8edf2;
  --card-face: #bdd0e0;
  --card-top: #cfdde8;
  --card-bottom: #96afc4;
  --widget-face: #b5c8d8;
  --text-primary: #18283a;
  --text-secondary: #2a3c50;
  --text-muted: #4a5c70;
  --a1: #b8780a;
  --a2: #d89020;
  --a3: #f8b830;
  --a4: #ffe090;
  --glow: rgba(248,184,48,0.5);
  --shine-top: rgba(255,255,255,0.55);
  --nav1: rgba(40,55,78,0.98);
  --nav2: rgba(26,38,58,0.98);
  --dock: rgba(160,185,200,0.7);
}

[data-theme="diamond"] {
  --bg: #04060e;
  --card-face: #081420;
  --card-top: #0e2030;
  --card-bottom: #040e18;
  --widget-face: #060e1c;
  --text-primary: #d8f4ff;
  --text-secondary: #a0d8f0;
  --text-muted: #5898b8;
  --a1: #0080c8;
  --a2: #00a8e8;
  --a3: #30d0ff;
  --a4: #b0f0ff;
  --glow: rgba(48,208,255,0.6);
  --shine-top: rgba(120,220,255,0.5);
  --nav1: rgba(2,6,24,0.99);
  --nav2: rgba(1,3,16,0.99);
  --dock: rgba(2,10,28,0.85);
}

/* Theme transition */
* { transition: background-color 0.5s, color 0.5s, border-color 0.5s, box-shadow 0.5s; }
```

### Theme Switcher Bar
Place at the very top of the page:
```html
<div class="theme-switcher">
  <button onclick="setTheme('ios-classic')" class="active">iOS Classic</button>
  <button onclick="setTheme('diamond')">Diamond</button>
</div>
```

---

## Relationship to Existing Themes

| Theme | Where Used | Source |
|-------|-----------|--------|
| iOS Classic (this skill) | GoSellr marketplace, user-facing pages | User's design spec |
| Diamond (this skill) | GoSellr marketplace, user-facing pages | User's design spec |
| Dark Glassmorphism | DMO admin, internal dashboards | `EHB-UIUX-SYSTEM.md` §2 |
| Silver 3D Chrome | Founder pages, control center | `EHB-UIUX-SYSTEM.md` §6 |

All themes coexist. The iOS Classic + Diamond pair is the PRIMARY user-facing theme system.

---

*EHB Technologies — Theme Reference v1.0*
