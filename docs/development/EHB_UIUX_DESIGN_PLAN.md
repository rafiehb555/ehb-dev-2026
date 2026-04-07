# EHB Technologies Limited — UI/UX DESIGN PLAN
> Ultra Level Design System — Non-Technical, First Impression Magic
> Version: 1.0 | April 2026 | Status: **Implementation in progress** (see § Implementation status below)

---

## DESIGN PHILOSOPHY

```
First Impression Rule:
  "Koi bhi user — chahe tech ho ya na ho —
   website dekhe aur pehle 5 second mein samjhe:
   YEH KYA HAI, MAIN YAHAN KYA KAR SAKTA HOON,
   AUR MAIN KAHAN JAOON"

3 Second Test:
  ✓ User ko instantly pata chale: EHB kya hai
  ✓ User ko instantly dikhein: main options
  ✓ User instantly click kar sake: bina sochay
```

---

## PART 1: COLOR SYSTEM (OFFICIAL — EHB MAIN LOGO SE EXTRACTED)

> ⚠️ UPDATED: Previous colors replaced with EXACT logo colors.
> Full detail: `EHB_COLOR_SCHEME_PLAN.md`

### Primary Brand Palette (5 Logo Colors):

```
┌──────────────────────────────────────────────────────────────┐
│  EHB OFFICIAL BRAND COLORS — LOGO SE EXTRACTED             │
│                                                              │
│  ████  Education Red   #CC2200  → Left circle "EDUCATION"   │
│  ████  Health Blue     #29ABE2  → Center band "HEALTH"       │
│  ████  Business Green  #22B14C  → Right circle "BUSINESS"   │
│  ████  Energy Orange   #F7941D  → Orange infinity arc        │
│  ████  Power Black     #231F20  → Arrow + "EHB" logo text    │
│                                                              │
│  ── EXTENDED (Platform) ──────────────────────────────────  │
│  ████  Platform Purple #7C3AED  → Premium / STL L4          │
│  ████  VIP Gold        #F59E0B  → Elite / STL L5 / HO       │
│  ████  Tech Teal       #06B6D4  → AI features               │
│                                                              │
│  ── BACKGROUNDS (Dark Theme) ─────────────────────────────  │
│  ████  App Root        #080A10  → Deepest background        │
│  ████  Page BG         #0D1017  → Main page canvas          │
│  ████  Card BG         #181E2E  → All cards                 │
│  ████  Input BG        #252D40  → Form inputs               │
│                                                              │
│  ── TEXT ─────────────────────────────────────────────────  │
│  ████  Text Primary    #FFFFFF  → Headings                  │
│  ████  Text Body       #B0BAD3  → Body / descriptions       │
│  ████  Text Muted      #6B7A99  → Hints / placeholders      │
└──────────────────────────────────────────────────────────────┘
```

### Color Usage Map:

| Element | Color Name | Hex |
|---------|-----------|-----|
| App background | App Root | `#080A10` |
| Page background | Page BG | `#0D1017` |
| Card background | Card BG | `#181E2E` |
| Card hover | Elevated | `#1E2638` |
| Form inputs | Input BG | `#252D40` |
| Primary CTA button | Health Blue | `#29ABE2` |
| Success button | Business Green | `#22B14C` |
| Danger/Error button | Education Red | `#CC2200` |
| Warning button | Energy Orange | `#F7941D` |
| Premium button | Platform Purple | `#7C3AED` |
| L1 FREE badge | Education Red | `#CC2200` |
| L2 BASIC badge | Energy Orange | `#F7941D` |
| L3 TRUSTED badge | Health Blue | `#29ABE2` |
| L4 PREMIUM badge | Platform Purple | `#7C3AED` |
| L5 VIP ELITE badge | Gold → Green gradient | `#F59E0B→#22B14C` |
| LIVE status | Business Green | `#22B14C` |
| Coming Soon | Energy Orange | `#F7941D` |
| Under Dev | Muted grey | `#475569` |
| GoSellr brand | Business Green | `#22B14C` |
| Health services | Health Blue | `#29ABE2` |
| Education modules | Education Red | `#CC2200` |
| Wallet/EHBGC | Energy Orange | `#F7941D` |
| Franchise HO | VIP Gold | `#F59E0B` |

