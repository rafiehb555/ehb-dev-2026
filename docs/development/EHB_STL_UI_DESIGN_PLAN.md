# EHB-STL — Complete UI Design Plan
> DMO Dashboard + STL Level Page + Icons + GoSellr Cards + Page Locations
> Version: 1.0 | April 2026 | Status: PLANNING

---

## QUESTION 1: DMO DASHBOARD — KYA DATA AATA HAI?

### DMO Main Dashboard (`/app/dmo/page.tsx`):

```
┌─────────────────────────────────────────────────────────────────┐
│  🏢 EHB DMO — CONTROL CENTER                     [April 2026]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 TODAY AT A GLANCE                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ 👥 Users │ │ 🛒 Orders│ │ 🚨 Alerts│ │ 🔐 STL   │         │
│  │  +342    │ │  1,204   │ │    7     │ │ Avg: 63  │         │
│  │ new today│ │ processed│ │ critical │ │ platform │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │📋 Pending│ │🔎 CRB    │ │⚖️Complt  │ │💰 Revenue│         │
│  │ PSS: 18  │ │ Queue:12 │ │ Open: 23 │ │ 2.4M EHBGC│        │
│  │ Review   │ │ Inspect  │ │          │ │ today    │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🚨 CRITICAL ALERTS (4)                         [View All →]  │
│                                                                 │
│  🔴 Inspector fraud signal — Sub Franchise #XYZ, Lahore       │
│  🔴 AML flag — UserID #1234 — PKR 500,000 transfer            │
│  🟠 Complaint Tier 4 escalation — Order #9876                 │
│  🟠 STL override request — UserID #5566                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📦 QUICK PANELS                                               │
│                                                                 │
│  [PSS Queue →]  [CRB Approvals →]  [STL Controls →]           │
│  [Complaints →] [Franchise Map →]  [Wallet/AML →]             │
│  [JPS Panel →]  [GoSellr Panel →]  [Reports →]                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📈 STL DISTRIBUTION (Live Graph)                              │
│                                                                 │
│  L5 Elite   ████░░░░░░░░░░░░░░░░ 8%                           │
│  L4 High    ████████░░░░░░░░░░░░ 22%                          │
│  L3 Trusted █████████████░░░░░░░ 35%                          │
│  L2 Basic   ████████░░░░░░░░░░░░ 25%                          │
│  L1 Low     ████░░░░░░░░░░░░░░░░ 10%                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### DMO STL Sub-Panel (`/app/dmo/stl/page.tsx`) — Already Built, Needs These Additions:

**Currently Has:**
- STL Ranking Table (entityId, entityType, score, level, lastUpdated)
- STL History Log (changes)
- Manual Calculator tool (trigger recalc for USER/SERVICE/PRODUCT)

**Missing (To Add):**
- Override tool (enter userId + new score + reason)
- STL Freeze/Unfreeze buttons
- Appeal queue panel
- Bulk recalculate button
- STL level distribution graph
- Top 10 / Bottom 10 users by STL
- Anomaly alerts (sudden drops > 20 points)

---

## QUESTION 2: EHB-STL-LEVEL PAGE — KYA DATA AATA HAI?

### User-Facing STL Page (`/app/stl/page.tsx` OR `/app/profile/stl/page.tsx`):

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back          YOUR TRUST LEVEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         🔵 L4                                                  │
│     HIGHLY TRUSTED                                             │
│                                                                 │
│         SCORE: 78 / 100                                        │
│     ████████████████░░░░  78%                                  │
│                                                                 │
│     Next Level (L5 Elite): Need 12 more points                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📊 SCORE BREAKDOWN                                            │
│                                                                 │
│  🔐 PSS Verification    ██████████████░░░░░░  28/40           │
│  🏅 CRB Certification   ████████████░░░░░░░░  15/20           │
│  ⭐ Performance          ████████░░░░░░░░░░░░  14/20           │
│  👤 Behavior             ████████████░░░░░░░░  12/20           │
│  🏭 Industries           ██████░░░░░░░░░░░░░░   6/20           │
│  🔄 Refilling            ████░░░░░░░░░░░░░░░░   3/10           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ✅ YOUR CURRENT BENEFITS (L4)                                 │
│                                                                 │
│  ✔ Priority search placement                                   │
│  ✔ Up to £2,000/day withdrawal                                 │
│  ✔ Franchise application eligible                              │
│  ✔ 10% platform commission (reduced)                           │
│  ✔ Verified Badge on profile                                   │
│  ✔ Featured placement eligible                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🎯 HOW TO REACH L5                                            │
│                                                                 │
│  ✔ Complete Business PSS layer (+5 points)                    │
│  ✔ Get CRB Advanced certification (+5 points)                 │
│  ✔ Complete 2 more verified orders (+2 points)                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📜 SCORE HISTORY (Last 90 days)                               │
│                                                                 │
│  Apr 07  Score: 78  ↑ +5  Reason: CRB approved               │
│  Mar 28  Score: 73  ↑ +8  Reason: PSS Layer 3 complete       │
│  Mar 15  Score: 65  ↑ +3  Reason: 10 orders completed        │
│  Feb 20  Score: 62  ↓ -5  Reason: Complaint #XYZ confirmed   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🔔 STL ALERTS                                                 │
│  CRB refilling due in 45 days — Act soon to avoid score drop  │
│                                                                 │
│            [Appeal STL Score]  [Improve Score]                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## QUESTION 3: LEVEL ICONS — KIS TARAN K HON GAY?

### 5 STL Level Icons (Visual Design):

```
L1 — FREE / LOW TRUST
┌─────────────────┐
│  🔴             │
│  ●              │
│  (Red circle)   │
│  Label: FREE    │
│  0 – 39         │
└─────────────────┘
Color: #EF4444 (Red)
Icon: Simple red dot / shield-outline (no fill)
Badge style: Outlined, thin border, red text

