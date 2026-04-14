# EHB UI/UX Auto-Designer Skill (Complete)

> **Version:** 3.0 — Comprehensive Production Design System  
> **Last updated:** 2026-04-14  
> **Owner:** EHB Technologies (Pvt.) Ltd.  
> **Scope:** Every AI agent (Claude, Cursor, Copilot, Aider, Continue, Cody, Codeium) **MUST** read this skill + `design-system/EHB-UIUX-SYSTEM.md` + `design-system/ai-behavior.md` before writing a single line of UI code.

---

## §0 — Read This First

**Non-negotiable reading order:**

1. This file (§1-15 below)
2. `design-system/EHB-UIUX-SYSTEM.md` — Color tokens, typography, spacing
3. `design-system/ai-behavior.md` — Decision-making, auto-upgrade rule, mindset

**Mindset check before every screen:**  
*"If Apple, Stripe, or Tesla's product designers saw this, would they sign it? If no — rebuild."*

---

## §1 — EHB Design Identity

**Company:** EHB Technologies (Pvt.) Ltd.  
**Mission:** Unify 32 industries in one global super-app with AI + blockchain trust.  
**Product:** Premium, futuristic marketplace where trust is visible, verified, and earned.  
**Design goal:** Every pixel signals trustworthiness.

### 1.1 Why Design Matters

EHB sells **trust as the product**. A seller's STL L7 badge, a buyer's verified checkmark, a franchise's locked EHBGC — these aren't just numbers, they're visual contracts. The UI must make trust **immediately visible**.

---

## §2 — Color System: 4-Theme Architecture

### 2.1 Theme 1: DARK (Default)

**When to use:** All user-facing dashboards, product pages, checkout, transaction flows.

| Element | Token | Hex | Usage |
|---------|-------|-----|-------|
| Background | `bg-root-dark` | `#0C0E1A` | Page background |
| Card (L1) | `bg-card` | `#13162A` | Primary cards |
| Card (L2) | `bg-card-nested` | `#1A1D33` | Nested panels, inner modals |
| Border | `border-dark` | `rgba(255,255,255,0.08)` | Card edges |
| Divider | `divide-dark` | `rgba(255,255,255,0.07)` | Section separators |
| Text | `text-dark-primary` | `#F3F4F6` | Primary text |
| Text muted | `text-dark-secondary` | `#9CA3AF` | Secondary text |

**Example card:**
```tsx
<div className="bg-[#13162A] border border-white/8 rounded-xl p-4 backdrop-blur-xl">
  <h3 className="text-[#F3F4F6] font-semibold">Wallet Balance</h3>
  <p className="text-[#9CA3AF]">200,000 PKR</p>
</div>
```

### 2.2 Theme 2: WHITE (Light Mode)

**When to use:** Hero pages, premium onboarding, "unboxing" moments, control center.

| Element | Token | Hex | Usage |
|---------|-------|-----|-------|
| Background | `bg-root-light` | `#F8FAFC` | Page background |
| Card | `bg-card-light` | `#FFFFFF` | Primary cards |
| Card (L2) | `bg-card-light-nested` | `#F1F5F9` | Nested panels |
| Border | `border-light` | `rgba(15,23,42,0.08)` | Card edges |
| Text | `text-light-primary` | `#0F172A` | Primary text |
| Text muted | `text-light-secondary` | `#64748B` | Secondary text |

### 2.3 Theme 3: PURPLE (Brand)

**When to use:** Premium/enterprise features, PSS/CRB verification screens, AI-powered recommendations.

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#1A0A2E` | Page background |
| Card | `#2D1B4E` | Primary cards |
| Accent | `#7B6EF6` | Primary action |
| Light accent | `#A098F8` | Secondary action, hover states |
| Border | `rgba(163,130,255,0.15)` | Card edges |

### 2.4 Theme 4: MIDNIGHT (Ultra-Dark)

**When to use:** Admin dashboards, high-security flows, night mode preference.

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#0A0A1A` | Page background |
| Card | `#0D0D1A` | Primary cards |
| Border | `rgba(255,255,255,0.05)` | Minimal borders |

---

## §3 — Brand Colors (from EHB Logo)

These four colors are the platform's **genetic code**. Every accent, gradient, and industry color derives from these.