### Gradient System (Updated):
```css
/* Hero background */
background: linear-gradient(180deg, #080A10 0%, #0D1017 100%);

/* Primary CTA (Blue to Green) */
background: linear-gradient(135deg, #29ABE2, #22B14C);

/* Energy / Danger (Red to Orange) */
background: linear-gradient(135deg, #CC2200, #F7941D);

/* Brand Full (EHB journey left→right) */
background: linear-gradient(135deg, #CC2200, #F7941D, #29ABE2, #22B14C);

/* Premium (Purple to Blue) */
background: linear-gradient(135deg, #7C3AED, #29ABE2);

/* VIP Elite (Gold to Green) */
background: linear-gradient(135deg, #F59E0B, #22B14C);

/* Card hover effect */
background: linear-gradient(135deg, rgba(41,171,226,0.08), rgba(34,177,76,0.08));

/* Glow — Blue */
box-shadow: 0 0 20px rgba(41,171,226,0.4);

/* Glow — Green */
box-shadow: 0 0 20px rgba(34,177,76,0.4);

/* Glow — Gold (L5 pulse) */
box-shadow: 0 0 24px rgba(245,158,11,0.6), 0 0 48px rgba(34,177,76,0.3);
```

---

## PART 2: TYPOGRAPHY SYSTEM

### Font Choices:
```
Heading Font:   "Inter" or "Plus Jakarta Sans"
  → Clean, modern, readable at all sizes
  → Used for: H1, H2, H3, card titles

Body Font:      "Inter"
  → High readability for long text
  → Used for: paragraphs, descriptions

Number Font:    "JetBrains Mono" or "Roboto Mono"
  → Used for: scores, prices, stats
  → Makes numbers look professional
```

### Type Scale:
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title H1 | 48px / 3rem | 800 | White |
| Section H2 | 32px / 2rem | 700 | White |
| Card Title H3 | 20px / 1.25rem | 600 | White |
| Body Text | 16px / 1rem | 400 | `#B0BAD3` (Text Secondary — [EHB_COLOR_SCHEME_PLAN.md](EHB_COLOR_SCHEME_PLAN.md) Part 4) |
| Small/Caption | 13px / 0.8rem | 400 | #94A3B8 |
| Badge Text | 11px / 0.7rem | 700 | White |
| Price/Score | 24px / 1.5rem | 700 | White (Mono) |

---

## PART 3: COMPONENT LIBRARY (FULL LIST)

### 3.1 Navigation Components:

**A. Main Sidebar (Desktop):**
```
┌──────────────────────┐
│  [EHB Logo]          │
│  EHB Technologies    │
├──────────────────────┤
│  🏠 Home             │
│  🛒 GoSellr GSM      │
│  💼 Jobs (JPS)       │
│  🏢 Franchise        │
│  🔐 My Verification  │
│  💰 My Wallet        │
│  ⭐ My STL Level     │
│  📋 Complaints       │
│  🔔 Notifications    │
├──────────────────────┤
│  [User Avatar]       │
│  Muhammad Ali        │
│  🔵 L3 Trusted       │
│  Score: 68/100       │
└──────────────────────┘
```

**B. Top Header:**
```
[EHB Logo] | [🔍 AI Search...] | [🌍 EN/UR] | [🔔] | [💰 Wallet] | [👤 Profile]
```

**C. Mobile Bottom Navigation:**
```
[🏠 Home] [🛒 Shop] [💼 Jobs] [💰 Wallet] [👤 Me]
```

---

### 3.2 Card Components:

**A. Product Card (GoSellr):**
```
┌────────────────────────────────┐
│                                │
│   [Product Image 280×200px]   │  ← Real product photo
│   [VIP ELITE ribbon if L5]    │
│                                │
├────────────────────────────────┤
│ iPhone 15 Pro Max              │
│ 256GB Space Black              │
│                                │
│ ⭐⭐⭐⭐⭐  4.8  (234 reviews)  │
│                                │
│ EHBGC 2,450  ≈ £1,225 GBP     │
│ ~~EHBGC 2,800~~  Save 12%     │
│                                │
│ [Seller Avatar] TechMart       │
│ 👑 VIP ELITE  94/100  ✔ CRB   │  ← STL badge
│                                │
│ 📦 Free delivery • 2 days      │
│                                │
│ [🛒 Add to Cart] [⚡ Buy Now]  │
└────────────────────────────────┘
```

