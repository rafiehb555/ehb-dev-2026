# EHB UI Components Library

Shared, self-contained React components for the EHB platform with plastic-effect 3D depth, animations, and theme support.

## Components

### 1. PlasticCard

Reusable card with 3-layer plastic coating effect: top gloss, diagonal shimmer sweep, and 3D bottom depth.

**Props:**
- `children: ReactNode` - Card content
- `className?: string` - Additional CSS classes
- `onClick?: () => void` - Click handler
- `variant?: 'default' | 'raised' | 'inset'` - Visual variant

**Example:**
```tsx
import { PlasticCard } from "@/components/ehb-ui";

export function MyComponent() {
  return (
    <PlasticCard variant="raised">
      <h3>Card Title</h3>
      <p>Card content goes here</p>
    </PlasticCard>
  );
}
```

### 2. EHBButton

3D button with 4 variants (gold, blue, green, red), gradient fill, depth shadow, top gloss, and shimmer sweep.

**Props:**
- `children: ReactNode` - Button text
- `variant?: 'gold' | 'blue' | 'green' | 'red'` - Color variant (default: 'gold')
- `onClick?: () => void` - Click handler
- `disabled?: boolean` - Disabled state (default: false)
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `fullWidth?: boolean` - Full width (default: false)
- `className?: string` - Additional CSS classes

**Behaviors:**
- Hover: translateY(-2px)
- Active: translateY(5px) + no shadow

**Example:**
```tsx
import { EHBButton } from "@/components/ehb-ui";

export function MyComponent() {
  return (
    <>
      <EHBButton variant="gold">Primary Action</EHBButton>
      <EHBButton variant="blue" size="lg">Navigation</EHBButton>
      <EHBButton variant="green" disabled>Success (Disabled)</EHBButton>
      <EHBButton variant="red" fullWidth>Danger Action</EHBButton>
    </>
  );
}
```

### 3. STLBadge

STL level badge with level-specific colors (L1-L10), gold glowing ring for current level, and lock icon for locked levels.

**Props:**
- `level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10` - STL level
- `current?: boolean` - Highlight as current (default: false)
- `locked?: boolean` - Show lock icon (default: false)
- `size?: 'sm' | 'md' | 'lg'` - Badge size (default: 'md')
- `className?: string` - Additional CSS classes

**Level Colors:**
- L1: Gray #b0b8c4→#8898a8
- L2: Steel #9aacbe→#7a8ea0
- L3: Green #50a050→#287828
- L4: Blue #2898c8→#1068a0
- L5: Indigo #4848c8→#282898
- L6: Purple #8838c8→#581898
- L7: Pink #c84898→#901868
- L8: Gold #c89010→#906000
- L9: Orange #a04800→#682800
- L10: Royal #581898→#300870

**Example:**
```tsx
import { STLBadge } from "@/components/ehb-ui";

export function MyComponent() {
  return (
    <>
      <STLBadge level={1} />
      <STLBadge level={8} current locked />
      <STLBadge level={10} size="lg" current />
    </>
  );
}
```

### 4. ThemeSwitcher

iOS Classic / Diamond theme toggle with CSS variable injection and localStorage persistence.

**Props:**
- `className?: string` - Additional CSS classes

**Themes:**
- **iOS Classic:** Light (#e8edf2 bg, gold #f0a030 accents)
- **Diamond:** Dark (#04060e bg, blue #2898c8 accents)

**Example:**
```tsx
import { ThemeSwitcher } from "@/components/ehb-ui";

export function Header() {
  return (
    <div>
      <h1>My App</h1>
      <ThemeSwitcher />
    </div>
  );
}
```

### 5. LivePill

Green pulsing dot indicator with "LIVE" text. Useful for showing live status, active sessions, or real-time updates.

**Props:**
- `className?: string` - Additional CSS classes

**Example:**
```tsx
import { LivePill } from "@/components/ehb-ui";

export function StreamStatus() {
  return (
    <div>
      <h2>Stream</h2>
      <LivePill />
    </div>
  );
}
```

### 6. TrustChainCard

Shows STL trust chain for products with Product, Seller, Company, and Owner STLs. Highlights the weakest link and calculates final STL as minimum.

**Props:**
- `productSTL: number` - Product STL level
- `sellerSTL: number` - Seller STL level
- `companySTL: number` - Company STL level
- `ownerSTL: number` - Owner STL level
- `className?: string` - Additional CSS classes
- `children?: ReactNode` - Additional content

**Logic:**
- Final STL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)
- Weakest link is highlighted in red
- Warning shown if weakest link < 5

**Example:**
```tsx
import { TrustChainCard } from "@/components/ehb-ui";

export function ProductTrust() {
  return (
    <TrustChainCard
      productSTL={8}
      sellerSTL={6}
      companySTL={7}
      ownerSTL={9}
    >
      <p>This product has trustworthy certification.</p>
    </TrustChainCard>
  );
}
```

## CSS Variables & Theme System

All components respect the global CSS variable theme system defined in `ehb-theme.css`:

```css
--ehb-theme-bg              /* Background */
--ehb-theme-surface         /* Card surface */
--ehb-theme-primary         /* Primary color */
--ehb-theme-accent          /* Accent color */
--ehb-theme-text            /* Text color */
--ehb-theme-text-secondary  /* Secondary text */
--ehb-theme-border          /* Border color */
--ehb-theme-card-shadow     /* Card shadow */
```

Themes automatically switch based on `prefers-color-scheme` or class override:
- `.theme-ios-classic` - Light theme
- `.theme-diamond` - Dark theme

## Animations

### ehb-sweep
Diagonal shimmer sweep (4.5s) — plastic gloss effect across cards and buttons.

### ehb-ring-pulse
Glowing ring pulse (2s) — highlights current STL level.

### live-blink
Pulsing blink (1.2s) — for LivePill component.

All animations support `prefers-reduced-motion`.

## Usage in App

1. Import components from `@/components/ehb-ui`:
```tsx
import {
  PlasticCard,
  EHBButton,
  STLBadge,
  ThemeSwitcher,
  LivePill,
  TrustChainCard,
} from "@/components/ehb-ui";
```

2. Components use "use client" directive — safe for Next.js App Router.

3. All components are self-contained with inline styles (CSS-in-JS via React.CSSProperties).

4. Theme CSS is auto-loaded via component imports.

## Design Principles

- **Plastic Effect:** 3-layer coating (gloss top, shimmer sweep, depth shadow)
- **3D Depth:** Real shadows and translateY effects for interactive feedback
- **Accessibility:** Respects `prefers-reduced-motion` and `prefers-color-scheme`
- **Self-Contained:** No external dependencies beyond React
- **TypeScript:** Full type safety with interfaces for all props

## Browser Support

All components require:
- Modern browsers with CSS Grid, Flexbox, Gradients
- CSS custom properties (variables)
- CSS animations
- ES2020+ JavaScript

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
