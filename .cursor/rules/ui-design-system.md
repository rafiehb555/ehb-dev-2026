# EHB UI/UX Quick Reference

> **Canonical UI/UX source of truth:** `design-system/EHB-UIUX-SYSTEM.md` (+ `design-system/ai-behavior.md`). If anything here conflicts, the design-system files win. Cursor always loads `ehb-uiux-system-mandatory.mdc`.

> Default Theme: Dark Blue

## Theme Reference
- Default UI: `assets/ui-default-theme-dark.png`
- Design Docs: `docs/ui-ux/design-system.md`

## Color Palette (Dark Blue Theme - DEFAULT)

### Backgrounds
```
Primary:    #0a0e1a   (main bg)
Secondary:  #111827   (sidebar, cards)
Tertiary:   #1a2235   (elevated)
Hover:      #1e293b   (hover states)
```

### Accents
```
Primary:    #3b82f6   (blue - buttons, links)
Success:    #10b981   (green - add buttons)
Accent:     #06b6d4   (cyan - highlights)
VIP:        #8b5cf6   (purple - premium)
```

### Text
```
Primary:    #ffffff   (headings)
Secondary:  #94a3b8   (body)
Muted:      #64748b   (hints)
```

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│  [Logo]     [Search Bar]        [Wallet] [User] │ ← Header
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Main Content                 │
│  240px   │                                      │
│          │                                      │
│ [Wallet] │                                      │
└──────────┴──────────────────────────────────────┘
```

## Theme Options
| Theme | Status |
|-------|--------|
| **Dark Blue** | DEFAULT (auto-selected) |
| Dark Purple | User selectable |
| Light | User selectable |
| High Contrast | User selectable |

## Key Components
- Cards: rounded-xl, bg-ehb-card
- Buttons: rounded-lg, green for "Add"
- Badges: VIP (purple), Free (green), Verified (blue)

## Tailwind Classes
```
bg-ehb-bg        → #0a0e1a
bg-ehb-card      → #111827
text-ehb-primary → #3b82f6
btn-success      → #10b981
```

---

*User can change theme in Settings, but Dark Blue is default*