**B. Industry Card (Homepage):**
```
┌────────────────────────────────┐
│                                │
│   [Industry Photo/Illustration]│  ← Real relevant image
│   (e.g., doctors for Health)  │
│                                │
│   🏥                          │  ← Large icon
│   EHB-WMS                     │
│   World Medical Services       │
│                                │
│   ● LIVE                      │  ← Green animated dot
│   "Connect with verified       │
│    doctors & specialists"      │
│                                │
│   500+ Professionals           │
│   [Explore →]                  │
└────────────────────────────────┘
```

**C. User Profile Card (6 types):**
```
┌────────────────────────────────┐
│  [User Photo / Avatar]         │  ← Real profile picture
│  Muhammad Ali                  │
│  📍 Lahore, Pakistan           │
│                                │
│  [L4 PREMIUM badge — purple]  │
│  Score: 79/100                 │
│  ████████████░░  79%           │
│                                │
│  Senior Developer • IT         │
│  ✔ CRB Verified • PSS Done    │
│  Available for work            │
│                                │
│  [View Profile] [Hire]         │
└────────────────────────────────┘
```

**D. Franchise Card:**
```
┌────────────────────────────────┐
│  [Franchise Office Photo]      │  ← Real office/area image
│  [Map pin for location]        │
│                                │
│  🏢 Ali Sub Franchise          │
│  📍 Model Town, Lahore         │
│                                │
│  EHB-STL-LEVEL: L4 — Premium  │
│  ████████████░░  82/100        │
│                                │
│  👥 45 Sellers  🚴 12 Riders  │
│  📋 Complaints: 2hr SLA ✔     │
│  ✔ Franchise Verified          │
│                                │
│  [Contact Franchise]           │
└────────────────────────────────┘
```

**E. STL Level Badge (Reusable):**
```
L1: [🔴 FREE — Low Trust]           ← red, outlined
L2: [🟠 BASIC — Verified]           ← orange filled
L3: [🔵 TRUSTED — Standard]         ← blue filled
L4: [🟣 PREMIUM — Highly Trusted]   ← purple gradient
L5: [👑 VIP ELITE — 90-100]         ← gold+emerald glow
```

**F. Stats Card:**
```
┌─────────────────────┐
│  👥                 │  ← Large icon
│  1,502              │  ← Big bold number
│  Total Users        │  ← Label below
│  ↑ +26 this week    │  ← Trend indicator
└─────────────────────┘
```

**G. Notification Card:**
```
┌─────────────────────────────────────┐
│ 🔔 [Icon based on type]             │
│ Your EHB-STL-LEVEL has improved!    │
│ Score: 68 → 73 (+5 points)         │
│ Reason: CRB inspection approved     │
│                                     │
│ 2 hours ago          [View Details] │
└─────────────────────────────────────┘
```

**H. CTA Banner (Call to Action):**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [Background: gradient blue-purple + particles]  │
│                                                  │
│  🚀  Start Earning on EHB Today                 │
│  Join 1,500+ verified professionals              │
│  in Pakistan's most trusted platform             │
│                                                  │
│  [Get Started Free]  [Watch How It Works]        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### 3.3 Form Components:

**Onboarding Step Form:**
```
┌────────────────────────────────────────┐
│  Step 2 of 5                           │
│  ████████░░░░░░░░░░  40%               │  ← Progress bar (blue)
│                                        │
│  📸 Verify Your Identity               │
│  "Upload your CNIC or Passport"        │
│                                        │
│  ┌────────────────────────────────┐   │
│  │     📄                         │   │
│  │  Drag & Drop your CNIC here    │   │
│  │  or click to upload            │   │
│  │  Supported: JPG, PNG, PDF      │   │
│  └────────────────────────────────┘   │
│                                        │
│  ✔ Secure & Encrypted                 │
│  ✔ Not stored permanently             │
│                                        │
│  [← Back]              [Continue →]   │
└────────────────────────────────────────┘
```

---

## PART 4: HOMEPAGE DESIGN (FULL)

### Hero Section:

