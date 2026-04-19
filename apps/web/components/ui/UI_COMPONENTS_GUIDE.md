# EHB UI Primitives — Foundation Layer

**Phase 1: Foundation Layer Complete**

All 11 shared UI primitive components have been created for the DMO (Decentralized Management Office) dashboard and platform-wide use. These components enforce the EHB design system (dark glassmorphism, premium motion, proper theming) consistently across the application.

---

## 1. **glass-card.tsx**

Base card component with glass effect, gradient border, and hover lift.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `className` | `string` | `''` | Additional Tailwind classes |
| `hoverable` | `boolean` | `true` | Enable hover lift/scale effect |
| `nested` | `boolean` | `false` | Use nested card color (#1A1D33 instead of #13162A) |
| `onClick` | `() => void` | optional | Click handler |
| `href` | `string` | optional | Link destination (wraps in Next.js Link) |

### Usage

```tsx
import { GlassCard } from '@/components/ui';

<GlassCard hoverable onClick={() => console.log('clicked')}>
  <p>Card content here</p>
</GlassCard>

<GlassCard nested href="/details">
  <p>Nested card that links</p>
</GlassCard>
```

### Design Tokens Applied

- Background: `#13162A` (card) or `#1A1D33` (nested)
- Border: `1px solid rgba(255,255,255,0.08)` or `0.07` (nested)
- Radius: `12px`
- Hover: scale 1.02 + shadow
- Transition: 200ms

---

## 2. **stat-card.tsx**

Specialized card for displaying key metrics with icon, value, trend, and sublabel.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | optional | Emoji or icon component (glow effect applied) |
| `label` | `string` | required | Stat label (uppercase, muted) |
| `value` | `string \| number` | required | Large mono display value |
| `subLabel` | `string` | optional | Supporting text below value |
| `trend` | `{ direction, percentage }` | optional | Trend indicator (up/down/neutral) |
| `onClick` | `() => void` | optional | Drill-in handler |
| `className` | `string` | `''` | Additional classes |

### Trend Object

```ts
{
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}
```

### Usage

```tsx
import { StatCard } from '@/components/ui';

<StatCard
  icon="📊"
  label="Total Users"
  value="12,459"
  subLabel="Verified in last 30 days"
  trend={{ direction: 'up', percentage: 24 }}
  onClick={() => navigate('/users')}
/>
```

### Design Tokens Applied

- Icon glow: `drop-shadow-[0_0_8px_rgba(123,110,246,0.3)]`
- Value: `text-4xl font-mono font-bold`
- Trend colors: green (#38C878) / red (#F05858) / gray

---

## 3. **status-chip.tsx**

Small, colored status indicator with dot and label.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Status text |
| `variant` | `StatusVariant` | required | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` |
| `size` | `StatusSize` | `'md'` | `'sm' \| 'md'` |
| `className` | `string` | `''` | Additional classes |

### Variants & Colors

| Variant | Color | Background |
|---------|-------|------------|
| `success` | #38C878 (green) | `rgba(56,200,120,0.1)` |
| `warning` | #F0A030 (amber) | `rgba(240,160,48,0.1)` |
| `danger` | #F05858 (red) | `rgba(240,88,88,0.1)` |
| `info` | #7B6EF6 (purple) | `rgba(123,110,246,0.1)` |
| `neutral` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.05)` |

### Usage

```tsx
import { StatusChip } from '@/components/ui';

<StatusChip label="Active" variant="success" size="md" />
<StatusChip label="Pending" variant="warning" size="sm" />
<StatusChip label="Blocked" variant="danger" />
```

---

## 4. **stl-badge.tsx**

EHB Service Trust Level (STL) badge showing level (L0–L10) with named tier and color gradient.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `STLLevel` | required | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10` |
| `showLabel` | `boolean` | `true` | Show tier name (FREE, BASIC, etc.) |
| `size` | `STLSize` | `'md'` | `'sm' \| 'md' \| 'lg'` |
| `className` | `string` | `''` | Additional classes |

### STL Levels & Labels

| Level | Label | Color | Glow |
|-------|-------|-------|------|
| L0 | UNVERIFIED | Gray | — |
| L1 | FREE | Blue | — |
| L2 | BASIC | Teal | — |
| L3 | NORMAL | Purple | — |
| L4 | STANDARD | Light Purple | — |
| L5 | ADVANCED | Amber | — |
| L6 | HIGH | Teal | — |
| L7+ | PRO/VIP/ELITE/SUPREME | Green/Red/Gold/Yellow | ✓ (glow) |

### Usage

```tsx
import { STLBadge } from '@/components/ui';

<STLBadge level={7} showLabel size="lg" />
<STLBadge level={3} showLabel={false} size="sm" />
```

---

## 5. **risk-badge.tsx**

Risk level indicator (LOW, MEDIUM, HIGH, CRITICAL) with optional pulsing animation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `RiskLevel` | required | `'LOW' \| 'MEDIUM' \| 'HIGH' \| 'CRITICAL'` |
| `className` | `string` | `''` | Additional classes |

### Risk Colors

| Level | Color | Pulse |
|-------|-------|-------|
| LOW | #38C878 (green) | No |
| MEDIUM | #F0A030 (amber) | No |
| HIGH | #F05858 (red) | No |
| CRITICAL | #FF6B6B (bright red) | Yes |

### Usage

```tsx
import { RiskBadge } from '@/components/ui';

<RiskBadge level="LOW" />
<RiskBadge level="CRITICAL" />
```

---

## 6. **data-table.tsx**

Reusable dark-themed data table with sortable columns, glass styling, and loading states.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | required | Column definitions |
| `data` | `T[]` | required | Data array |
| `onRowClick` | `(row: T) => void` | optional | Row click handler |
| `loading` | `boolean` | `false` | Show skeleton loader |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `keyExtractor` | `(row, idx) => string \| number` | optional | Row key function |

### Column Interface

```ts
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value, row) => ReactNode;
}
```

### Usage

```tsx
import { DataTable } from '@/components/ui';