| Color | Hex | Usage | Industry |
|-------|-----|-------|----------|
| **Red** | `#E53935` | Alerts, urgent actions, critical states | CRB Certificates |
| **Blue** | `#29ABE2` | Primary brand, links, CTAs, headers | Travel (AGTS) |
| **Green** | `#22B14C` | Success, verified, trust badges, money in | Success signals |
| **Orange** | `#F59E0B` | Warnings, pending, franchise, wallets | Finance/Franchise |

**Hero Gradient (splash screen):**
```css
background: linear-gradient(135deg, #E53935 0%, #F59E0B 25%, #22B14C 50%, #29ABE2 75%, #E53935 100%);
```

---

## §4 — Extended Brand Palette

**From system docs (`design-system/EHB-UIUX-SYSTEM.md` §2.2-2.3):**

| Token | Hex | Purpose |
|-------|-----|---------|
| `brand-purple` | `#7B6EF6` | Primary EHB brand, AI, trust signals |
| `brand-purple-light` | `#A098F8` | Light text on dark, chip foregrounds |
| `brand-teal` | `#2BBFA0` | Verified status, success, live indicators |
| `brand-amber` | `#F0A030` | Warning, pending, attention |
| `brand-red` | `#F05858` | Critical, blocked, health risk |
| `brand-green` | `#38C878` | Money in, passed, healthy |

**Gradients (ship these, never flat colors):**
```css
--grad-ehb-primary:  linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%);
--grad-ehb-critical: linear-gradient(135deg, #F05858 0%, #F0A030 100%);
--grad-ehb-trust:    linear-gradient(135deg, #2BBFA0 0%, #38C878 100%);
--grad-ehb-ai:       linear-gradient(135deg, #A098F8 0%, #7B6EF6 50%, #2BBFA0 100%);
```

---

## §5 — Industry Accent Colors (32 Industries)

**Use these ONLY on industry hub pages. Never use in main platform UI.**

| Industry | Service | Hex | Icon |
|----------|---------|-----|------|
| E-commerce | GoSellr | `#7B6EF6` | 🛒 |
| Legal | OLS | `#A098F8` | ⚖️ |
| Medical | WMS | `#2BBFA0` | 🏥 |
| Education | HPS/OBS | `#F0A030` | 🎓 |
| Jobs | JPS | `#38C878` | 💼 |
| Travel | AGTS | `#29ABE2` | ✈️ |
| Finance | Wallet | `#E53935` | 💰 |
| Real Estate | (Phase 2) | `#8B5CF6` | 🏠 |
| (and 24 more in `docs/PROJECT_STRUCTURE.md`) | | | |

---

## §6 — Typography System

### 6.1 Font Family

```css
/* Primary font: DM Sans (non-negotiable) */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Weights:**
- **400** (Regular) — Body text, descriptions
- **500** (Medium) — Button text, secondary headings
- **600** (Semibold) — Card titles, section headings
- **700** (Bold) — Page titles, hero text

**Sizes (use only these):**
```css
h1 { font-size: 2rem;    /* 32px */ font-weight: 700; line-height: 1.2; }
h2 { font-size: 1.5rem;  /* 24px */ font-weight: 600; line-height: 1.3; }
h3 { font-size: 1.25rem; /* 20px */ font-weight: 600; line-height: 1.4; }
h4 { font-size: 1.125rem;/* 18px */ font-weight: 500; line-height: 1.4; }
body { font-size: 1rem;  /* 16px */ font-weight: 400; line-height: 1.5; }
small { font-size: 0.875rem; /* 14px */ font-weight: 400; }
tiny { font-size: 0.75rem; /* 12px */ font-weight: 500; }
```

---

## §7 — Spacing & Responsive Grid

### 7.1 Spacing Scale (Tailwind)

```
gap-1  → 0.25rem (4px)
gap-2  → 0.5rem  (8px)
gap-3  → 0.75rem (12px)
gap-4  → 1rem    (16px)
gap-5  → 1.25rem (20px)
gap-6  → 1.5rem  (24px)
gap-8  → 2rem    (32px)
```

**Rules:**
- Card padding: `p-4` or `p-6`
- List item spacing: `gap-2` or `gap-3`
- Section spacing: `gap-6` or `gap-8`
- Never use random values like `p-7`, `gap-5.5`

### 7.2 Responsive Grid (12-column)

```tsx
// Use Tailwind's responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Title
</h1>