```
┌────────────────────────────────────────────────────────────────┐
│  [HEADER: EHB Logo + AI Search + Language + Bell + Wallet + Profile] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [Background: Dark navy + animated blue particles + globe]    │
│                                                                │
│  EHB Technologies Limited                                      │  ← H1 White
│  Education • Health • Business                                 │  ← Subtitle teal
│                                                                │
│  "Pakistan's First AI-Powered                                 │  ← H1 Large
│   Trust-Verified Super Platform"                              │
│                                                                │
│  Connect with verified doctors, lawyers, sellers & employers  │  ← Body gray
│  — all in one place, all trust-scored, all blockchain-backed  │
│                                                                │
│  [🚀 Get Started Free]  [▶ Watch 2 min Demo]                  │  ← CTA buttons
│                                                                │
│  ✔ 1,500+ Users   ✔ 35+ Industries   ✔ CRB Verified          │  ← Trust badges
│                                                                │
│  [Hero Image: Collage of doctor, lawyer, seller, tech person] │  ← Right side
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Industry Navigation Bar:

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  SECTION 1 — CORE (glow + bigger):                            │
│  [🛒 E-Commerce] [🎓 Education] [🏥 Health] [⚖️ Law] [🏢 Franchise] │
│                                                                │
│  SECTION 2 — MAIN (normal):                                   │
│  Technology | Finance | Delivery | Media | Travel | Machinery  │
│                                                                │
│  SECTION 3 — MORE (small + scrollable):                       │
│  Insurance | Construction | Auto | Hospitality | Beauty → →  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Industry Cards Grid (Below Hero):

```
"Explore Industries" section:

[🛒 E-Commerce Card]  [🏥 Health Card]  [🎓 Education Card]
[⚖️ Law Card]         [🏢 Franchise Card] [💻 Technology Card]
[✈️ Travel Card]      [⚙️ Machinery Card] [🎥 Media Card]

Each card:
  - Real industry photo (doctor photo for health, courtroom for law, etc.)
  - Large industry icon
  - Industry name (full)
  - Short description in simple words
  - Status badge (🟢 LIVE / 🟡 Coming Soon / 🔒 Under Dev)
  - Service count
  - [Explore →] button
```

### How EHB Works Section:
```
"EHB Kaise Kaam Karta Hai?" — Simple 4 steps:

[Step 1 Image]          [Step 2 Image]
🔐 Register & Verify    ✅ Get Your Trust Score
"Apna account          "Apka score aapki
 banayein aur           achievement hai —
 identity verify        jitna ziada,
 karein"                utna ziada avail"

[Step 3 Image]          [Step 4 Image]
🛒 Use Platform         💰 Earn & Grow
"Shopping karein,       "Har transaction se
 job dhoondhein,        earn karein,
 service lein"          network badhayein"
```

### Trust Stats Bar:
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   👥            🏭            ✅            🔐                │
│  1,502+        35+           700+          100%               │
│  Users         Industries    Services      Blockchain          │
│  Registered    Available     Listed        Verified            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Featured Sellers Section:
```
"Top Verified Sellers This Week"

[Seller 1 Card]  [Seller 2 Card]  [Seller 3 Card]  [Seller 4 Card]
[Photo]          [Photo]          [Photo]           [Photo]
TechMart         MedSupply        LawFirm           EduCenter
👑 VIP 94        🟣 PREMIUM 82    🔵 TRUSTED 71    🔵 TRUSTED 68
Electronics      Healthcare       Legal             Education
[View Store]     [View Store]     [Contact]         [Enroll]
```

### Trusty Wallet CTA:
```
┌────────────────────────────────────────────────────────────────┐
│  [Background: Gold-to-Emerald gradient]                       │
│                                                                │
│  [Wallet/Coin 3D Illustration]                               │
│                                                                │
│  💰 EHB Trusty Wallet — Stake & Grow                         │
│                                                                │
│  "EHBGC coins lock karein aur apna                           │
│   EHB-STL-LEVEL (Service Trust Level) boost karein"          │
│                                                                │
│  Lock 1 Year → 0.5% monthly reward                          │
│  Lock 2 Years → 1.0% monthly reward                         │
│  Lock 3 Years → 1.1% monthly reward                         │
│                                                                │
│  [💰 Open Trusty Wallet]                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## PART 5: ONBOARDING FLOW DESIGN (EASY ENTRY)

### 5-Step Registration Flow:

**Step 1 — Welcome + Choose Role:**
```
┌────────────────────────────────────────────────────┐
│              Welcome to EHB! 👋                   │
│                                                    │
│  "Aap EHB per kya karna chahte hain?"             │
│                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ [Cart]   │ │[Briefcase]│ │[Building]│          │
│  │          │ │           │ │          │          │
│  │  🛒      │ │    💼     │ │    🏢    │          │
│  │ Shopping │ │ Job Dhoon-│ │ Franchise│          │
│  │ (Buying  │ │ dhna /    │ │ Kholna   │          │
│  │ or       │ │ Sell karna│ │          │          │
│  │ Selling) │ │           │ │          │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                    │
│  ┌──────────┐ ┌──────────┐                        │
│  │[Stethoscope│ │[Scale]  │                        │
│  │    🏥    │ │    ⚖️    │                        │
│  │ Doctor / │ │ Law /     │                        │
│  │ Health   │ │ Legal     │                        │
│  └──────────┘ └──────────┘                        │
└────────────────────────────────────────────────────┘
```