interface User {
  id: string;
  name: string;
  status: string;
}

<DataTable<User>
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', render: (val) => <StatusChip label={val} variant="info" /> },
  ]}
  data={users}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
  loading={isLoading}
  emptyMessage="No users found"
/>
```

### Features

- Sortable columns with up/down indicators
- Hover row highlight
- Skeleton loader when `loading={true}`
- Custom cell rendering via `render` prop
- Sticky header (glass background)
- Responsive horizontal scroll

---

## 7. **drawer-panel.tsx**

Slide-in detail panel from the right side with glass background and close button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Panel visibility |
| `onClose` | `() => void` | required | Close handler |
| `title` | `string` | optional | Panel header text |
| `children` | `ReactNode` | required | Panel content |
| `width` | `DrawerWidth` | `'lg'` | `'md' \| 'lg' \| 'xl'` (w-96, w-480px, w-640px) |

### Usage

```tsx
import { DrawerPanel } from '@/components/ui';

const [open, setOpen] = useState(false);

<>
  <button onClick={() => setOpen(true)}>Open Panel</button>
  <DrawerPanel open={open} onClose={() => setOpen(false)} title="Details" width="lg">
    <p>Detailed content here...</p>
  </DrawerPanel>
</>
```

### Features

- Backdrop overlay with blur
- Smooth slide transition (300ms)
- Auto-manages body overflow
- Close button (X) in header
- Scrollable content area

---

## 8. **progress-bar.tsx**

Animated progress bar with gradient fill (green → amber → red based on value).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Progress percentage (0–100, auto-clamped) |
| `label` | `string` | optional | Display label above bar |
| `size` | `ProgressSize` | `'md'` | `'sm' \| 'md'` |
| `className` | `string` | `''` | Additional classes |

### Color Thresholds

- **0–33%**: Green (#38C878)
- **34–66%**: Green → Amber gradient
- **67–100%**: Amber → Red gradient

### Usage

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar value={65} label="Memory Usage" size="md" />
<ProgressBar value={92} size="sm" />
```

---

## 9. **metric-ring.tsx**

Circular progress ring with SVG animation, center value display, and label.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Progress percentage (0–100) |
| `label` | `string` | optional | Display below ring |
| `color` | `string` | `'#7B6EF6'` | Ring color (any CSS color) |
| `size` | `number` | `200` | SVG size in pixels |
| `className` | `string` | `''` | Additional classes |

### Usage

```tsx
import { MetricRing } from '@/components/ui';

<MetricRing value={75} label="Completion Rate" color="#38C878" size={200} />
<MetricRing value={45} color="#F0A030" />
```

### Features

- SVG-based (crisp scaling)
- Animated fill transition (600ms)
- Glow effect behind ring
- Center percentage display
- Responsive sizing

---

## 10. **empty-state.tsx**