L2 — BASIC VERIFIED
┌─────────────────┐
│  🟠             │
│  ◉              │
│ (Orange shield) │
│  Label: BASIC   │
│  40 – 59        │
└─────────────────┘
Color: #F97316 (Orange)
Icon: Shield with single checkmark
Badge style: Orange filled, white text

L3 — TRUSTED
┌─────────────────┐
│  🟡             │
│  ✦              │
│ (Blue shield ✓) │
│ Label: TRUSTED  │
│  60 – 74        │
└─────────────────┘
Color: #3B82F6 (Blue)
Icon: Shield with checkmark + small star
Badge style: Blue filled, white text, slight glow

L4 — HIGHLY TRUSTED
┌─────────────────┐
│  🔵             │
│  ✦✦             │
│(Purple shield ✓✓)│
│ Label: PREMIUM  │
│  75 – 89        │
└─────────────────┘
Color: #8B5CF6 (Purple/Violet)
Icon: Shield with double check + 2 stars
Badge style: Purple gradient, white text, glow

L5 — ELITE / VIP
┌─────────────────┐
│  👑             │
│  ★              │
│(Gold crown+     │
│ emerald shield) │
│  Label: VIP     │
│  90 – 100       │
└─────────────────┘
Color: #F59E0B → #10B981 gradient (Gold → Emerald)
Icon: Crown + diamond shield + stars
Badge style: Gold-to-green gradient, animated glow, "ELITE" text
```

### User Types and Their STL Cards:

#### 6 User Types + What Shows on Their Card:

**1. REGULAR BUYER:**
```
┌───────────────────────────┐
│ [Avatar]  Muhammad Ali    │
│ 📍 Lahore, Pakistan       │
│                           │
│ 🟠 BASIC  Score: 45/100  │
│ ████░░░░░░░░  45%         │
│                           │
│ Member since: Jan 2025    │
│ Orders: 12  Reviews: 8    │
└───────────────────────────┘
```

**2. SELLER:**
```
┌───────────────────────────┐
│ [Shop Logo]  Ali's Store  │
│ 📍 Karachi                │
│ Electronics Seller        │
│                           │
│ 🔵 TRUSTED  Score: 72/100│
│ ██████████░░  72%         │
│                           │
│ ✔ CRB Verified            │
│ Sales: 340  Rating: 4.8⭐ │
│ Response: 98% within 1hr  │
└───────────────────────────┘
```

**3. RIDER:**
```
┌───────────────────────────┐
│ [Avatar]  Hassan Rider    │
│ 📍 Active — Lahore        │
│ Verified Rider            │
│                           │
│ 🔵 TRUSTED  Score: 68/100│
│ ████████░░░░  68%         │
│                           │
│ Deliveries: 1,204         │
│ On-time: 96%  Rating:4.9⭐│
│ ✔ CRB Certified           │
└───────────────────────────┘
```

**4. INSPECTOR:**
```
┌───────────────────────────┐
│ [Badge Icon]  Usman Insp. │
│ 📍 Lahore District        │
│ Senior Inspector (L4)     │
│                           │
│ 🟣 PREMIUM  Score: 81/100│
│ ████████████░  81%        │
│                           │
│ Inspections: 234          │
│ Accuracy: 97.8%           │
│ ✔ CRB VIP Authority       │
└───────────────────────────┘
```

**5. FRANCHISE OPERATOR:**
```
┌───────────────────────────┐
│ [Franchise Logo]          │
│  Ali Sub Franchise        │
│ 📍 Model Town, Lahore     │
│                           │
│ 🟣 PREMIUM  Score: 82/100│
│ ████████████░  82%        │
│                           │
│ Area: Model Town          │
│ Sellers: 45  Riders: 12  │
│ ✔ Franchise Verified      │
└───────────────────────────┘
```

**6. JPS EMPLOYEE / JOB SEEKER:**
```
┌───────────────────────────┐
│ [Avatar]  Sara Ahmed      │
│ 📍 Lahore                 │
│ Senior Developer (L4 JPS) │
│                           │
│ 🟣 PREMIUM  Score: 79/100│
│ ████████████░  79%        │
│                           │
│ Skills: React, Node.js    │
│ ✔ CRB Verified            │
│ Available: Open to offers │
└───────────────────────────┘
```

---

## QUESTION 4 + 5 + 6: GOSELLR — CARDS + STL DESIGN + WEBSITE APPEARANCE

### GoSellr Product Card (on marketplace):

```
┌────────────────────────────┐
│                            │
│   [Product Image]          │
│   (250x200px, rounded)     │
│                            │
├────────────────────────────┤
│ iPhone 15 Pro Max          │
│ 256GB Space Black          │
│                            │
│ ⭐ 4.8  (234 reviews)      │
│                            │
│ EHBGC 2,450  ≈ £1,225     │
│ ~~EHBGC 2,800~~  12% off  │
│                            │
├────────────────────────────┤
│ Sold by: TechMart Store    │
│ 🔵 TRUSTED  72/100        │ ← STL badge
│                            │
│ 📦 Free delivery in 2 days │
│ ✔ CRB Verified Seller      │
│                            │
│  [Add to Cart]  [Buy Now]  │
└────────────────────────────┘
```

### STL Badges on GoSellr Cards (By Seller Level):

| Seller STL | Badge Shown | Extra Indicators |
|------------|-------------|-----------------|
| L1 (0–39) | 🔴 LOW TRUST — Red | Warning: "Unverified seller" |
| L2 (40–59) | 🟠 BASIC — Orange | "Basic Verified" |
| L3 (60–74) | 🔵 TRUSTED — Blue | "✔ CRB Verified" |
| L4 (75–89) | 🟣 PREMIUM — Purple | "✔ Premium Seller" + purple border |
| L5 (90–100) | 👑 VIP ELITE — Gold | "⭐ Elite Seller" + gold glow + homepage featured |

### GoSellr Seller Profile Card (Full Page):

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  [Shop Banner Image]                                 │
│                                                      │
│  [Logo]   TechMart Store              [Follow]       │
│           📍 Karachi, Pakistan                       │
│                                                      │
│  👑 VIP ELITE  Score: 94/100                        │
│  ██████████████████░░  94%                          │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Sales   │ │  Rating  │ │ Response │            │
│  │  1,240   │ │  4.9 ⭐  │ │   99%    │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                      │
│  ✔ CRB Certified (Advanced)                         │
│  ✔ PSS All Layers Complete                          │
│  ✔ EHBGC Trusty Wallet Active                       │
│  ✔ Member since Jan 2024                            │
│                                                      │
│  [View Products]  [Message Seller]  [Report]         │
└──────────────────────────────────────────────────────┘
```