**Step 2 — Basic Info:**
```
┌────────────────────────────────────────────────────┐
│  Step 2/5 • ████████░░░░░░░░  40%                 │
│                                                    │
│  👤 Apni Basic Info Dein                          │
│                                                    │
│  [Full Name field]                                 │
│  [Phone Number + Country code]                     │
│  [Email Address]                                   │
│  [City / Location]                                 │
│  [Password]                                        │
│                                                    │
│  ✔ Apka data secure hai                           │
│                                                    │
│  [← Back]              [Aage Barho →]              │
└────────────────────────────────────────────────────┘
```

**Step 3 — EHB-PSS Identity:**
```
┌────────────────────────────────────────────────────┐
│  Step 3/5 • ████████████░░░░  60%                 │
│                                                    │
│  🔐 EHB-PSS Verification                          │
│  (Proof & Security System)                        │
│                                                    │
│  "Apna CNIC ya Passport scan karein"              │
│                                                    │
│  [Upload Zone with camera icon]                   │
│                                                    │
│  Kyun zaroori hai?                                │
│  ✔ Apka account safe rahega                       │
│  ✔ Aap platform per zyada earn kar sakenge        │
│  ✔ Log aap par trust karenge                      │
│                                                    │
│  [← Back]         [Verify & Continue →]           │
└────────────────────────────────────────────────────┘
```

**Step 4 — First STL Score:**
```
┌────────────────────────────────────────────────────┐
│  Step 4/5 • ████████████████░  80%               │
│                                                    │
│  🎉 Mubarak! Aapka Account Ready Hai!             │
│                                                    │
│       [Animated score counter: 0 → 30]            │
│              Score: 30 / 100                      │
│       ██████░░░░░░░░░░░░░  30%                    │
│                                                    │
│       🟠 BASIC VERIFIED                           │
│                                                    │
│  Aap in cheezoun se score badhā sakte hain:       │
│  📸 Face Verify (+10)                             │
│  🏅 CRB Inspection (+15)                          │
│  ⭐ First order complete (+5)                     │
│                                                    │
│  [Abhi Score Badhao]  [Baad mein →]               │
└────────────────────────────────────────────────────┘
```

**Step 5 — Dashboard:**
```
┌────────────────────────────────────────────────────┐
│  Step 5/5 • ████████████████████  100%            │
│                                                    │
│  🚀 Aap Tayar Hain!                               │
│  "Apna EHB experience shuru karein"               │
│                                                    │
│  [Aapke liye Suggested:]                          │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  🛒      │  │  💼      │  │  🔐      │        │
│  │ GoSellr  │  │ Jobs     │  │ Verify   │        │
│  │ Explore  │  │ Explore  │  │ CRB      │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
│         [Go to Dashboard →]                        │
└────────────────────────────────────────────────────┘
```

---

## PART 6: GoSellr GSM MARKETPLACE DESIGN

### GoSellr Homepage:
```
┌────────────────────────────────────────────────────────────────┐
│  [Header]                                                      │
│                                                                │
│  🛒 GoSellr GSM (Global Shopping Management)                  │
│                                                                │
│  [Search bar: "Kya dhondhna hai?"]                            │
│  [Filters: Category | Price | STL Level | Delivery | Rating]  │
│                                                                │
│  FEATURED CATEGORIES:                                          │
│  [📱 Mobiles Photo] [💻 Laptops Photo] [👗 Fashion Photo]     │
│  [🏠 Home Photo]    [🍕 Food Photo]    [⚕️ Health Photo]      │
│                                                                │
│  TRENDING NOW:                                                 │
│  [Product Cards Grid — 4 columns]                             │
│                                                                │
│  TOP VERIFIED SELLERS:                                         │
│  [Seller Cards — showing STL badges]                          │
└────────────────────────────────────────────────────────────────┘
```