Empty state placeholder with icon, title, description, and optional CTA button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | optional | Large emoji/icon (60px) |
| `title` | `string` | required | Heading text |
| `description` | `string` | optional | Subtitle/supporting text |
| `ctaLabel` | `string` | optional | Button text (requires `onCtaClick`) |
| `onCtaClick` | `() => void` | optional | Button click handler |
| `className` | `string` | `''` | Additional classes |

### Usage

```tsx
import { EmptyState } from '@/components/ui';

<EmptyState
  icon="📭"
  title="No Data"
  description="Start by creating your first item"
  ctaLabel="Create Now"
  onCtaClick={() => setShowForm(true)}
/>
```

---

## 11. **skeleton-loader.tsx**

Shimmer skeleton placeholder for loading states. Four variants: card, row, stat, table.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `SkeletonVariant` | `'card'` | `'card' \| 'row' \| 'stat' \| 'table'` |
| `count` | `number` | `1` | Number of skeletons to render |
| `className` | `string` | `''` | Additional classes |

### Variants

- **`card`**: Full card with title and content lines
- **`row`**: Icon + two text lines (list item)
- **`stat`**: Icon + stat value + sublabel
- **`table`**: Header + 3 data rows with columns

### Usage

```tsx
import { SkeletonLoader } from '@/components/ui';

{isLoading ? (
  <SkeletonLoader variant="card" count={3} />
) : (
  <div>{/* actual content */}</div>
)}

<SkeletonLoader variant="stat" />
<SkeletonLoader variant="table" count={1} />
```

---

## Design System Compliance

All 11 components strictly follow the EHB design system:

### Colors (EHB Tokens)

- **Background**: `#0C0E1A` (page) / `#13162A` (card) / `#1A1D33` (nested)
- **Primary Purple**: `#7B6EF6` / Light: `#A098F8`
- **Secondary Teal**: `#2BBFA0`
- **Accent Amber**: `#F0A030`
- **Alert Red**: `#F05858`
- **Success Green**: `#38C878`

### Typography

- **Font**: DM Sans
- **Scales**: xs (10px) → sm (12px) → base (14px) → lg (16px) → xl (20px) → 4xl (36px)
- **Font Stack**: `DM Sans, system-ui, -apple-system, sans-serif`

### Spacing & Radius

- **Card Radius**: `12px`
- **Input/Button Radius**: `8px`
- **Chip Radius**: `5–6px`
- **Padding**: 4px grid (p-2, p-4, p-6, p-8)

### Motion

- **Transitions**: `120–240ms` (all interactive elements)
- **Easing**: `ease-out` for positive feedback, `ease-in-out` for continuous
- **Transform**: `scale`, `translate`, `opacity` (GPU-accelerated)

### Effects

- **Glassmorphism**: `backdrop-blur-md`
- **Shadows**: `drop-shadow` for glows, `shadow-lg` for depth
- **Borders**: `1px solid rgba(255,255,255,0.08)` (cards), `0.04` (dividers)

---

## Import Patterns

### Option 1: Barrel Export (Recommended)

```tsx
import { GlassCard, StatCard, StatusChip, STLBadge } from '@/components/ui';
```

### Option 2: Individual Imports

```tsx
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
```

---

## TypeScript Export Types

All components export their prop interfaces:

```tsx
import { GlassCardProps, StatCardProps, StatusChipProps } from '@/components/ui';
```

---

## Accessibility

- All interactive elements have proper `aria-label` where needed
- Keyboard navigation: focusable elements (buttons, links)
- Color contrast: WCAG AA compliant
- Semantic HTML: `<button>`, `<table>`, `<a>` used appropriately
- Drawer: manages `body.overflow` and focus

---

## Performance Notes

- All components use `React.forwardRef` for flexibility
- No inline function props (use `useCallback` in parent)
- Minimal re-renders via proper TypeScript typing
- SVG components (MetricRing) render efficiently at any size
- Skeleton loader uses CSS `animate-pulse` (no JS animation)

---

## Next Steps for Integration

1. **Replace legacy components** in existing pages with these new primitives
2. **Update imports** from old `@/components/ui/card.tsx` to new `@/components/ui`
3. **Extend variants** as needed (new status types, risk levels, STL tiers)
4. **Document patterns** in `design-system/EHB-UIUX-SYSTEM.md` (auto-update rule)
5. **Test responsive** behavior on mobile (all components Tailwind-responsive)

---

**Status**: ✅ Foundation Layer Complete  
**Created**: 2026-04-19  
**All 11 Components**: Production-ready with full TypeScript support
