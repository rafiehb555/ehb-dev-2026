# EHB Module-Specific Design Rules

Each EHB module has unique UI patterns. Follow these rules exactly when building pages for each module.

---

## 1. STL Module (Service Trust Level)

### Key Components
- **4 Department Tracks:** PSS / CRB / DMO / Wallet — each shown as a separate progress track with its own level
- **MIN Rule Box:** Shows all 4 department levels side by side, with an arrow pointing to "Final STL = MIN of all"
- **Shield Badge:** Large shield icon with crown + level number + stars representing achievement

### Layout
```
┌─────────────────────────────────────────┐
│  Shield Badge (center, large)           │
│  ★ YOUR LEVEL: L4 STANDARD             │
├─────────────────────────────────────────┤
│  PSS: ████████░░ L6 HIGH               │
│  CRB: ██████░░░░ L4 STANDARD ← MIN     │
│  DMO: ████████░░ L6 HIGH               │
│  WAL: ███████░░░ L5 ADVANCED            │
├─────────────────────────────────────────┤
│  Final STL = L4 (lowest of all)         │
└─────────────────────────────────────────┘
```

### Rules
- Gold tag "YOUR LEVEL" on the current level card with glowing ring
- Level cards: 3-col (mobile) / 5-col (PC)
- Each level card has its specific gradient color (see SKILL.md §5)
- Progress bars show percentage toward next level
- Star ratings match STL level (L1=1 star, L10=10 stars)

---

## 2. DMO Module (Decentralized Management Office)

### Key Components
- **Live Activity Counter:** Green dot + animated counter showing real-time actions
- **Up-Guard Fraud Radar:** Risk bar 0-100 with color coding (green < 30, amber 30-70, red > 70)
- **Earnings Engine:** Three sections — Validated (green), Pending (amber), Rejected (red)
- **10-Level Cards:** Display all STL levels as cards in grid

### Layout Rules
- 3-col grid on mobile, 5-col on PC for level cards
- Activity feed: real-time scroll with timestamp
- Earnings split visualization: horizontal stacked bar
- Fraud radar: circular gauge with needle

### Specific Patterns
- Every DMO card shows module icon + count badge
- Active complaints get red glow border
- SLA countdown timers on pending items
- Escalation path visualization: linear stepper

---

## 3. PSS Module (Personal Security System)

### Key Components
- **KYC Stepper:** 4 steps — Unverified → Basic → Full → Face Match
- **Trust Score Donut:** Circular chart showing trust percentage (0-100)
- **Complaint Log:** List with severity color coding
- **Face Match Status Card:** Photo comparison with match percentage

### Stepper Design
```
[○ Unverified] ──→ [● Basic] ──→ [◐ Full] ──→ [○ Face Match]
                    ✓ Done         In Progress    Locked
```

- Completed steps: green circle with checkmark
- Active step: pulsing accent color
- Locked steps: gray, no interaction
- Each step expands on click to show requirements

### Rules
- KYC documents shown as card list with status badges
- Trust score donut uses brand gradient fill
- Complaint severity: Low (amber), Medium (orange), High (red), Critical (dark red with pulse)
- Face match card shows uploaded photo vs verified photo side by side

---

## 4. CRB Module (Central Record Blockchain)

### Key Components
- **Exam Cards:** Card per exam with countdown timer, category, and pass/fail state
- **Skill Upload Card:** Multimedia proof upload (photo, video, document) with status
- **Refill Countdown:** Days remaining until re-verification needed
- **Certificate Badge:** Pass = green gradient, Fail = red, Pending = amber

### Exam Card Design
```
┌──────────────────────────┐
│ 📝 Web Development       │
│ Category: Technology      │
│ ⏱ 45:00 remaining        │
│ Score: --/100             │
│ [Start Exam] (gold btn)  │
└──────────────────────────┘
```

### Rules
- Countdown timer animates in real-time
- Certificate has blockchain hash displayed (truncated with copy button)
- Refill countdown: green > 30 days, amber 7-30 days, red < 7 days
- Upload card shows progress bar during upload
- Expired certificates get red "EXPIRED" overlay badge

---

## 5. Wallet Module

### Key Components
- **EHBGC Donut:** Locked (gold fill) vs Free (muted fill) balance visualization
- **Lock Duration Picker:** Tab selector — 1yr / 2yr / 3yr with APY display
- **Blockchain Timeline:** 3-phase horizontal — BSC → Mosaic → Polkadot
- **STL Requirement Bar:** Shows how much EHBGC lock is needed per STL level

