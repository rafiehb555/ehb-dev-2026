# EHB — Global Industries + UI Design Strategy
> Industry Structure + UI Categorization + Active vs Under Development
> Version: 1.0 | April 2026 | Status: PLANNING

---

## PART 1: FINAL INDUSTRY STRUCTURE RULE

### 3 Tiers:

```
TIER 1 — CORE (5–6 industries)
  → Highlighted, glow, bigger, left-position
  → These are LIVE / in active development

TIER 2 — MAIN INDUSTRIES (10–12 industries)
  → Normal buttons, visible
  → Some live, some "Coming Soon"

TIER 3 — OTHER INDUSTRIES (15–20 industries)
  → Scrollable, smaller
  → Mostly "Under Development"
  → Still searchable via AI
```

---

## PART 2: FULL INDUSTRY MASTER LIST (35 Industries)

### 🔵 TIER 1 — CORE INDUSTRIES (Priority — LIVE first)

| # | Industry | Platform | Status |
|---|----------|----------|--------|
| 1 | E-commerce | GoSellr GSM (Global Shopping Management) | 🟢 LIVE |
| 2 | Education | EHB-HPS (Human Performance Solution) | 🟢 LIVE |
| 3 | Health | EHB-WMS (World Medical Services) | 🟢 LIVE |
| 4 | Law | EHB-OLS (Online Law Services) | 🟢 LIVE |
| 5 | Franchise System | EHB-ESF/EMF/ECF | 🟢 LIVE |

---

### 🟢 TIER 2 — MAIN INDUSTRIES (Visible, Some Live)

| # | Industry | Platform | Status |
|---|----------|----------|--------|
| 6 | Technology / IT | EHB-SOT (Services of Technology) | 🟡 Coming Soon |
| 7 | AI & Blockchain | EHB-BRS (Blockchain Record System) | 🟡 Coming Soon |
| 8 | Finance | EHB-EFS (EHB Financial Services) | 🟡 Coming Soon |
| 9 | Real Estate | EHB-ERS (EHB Real Estate Services) | 🟡 Coming Soon |
| 10 | Delivery / Logistics | EHB-LDS (Logistics & Delivery Services) | 🟢 LIVE |
| 11 | Media & Entertainment | EHB Tube (EHB Media Platform) | 🟡 Coming Soon |
| 12 | Travel & Tourism | EHB-AGTS (Advanced Global Travel Services) | 🟡 Coming Soon |
| 13 | Agriculture | EHB-EAS (EHB Agriculture Services) | 🟡 Coming Soon |
| 14 | Machinery & Industrial | EHB-HMS / EHB-ITS | 🟡 Coming Soon |
| 15 | HR & Recruitment | EHB-JPS (Job Profile & Skill) | 🟢 LIVE |

---

### ⚫ TIER 3 — OTHER INDUSTRIES (Scrollable, Under Development)

| # | Industry | Future Platform | Status |
|---|----------|----------------|--------|
| 16 | Insurance | EHB Insurance Services | 🔒 Under Development |
| 17 | Construction | EHB Construction Platform | 🔒 Under Development |
| 18 | Automotive | EHB Auto Services | 🔒 Under Development |
| 19 | Manufacturing | EHB Manufacturing Hub | 🔒 Under Development |
| 20 | Hospitality | EHB Hotel & Stay | 🔒 Under Development |
| 21 | Beauty & Cosmetics | EHB Beauty Platform | 🔒 Under Development |
| 22 | Fitness & Sports | EHB Fitness Hub | 🔒 Under Development |
| 23 | Gaming | EHB Gaming Zone | 🔒 Under Development |
| 24 | Marketing & Advertising | EHB Marketing Services | 🔒 Under Development |
| 25 | Consulting | EHB Consulting Network | 🔒 Under Development |
| 26 | Freelancing | EHB Freelance Market | 🔒 Under Development |
| 27 | Security Services | EHB Security Solutions | 🔒 Under Development |
| 28 | Telecom | EHB Telecom Services | 🔒 Under Development |
| 29 | Energy | EHB Energy Platform | 🔒 Under Development |
| 30 | Environment | EHB Green Services | 🔒 Under Development |
| 31 | Research & Development | EHB R&D Hub | 🔒 Under Development |
| 32 | NGO / Social Services | EHB Social Impact | 🔒 Under Development |
| 33 | Government Services | EHB Gov Connect | 🔒 Under Development |
| 34 | Professional Services | EHB-EPS (EHB Professional Services) | 🔒 Under Development |
| 35 | Local Services | EHB-ELS (EHB Local Services) | 🟡 Coming Soon |

### 🚀 FUTURE / ADVANCED INDUSTRIES (Post Phase 3)