### GoSellr Homepage — Seller Listing Grid:

```
┌──────────────────────────────────────────────────────────────┐
│  🛒 GoSellr Marketplace                                      │
│  Featured: Electronics > Mobiles                            │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │[Image]   │ │[Image]   │ │[Image]   │ │[Image]   │      │
│  │iPhone 15 │ │Samsung S24│ │Pixel 8  │ │OnePlus 12│      │
│  │          │ │          │ │          │ │          │      │
│  │⭐4.9(234)│ │⭐4.7(189)│ │⭐4.8(92) │ │⭐4.6(67) │      │
│  │          │ │          │ │          │ │          │      │
│  │2,450 EHBGC│2,200 EHBGC│1,800 EHBGC│1,600 EHBGC│      │
│  │≈£1,225   │ │≈£1,100   │ │≈£900    │ │≈£800     │      │
│  │          │ │          │ │          │ │          │      │
│  │👑VIP 94  │ │🟣PREM 82 │ │🔵TRUST72│ │🟠BASIC 52│      │
│  │TechMart  │ │MobileHub │ │GadgetCo │ │QuickShop │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────────────────────┘
```

**Important GoSellr Rules:**
- L1 sellers → Products shown with "⚠️ Unverified" warning badge
- L5 sellers → Products shown with gold border + "Featured" ribbon
- Search results default sorted by: STL level (high first) → rating → sales
- Buyer can filter: "Show only Verified sellers" (L3+)