### Donut Chart
- Inner circle shows total balance
- Outer ring: gold section = locked, muted section = free
- Click segment to expand details
- Animation: ring fills from 0 on page load

### Lock Duration Tabs
```
[1 Year: 8% APY] [2 Year: 12% APY] [3 Year: 18% APY]
```
- Active tab: accent gradient background
- Show estimated earnings below

### Rules
- Transaction history: chronological list with type icons (send/receive/lock/unlock)
- Conversion calculator: EHBGC ↔ USD real-time
- Minimum withdrawal warning (1,000 PKR)
- Anti-dump limits displayed: 5% daily, 20% weekly

---

## 6. GoSellr Module (Marketplace)

### Product Card
```
┌──────────────────────────┐
│ [Product Image]           │
│ STL: L6 (top-left badge)  │
│ AI ✨ (top-right if AI)   │
├──────────────────────────┤
│ Product Name               │
│ ★★★★☆ 4.3 (128 reviews)  │
│ ~~$34.99~~ $24.99          │
│ [Add to Cart] (gold btn)   │
└──────────────────────────┘
```

### Rules
- STL badge ALWAYS visible on product cards (using level-specific color)
- AI-recommended tag: sparkle icon, accent gradient badge
- Price: strikethrough old price in muted, current price in accent bold
- Star ratings: filled stars in gold, empty in muted
- Store strip: horizontal scroll of seller cards

### Order Tracking (5-Step Animated)
```
[Placed] ──→ [Paid] ──→ [Packed] ──→ [On Way] ──→ [Done]
   ✓           ✓          ●           ○            ○
```
- Completed: green circle with check
- Active: pulsing accent circle
- Pending: gray outline circle
- Animated connector line fills green as progress moves

### STL MIN Rule Card
Show in product listing:
```
🛡 Trust Chain:
Product  L7 PRO
Seller   L6 HIGH
Company  L4 STANDARD ← weakest
Final    L4 STANDARD
```

---

## 7. Franchise Module

### Key Components
- **4-Level Selector:** Online / City / State / Country — tab bar or card selector
- **Area Revenue Zones:** Map-style visualization with revenue per zone
- **Verification Badge:** L8 = green check, L9 = blue check, L10 = gold check + "F"

### Level Selector
```
[Online $100-$1500] [City $5K-$20K] [State $20K-$50K] [Country $50K-$200K]
```
- Each tab shows franchise type with price range
- Active tab: accent gradient
- Show requirements and benefits below selected type

### Rules
- Franchise hierarchy tree: indented levels with connecting lines
- Revenue dashboard: monthly/quarterly earnings chart
- Sub-franchise count per territory
- Dual pricing shown: USD entry price + EHBGC hold requirement

---

## 8. Blockchain Module

### Key Components
- **3-Phase Timeline:** Horizontal progression — BSC → Mosaic → Polkadot
- **Transaction Explorer:** Card per transaction (hash, amount, timestamp, status)
- **Phase Status:** Active (green glow) / Upcoming (amber) / Future (gray)

### Timeline Design
```
[BSC ✓ Active] ────→ [Mosaic ◐ Upcoming] ────→ [Polkadot ○ Future]
```

- Active phase: full color, green glow ring
- Upcoming: semi-transparent, amber accent
- Future: gray, locked appearance
- Connector line: gradient from current phase color to gray

### Transaction Card
```
┌──────────────────────────┐
│ 🔗 TX: 0xabc1...4412     │
│ Amount: 150 EHBGC         │
│ Time: 2026-04-19 14:22    │
│ Status: ✓ Confirmed       │
│ [View on Explorer]         │
└──────────────────────────┘
```

---

## 9. Affiliate Module

### Key Components
- **Downline Tree:** 3 levels deep visual tree
- **Commission Calculator:** Interactive card with inputs and real-time calculation
- **Direct vs Level Bonus Split:** Side-by-side comparison
- **Referral Link Card:** Copy-to-clipboard with share buttons

### Downline Tree
```
       [You]
      /     \
   [L1]     [L1]     ← 5% each
   / \       |
 [L2] [L2]  [L2]     ← 3% each
  |
 [L3]                 ← 2% each
```