| # | Industry | Notes |
|---|----------|-------|
| 36 | Space Tech | Long-term vision |
| 37 | Robotics | Long-term vision |
| 38 | Metaverse | Long-term vision |
| 39 | IoT (Internet of Things) | Long-term vision |
| 40 | Smart Cities | Long-term vision |
| 41 | Biotechnology | Long-term vision |
| 42 | Nanotechnology | Long-term vision |
| 43 | Quantum Computing | Long-term vision |

**Total: 35 active + 8 future = 43 industries**
**Services across all: 700+**

---

## PART 3: TOP BAR INDUSTRY UI DESIGN

### Layout (Header — Horizontal Scroll):

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔵 CORE (Highlighted + Glow)                                        │
│                                                                      │
│  [ 🛒 E-commerce ]  [ 🎓 Education ]  [ 🏥 Health ]                 │
│  [ ⚖️ Law ]  [ 🏢 Franchise ]                                        │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  🟢 MAIN INDUSTRIES (Normal buttons)                                 │
│                                                                      │
│  Technology | Finance | Real Estate | Delivery | Media |            │
│  Travel | Agriculture | Machinery | HR & Jobs | Insurance            │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ⚫ MORE INDUSTRIES (Scrollable, smaller)                            │
│                                                                      │
│  Construction | Auto | Manufacturing | Hospitality | Beauty |       │
│  Fitness | Gaming | Marketing | Consulting | Freelancing |          │
│  Security | Telecom | Energy | Environment | NGO | Government →     │
└──────────────────────────────────────────────────────────────────────┘
```

### CSS Style Differences:

```
TIER 1 (Core):
  background: linear-gradient(135deg, #3B82F6, #8B5CF6)
  border: 2px solid rgba(139, 92, 246, 0.6)
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4)   ← glow effect
  padding: 10px 20px
  font-size: 15px, font-weight: 700

TIER 2 (Main):
  background: rgba(255,255,255,0.05)
  border: 1px solid rgba(255,255,255,0.15)
  padding: 8px 16px
  font-size: 14px, font-weight: 500

TIER 3 (Other / Scrollable):
  background: transparent
  border: 1px solid rgba(255,255,255,0.08)
  padding: 6px 12px
  font-size: 13px, font-weight: 400
  opacity: 0.7
```

---

## PART 4: INDUSTRY CARD STATUS SYSTEM

### 🟢 ACTIVE / LIVE Card:

```
┌────────────────────────────┐
│                            │
│   [Industry Icon]          │
│                            │
│   E-Commerce               │
│   GoSellr GSM              │
│   (Global Shopping Mgmt)   │
│                            │
│   ● LIVE                  │ ← Green dot + "LIVE" badge
│                            │
│   700+ Services            │
│   [Open Platform →]        │ ← Clickable button
│                            │
└────────────────────────────┘
Border: Green glow
Background: Dark green tint
Button: Active, clickable
```

### 🟡 COMING SOON Card:

```
┌────────────────────────────┐
│                            │
│   [Industry Icon]          │
│                            │
│   Finance                  │
│   EHB-EFS                  │
│   (EHB Financial Services) │
│                            │
│   ◉ Coming Soon           │ ← Yellow badge
│                            │
│   [Notify Me]              │ ← Email signup
│                            │
└────────────────────────────┘
Border: Yellow/amber tint
Background: Slightly blurred
Button: "Notify Me" (email capture)
```

### 🔒 UNDER DEVELOPMENT Card:

```
┌────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░  │ ← Blur/frosted effect
│  ░░  [Blurred Icon]  ░░░  │
│  ░░                  ░░░  │
│  ░░   Construction   ░░░  │
│  ░░   🔒 Under Dev   ░░░  │
│  ░░                  ░░░  │
│  ░░  [Register Interest]  │ ← Subtle CTA
│  ░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────┘
Border: Dark, no glow
Background: Heavy blur (backdrop-filter: blur(8px))
Lock icon: 🔒 visible
Opacity: 0.5
```

---

## PART 5: AI SEARCH BEHAVIOR

### Search Rules:
```
User types in search bar →

AI searches ALL 43 industries

Results shown:
  🟢 LIVE industries → Full result card (clickable, open)
  🟡 Coming Soon → Shown with "Coming Soon" badge
  🔒 Under Development → Shown with lock + "Register Interest"

Rule:
  NEVER hide any industry from search
  ALL industries searchable and findable
  BUT status clearly shown
