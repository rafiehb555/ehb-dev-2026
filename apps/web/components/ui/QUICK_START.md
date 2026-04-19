# UI Components — Quick Start Cheat Sheet

## Import All at Once

```tsx
import {
  GlassCard,
  StatCard,
  StatusChip,
  STLBadge,
  RiskBadge,
  DataTable,
  DrawerPanel,
  ProgressBar,
  MetricRing,
  EmptyState,
  SkeletonLoader,
} from '@/components/ui';
```

---

## Component Quick Reference

### 1. **GlassCard** — Base container
```tsx
<GlassCard hoverable nested onClick={handler} href="/path">
  Content here
</GlassCard>
```

### 2. **StatCard** — Key metrics display
```tsx
<StatCard
  icon="📊"
  label="Users"
  value={12459}
  trend={{ direction: 'up', percentage: 24 }}
  onClick={() => {}}
/>
```

### 3. **StatusChip** — Small status badge
```tsx
<StatusChip label="Active" variant="success" size="md" />
// variants: success | warning | danger | info | neutral
// sizes: sm | md
```

### 4. **STLBadge** — Service Trust Level (L0–L10)
```tsx
<STLBadge level={7} showLabel size="lg" />
// Colors + glow effect for L7+
```

### 5. **RiskBadge** — Risk level indicator
```tsx
<RiskBadge level="HIGH" />
// Levels: LOW | MEDIUM | HIGH | CRITICAL (pulsing)
```

### 6. **DataTable** — Sortable table
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', render: (val) => <span>{val}</span> },
  ]}
  data={items}
  onRowClick={(row) => {}}
  loading={isLoading}
  emptyMessage="No items"
/>
```

### 7. **DrawerPanel** — Slide-in panel
```tsx
<DrawerPanel
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Details"
  width="lg"
>
  Panel content here
</DrawerPanel>
// widths: md | lg | xl
```

### 8. **ProgressBar** — Animated progress
```tsx
<ProgressBar value={65} label="Memory Usage" size="md" />
// Auto-colors: green (0–33%) → amber (34–66%) → red (67–100%)
```

### 9. **MetricRing** — Circular progress
```tsx
<MetricRing
  value={75}
  label="Completion"
  color="#38C878"
  size={200}
/>
```

### 10. **EmptyState** — No data placeholder
```tsx
<EmptyState
  icon="📭"
  title="No Data"
  description="Start by creating your first item"
  ctaLabel="Create"
  onCtaClick={() => {}}
/>
```

### 11. **SkeletonLoader** — Loading skeleton
```tsx
<SkeletonLoader variant="card" count={3} />
// variants: card | row | stat | table
```

---

## Design Tokens (Hardcoded in Components)

### Colors

| Token | Value | Use |
|-------|-------|-----|
| BG Page | `#0C0E1A` | Page background |
| BG Card | `#13162A` | Card background |
| BG Nested | `#1A1D33` | Nested/secondary card |
| Purple | `#7B6EF6` | Primary action, badges |
| Light Purple | `#A098F8` | Hover states, secondary |
| Teal | `#2BBFA0` | Accent, high priority |
| Amber | `#F0A030` | Warning, 33–66% progress |
| Red | `#F05858` | Alert, danger, 67–100% progress |
| Green | `#38C878` | Success, 0–33% progress |

### Spacing & Radius

- **Card Radius**: `12px`
- **Button/Input Radius**: `8px`
- **Chip Radius**: `5–6px`

### Motion

- **Default Transition**: `duration-200` (120–240ms)
- **Easing**: `ease-out` (positive feedback)

---

## Type Exports for TypeScript

```tsx
// Status variants
type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type StatusSize = 'sm' | 'md';

// STL levels
type STLLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type STLSize = 'sm' | 'md' | 'lg';

// Risk levels
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Drawer width
type DrawerWidth = 'md' | 'lg' | 'xl';

// Progress size
type ProgressSize = 'sm' | 'md';

// Skeleton variant
type SkeletonVariant = 'card' | 'row' | 'stat' | 'table';
```

---

## Glassmorphism Settings (Applied to All)

```css
backdrop-blur-md            /* Blur effect */
border: 1px solid rgba(255,255,255,0.08)  /* Subtle borders */
border-radius: 12px         /* Card radius */
background: rgba(...)       /* Semi-transparent bg */
```

All components have:
- ✅ Hover lift effect (scale 1.02 + shadow)
- ✅ Smooth transitions (200ms)
- ✅ Responsive design
- ✅ Dark theme (no light mode)
- ✅ TypeScript support
- ✅ `use client` directive (client-side)

---

## Common Patterns

### Loading State

```tsx
{isLoading ? (
  <SkeletonLoader variant="card" count={3} />
) : (
  <div>Content</div>
)}
```

### Empty State with Action

```tsx
{items.length === 0 ? (
  <EmptyState
    icon="📭"
    title="No items"
    ctaLabel="Create first"
    onCtaClick={() => setShowForm(true)}
  />
) : (
  <DataTable {...props} />
)}
```

### Modal Detail Panel

```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);

<DrawerPanel
  open={!!selectedId}
  onClose={() => setSelectedId(null)}
  title={`Details: ${selectedId}`}
  width="lg"
>
  <Detail id={selectedId} />
</DrawerPanel>
```

### Metric Dashboard

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <StatCard icon="👥" label="Users" value={12459} />
  <StatCard icon="📊" label="Revenue" value="$45.2K" />
  <MetricRing value={78} label="Health" color="#38C878" />
  <ProgressBar value={65} label="Target" />
</div>
```

---

## Component Hierarchy

```
GlassCard (base)
├── StatCard (extends GlassCard)
├── DataTable (glass wrapper + table)
├── EmptyState (glass wrapper + content)
└── DrawerPanel (independent, full-screen)

Badges (standalone)
├── StatusChip
├── STLBadge
└── RiskBadge

Progress (standalone)
├── ProgressBar
└── MetricRing

States (standalone)
├── SkeletonLoader
└── EmptyState
```

---

## Performance Tips

- Memoize row render functions in DataTable
- Use `useCallback` for click handlers
- Avoid inline objects in props (use state/constants)
- Skeleton loader uses CSS animations (no JS)
- MetricRing scales via SVG viewBox (no re-render needed)

---

## Responsive Breakpoints (Tailwind)

All components respond to:
- `sm: 640px`
- `md: 768px`
- `lg: 1024px`
- `xl: 1280px`
- `2xl: 1536px`

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard ... />
</div>
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Component not styled | Ensure Tailwind CSS is loaded in `layout.tsx` |
| Drawer backdrop not visible | Check z-index values (40 = backdrop, 50 = panel) |
| Colors look different | Verify `#0C0E1A` background on page |
| Hover effect missing | Add `hoverable={true}` to GlassCard |
| Text not readable | Adjust `text-[rgba(...)]` opacity in nested elements |

---

**All 11 components are production-ready.** Start integrating today!