- Your node: gold glow, largest
- L1 nodes: accent color, medium
- L2 nodes: lighter accent, smaller
- L3 nodes: muted, smallest
- Connecting lines: gradient from parent to child color

### Referral Link Card
```
┌──────────────────────────────────────┐
│ 🔗 Your Referral Link                │
│ https://ehb.com/ref/ABC123           │
│ [Copy] [Share WhatsApp] [Share Email] │
│ Total Referrals: 47 | Active: 32     │
└──────────────────────────────────────┘
```

---

## 10. EHB Tube (Video Platform)

### Key Components
- **Video Grid:** 2-col layout on mobile, 3-4 col on PC
- **Creator Badge:** Circular avatar with STL level ring
- **View/Watch Stats:** View count + watch time displayed
- **STL Visibility Indicator:** Higher STL = more visibility

### Video Card
```
┌──────────────────────────┐
│ [Video Thumbnail]         │
│ ▶ 12:34                   │
├──────────────────────────┤
│ Video Title Here           │
│ [Creator Avatar] Name L6   │
│ 12.4K views • 2 days ago  │
└──────────────────────────┘
```

---

## 11. Industry Verticals (All 32)

### Standard Patterns for ALL Industries
Every industry page MUST include:

1. **Professional Card:**
```
┌──────────────────────────┐
│ [Photo]  Name Here        │
│          ★★★★☆ 4.5        │
│          STL: L6 HIGH     │
│          [Book Now] (gold) │
└──────────────────────────┘
```

2. **Service/Booking Card:** With time slot picker
3. **Industry-Specific STL Requirement:** Minimum STL level shown
4. **Category Filter Tabs:** Horizontal scrollable tabs

### Industry Accent Colors
| Industry | Accent | Icon |
|----------|--------|------|
| E-commerce (GoSellr) | `#7B6EF6` | Shopping cart |
| Legal (OLS) | `#A098F8` | Scales |
| Medical (WMS) | `#2BBFA0` | Hospital |
| Education (HPS/OBS) | `#F0A030` | Graduation cap |
| Jobs (JPS) | `#38C878` | Briefcase |
| Travel (AGTS) | `#F05858` | Airplane |
| Finance | `#F0A030` | Dollar |
| Consulting | `#7B6EF6` | Lightbulb |
| Construction | `#F05858` | Hard hat |
| Agriculture | `#38C878` | Leaf |
| Automotive | `#2BBFA0` | Car |
| Hospitality | `#A098F8` | Hotel |

### Adding a New Industry
1. Pick an accent color (can reuse from palette above or create new)
2. Create industry entry in `ehb-info/departments/Industries.md`
3. Build 3 standard pages: Landing, Listing, Detail
4. All 3 pages follow the standard patterns above
5. Add STL minimum requirement for the industry
6. Update this file with the new industry's specific rules
7. Run `node scripts/sync-agent-context.mjs`

---

## 12. Commission Display Patterns

### 85/10/5 Split Visualization
Used in seller dashboards, admin panels:
```
┌──────────────────────────────────────────────┐
│ Revenue Split: $100 Order                      │
│ ████████████████████████████████████░░░░░░░░░ │
│ Seller 85%     │ Franchise 10% │ Platform 5%   │
│ $85.00         │ $10.00        │ $5.00          │
└──────────────────────────────────────────────┘
```

- Seller section: green gradient
- Franchise section: amber gradient
- Platform section: purple gradient
- Animated fill from left to right on page load

### Franchise Sub-Distribution
```
Franchise Network (10%):
├── Sub Franchise:    5%  ████████████████
├── Master Franchise: 2%  ██████
├── Corporate:        1.5% █████
├── Country:          1%   ███
└── HQ Extra:         0.5% ██
```

---

## Design Rules Summary

| Rule | Applies To |
|------|-----------|
| Plastic coating on ALL cards | Every module |
| STL badge on user/product cards | GoSellr, Industry, Franchise |
| 3D buttons for all CTAs | Every module |
| Both themes supported | Every module |
| Trust chain display | GoSellr product pages |
| Level-specific colors | STL, all level displays |
| Animated progress bars | STL, CRB exams, Wallet locks |
| Real-time counters | DMO, Wallet, Blockchain |
| Responsive grid layouts | Every module |

---

*EHB Technologies — Module Rules Reference v1.0*