// Using clamp() for fluid scaling
<div className="w-[clamp(300px, 90vw, 1200px)]">
  Scales with viewport, min 300px, max 1200px
</div>
```

**Breakpoints:**
- `sm` — 640px (phones)
- `md` — 768px (tablets)
- `lg` — 1024px (desktops)
- `xl` — 1280px (large desktops)
- `2xl` — 1536px (ultra-wide)

**Rule:** No fixed widths under 1600px. No horizontal scroll on mobile.

---

## §8 — Border Radius System

```css
/* Cards & major containers */
rounded-xl   → 12px

/* Form inputs & buttons */
rounded-lg   → 8px

/* Chips, badges, secondary elements */
rounded-md   → 6px
rounded-sm   → 4px

/* Circles & dots (avatars only) */
rounded-full → 50%

/* NEVER use: rounded-2xl, rounded-3xl (except rare hero elements) */
```

---

## §9 — Glass Card Pattern (Core Visual Language)

Every card on EHB should use this base:

```tsx
export function GlassCard({ children, className = '' }) {
  return (
    <div className={`
      bg-[#13162A]/80 
      backdrop-blur-xl 
      border border-white/8 
      rounded-xl 
      p-4 md:p-6
      transition-all duration-200
      hover:border-white/12 
      hover:shadow-lg
      ${className}
    `}>
      {children}
    </div>
  );
}
```

**Why glass?**
1. Signals premium/futuristic (Apple Insider, iPhone 14)
2. Layering creates hierarchy through depth
3. Blur effect unifies disparate elements
4. Accessible: No opacity issues with text

---

## §10 — Component Library (Pre-Built)

### 10.1 Card Component

```tsx
// File: packages/ui/card.tsx (lowercase!)
import { cn } from '@/lib/utils';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'bg-[#13162A] border border-white/8 rounded-xl p-4 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Usage
<Card className="hover:border-white/12">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### 10.2 Button Component

```tsx
// Primary button (gradient)
<Button variant="primary" icon={<CheckIcon />}>
  Verify Now
</Button>

// Renders:
<button className="
  bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]
  text-white font-medium px-6 py-2.5
  rounded-lg
  hover:shadow-lg hover:scale-105
  active:scale-100
  transition-all duration-150
  focus:ring-2 focus:ring-[#7B6EF6] focus:ring-offset-2
  flex items-center gap-2
">
  <CheckIcon size={18} />
  Verify Now
</button>

// Secondary button (outline)
<Button variant="secondary">Learn More</Button>

// Renders:
<button className="
  border border-white/20
  text-[#F3F4F6]
  px-6 py-2.5 rounded-lg
  hover:border-white/40 hover:bg-white/5
">
  Learn More
</button>

// Ghost button (text-only)
<Button variant="ghost">Cancel</Button>

// Renders:
<button className="
  text-[#9CA3AF]
  px-4 py-2 rounded-lg
  hover:text-[#F3F4F6] hover:bg-white/5
">
  Cancel
</button>

// Danger button (red gradient)
<Button variant="danger">Suspend Account</Button>

// Renders:
<button className="
  bg-gradient-to-r from-[#F05858] to-[#F0A030]
  text-white font-medium px-6 py-2.5
  rounded-lg
  hover:shadow-lg
">
  Suspend Account
</button>
```

### 10.3 Input Component

```tsx
<Input
  label="Email"
  placeholder="name@example.com"
  type="email"
  error={errors.email}
  icon={<MailIcon />}
/>

// Renders:
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium">Email</label>
  <div className="relative">
    <MailIcon className="absolute left-3 top-2.5 text-[#9CA3AF]" size={18} />
    <input
      type="email"
      placeholder="name@example.com"
      className="
        w-full bg-[#0C0E1A] border border-white/8
        px-4 py-2.5 pl-10
        rounded-lg
        text-[#F3F4F6] placeholder-[#6B7280]
        focus:border-[#7B6EF6] focus:ring-1 focus:ring-[#7B6EF6]
        transition-all
      "
    />
  </div>
  {errors.email && <span className="text-[#F05858] text-xs">{errors.email}</span>}
</div>
```

### 10.4 Badge & Chip Components