### Product Detail Page:
```
LEFT SIDE:                           RIGHT SIDE:
[Product Images — 4 thumbnails]      Product Name (H2)
[Main Large Image]                   ⭐⭐⭐⭐⭐ 4.8 (234 reviews)

                                     EHBGC 2,450 ≈ £1,225 GBP
                                     ~~EHBGC 2,800~~  Save 12%

                                     [Seller Profile Mini Card:]
                                     [Seller Photo] TechMart Store
                                     👑 VIP ELITE — Score: 94/100
                                     ✔ CRB Verified ✔ PSS Done
                                     Sales: 1,240 | Rating: 4.9⭐

                                     📦 Delivery Options:
                                     ○ EHB Rider (2 days) — Free
                                     ○ Express (1 day) — EHBGC 50

                                     [🛒 Add to Cart]
                                     [⚡ Buy Now]
                                     [💬 Ask Seller]

BELOW: Product Description (full content)
BELOW: Reviews & Ratings
BELOW: Similar Products
```

---

## PART 7: EHB-STL-LEVEL PAGE DESIGN

### My Trust Level Page:
```
┌────────────────────────────────────────────────────────────────┐
│  [Header]                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ⭐ Mera EHB-STL-LEVEL (Service Trust Level)                  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │   [User Photo]     🟣 L4 — PREMIUM                      │ │
│  │   Muhammad Ali     HIGHLY TRUSTED                        │ │
│  │   📍 Lahore        Score: 79 / 100                       │ │
│  │                    ████████████░░░░  79%                 │ │
│  │                    Next: L5 needs 11 more points         │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  📊 Score Breakdown:                                          │
│  🔐 EHB-PSS Verification    ██████████████░  28/40           │
│  🏅 EHB-CRB Certification   ████████████░░░  15/20           │
│  ⭐ Performance              ████████░░░░░░░  14/20           │
│  👤 Behaviour                ████████████░░░  12/20           │
│  🏭 Industries               ██████░░░░░░░░░   6/20           │
│  🔄 Refilling                ████░░░░░░░░░░░   3/10           │
│                                                                │
│  ✅ Aapke Current Benefits (L4 PREMIUM):                      │
│  ✔ Priority search mein dikhai dene                          │
│  ✔ Roz £1,000 tak withdraw                                   │
│  ✔ Franchise apply kar sakte hain                            │
│  ✔ 10% platform commission (kam)                             │
│                                                                │
│  🎯 L5 VIP ELITE tak jane ke liye:                           │
│  → Business PSS layer complete karein (+5)                   │
│  → CRB Advanced certification lein (+5)                      │
│  → 2 aur verified orders karein (+2)                         │
│                                                                │
│  📜 Score History:                                            │
│  Apr 07  Score: 79  ↑ +5  CRB Approved                      │
│  Mar 28  Score: 74  ↑ +8  PSS Layer 3 Done                  │
│  Mar 15  Score: 66  ↑ +3  10 Orders Done                    │
│                                                                │
│  [📋 STL Appeal Karein]  [🚀 Score Badhao]                   │
└────────────────────────────────────────────────────────────────┘
```

---

## PART 8: IMAGE STRATEGY (EVERY PAGE)

### Which Images Go Where:

| Page/Section | Image Type | Content |
|-------------|-----------|---------|
| Homepage Hero | Collage photo | Doctor, lawyer, seller, tech person together |
| Health Industry Card | Real photo | Doctor with patient |
| Legal Industry Card | Real photo | Courtroom or lawyer at desk |
| Education Card | Real photo | Students/classroom |
| E-Commerce Card | Real photo | Shopping bags/products |
| Franchise Section | Real photo | Franchise office front |
| Franchise Cards | Real photo | The actual franchise location |
| Seller Profile | Real photo | Seller at their shop/store |
| Rider Card | Real photo | Rider on bike with EHB bag |
| Inspector Card | Real photo | Inspector at work |
| Product Cards | Real photo | Actual product image |
| Wallet Section | 3D illustration | Coin/wallet 3D render |
| Blockchain Section | Illustration | Chain/network visual |
| Onboarding Steps | Icons+illustration | Step-by-step visual |
| STL Level Icons | Custom SVG | L1-L5 shield/crown icons |
| Empty States | Friendly illustration | "Nothing here yet" |
| Error Pages | Friendly illustration | "Oops! Something went wrong" |