```

### Search Result Card:
```
┌──────────────────────────────────────┐
│ 🔍 Results for "insurance"           │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Insurance                        │ │
│ │ EHB Insurance Services           │ │
│ │ 🔒 Under Development             │ │
│ │ [Register Interest]              │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Related: EHB-EFS (Finance) → LIVE    │
│ [Open EHB-EFS →]                     │
└──────────────────────────────────────┘
```

---

## PART 6: HOMEPAGE LAYOUT — FINAL STRUCTURE

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  [EHB Logo]    [Search bar — AI powered]    [Login/Signup]  │
├──────────────────────────────────────────────────────────────┤
│  INDUSTRY TOP BAR                                            │
│  [Core Industries — Glow]                                    │
│  [Main Industries — Normal]                                  │
│  [More Industries — Scrollable] →                           │
├──────────────────────────────────────────────────────────────┤
│  HERO SECTION                                                │
│  "EHB Technologies Limited                                   │
│   Education • Health • Business"                             │
│  AI Search + CTA buttons                                     │
├──────────────────────────────────────────────────────────────┤
│  INDUSTRY CARDS GRID                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│  │🟢LIVE│ │🟢LIVE│ │🟡SOON│ │🔒DEV │ │🔒DEV │            │
│  │GoSellr│ │Health│ │Tech  │ │Finance│ │Auto  │            │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘            │
├──────────────────────────────────────────────────────────────┤
│  EHB-STL-LEVEL (Service Trust Level) SHOWCASE               │
│  "Trust-powered marketplace — every seller verified"         │
├──────────────────────────────────────────────────────────────┤
│  FRANCHISE SYSTEM SECTION                                    │
│  EHB-ESF → EHB-EMF → EHB-ECF → Country → Head Office       │
├──────────────────────────────────────────────────────────────┤
│  STATS SECTION                                               │
│  Users: X | Services: 700+ | Industries: 35+ | Countries: 2 │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## PART 7: INDUSTRY STATUS MANAGEMENT (DMO)

### DMO Industry Control Panel (`/dmo/industries`):
- Toggle industry status: LIVE / COMING_SOON / UNDER_DEVELOPMENT
- Add new industry
- Edit industry name/platform/description
- View industry-wise traffic and signups
- "Register Interest" count per under-development industry

### Database Model:
```prisma
model Industry {
  id
  name              (e.g., "E-Commerce")
  shortName         (e.g., "GSM")
  fullName          (e.g., "Global Shopping Management")
  platform          (e.g., "GoSellr GSM")
  displayName       (e.g., "GoSellr GSM (Global Shopping Management)")
  tier              (CORE / MAIN / OTHER / FUTURE)
  status            (LIVE / COMING_SOON / UNDER_DEVELOPMENT / FUTURE)
  icon              (emoji or icon name)
  description
  launchDate        (optional)
  serviceCount      (Int)
  interestSignups   (Int)
  order             (Int, for sorting)
  createdAt
  updatedAt
}

model IndustryInterest {
  id
  industryId
  email
  userId (optional)
  registeredAt
}
```

---

## PART 8: NAMING IN CODE (DEVELOPER REFERENCE)

### TypeScript Constants:
```typescript
// src/lib/constants/ehb-names.ts

export const EHB_NAMES = {
  // Core Systems
  DMO: "EHB-DMO (Decentralized Management Office)",
  JPS: "EHB-JPS (Job Profile & Skill)",
  PSS: "EHB-PSS (Proof & Security System)",
  CRB: "EHB-CRB (Certification & Registry Board)",
  STL: "EHB-STL-LEVEL (Service Trust Level)",
  EHW: "EHB-EHW (EHB Wallet)",
  EAP: "EHB-EAP (EHB Affiliate Program)",

  // Industry Platforms
  GSM: "GoSellr GSM (Global Shopping Management)",
  WMS: "EHB-WMS (World Medical Services)",
  HPS: "EHB-HPS (Human Performance Solution)",
  OBS: "EHB-OBS (Online Book Store)",
  OLS: "EHB-OLS (Online Law Services)",
  AGTS: "EHB-AGTS (Advanced Global Travel Services)",
  HMS: "EHB-HMS (Homan Machinery Solutions)",
  ITS: "EHB-ITS (Industrial Technology Services)",
  SOT: "EHB-SOT (Services of Technology)",
  TUBE: "EHB Tube (EHB Media Platform)",

  // Support Services
  LDS: "EHB-LDS (Logistics & Delivery Services)",
  ERS: "EHB-ERS (EHB Real Estate Services)",
  EFS: "EHB-EFS (EHB Financial Services)",
  EPS: "EHB-EPS (EHB Professional Services)",
  EAS: "EHB-EAS (EHB Agriculture Services)",
  ELS: "EHB-ELS (EHB Local Services)",

  // System Modules
  AMS: "EHB-AMS (Application Management System)",
  CMS: "EHB-CMS (Complaint Management System)",
  NMS: "EHB-NMS (Notification Management System)",
  VSS: "EHB-VSS (Verification Support System)",
  BRS: "EHB-BRS (Blockchain Record System)",

  // Franchise
  ESF: "EHB-ESF (EHB Sub Franchise)",
  EMF: "EHB-EMF (EHB Master Franchise)",
  ECF: "EHB-ECF (EHB Corporate Franchise)",
} as const;
```

---

*Industries + UI Plan v1.0 | April 2026 | Planning Phase*