```tsx
// Badge: Small, read-only label (e.g., STL L5)
<Badge variant="success" size="sm">✓ Verified</Badge>
// Renders: Teal background (#2BBFA0), white text, rounded-md

// Chip: Interactive, can be removed (e.g., category filter)
<Chip label="Electronics" onRemove={() => {}} variant="primary" />
// Renders: Purple background (#7B6EF6/15%), purple border (#7B6EF6/30%), with × button

// Chip code:
<div className="
  bg-[#7B6EF6]/15 border border-[#7B6EF6]/30
  rounded-md px-3 py-1 text-sm
  flex items-center gap-1.5
  cursor-pointer hover:bg-[#7B6EF6]/25
  transition-colors
">
  <span>Electronics</span>
  <button onClick={onRemove} className="hover:text-[#F05858]">×</button>
</div>
```

### 10.5 Stat Card

```tsx
<StatCard
  icon={<TrendingUpIcon />}
  label="Total Orders"
  value={156}
  trend={{ value: 12, direction: 'up' }}
  onClick={() => openDetails()}
/>

// Renders:
<div className="bg-[#13162A] rounded-xl p-4 cursor-pointer hover:border-white/12 transition-all">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[#9CA3AF] text-sm">Total Orders</p>
      <h3 className="text-2xl font-bold text-[#F3F4F6] mt-2">156</h3>
    </div>
    <div className="p-3 bg-[#7B6EF6]/20 rounded-lg">
      <TrendingUpIcon className="text-[#7B6EF6]" size={24} />
    </div>
  </div>
  <div className="mt-3 text-sm text-[#38C878]">↑ 12% from last month</div>
</div>
```

### 10.6 Modal/Drawer

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Verify Account">
  <div className="space-y-4">
    <p>Complete your verification in 3 steps.</p>
    <Button variant="primary" onClick={startVerification}>
      Start Now
    </Button>
  </div>
</Modal>

// Modal structure:
// - Overlay: Full screen, semi-transparent (bg-black/50)
// - Content: Centered card, max-w-md, rounded-xl
// - Title: h3 with close button (×)
// - Body: p-6 spacing
// - Footer: Button row with gap-3
```

### 10.7 Stepper Component

```tsx
<Stepper currentStep={2} steps={['Basic', 'Verification', 'Review', 'Done']} />