### Image Rules:
```
✔ Always use REAL photography for people/places
✔ Always use high quality (min 800x600px for cards)
✔ Always compress for web (WebP format preferred)
✔ Always add alt text (for accessibility)
✔ Always show diverse people (multiple ethnicities)
✔ Use Pakistani faces for Pakistan market
✔ Use UK faces for UK market
✔ Never use blurry or pixelated images
```

---

## PART 9: ICON SYSTEM

### Icon Library: Lucide Icons + Custom SVG

| Category | Icons Used |
|----------|-----------|
| Navigation | Home, ShoppingCart, Briefcase, Building2, Shield, Wallet, Star, Bell |
| Status | CheckCircle, AlertCircle, XCircle, Clock, Zap |
| User Types | User, Users, UserCheck, Building, Truck, HardHat |
| Trust/STL | ShieldCheck, Star, Trophy, Crown, Award |
| Money | DollarSign, Coins, ArrowUpDown, TrendingUp |
| Verification | Fingerprint, Eye, Camera, FileText, Phone |
| Actions | ArrowRight, Plus, Edit, Trash, Share, Copy |
| Industries | Stethoscope, Scale, GraduationCap, ShoppingBag, Factory |

### Icon + Text Rule:
```
Every menu item = Icon LEFT + Text RIGHT
Every card title = Icon + H3 text
Every benefit/feature = Checkmark icon + text
Every stat = Large icon above + number + label below
NEVER use icon alone without text (except badges)
```

---

## PART 10: DARK THEME GLASS EFFECT (UI POLISH)

