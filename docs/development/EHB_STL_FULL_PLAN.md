# EHB-STL — Service Trust Level — Full Development Plan
> Version: 2.0 | April 2026 | Status: PLANNING PHASE

---

## TABLE OF CONTENTS

1. [STL Kya Hai — Definition](#1-stl-kya-hai)
2. [Current State — Kya Ban Chuka Hai](#2-current-state)
3. [STL Score Formula — Complete](#3-stl-score-formula)
4. [STL Levels — Complete Tier System](#4-stl-levels)
5. [Access Control — Level-wise Permissions](#5-access-control)
6. [Auto-Update Triggers — Kab Recalculate Ho](#6-auto-update-triggers)
7. [Appeal System — User Appeals](#7-appeal-system)
8. [Refilling System — 6-Month Cycle](#8-refilling-system)
9. [Wallet Integration — Commission + Withdrawal](#9-wallet-integration)
10. [STL Visibility — Kahan Dikhega](#10-stl-visibility)
11. [Leaderboard — Public Rankings](#11-leaderboard)
12. [Notifications — Alert System](#12-notifications)
13. [Platform Integrations](#13-platform-integrations)
14. [DMO Admin Tools](#14-dmo-admin-tools)
15. [History Retention Policy](#15-history-retention)
16. [Database Schema Plan](#16-database-schema)
17. [API Routes Plan](#17-api-routes-plan)
18. [UI Pages Plan](#18-ui-pages-plan)
19. [Development Phases — Step by Step](#19-development-phases)
20. [Complete File Structure](#20-file-structure)

---

## 1. STL KYA HAI

**STL (Service Trust Level)** EHB ka AI-driven reputation engine hai jo platform par har entity ko ek **0–100 trust score** deta hai.

### Entities Jo Score Paati Hain:
- **USER** — Individual users, professionals, freelancers
- **SERVICE** — Provider services (electrician, doctor, etc.)
- **PRODUCT** — GoSellr marketplace products

### Core Purpose:
- Search ranking decide karna (high STL = top results)
- Feature access control karna
- Customers ko trusted providers dikhana
- Fraud prevention (low STL → fraud signal)
- Wallet limits aur commission rates set karna

---

## 2. CURRENT STATE — KYA BAN CHUKA HAI

### ✅ Already Built (DO NOT REBUILD):

| File | Status | Description |
|------|--------|-------------|
| `lib/stl/engine.ts` | ✅ DONE | Core scoring engine (computeUserStl, computeServiceStl, computeProductStl) |
| `app/api/stl/calculate/route.ts` | ✅ DONE | POST: manual recalc, GET: all scores + history |
| `app/api/stl/me/route.ts` | ✅ DONE | GET: current user's live STL breakdown |
| `app/dmo/stl/page.tsx` | ✅ DONE | DMO STL dashboard (ranking table, history, manual calc) |
| `components/stl/StlWidget.tsx` | ✅ DONE | Reusable widget with component bar charts |
| `lib/fraud/orchestration.ts` | ✅ DONE | STL ↔ Fraud bridge (low STL auto triggers fraud signal) |
| `prisma/schema.prisma` (STLScore, STLLog) | ✅ DONE | Core database models |

### Current Score Breakdown (Engine v1):
```
STL Total (0-100) =
  PSS Score      (0–40)   → Identity verification
  CRB Score      (0–20)   → Physical certification
  Performance    (0–20)   → Completed orders, services
  Behavior       (-50–20) → Inspection results, fraud signals
  Industries     (0–20)   → Multi-industry verification boosts
  Refilling      (-40–10) → Re-verification status
```

### Current STL Levels (Engine v1):
```
L1: 0–39  → Low Trust
L2: 40–59 → Basic Verified
L3: 60–74 → Trusted
L4: 75–89 → Highly Trusted
L5: 90–100 → Elite Verified
```

### ❌ What is Missing (To Be Built):

| Feature | Status |
|---------|--------|
| User Profile STL badge | ❌ Missing |
| Public Trust Card with STL | ❌ Missing |
| GoSellr product/seller STL display | ❌ Missing |
| Appeal System | ❌ Missing |
| Auto-update on PSS/CRB/Order/Review events | ❌ Missing (hooks not wired) |
| Refilling scheduler + warnings | ❌ Missing |
| Wallet commission + withdrawal integration | ❌ Missing |
| Public Leaderboard | ❌ Missing |
| Notification system for STL changes | ❌ Missing |
| DMO manual override tool | ❌ Missing |
| DMO bulk recalculate | ❌ Missing |
| STL freeze/suspend tool | ❌ Missing |
| Score audit trail view | ❌ Missing |
| JPS profile STL integration | ❌ Missing |

---

## 3. STL SCORE FORMULA — COMPLETE

### Component Weights:

| Component | Min | Max | Description |
|-----------|-----|-----|-------------|
| PSS Score | 0 | 40 | Identity verification depth |
| CRB Score | 0 | 20 | Certification + inspection quality |
| Performance | 0 | 20 | Orders, delivery, response time |
| Behavior | -50 | 20 | Franchise inspection + fraud signals |
| Industries | 0 | 20 | Multi-industry verification boosts |
| Refilling | -40 | 10 | Re-verification lifecycle status |
| **Total** | **0** | **100** | Clamped 0–100 |

### PSS Score Rules:
```
Phase 0 completed → 0 pts
Phase 1 completed → 30 pts  (identity + device)
Phase 2 completed → 40 pts  (AML + full KYC)
Phase 3+ completed → 40 pts (cap at 40)
```

### CRB Score Rules:
```
Per active, non-expired certificate:
  Base points: +10
  If inspection score >= 90: +5 bonus
  Cap: 20 total
```

### Performance Score Rules (User):
```
Completed orders as SELLER: × 2 pts each (cap 12)
Completed orders as BUYER:  × 1 pt each  (cap 4)
Active provider services:   × 2 pts each (cap 4)
Total cap: 20
```

### Behavior Score Rules:
```
Latest CRB inspection:
  fraudSuspected = true → -50
  score < 50            → -30
  score 50-79           → -10
  score 80-89           → +10
  score >= 90           → +20
  (no inspection)       →   0
```

### Industry Boost Rules:
```
Per verified, non-expired IndustryVerification:
  Points = (score/100) × 10 × weight
  Cap: 20 total
```

### Refilling Score Rules:
```
StlStatus ACTIVE     → +10
StlStatus WARNING    → +5
StlStatus LIMITED    → -10
StlStatus DOWNGRADED → -20
StlStatus SUSPENDED  → -40
```

### Score Level Classification:
```
90-100 → L5 (Elite Verified)
75-89  → L4 (Highly Trusted)
60-74  → L3 (Trusted)
40-59  → L2 (Basic Verified)
0-39   → L1 (Low Trust)
```

---

## 4. STL LEVELS — COMPLETE TIER SYSTEM

| Level | Score | Label | Badge Color | Icon |
|-------|-------|-------|-------------|------|
| L1 | 0–39 | Low Trust | Red | 🔴 |
| L2 | 40–59 | Basic Verified | Orange | 🟠 |
| L3 | 60–74 | Trusted | Yellow-Green | 🟡 |
| L4 | 75–89 | Highly Trusted | Blue | 🔵 |
| L5 | 90–100 | Elite Verified | Emerald/Gold | 🟢⭐ |

### Level Benefits:

#### L1 (Low Trust, 0–39):
- Browse platform: ✅
- Create account: ✅
- View services: ✅
- List services: ❌ (must reach L2)
- Sell products: ❌
- Search visibility: Very low

#### L2 (Basic Verified, 40–59):
- Everything in L1: ✅
- List up to 3 services: ✅
- Sell products (limited): ✅
- Search visibility: Low
- Wallet withdrawal: Up to £100/day
- Platform commission: 15%

#### L3 (Trusted, 60–74):
- Everything in L2: ✅
- List unlimited services: ✅
- Full marketplace access: ✅
- Search visibility: Standard
- Wallet withdrawal: Up to £500/day
- Platform commission: 12%
- Priority customer support: ✅

#### L4 (Highly Trusted, 75–89):
- Everything in L3: ✅
- Franchise applications: ✅
- Featured placement eligible: ✅
- Search visibility: Priority
- Wallet withdrawal: Up to £2,000/day
- Platform commission: 10%
- Verified Badge on profile: ✅

#### L5 (Elite Verified, 90–100):
- Everything in L4: ✅
- Top search placement: ✅
- Featured on homepage: ✅
- Search visibility: TOP
- Wallet withdrawal: Up to £10,000/day
- Platform commission: 7%
- Elite badge + Gold border on cards: ✅
- Access to premium analytics: ✅
- Early access to new features: ✅

---

## 5. ACCESS CONTROL — LEVEL-WISE PERMISSIONS

### Feature Access Matrix:

| Feature | L1 | L2 | L3 | L4 | L5 |
|---------|----|----|----|----|-----|
| Browse platform | ✅ | ✅ | ✅ | ✅ | ✅ |
| List services | ❌ | ✅(3) | ✅ | ✅ | ✅ |
| Sell products | ❌ | ✅ | ✅ | ✅ | ✅ |
| Apply for CRB | ✅ | ✅ | ✅ | ✅ | ✅ |
| Franchise apply | ❌ | ❌ | ❌ | ✅ | ✅ |
| Featured listing | ❌ | ❌ | ❌ | ✅ | ✅ |
| Premium analytics | ❌ | ❌ | ❌ | ❌ | ✅ |
| Early features | ❌ | ❌ | ❌ | ❌ | ✅ |

### Search Ranking Boost:
```
L5: rank score × 2.0
L4: rank score × 1.5
L3: rank score × 1.0 (baseline)
L2: rank score × 0.6
L1: rank score × 0.3
```

### Wallet Limits:

| Level | Daily Withdrawal | Commission |
|-------|-----------------|------------|
| L1 | £0 (blocked) | N/A |
| L2 | £100 | 15% |
| L3 | £500 | 12% |
| L4 | £2,000 | 10% |
| L5 | £10,000 | 7% |

---

## 6. AUTO-UPDATE TRIGGERS — KAB RECALCULATE HO

STL score automatically recalculate hona chahiye jab yeh events hain:

### Trigger 1: PSS Phase Complete
```
Event: PSS verification phase completed
Action: recalcUserStl({ userId, reason: "PSS_PHASE_COMPLETED" })
Where: app/api/pss/[...]/route.ts — after phase update
```

### Trigger 2: CRB Certificate Issued
```
Event: CRB certificate status → ACTIVE
Action: recalcUserStl + recalcServiceStl (if linked)
Where: app/api/crb/certificate/route.ts — after certificate creation
Reason: "CRB_CERTIFICATE_ISSUED"
```

### Trigger 3: Order Delivered
```
Event: Order status → DELIVERED
Action: recalcUserStl (sellerId) + recalcProductStl (productId)
Where: app/api/marketplace/orders/route.ts — after delivery confirmation
Reason: "ORDER_DELIVERED"
```

### Trigger 4: Review Submitted
```
Event: Customer review submitted
Action: recalcUserStl (targetId) + recalcServiceStl / recalcProductStl
Where: app/api/marketplace/reviews/route.ts — after review save
Reason: "REVIEW_SUBMITTED"
```

### Trigger 5: Industry Verification Approved/Rejected
```
Event: IndustryVerification status changes
Action: recalcUserStl (entityId)
Where: app/api/industry/[slug]/verify/route.ts — after DMO decision
Reason: "INDUSTRY_VERIFICATION_CHANGED"
```

### Trigger 6: Refilling Status Changed
```
Event: Profile stlStatus updated (ACTIVE/WARNING/LIMITED/SUSPENDED)
Action: recalcUserStl (userId)
Where: Refilling cron job / DMO refilling action
Reason: "REFILLING_STATUS_CHANGED"
```

### Trigger 7: Fraud Signal Written
```
Event: New FraudSignal created for entity
Action: recalcUserStl — (already partially done in orchestration.ts)
Reason: "FRAUD_SIGNAL_IMPACT"
```

---

## 7. APPEAL SYSTEM — USER APPEALS

User ko yeh right hona chahiye k agar unka STL score galat lagta hai, woh appeal kar sakein.

### Appeal Flow:
```
User → Submit Appeal Form
  ↓
Appeal record creates (status: PENDING)
  ↓
Notification to DMO admin
  ↓
DMO Admin reviews appeal + evidence
  ↓
  ├── APPROVED → Score manually adjusted OR recalculated
  └── REJECTED → Reason provided to user
  ↓
User notified of decision
  ↓
Audit log created
```

### Appeal Reasons (Dropdown):
- Wrong documents counted
- Fraud signal false positive
- CRB score mismatch
- Refilling status error
- Review count wrong
- Other (with text field)

### Database Model:
```prisma
model STLAppeal {
  id          String   @id @default(auto()) @db.ObjectId
  entityId    String   (userId or serviceId)
  entityType  STLEntityType
  reason      String   (enum: see above)
  description String   (user explanation)
  evidence    Json?    (optional document IDs)
  status      AppealStatus (PENDING/REVIEWING/APPROVED/REJECTED)
  reviewNote  String?  (DMO response)
  reviewedBy  String?  (DMO admin userId)
  reviewedAt  DateTime?
  createdAt   DateTime @default(now())
}

enum AppealStatus {
  PENDING
  REVIEWING
  APPROVED
  REJECTED
}
```

### API Routes:
- `POST /api/stl/appeal` — Submit new appeal
- `GET /api/stl/appeal` — Get user's own appeals
- `GET /api/stl/appeal/[id]` — Appeal details
- `PATCH /api/stl/appeal/[id]` — DMO: approve/reject (ADMIN only)
- `GET /api/dmo/stl/appeals` — DMO: all pending appeals

### UI Pages:
- `/stl/appeal` — User: submit appeal form
- `/stl/appeal/status` — User: see appeal history + status
- `/dmo/stl/appeals` — DMO admin: review + decide

---

## 8. REFILLING SYSTEM — 6-MONTH CYCLE

Har 6 mahine mein user ko re-verification karni hoti hai. Agar miss kare to STL gir jata hai.

### Refilling Lifecycle:

```
Verification Approved
        ↓
  (6 months later - 14 days)
        ↓
  Status: WARNING ← Email + Bell notification
        ↓
  (7 days before expiry)
        ↓
  Status: LIMITED ← SMS/WhatsApp + Dashboard banner
        ↓
  (Expiry date reached)
        ↓
  Status: SUSPENDED ← STL drops severely (-40 refilling component)
        ↓
  User completes refilling
        ↓
  Status: ACTIVE ← STL restored
```

### Grace Period Rules:
- Most industries: 14 days grace
- Healthcare: 7 days grace
- Legal: 30 days grace

### Notification Schedule:
```
Day -14 (14 days before expiry): Email + Bell "Refilling Due Soon"
Day -7  (7 days before):         Email + Bell + SMS "URGENT: Refilling Required"
Day -3  (3 days before):         All channels "Final Warning"
Day 0   (expiry):                All channels "Expired — STL Suspended"
Day +1  (after expiry):          Dashboard banner shown on every login
```

### StlStatus Transitions:
```
ACTIVE    → WARNING   (14 days before expiry)
WARNING   → LIMITED   (7 days before expiry)
LIMITED   → SUSPENDED (expiry reached)
SUSPENDED → ACTIVE    (after successful refilling)
```

### Cron Job:
```
Schedule: Every day at 2:00 AM UTC
Job: Check all Profiles with upcoming expiry
     → Update stlStatus accordingly
     → Trigger STL recalculation
     → Send appropriate notifications
```

---

## 9. WALLET INTEGRATION — COMMISSION + WITHDRAWAL

STL level directly wallet settings affect karega.

### Commission Rate by STL Level:

| STL Level | Score Range | Commission Rate |
|-----------|-------------|-----------------|
| L1 | 0–39 | 15% (max penalty) |
| L2 | 40–59 | 15% |
| L3 | 60–74 | 12% |
| L4 | 75–89 | 10% |
| L5 | 90–100 | 7% |

*Commission deducted from every transaction.*

### Daily Withdrawal Limit by STL Level:

| STL Level | Daily Limit | Weekly Limit |
|-----------|-------------|--------------|
| L1 | £0 (blocked) | £0 |
| L2 | £100 | £500 |
| L3 | £500 | £2,500 |
| L4 | £2,000 | £10,000 |
| L5 | £10,000 | £50,000 |

### Implementation Points:
- Wallet service reads user's current STL level before processing withdrawal
- Commission deducted at transaction time using current STL level
- Level changes take effect at next transaction
- Wallet API route: `GET /api/wallet/limits` returns current limits based on STL

---

## 10. STL VISIBILITY — KAHAN DIKHEGA

User ne confirm kiya: STL 4 jagah dikhana hai.

### 10.1 User Profile Page (`/profile/[userId]`):
```
┌─────────────────────────────────────────┐
│  [Avatar]  Ali Khan                     │
│            Service Provider             │
│                                         │
│  ╔══════════════════════╗              │
│  ║  STL Score: 82       ║              │
│  ║  Level: L4           ║              │
│  ║  🔵 Highly Trusted   ║              │
│  ╚══════════════════════╝              │
│                                         │
│  Breakdown bars (PSS/CRB/Performance...)│
└─────────────────────────────────────────┘
```

### 10.2 Public Trust Card (Search Results):
```
┌─────────────────────────────────────────┐
│  [Photo]  Ali Electric        🔵 L4 82  │
│           Electrician · Lahore          │
│  🛡️PSS  🏛️CRB  ⭐STL HIGH             │
│  ⭐ 4.8 (156 reviews)  ✔️ 320 jobs     │
│  [BOOK NOW]                             │
└─────────────────────────────────────────┘
```

### 10.3 GoSellr Product Listing:
```
┌─────────────────────────────────────────┐
│  [Product Image]                        │
│  Product Name                £299       │
│  Seller: Ali Store  🔵 STL L4 (82)    │
│  ⭐ 4.7  |  234 sold                   │
│  [Add to Cart]                          │
└─────────────────────────────────────────┘
```

### 10.4 DMO Admin Panel (`/dmo/stl`):
- Already built ✅
- Shows ranking table, history log, manual calculator

---

## 11. LEADERBOARD — PUBLIC RANKINGS

Public leaderboard jahan top providers dekhe ja sakein.

### Page: `/stl/leaderboard`

### Filters:
- Industry (IT, Health, Education, Logistics, All)
- Entity Type (Users, Services, Products)
- Location (City, Country)
- Time Period (All time, This month, This week)

### Leaderboard Card (each row):
```
Rank | Photo | Name | Industry | STL Score | Level | Reviews | Badge
  1  | [img] | Ali  | IT       | 97        | L5⭐  | 4.9★   | Elite
  2  | [img] | Sara | Health   | 94        | L5⭐  | 4.8★   | Elite
  3  | [img] | Omar | Logistics| 91        | L5⭐  | 4.7★   | Elite
```

### API Route:
- `GET /api/stl/leaderboard?industry=all&type=USER&limit=100`

---

## 12. NOTIFICATIONS — ALERT SYSTEM

User ne confirm kiya: 4 types chahiye.

### Notification Events + Channels:

| Event | Bell | Email | SMS/WA | Banner |
|-------|------|-------|--------|--------|
| STL Level UP | ✅ | ✅ | ❌ | ❌ |
| STL Level DOWN | ✅ | ✅ | ❌ | ✅ |
| Refilling Due (14 days) | ✅ | ✅ | ❌ | ❌ |
| Refilling Due (7 days) | ✅ | ✅ | ✅ | ✅ |
| STL SUSPENDED | ✅ | ✅ | ✅ | ✅ |
| Appeal Approved | ✅ | ✅ | ❌ | ❌ |
| Appeal Rejected | ✅ | ✅ | ❌ | ❌ |
| STL Frozen (by admin) | ✅ | ✅ | ✅ | ✅ |
| Score milestone hit | ✅ | ✅ | ❌ | ❌ |

### Notification Templates:

**Level UP:**
> 🎉 "Mubarak! Aap ka STL level L3 se L4 (Highly Trusted) ho gaya. Score: 76/100. Ab aap franchise apply kar sakte hain!"

**Refilling Warning:**
> ⚠️ "Aap ki verification 14 din mein expire ho rahi hai. Refilling complete karein warna STL suspended ho jayega."

**SUSPENDED:**
> 🔴 "Aap ka STL suspend ho gaya hai. Reason: Refilling miss. Apni dashboard par ja kar refilling complete karein."

---

## 13. PLATFORM INTEGRATIONS

User ne confirm kiya: GoSellr, JPS, CRB, PSS sab integrate karne hain.

### 13.1 GoSellr Integration:
- **Where:** Product cards, Seller profile, Checkout page
- **Data Shown:** STL score, level badge, level label
- **API Used:** `GET /api/stl/calculate?entityId=xxx&entityType=PRODUCT`
- **Auto-trigger:** Order delivered → recalcProductStl

### 13.2 JPS Integration:
- **Where:** JPS professional profile page
- **Data Shown:** STL score gauge, breakdown summary, level badge
- **API Used:** `GET /api/stl/me` (for own profile) or `GET /api/stl/calculate?entityId=xxx`
- **Badge Shown:** "L4 Highly Trusted" with blue border

### 13.3 CRB Integration:
- **Trigger Point:** When CRBCertificate status → ACTIVE
- **Action:** `recalcUserStl({ userId: applicantId, reason: "CRB_CERTIFICATE_ISSUED" })`
- **Also:** When certificate expires → recalc (CRB component drops)
- **File:** `app/api/crb/` decision route

### 13.4 PSS Integration:
- **Trigger Point:** When PSSVerification phaseCompleted increments
- **Action:** `recalcUserStl({ userId, reason: "PSS_PHASE_COMPLETED" })`
- **File:** `app/api/pss/` phase update route

---

## 14. DMO ADMIN TOOLS

DMO mein STL ke liye yeh admin tools banane hain:

### Tool 1: Manual Score Override
- **Page:** `/dmo/stl/override`
- **Function:** Admin kisi bhi entity ka STL manually +/- points adjust kare
- **Fields:** entityId, entityType, adjustment (+/-), reason, note
- **Audit:** Har override audit log mein record ho

### Tool 2: Bulk Recalculate
- **Page:** `/dmo/stl` (button on existing page)
- **Function:** Ek click mein selected entity type ke sab scores recalculate
- **Options:** All USERs / All SERVICEs / All PRODUCTs / Specific batch
- **Progress:** Show progress bar while running

### Tool 3: STL Freeze
- **Page:** `/dmo/stl/freeze`
- **Function:** Kisi user ka STL temporarily freeze karo (investigation ke liye)
- **Effect:** Score nahi badhega ya girega jab tak unfreeze na ho
- **Note:** User ko notification milegi

### Tool 4: Score Audit Trail
- **Page:** `/dmo/stl/audit`
- **Function:** Kisi bhi entity ka poora score change history
- **Filters:** Entity ID, date range, reason, actor
- **Shows:** Previous score → New score, reason, who triggered, timestamp

### Tool 5: Appeal Review Center
- **Page:** `/dmo/stl/appeals`
- **Function:** Pending appeals review karein, approve/reject karein
- **Shows:** User info, current score, claimed issue, evidence

---

## 15. HISTORY RETENTION POLICY

User ne confirm kiya: **Permanent** — sab records hamesha store rahein.

### Implementation:
- STLLog model: No deletion, no archival
- STLScore model: Always updated in-place (history in logs)
- Appeals: Permanent record
- All indexes on `createdAt` for performance
- MongoDB TTL indexes: None (permanent)

---

## 16. DATABASE SCHEMA PLAN

### New Models to Add:

```prisma
// STL Appeal System
model STLAppeal {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  entityId    String        @map("entity_id")
  entityType  STLEntityType @map("entity_type")
  reason      AppealReason  @map("reason")
  description String        @map("description")
  evidence    Json?         @map("evidence")
  status      AppealStatus  @default(PENDING) @map("status")
  reviewNote  String?       @map("review_note")
  reviewedBy  String?       @map("reviewed_by") @db.ObjectId
  reviewedAt  DateTime?     @map("reviewed_at")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@index([entityId, entityType])
  @@index([status])
  @@index([createdAt])
  @@map("stl_appeals")
}

// STL Freeze (Admin tool)
model STLFreeze {
  id         String        @id @default(auto()) @map("_id") @db.ObjectId
  entityId   String        @map("entity_id")
  entityType STLEntityType @map("entity_type")
  reason     String        @map("reason")
  frozenBy   String        @map("frozen_by") @db.ObjectId
  frozenAt   DateTime      @default(now()) @map("frozen_at")
  unfrozenBy String?       @map("unfrozen_by") @db.ObjectId
  unfrozenAt DateTime?     @map("unfrozen_at")
  isActive   Boolean       @default(true) @map("is_active")

  @@unique([entityId, entityType, isActive])
  @@index([entityId])
  @@map("stl_freezes")
}

// STL Manual Override Log
model STLOverride {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  entityId    String        @map("entity_id")
  entityType  STLEntityType @map("entity_type")
  adjustment  Float         @map("adjustment")  // +/- points
  scoreBefore Float         @map("score_before")
  scoreAfter  Float         @map("score_after")
  reason      String        @map("reason")
  note        String?       @map("note")
  actorId     String        @map("actor_id") @db.ObjectId
  createdAt   DateTime      @default(now()) @map("created_at")

  @@index([entityId])
  @@index([createdAt])
  @@map("stl_overrides")
}

// New Enums
enum AppealReason {
  WRONG_DOCUMENTS
  FALSE_FRAUD_SIGNAL
  CRB_SCORE_MISMATCH
  REFILLING_STATUS_ERROR
  REVIEW_COUNT_WRONG
  OTHER
}

enum AppealStatus {
  PENDING
  REVIEWING
  APPROVED
  REJECTED
}
```

### Existing Models (Already in Schema):
- `STLScore` ✅ (entityId, entityType, score, level, breakdown)
- `STLLog` ✅ (entityId, entityType, change, reason, metadata)
- `Profile.stlStatus` ✅ (ACTIVE/WARNING/LIMITED/SUSPENDED/DOWNGRADED)
- `Profile.stlScore` ✅
- `IndustryVerification` ✅ (for industry boost)

---

## 17. API ROUTES PLAN

### Already Built ✅:
- `GET/POST /api/stl/calculate` — Score calculation + all scores
- `GET /api/stl/me` — Current user's STL

### To Build ❌:

#### Appeal APIs:
- `POST /api/stl/appeal` — Submit appeal
- `GET /api/stl/appeal` — User's own appeals
- `PATCH /api/stl/appeal/[id]` — DMO: decide (ADMIN only)
- `GET /api/dmo/stl/appeals` — All pending appeals (DMO admin)

#### Leaderboard API:
- `GET /api/stl/leaderboard` — Public rankings
  - Query: `?industry=all&type=USER&limit=100&location=uk`

#### Admin Tools APIs:
- `POST /api/dmo/stl/override` — Manual score adjustment (ADMIN)
- `POST /api/dmo/stl/bulk-recalc` — Bulk recalculate all (ADMIN)
- `POST /api/dmo/stl/freeze` — Freeze entity STL (ADMIN)
- `DELETE /api/dmo/stl/freeze/[id]` — Unfreeze STL (ADMIN)
- `GET /api/dmo/stl/audit` — Score audit trail (ADMIN)

#### Event Hooks (wiring existing recalc):
- Wire into: `app/api/pss/` — after phase complete
- Wire into: `app/api/crb/` — after certificate issued
- Wire into: `app/api/marketplace/orders/` — after delivered
- Wire into: `app/api/marketplace/reviews/` — after review submit

#### Wallet Integration:
- `GET /api/wallet/stl-limits` — Get limits based on current STL
- Wire wallet withdrawal route to check STL level first

#### Notification Triggers:
- Notify on: STL level change, refilling warning, suspension, appeal decision

---

## 18. UI PAGES PLAN

### Already Built ✅:
- `/dmo/stl` — DMO dashboard (scores, history, manual calc)
- `StlWidget.tsx` — Reusable score widget

### To Build ❌:

#### User-Facing Pages:

| Page | Route | Description |
|------|-------|-------------|
| User STL Dashboard | `/dashboard/stl` | Personal STL score, breakdown, history, improvement tips |
| Submit Appeal | `/stl/appeal` | Form to submit STL score appeal |
| Appeal Status | `/stl/appeal/status` | User's own appeals + status |
| Public Leaderboard | `/stl/leaderboard` | Top 100 providers by STL |

#### Component Updates:

| Component | Where Used | What to Add |
|-----------|-----------|-------------|
| User Profile page | `/profile/[userId]` | STL score badge + level |
| GoSellr product card | Search results | Seller STL badge |
| JPS profile | `/jps/[userId]` | STL gauge widget |
| Search results | GoSellr + Services | STL badge on each result |

#### DMO Admin Pages:

| Page | Route | Description |
|------|-------|-------------|
| Manual Override | `/dmo/stl/override` | Adjust score with reason |
| Bulk Recalculate | `/dmo/stl` (button) | Already exists — add button |
| STL Freeze Tool | `/dmo/stl/freeze` | Freeze/unfreeze entities |
| Score Audit Trail | `/dmo/stl/audit` | Full history viewer |
| Appeal Review | `/dmo/stl/appeals` | Review + decide user appeals |

---

## 19. DEVELOPMENT PHASES — STEP BY STEP

Development sirf jab user permission de, tab start hogi.

### Phase STL-1: Auto-Update Triggers Wiring
*Estimated: ~4 files*
- Wire PSS → STL recalc
- Wire CRB → STL recalc
- Wire Order delivery → STL recalc
- Wire Review submit → STL recalc
- **No new pages needed, just wiring existing functions**

### Phase STL-2: Database Schema Extension
*Estimated: 1 schema file + migration*
- Add STLAppeal model
- Add STLFreeze model
- Add STLOverride model
- Add AppealReason, AppealStatus enums
- Run `npx prisma generate`

### Phase STL-3: Appeal System — Backend
*Estimated: ~4 API files*
- `POST /api/stl/appeal` — Submit appeal
- `GET /api/stl/appeal` — User's appeals
- `PATCH /api/stl/appeal/[id]` — DMO decision
- `GET /api/dmo/stl/appeals` — DMO view

### Phase STL-4: Appeal System — Frontend
*Estimated: ~3 pages*
- `/stl/appeal` — Submit form
- `/stl/appeal/status` — Status page
- `/dmo/stl/appeals` — DMO review center

### Phase STL-5: DMO Admin Tools
*Estimated: ~5 API files + 3 pages*
- Manual override API + page
- Bulk recalculate API + button
- STL freeze API + page
- Audit trail API + page

### Phase STL-6: STL Visibility in Platform
*Estimated: ~6 component updates*
- User Profile page — add STL badge
- GoSellr product card — add seller STL
- JPS profile — add STL widget
- Search results — add STL badge to each result
- Public leaderboard API + page

### Phase STL-7: Wallet Integration
*Estimated: ~3 files*
- `GET /api/wallet/stl-limits` — Return limits by STL
- Wire withdrawal route — check STL level
- Wire commission deduction — use STL rate

### Phase STL-8: Notifications
*Estimated: ~4 files*
- Notification templates for all STL events
- Bell notification triggers
- Email notification templates
- Refilling cron job scheduler

### Phase STL-9: Leaderboard
*Estimated: ~2 files*
- `GET /api/stl/leaderboard` — API
- `/stl/leaderboard` — Public page

### Phase STL-10: Testing + QA
- Test all auto-triggers
- Test appeal flow end-to-end
- Test wallet limits by STL level
- Test notification delivery
- Performance: ensure STL calc < 200ms

---

## 20. COMPLETE FILE STRUCTURE

```
EHB landing-2026/
│
├── prisma/
│   └── schema.prisma
│       └── ADD: STLAppeal, STLFreeze, STLOverride models
│
├── lib/
│   └── stl/
│       ├── engine.ts              ✅ DONE (core scoring)
│       ├── triggers.ts            ❌ BUILD (event trigger hooks)
│       ├── appeal.ts              ❌ BUILD (appeal logic)
│       ├── freeze.ts              ❌ BUILD (freeze logic)
│       ├── override.ts            ❌ BUILD (manual override logic)
│       ├── leaderboard.ts         ❌ BUILD (ranking query)
│       └── walletLimits.ts        ❌ BUILD (STL → wallet mapping)
│
├── app/
│   ├── api/
│   │   └── stl/
│   │       ├── calculate/route.ts ✅ DONE
│   │       ├── me/route.ts        ✅ DONE
│   │       ├── appeal/
│   │       │   ├── route.ts       ❌ BUILD (POST submit, GET user's)
│   │       │   └── [id]/route.ts  ❌ BUILD (PATCH DMO decision)
│   │       └── leaderboard/
│   │           └── route.ts       ❌ BUILD
│   │
│   │   └── dmo/stl/
│   │       ├── appeals/route.ts   ❌ BUILD
│   │       ├── override/route.ts  ❌ BUILD
│   │       ├── bulk-recalc/route.ts ❌ BUILD
│   │       ├── freeze/route.ts    ❌ BUILD
│   │       └── audit/route.ts     ❌ BUILD
│   │
│   │   └── wallet/
│   │       └── stl-limits/route.ts ❌ BUILD
│   │
│   ├── stl/
│   │   ├── appeal/page.tsx        ❌ BUILD (submit form)
│   │   ├── appeal/status/page.tsx ❌ BUILD (status view)
│   │   └── leaderboard/page.tsx   ❌ BUILD
│   │
│   └── dmo/stl/
│       ├── page.tsx               ✅ DONE (ranking + history)
│       ├── appeals/page.tsx       ❌ BUILD
│       ├── override/page.tsx      ❌ BUILD
│       ├── freeze/page.tsx        ❌ BUILD
│       └── audit/page.tsx         ❌ BUILD
│
└── components/
    └── stl/
        ├── StlWidget.tsx          ✅ DONE (breakdown bars)
        ├── StlBadge.tsx           ❌ BUILD (small badge for cards)
        ├── StlLeaderboardCard.tsx ❌ BUILD (leaderboard row)
        └── StlAppealForm.tsx      ❌ BUILD (appeal form)
```

---

## SUMMARY TABLE — KYA BAAKI HAI

| Phase | Items | Priority |
|-------|-------|----------|
| STL-1: Auto-trigger wiring | 4 files | HIGH |
| STL-2: Schema extension | 1 file | HIGH |
| STL-3: Appeal backend | 4 files | HIGH |
| STL-4: Appeal frontend | 3 pages | HIGH |
| STL-5: DMO admin tools | 8 files | MEDIUM |
| STL-6: Platform visibility | 6 updates | HIGH |
| STL-7: Wallet integration | 3 files | MEDIUM |
| STL-8: Notifications | 4 files | MEDIUM |
| STL-9: Leaderboard | 2 files | LOW |
| STL-10: QA + Testing | — | HIGH |
| **TOTAL** | **~35 files** | — |

---

*Document Created: April 2026*
*Status: PLANNING COMPLETE — Awaiting development approval*
*Next Step: User confirmation → Begin Phase STL-1*