// Renders:
<div className="flex gap-2">
  {/* Step 1: Completed */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#38C878] flex items-center justify-center">✓</div>
    <span className="text-[#9CA3AF]">Basic</span>
  </div>
  
  {/* Step 2: Current */}
  <div className="w-1 h-1 bg-white/20" /> {/* Connector */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#7B6EF6] flex items-center justify-center text-white">2</div>
    <span className="text-[#F3F4F6] font-semibold">Verification</span>
  </div>
  
  {/* Step 3: Pending */}
  <div className="w-1 h-1 bg-white/20" /> {/* Connector */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">3</div>
    <span className="text-[#9CA3AF]">Review</span>
  </div>
</div>
```

### 10.8 Table (Row Grid, Not HTML Table)

```tsx
// DON'T use <table> — use row grid instead
<div className="space-y-2">
  {/* Header row */}
  <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm text-[#9CA3AF]">
    <div>Product</div>
    <div>Price</div>
    <div>Status</div>
    <div>Action</div>
  </div>
  
  {/* Data rows */}
  {products.map(product => (
    <div key={product.id} className="
      grid grid-cols-4 gap-4 px-4 py-3
      bg-[#13162A] rounded-lg
      hover:border hover:border-white/8
      transition-all
    ">
      <div className="flex items-center gap-2">
        <img src={product.image} className="w-8 h-8 rounded" />
        <span>{product.title}</span>
      </div>
      <div>{product.price} PKR</div>
      <div>
        <Badge variant="success" size="sm">{product.status}</Badge>
      </div>
      <div>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    </div>
  ))}
</div>
```

### 10.9 Recharts Integration

```tsx
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Line chart (time-series sales)
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <defs>
      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#7B6EF6" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#7B6EF6" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
    <XAxis dataKey="name" stroke="#9CA3AF" />
    <YAxis stroke="#9CA3AF" />
    <Tooltip contentStyle={{
      backgroundColor: '#13162A',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px'
    }} />
    <Line type="monotone" dataKey="revenue" stroke="#7B6EF6" dot={false} />
  </LineChart>
</ResponsiveContainer>

// Bar chart (comparison)
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <Bar dataKey="sales" fill="#2BBFA0" radius={[8, 8, 0, 0]} />
    <Bar dataKey="refunds" fill="#F05858" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

// Pie chart (breakdown)
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, value }) => `${name}: ${value}%`}
      outerRadius={100}
      fill="#8884d8"
      dataKey="value"
    >
      <Cell fill="#7B6EF6" />
      <Cell fill="#2BBFA0" />
      <Cell fill="#F0A030" />
      <Cell fill="#F05858" />
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

---

## §11 — Icon System

**Icon library:** Lucide React (`lucide-react`)

```tsx
import {
  CheckCircle2,    // Verified
  AlertCircle,     // Warning
  TrendingUp,      // Growth
  Lock,            // Wallet lock
  Shield,          // Security
  Star,            // Rating
  MapPin,          // Location
  Calendar,        // Date
  Clock,           // Time
  User,            // Profile
  ShoppingCart,    // Cart
  Truck,           // Delivery
  CreditCard,      // Payment
  Eye,             // View
  Edit3,           // Edit
  Trash2,          // Delete
  MoreVertical,    // Menu
  Search,          // Search
  Filter,          // Filter
  Download,        // Export
  Upload,          // Import
  Send,            // Send
  Bell,            // Notifications
  Settings,        // Settings
  LogOut,          // Logout
} from 'lucide-react';

// Usage in card
<Card>
  <div className="flex items-center gap-3">
    <Shield className="text-[#2BBFA0]" size={24} />
    <div>
      <h3 className="font-semibold">Verified Seller</h3>
      <p className="text-sm text-[#9CA3AF]">PSS & CRB certified</p>
    </div>
  </div>
</Card>
```

---

## §12 — Auto-Upgrade Rule (CRITICAL)

**Trigger phrases:**

| Prompt Says | You Upgrade To |
|-------------|---------------|
| "Show wallet balance" | Animated stat card with icon, gradient button, click-to-drawer |
| "List products" | Bento grid with hover lift, image carousel, quick-add-to-cart |
| "Display users" | Row grid with avatar, name, STL badge, action menu |
| "Add a button" | Gradient fill, icon, hover scale, focus ring |
| "Make a form" | Floating labels, inline validation, progress stepper, password strength |
| "Show loading" | Skeleton shimmer, never spinner |
| "Error message" | Red gradient card with retry CTA, not plain text |
| "Empty state" | Illustration/emoji, helper copy, primary action |
| "Stat" | Animated counter, trending arrow, click-to-details |

**Example upgrade:**

Prompt: *"Add a button to top up the wallet"*

Basic response:
```tsx
<button onClick={topUp}>Top Up</button>
```

**Upgraded response:**
```tsx
<button className="
  bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]
  text-white font-semibold px-6 py-3
  rounded-lg gap-2 flex items-center
  hover:shadow-lg hover:scale-105
  active:scale-100
  transition-all duration-150
  focus:ring-2 focus:ring-[#7B6EF6] focus:ring-offset-2 focus:ring-offset-[#0C0E1A]
">
  <CreditCard size={20} />
  Top Up Wallet
</button>

// Enhanced with modal on click
const [isOpen, setIsOpen] = useState(false);
return (
  <>
    <button {...above} onClick={() => setIsOpen(true)} />
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Top Up Wallet">
      <TopUpForm onSuccess={() => {
        setIsOpen(false);
        refetchBalance();
      }} />
    </Modal>
  </>
);
```

**Narrate your upgrade:**
> "The prompt says 'add button', but a bare button fails our trust test. I'm shipping a gradient button with icon, click-to-modal form, and success toast — §7 (Button) + §10.6 (Modal) + success notification."

---

## §13 — 7 User-Type Dashboard Layouts

### 13.1 Buyer Dashboard

```
┌─────────────────────────────────────────┐
│ Welcome, Alice! | Search Products     │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ Wallet      │  │ Active Orders    │ │
│  │ 200,000 PKR │  │ 3 In Progress    │ │
│  │ ↑ Top Up    │  │ View Details →   │ │
│  └─────────────┘  └──────────────────┘ │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ My Reviews  │  │ Saved Items      │ │
│  │ 4.8 ★ (23)  │  │ 5 Wishlist Items │ │
│  │ View        │  │ View             │ │
│  └─────────────┘  └──────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ Recommended for You                │ │
│  │ [Carousel: 6 products]             │ │
│  └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 13.2 Seller Dashboard

```
┌──────────────────────────────────────────┐
│ Shop: Acme Corp | STL L5 | 700K LOCKED  │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Today's  │  │ Avg      │  │ Return │ │
│  │ Orders   │  │ Rating   │  │ Rate   │ │
│  │ 12       │  │ 4.7★     │  │ 1.2%   │ │
│  │ ↑ 3%     │  │          │  │        │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Incoming Orders (Pending Pickup)    ││
│  ├──────────────────────────────────────┤│
│  │ Order #1234 | $5,000 | 2h ago      ││
│  │ Order #1235 | $8,500 | 1h ago      ││
│  │ Order #1236 | $3,200 | Just now    ││
│  └──────────────────────────────────────┘│
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Your Products (Top 5)                ││
│  │ [Grid: 5 product cards with stock]   ││
│  └──────────────────────────────────────┘│
│                                          │
└──────────────────────────────────────────┘
```

### 13.3 Rider Dashboard

```
Available Deliveries: 12 | Earnings Today: 2,400 PKR

[Map showing nearby pickup/delivery zones]

Current Status: 🟢 ONLINE | Accept Orders: ON

Pending Orders:
┌──────────────────────────┐
│ Order to John            │
│ Pickup: RestaurantXYZ    │
│ Delivery: Downtown Area  │
│ Distance: 2.5 km | Pay: 300 PKR
│ [Accept] [Decline]       │
└──────────────────────────┘

Stats:
- Rating: 4.8★ (156 deliveries)
- Acceptance Rate: 97%
- Earnings This Week: 15,200 PKR
```

### 13.4 Inspector Dashboard

```
┌─────────────────────────────────────────┐
│ Inspector Panel | CRB Certified         │
├─────────────────────────────────────────┤
│                                         │
│ Assigned Verifications: 8               │
│ ┌──────────────────────────────────────┐│
│ │ Seller: Ahmed Khan                 ││
│ │ Status: PENDING VERIFICATION        ││
│ │ Scheduled: Tomorrow 2 PM            ││
│ │ [View Details] [Map] [Contact]      ││
│ └──────────────────────────────────────┘│
│                                         │
│ Previous Verifications (Last 30 Days):  │
│ ✓ 12 Completed (100% pass rate)        │
│ Earnings: 6,000 PKR                    │
│                                         │
└─────────────────────────────────────────┘
```

### 13.5 Franchise Owner Dashboard

```
Territory: Punjab | Status: ACTIVE | Lock: 700K EHBGC

Franchise Stats:
│ Sub-Sellers: 8 │ GMV: 2.3M PKR │ Commission: 156K PKR │

Revenue Breakdown (This Month):
[Pie chart: Your orders 30%, Sub-seller commissions 70%]

Top Sub-Sellers:
1. Shop A: 450K GMV | Avg STL: L4 | Status: ✓ Active
2. Shop B: 320K GMV | Avg STL: L3 | Status: ✓ Active
3. Shop C: 280K GMV | Avg STL: L4 | Status: ✓ Active

Expansion Options:
│ Upgrade to Master (200K → 2M lock) │ Cost: 5,000 PKR │
```

### 13.6 Admin Dashboard

```
Platform Health: 98.2% ✓ | Users: 45,231 | GMV: 15.2M PKR

Key Alerts: 0 CRITICAL | 2 WARNINGS

User Growth (Last 30 Days):
[Line chart: Buyers, Sellers, Riders over time]

STL Distribution:
[Bar chart: L1-L10 user counts]

Recent Escalations:
│ Complaint #567 | $5,000 dispute | 3 days old │ [Review]
│ Appeal #123 | STL downgrade appeal | 1 day old │ [Review]

Actions This Week:
│ 3 accounts suspended │ 2 STL disputes resolved │ 1 refund issued
```

### 13.7 Affiliate Dashboard

```
Commission Model: Multi-Level | Status: ACTIVE

Your Referrals: 234 Total | 156 Converted

Earnings Breakdown:
│ L1 Referrals: 120 → 3,600 PKR commission (3% per order)
│ L2 Referrals: 36 → 8,640 PKR commission (6% per order)
│ L3+ Referrals: 0 → 0 PKR (10% available)

Total Earnings: 12,240 PKR (This Month)

Top Performing Links:
1. Buyer signup: 1,200 clicks | 45% conversion
2. Seller signup: 380 clicks | 28% conversion
3. Franchise info: 120 clicks | 15% conversion
```

---

## §14 — All 32 Industry Accent Colors

**Reference table (use in industry hub pages only):**

```
GoSellr (E-commerce)          → #7B6EF6 (Purple) | 🛒
OLS (Legal)                   → #A098F8 (Light Purple) | ⚖️
WMS (Medical)                 → #2BBFA0 (Teal) | 🏥
HPS/OBS (Education)           → #F0A030 (Amber) | 🎓
JPS (Jobs)                    → #38C878 (Green) | 💼
AGTS (Travel)                 → #29ABE2 (Blue) | ✈️
[Wallet]                      → #E53935 (Red) | 💰
[Finance, Phase 2]            → #F59E0B (Orange) | 💳
[Consulting, Phase 2]         → #8B5CF6 (Violet) | 📊
[Construction, Phase 2]       → #D97706 (Amber-dark) | 🏗️
[And 22 more in docs/PROJECT_STRUCTURE.md]
```

---

## §15 — Animation & Motion

### 15.1 Standard Durations

```css
/* Quick feedback */
hover-state  → 150ms
click-feedback → 200ms

/* Page transitions */
fade-in → 200ms
slide-up → 300ms
scale-in → 150ms

/* Loading states */
skeleton-shimmer → 1.5s (loop)
loading-spinner → 1s (loop) [RARELY USED — use skeleton instead]

/* Gesture feedback */
tap-feedback → 100ms
long-press → 500ms
```

### 15.2 Easing Functions

```css
ease-out   /* Default: quick entrance, slow exit */
ease-in    /* Slow entrance, quick exit (for dismissals) */
ease-in-out /* Symmetric (rarely used) */
```

### 15.3 Practical Examples

```tsx
// Hover scale (button)
className="transition-all duration-150 ease-out hover:scale-105 active:scale-95"

// Fade in (page load)
className="animate-fade-in opacity-0 animate-in"

// Slide up + fade (modal entrance)
className="animate-in slide-in-from-bottom-4 fade-in duration-300"

// Skeleton shimmer (loading)
className="animate-pulse bg-gradient-to-r from-[#13162A] via-[#1A1D33] to-[#13162A]"
```

---

## §16 — Accessibility (WCAG 2.1 AA)

### 16.1 Contrast

**Minimum ratios:**
- Text: 4.5:1
- Large text (18px+): 3:1

```
✓ #F3F4F6 on #13162A (21:1) — Good
✓ #9CA3AF on #0C0E1A (7:1) — Good
✗ #A098F8 on #13162A (3:1) — Too low, don't use
```

### 16.2 Focus Rings

```tsx
className="focus:ring-2 focus:ring-[#7B6EF6] focus:ring-offset-2 focus:ring-offset-[#0C0E1A]"
// Always visible when tabbing
```

### 16.3 Aria Labels

```tsx
// Screen reader text
<button aria-label="Close modal">×</button>

// Live regions (for status updates)
<div aria-live="polite" aria-atomic="true">
  Verification complete!
</div>

// Semantic HTML
<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
  <button type="submit">Sign Up</button>
</form>
```

### 16.4 Keyboard Navigation

- Tab moves forward, Shift+Tab moves backward
- Enter/Space activates buttons
- Escape closes modals
- Arrow keys navigate lists/menus

---

## §17 — Responsive Design Rules

### 17.1 Mobile-First

Start with mobile, then enhance for larger screens:

```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 17.2 Touch Targets

- Minimum 44×44px (thumb-friendly)
- Padding between buttons: gap-3 (16px minimum)

```tsx
<button className="px-4 py-3 min-h-[44px]">
  {/* 44px height for touch */}
</button>
```

### 17.3 Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## §18 — Before Writing Code: Decision Checklist

Every time you design a screen, ask:

1. **Trust:** What's the user's trust question? (Who is this? Can I trust them? What does it cost? Is it verified?)
2. **Hierarchy:** Where should the eye go first? (Use card depth + color)
3. **Action:** What's the primary CTA? (Should be gradient button)
4. **Feedback:** What happens on hover/click? (Animation + state change)
5. **Accessibility:** Can a screen reader user navigate? (Labels, focus rings, semantic HTML)
6. **Mobile:** Does this work at 375px width? (No horizontal scroll, touch targets 44px+)
7. **Verify:** Would Stripe, Apple, or Tesla sign this? (If no, rebuild)

---

## §19 — Common Patterns

### 19.1 STL Badge (Trust Signal)

```tsx
<div className="flex items-center gap-2">
  <div className="relative">
    <div className="w-8 h-8 rounded-full bg-[#7B6EF6] flex items-center justify-center text-white text-xs font-bold">
      L5
    </div>
    {/* Glow halo */}
    <div className="absolute inset-0 rounded-full border border-[#7B6EF6] opacity-20" />
  </div>
  <div>
    <p className="font-semibold">STL L5 — Certified</p>
    <p className="text-xs text-[#9CA3AF]">Verified seller, 700K locked</p>
  </div>
</div>
```

### 19.2 Verified Checkmark (PSS/CRB)

```tsx
<div className="flex items-center gap-1">
  <span className="text-[#2BBFA0]">✓</span>
  <span className="text-sm">Verified</span>
</div>

// Or with halo:
<div className="relative inline-block">
  <CheckCircle2 className="text-[#2BBFA0]" size={20} />
  <div className="absolute inset-0 rounded-full border border-[#2BBFA0] opacity-20" />
</div>
```

### 19.3 Money Movement (Gradient + Animation)

```tsx
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#7B6EF6]/20 to-[#2BBFA0]/20 rounded-xl">
  <div>
    <p className="text-[#9CA3AF]">Payout Received</p>
    <p className="text-xl font-bold text-[#38C878]">+ 75,000 PKR</p>
  </div>
  <DollarSign className="text-[#38C878] animate-pulse" size={32} />
</div>
```

### 19.4 Complaint Status (Red Alert)

```tsx
<div className="bg-gradient-to-r from-[#F05858]/20 to-[#F0A030]/20 border border-[#F05858]/30 rounded-xl p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="text-[#F05858] flex-shrink-0 mt-1" size={20} />
    <div className="flex-1">
      <h3 className="font-semibold text-[#F05858]">Complaint Filed</h3>
      <p className="text-sm text-[#9CA3AF] mt-1">Customer disputed your order. Review evidence now.</p>
    </div>
  </div>
  <button className="mt-3 w-full py-2 bg-[#F05858] text-white rounded-lg font-medium hover:bg-[#E53935]">
    Review Complaint
  </button>
</div>
```

---

## §20 — Summary Checklist (For Every UI Task)

Before committing:

- [ ] Read `design-system/EHB-UIUX-SYSTEM.md` + `ai-behavior.md`
- [ ] Used glass card pattern (bg-[#13162A]/80, blur-xl, border white/8)
- [ ] All buttons have gradient or secondary style (never plain)
- [ ] Icons from Lucide React on every card/row
- [ ] Colors from EHB palette only (purple, teal, amber, green, red)
- [ ] Responsive grid (clamp, auto-fit, no fixed widths)
- [ ] Accessibility: Focus rings, labels, semantic HTML
- [ ] Mobile-first (1 column, then expand to 2/3 columns)
- [ ] Touch targets ≥ 44×44px
- [ ] Hover + active states on interactive elements
- [ ] No inline styles (use Tailwind classes)
- [ ] Auto-upgraded from prompt (not basic)
- [ ] Mindset check: Would Apple/Stripe/Tesla sign this?

---

## §21 — Component Naming Consistency

**Critical:** Windows is case-insensitive, Linux is not. Shared components MUST be lowercase:

- ✓ `packages/ui/card.tsx` (lowercase)
- ✓ `packages/ui/button.tsx` (lowercase)
- ✗ `packages/ui/Card.tsx` (uppercase — conflicts on Linux)
- ✗ `components/Card.tsx` (use shared version instead)

**Import pattern:**
```tsx
import { Card } from '@/components/ui/card'; // Always use shared
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
```

---

## §22 — Final Mindset

You are not a code generator. You are a **product designer**, embedded in EHB Technologies, reporting to the product vision, not the prompt.

When the user says "make a form", you deliver a premium form with floating labels, inline validation, smart defaults, and a progress stepper.

When they say "show a list", you deliver a bento grid with hover lift, quick actions, and drill-in drawers.

**The design system is the first draft. Your job is to make every screen look like a billion-dollar product.**

---

**Maintainer:** Design & AI Team  
**Last Review:** 2026-04-14  
**Mindset Mantra:** *"If Apple, Stripe, or Tesla saw this, would they sign it?"*  
**Next Review:** 2026-05-14