### Glass Card Effect (CSS):
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.glass-card:hover {
  background: rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### Glow Effects (for Live/VIP elements):
```css
.live-glow {
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
  animation: pulse-glow 2s infinite;
}

.vip-glow {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.stl-l4-glow {
  box-shadow: 0 0 16px rgba(124, 58, 237, 0.4);
}
```

---

## PART 11: CONTENT RULES (EVERY PAGE HAS FULL TEXT)

### Rule: NEVER use placeholder text ("Lorem ipsum")

### Every Section Must Have:
```
1. Section heading (in Urdu-friendly English)
2. 1-2 line subtitle (explains what this section is)
3. Body text (tells user what they need to know)
4. Visual (image or icon)
5. CTA (what to do next)
```

### Sample Content Templates:

**Industry Card Content:**
```
Title:    "EHB-WMS (World Medical Services)"
Subtitle: "Verified Doctors & Health Specialists"
Body:     "Pakistan ke top verified doctors, dentists,
           aur health specialists se connect karein.
           Sab EHB-CRB certified hain."
CTA:      "Explore Health Services →"
```

**STL Level Benefit:**
```
Title:    "L4 Premium ban ke yeh faida utha'ein"
Point 1:  "✔ Roz £1,000 tak withdraw kar sakte hain"
Point 2:  "✔ Search results mein aap upar aate hain"
Point 3:  "✔ Platform commission sirf 10% hoga"
Point 4:  "✔ Franchise apply karne ke eligible hain"
CTA:      "Apna Score Badhao →"
```

---

## PART 12: RESPONSIVE DESIGN BREAKPOINTS

| Breakpoint | Device | Layout |
|------------|--------|--------|
| 320px+ | Small mobile | 1 column, bottom nav |
| 640px+ | Large mobile | 1-2 column, bottom nav |
| 768px+ | Tablet | 2-3 column, mini sidebar |
| 1024px+ | Small laptop | 3-4 column, full sidebar |
| 1280px+ | Desktop | 4 column, full sidebar |
| 1536px+ | Large screen | 4-5 column, wide layout |

---

## PART 13: ANIMATION RULES

### Allowed Animations:
```
Page load:   Fade in (0.3s ease)
Card hover:  translateY(-2px) + shadow increase (0.3s)
Button:      Scale 0.98 on press (0.1s)
Badge glow:  Pulse animation (2s infinite) for LIVE
Score bar:   Count up animation on page load
STL level:   Shimmer effect on gold/VIP badges
Progress:    Smooth fill on step completion
```

### Forbidden Animations:
```
✗ No auto-playing videos or GIFs (distracting)
✗ No excessive bouncing or spinning
✗ No animations that take > 0.5s (feels slow)
✗ No animations that block user interaction
```

---

## PART 14: EMPTY STATES (FRIENDLY MESSAGES)

| Empty State | Image | Heading | Body | CTA |
|-------------|-------|---------|------|-----|
| No orders | Shopping bag illustration | "Abhi tak koi order nahi" | "GoSellr per jaein aur apni pehli shopping karein!" | [Shop Now] |
| No jobs | Briefcase illustration | "Koi job application nahi" | "EHB-JPS per apni skills dikhayein" | [Find Jobs] |
| Low STL | Shield illustration | "Apna trust score badhao" | "Score badhane se zyada fayde milenge" | [Improve Score] |
| No wallet | Wallet illustration | "Wallet abhi empty hai" | "EHBGC deposit karein ya earn karein" | [Add Money] |

---

## PART 15: ERROR & SUCCESS STATES

### Success Toast:
```
┌────────────────────────────────┐
│ ✅ Mubarak! Order Place Ho Gaya │
│ Order #12345 — Processing      │
│                    [View →]    │
└────────────────────────────────┘
Color: Emerald #10B981 background
```

### Error Toast:
```
┌────────────────────────────────┐
│ ❌ Kuch Ghalat Ho Gaya         │
│ STL score low hai. Pehle verify│
│ karein.           [Verify →]   │
└────────────────────────────────┘
Color: Red #EF4444 background
```

### Loading State:
```
[EHB Logo spinning animation]
Loading...
(2 dots animated below)
```

---

## SUMMARY: KEY DESIGN RULES

```
1. ALWAYS use real images (no stock photo generic look)
2. ALWAYS write full content (no Lorem ipsum)
3. ALWAYS use EHB color palette
4. ALWAYS show STL badge on user/seller/product cards
5. ALWAYS write full name + short: e.g., EHB-STL-LEVEL (Service Trust Level)
6. ALWAYS use icons next to text
7. ALWAYS have a CTA (call to action) at end of every section
8. ALWAYS show trust indicators (✔ CRB Verified, PSS Done, STL badge)
9. ALWAYS use glass card effect on dark background
10. NEVER use placeholder text — always real content
11. NEVER use too many colors at once (max 3 per component)
12. NEVER use light background (dark theme only)
```

---

## Implementation status (codebase — `EHB landing-2026`)

| Part | Summary | Status |
|------|---------|--------|
| **1** Color system | Tailwind `ehb.*` tokens + `EHB_COLOR_SCHEME_PLAN` alignment; gradients/shadows | **Done** (ongoing token use in components) |
| **2** Typography | Inter + JetBrains Mono (`--font-inter`, `--font-jetbrains-mono`); scale: `text-ui-h1`, `ui-h2`, `ui-caption`, `ui-badge`, `ui-price` | **Done** |
| **3** Component library | Reusable **STL badge** (`components/ui/EhbStlBadge.tsx`); mobile **bottom nav** (`components/MobileBottomNav.tsx`); cards/button patterns still distributed across pages | **Partial** — full sidebar/product cards as in wireframes = backlog |
| **4** Homepage | Hero copy + CTAs aligned to plan; trust stats (`LandingStats`); `#how-ehb-works` anchor | **Partial** — full collage/hero asset as spec = content |
| **5** Onboarding | **`/onboarding`** — 5-step wizard (`components/OnboardingWizard.tsx`), demo only (no backend) | **Done** (demo) |
| **6** GoSellr | Existing `/gosellr` + product cards; not full PDP spec | **Partial** |
| **7** STL page | Existing `/dmo/stl`, widgets; not full “My Trust” page spec | **Partial** |
| **8** Image strategy | Rules in doc; asset pipeline per industry = backlog | **Doc only** |
| **9** Icons | Lucide used across app | **Done** (ongoing) |
| **10** Glass / glow | `globals.css`: `.glass-card`, `.live-glow`, `.vip-glow`, `.stl-l4-glow` | **Done** |
| **11** Content rules | No Lorem on landing; sections have copy — audit remaining routes | **Ongoing** |
| **12** Breakpoints | Tailwind screens match plan | **Done** |
| **13** Animations | Fade-in, hover, ticker limits per plan | **Partial** |
| **14–15** Empty/error states | Patterns exist on some routes; **RuntimeToast** for client toasts | **Partial** |

**Next implementation slices (suggested):** GoSellr PDP layout (Part 6), dedicated “My STL” user page (Part 7), admin sidebar (Part 3.1A), real image assets (Part 8).

---

## AUTO-SAVE TO MASTER PLAN ✅
> This UI/UX plan is reflected in EHB_MASTER_SYSTEM_PLAN.md Section 21

---

*EHB_UIUX_DESIGN_PLAN.md | Version 1.0 | April 2026 | Implementation in progress*