---

## QUESTION 7: STL LEVEL PAGE — KAHAN CREATE HOGA?

### File Location:

```
EHB landing-2026/
├── app/
│   ├── stl/                          ← NEW FOLDER
│   │   ├── page.tsx                  ← Main STL Level Page (user-facing)
│   │   └── appeal/
│   │       └── page.tsx              ← Appeal form page
│   │
│   ├── dmo/
│   │   └── stl/
│   │       └── page.tsx              ← Already exists (DMO admin view)
│   │
│   └── profile/
│       └── [userId]/
│           └── page.tsx              ← Shows mini STL card on public profile
│
├── components/
│   ├── stl/
│   │   ├── StlWidget.tsx             ← Already exists (reusable mini widget)
│   │   ├── StlLevelBadge.tsx         ← NEW: level badge component (L1-L5)
│   │   ├── StlScoreBreakdown.tsx     ← NEW: breakdown bar chart
│   │   ├── StlHistoryTimeline.tsx    ← NEW: history of changes
│   │   ├── StlBenefitsList.tsx       ← NEW: what you can do at this level
│   │   ├── StlImproveGuide.tsx       ← NEW: how to reach next level
│   │   └── StlGoSellrCard.tsx        ← NEW: seller/product card STL badge
│   │
│   └── gosellr/
│       ├── ProductCard.tsx           ← NEW: product card with STL badge
│       └── SellerCard.tsx            ← NEW: seller card with STL badge
```

### URL Routes:

| URL | Page | Who Sees It |
|-----|------|------------|
| `/stl` | My STL Level page | Logged in user |
| `/stl/appeal` | STL Appeal form | Logged in user |
| `/stl/leaderboard` | Public STL rankings | Everyone |
| `/dmo/stl` | DMO STL Control panel | DMO staff only |
| `/profile/[userId]` | Public profile (STL mini card) | Everyone |
| `/gosellr` | Marketplace (STL on product cards) | Everyone |
| `/gosellr/seller/[id]` | Seller profile page (full STL) | Everyone |

---

## SUMMARY TABLE — ALL ANSWERS

| Question | Answer |
|----------|--------|
| DMO dashboard data | Stats cards + critical alerts + quick panel links + STL distribution graph + module panels |
| STL Level page data | Score display + breakdown bars + benefits + how to improve + history + alerts |
| Level icons | L1=Red dot, L2=Orange shield, L3=Blue shield+✓, L4=Purple shield+✓✓, L5=Gold crown+emerald |
| User types | 6 types: Buyer, Seller, Rider, Inspector, Franchise, JPS Employee |
| STL on user cards | Score + level badge + verification status + role-specific KPIs |
| GoSellr card STL | Seller STL badge under price + "CRB Verified" if L3+ |
| GoSellr card design | Image → Name → Stars+reviews → Price → Seller STL badge → Delivery → Buttons |
| STL Level page location | `/app/stl/page.tsx` + new components in `/components/stl/` |

---

*STL UI Design Plan v1.0 | April 2026 | Planning Phase*
