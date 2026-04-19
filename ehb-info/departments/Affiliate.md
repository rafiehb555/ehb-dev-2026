# Affiliate — EHB Referral & Growth Engine

**Status:** Canonical spec (v2.0) · 2026-04-19  
**Related:** `Wallet.md` · `Finance.md` · `DMO.md` · `Commission.md`

---

## 1. Purpose

The Affiliate system turns users into growth engines. Anyone can refer new users to EHB and earn commissions across three proven sources: **Product Sales (category-based %)**, **Multi-level Referral Network (5% → 3% → 2%)**, and **Franchise Sales (30% of sale price)**. Enables scalable network building with fraud prevention through DMO oversight and STL-based earning tiers.

## 2. Core Components

### 2.1 Referral Code Generation
- **Unique code per user** — auto-generated at signup (alphanumeric, 8–12 chars)
- **Shareable link** — `https://ehb.io/ref/{referral_code}`
- **User tracking** — system records referrer → referred user mapping
- **Link expiry** — none (permanent, unless user flagged for abuse)
- **QR code** — shareable per-user QR code for easy mobile referral

### 2.2 3-Source Commission Engine

The affiliate system earns through **three independent, non-exclusive** commission sources:

#### Source 1: Product Commission (Category-Based)

Affiliate earns a percentage of product sales referred via their network. Rates vary by category:

| Category | Commission % |
|---|---|
| **Electronics** | 3–5% |
| **Fashion** | 8–12% |
| **Health & Wellness** | 6–10% |
| **Food & Beverages** | 2–4% |
| **Services & Professional** | 5–8% |
| **Education & Learning** | 8–15% |

**Trigger:** Referred user purchases product → commission credited upon order fulfillment  
**Frequency:** Per transaction  
**Duration:** Applies only to referred user's first purchase in each category (no recurring)

#### Source 2: Referral Commission (Multi-Level)

Affiliate earns a decreasing percentage of each transaction made by referred users (up to 3 levels deep):

| Level | Commission % | Status |
|---|---|---|
| **L1 (Direct referral)** | 5% | **LOCKED** |
| **L2 (Referral's referral)** | 3% | **LOCKED** |
| **L3 (Referral's referral's referral)** | 2% | **LOCKED** |

**Trigger:** Any qualifying transaction (purchase, service, franchise sale) by referred user or their network  
**Frequency:** Per transaction  
**Cap:** Depth limited to 3 levels (L4+ do not earn)

#### Source 3: Franchise Sale Commission

Affiliate earns a substantial commission when a referred user joins the Franchise system:

| Commission Type | Rate | Status |
|---|---|---|
| **Franchise Sale Commission** | 30% of franchise sale price | **LOCKED** |

**Trigger:** Referred user completes franchise purchase (OF1–OF4 tiers)  
**Frequency:** One-time per franchise sale  
**Notes:** 30% is paid to the entire affiliate network of the referrer, not just the referrer alone. Applies at any STL level (see §5 for STL multipliers).

### 2.3 Multi-Level Structure

Referrals organized in 3-level pyramid:
- **Level 1 (Direct)** — users you directly referred (earn 5% referral commission + product commission)
- **Level 2** — users referred by your L1 referrals (earn 3% referral commission)
- **Level 3** — users referred by your L2 referrals (earn 2% referral commission)
- **Depth cap** — exactly 3 levels (L4+ earn zero)
- **All sources stack** — earn product + referral + franchise commissions simultaneously from the same referred user

### 2.4 Data Model

```json
{
  "_id": "ObjectId",
  "user_id": "string (unique)",
  "referral_code": "string (unique, 8-12 alphanumeric)",
  "referred_by": "string (parent user_id) or null",
  "referrals": [
    {
      "user_id": "string",
      "joined_at": "timestamp",
      "verification_status": "pending|verified|banned",
      "level": 1
    }
  ],
  "earnings": {
    "product_commission": {
      "total": 0,
      "by_category": {
        "electronics": 0,
        "fashion": 0,
        "health": 0,
        "food": 0,
        "services": 0,
        "education": 0
      },
      "pending_approval": 0
    },
    "referral_commission": {
      "total": 0,
      "by_level": {
        "l1": 0,
        "l2": 0,
        "l3": 0
      },
      "pending_approval": 0
    },
    "franchise_commission": {
      "total": 0,
      "pending_approval": 0
    },
    "total_all_sources": 0
  },
  "stats": {
    "total_referrals": 0,
    "verified_referrals": 0,
    "banned_referrals": 0,
    "l1_count": 0,
    "l2_count": 0,
    "l3_count": 0,
    "avg_referral_order_value": 0,
    "franchise_referrals": 0
  },
  "settings": {
    "affiliate_enabled": true,
    "auto_withdraw": false,
    "bank_account": "optional",
    "payout_preference": "wallet|bank"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 3. Referral Flow

1. **User signs up**
   - Affiliate account auto-created, unique code assigned
   - User sees referral dashboard with shareable link + QR code

2. **User shares link**
   - Sends link to friends/networks
   - Link tracked in session/attribution cookies (30-day window)

3. **New user signs up via referral link**
   - System detects referral_code in URL
   - Creates link: new_user → existing_user (becomes L1)

4. **New user verifies PSS**
   - Status changes to "verified" in referral list
   - Affiliate account now eligible for commissions

5. **On qualifying transaction (purchase/service/franchise)**
   - **Product Commission** calculated (% of product sale, category-dependent)
   - **Referral Commission** calculated (5% L1 / 3% L2 / 2% L3)
   - **Franchise Commission** calculated (30% if franchise sale)
   - All commissions applied, adjusted for referrer STL (see §5)
   - Credits to referrer wallet + multi-level cascade (L2/L3 also earn)

6. **Commission settlement & withdrawal**
   - Daily commission accrual to pending balance
   - 30-day DMO approval hold before moving to "available"
   - User can request withdrawal to wallet or bank account
   - Withdrawal settles within 5–7 business days

## 4. Attribution Model

**Default Model:** Last Click Wins

- **Cookie duration:** 30 days
- **Scope:** User's first purchase in each category (product commission)
- **Referral commission:** Tied to initial signup referral, permanent (no expiry)
- **Admin override:** Yes — DMO can manually assign/reassign affiliate credit if disputed

**Multi-Device & Cross-Domain:**
- Affiliate link must be followed in same session (same device)
- If user clears cookies before purchase, referral is lost
- Cross-device tracking: future phase (requires SSO or account linking)

## 5. STL Impact on Affiliate Earnings

**Affiliate earns full commission only at L3+ STL. Lower STL tiers earn reduced percentages:**

| Referrer STL | Product Commission | Referral Commission | Franchise Commission |
|---|---|---|---|
| **L1–L2 (FREE/BASIC)** | 50% of rate | 50% of rate | Not eligible |
| **L3–L4 (NORMAL/STANDARD)** | 75% of rate | 75% of rate | Eligible |
| **L5–L6 (ADVANCED/HIGH)** | 100% of rate | 100% of rate | Eligible + 5% bonus |
| **L7–L10 (PRO/VIP/ELITE/SUPREME)** | 100% + 10% STL bonus | 100% + 10% STL bonus | Eligible + 10% bonus |

**Examples:**

- **L1 user** selling Fashion (8% base): earns 4% (50% of 8%)
- **L4 user** selling Electronics (4% base): earns 3% (75% of 4%)
- **L7 user** selling Electronics (4% base): earns 4.4% (100% of 4% + 10% bonus = 4% × 1.10)
- **L1 user** with 1 L1 referral earning: gets 2.5% (5% × 50%)
- **L5 user** with 1 L2 referral earning: gets 3.15% (3% × 100% + 5% bonus multiplier = 3% × 1.05)

**Minimum STL to earn:**
- **Product Commission:** L1+ can earn (reduced at L1–L2)
- **Referral Commission:** L1+ can earn (reduced at L1–L2)
- **Franchise Commission:** L3+ only (L1–L2 not eligible)
- **STL bonus:** L7+ only

**Earnings freeze at L0:** If referrer drops to L0 → affiliate account freezes pending STL restoration. Pending earnings are held, not clawed back.

## 6. Affiliate Dashboard (11 Sections)

The affiliate dashboard provides end-to-end visibility into referral network, earnings, and growth. All data updates daily at midnight UTC.

### 6.1 Dashboard (Overview)
- **Key stats:** Total earnings (all sources), today's earnings, pending approval, available balance
- **Network snapshot:** Total L1 referrals, total L2/L3 indirect, active referrals this month
- **STL impact:** Current STL level, commission rate multiplier, next upgrade threshold
- **Charts:** 30-day earnings trend (stacked by source), referral growth timeline
- **Quick actions:** Share link, withdraw, manage settings

### 6.2 Earnings
- **Summary cards:** Total earned (all-time), pending (30-day hold), available (withdrawable)
- **Breakdown by source:**
  - Product Commission: total, breakdown by category (Electronics, Fashion, Health, Food, Services, Education)
  - Referral Commission: total, breakdown by level (L1/L2/L3)
  - Franchise Commission: total, count of franchise referrals
- **Withdrawal history:** List of past withdrawals (date, amount, status, destination)
- **Pending approval:** Detailed list of earnings in 30-day hold (when approved, when available)

### 6.3 Referral Network
- **Tree view:** Hierarchical display of L1 → L2 → L3 referrals
- **Per-node data:** User name, join date, STL level, verification status, earnings generated (to referrer)
- **Search & filter:** Filter by level, status (verified/pending), join date range
- **Bulk actions:** Pause notifications for user, flag for review (DMO), export as CSV

### 6.4 Products
- **Browsable product catalog:** All products available for affiliate promotion
- **Commission rates:** Display category commission % for each product
- **Shareable links:** Generate unique tracking link per product + copy-to-clipboard
- **Promotional assets:** Download product banners, social media thumbnails, email templates
- **Top products:** Show top 10 by category (by earnings, conversion rate)

### 6.5 Analytics
- **Click tracking:** Total clicks on referral links, clicks per link, unique visitors
- **Conversion rates:** % of clicks → signup, % of signups → verified, % of verified → purchase
- **Product breakdown:** Top products by clicks, conversions, revenue
- **Geographic breakdown:** Referral signups by country/region (if available)
- **Time trends:** Daily/weekly/monthly earning patterns, seasonality

### 6.6 Network Growth
- **Growth chart:** 30/60/90-day referral count growth (L1, L2, L3)
- **New referrals timeline:** Daily new referral signups (stacked by level)
- **Network health score:** Metric (0–100) based on active referrals, verification %, churn
- **Churn tracking:** % of referrals inactive 30+ days, % banned for abuse
- **Milestone badges:** Rewards for hitting referral count milestones (10, 50, 100, 500 referrals)

### 6.7 Wallet
- **Account balance:** Total balance, pending (30-day hold), available (withdrawable)
- **Transaction history:** All deposits/withdrawals, status, dates
- **Withdrawal UI:** 
  - Enter amount (min PKR 500)
  - Select destination (wallet or bank account)
  - View estimated delivery time (5–7 business days for bank)
  - Confirm and submit
- **Bank account management:** Add/remove bank account, set default account

### 6.8 Campaigns
- **Campaign builder:** Create custom shareable links with tracking codes
  - Campaign name, description, target audience
  - Auto-generated tracking code (e.g., `ref_CODE_CAMPAIGN_001`)
  - Preview link + copy-to-clipboard
- **Campaign performance:** Click count, signup count, conversion rate, revenue generated per campaign
- **A/B testing:** Create two variant links, compare performance side-by-side
- **Campaign history:** Past campaigns, archive, re-activate

### 6.9 STL Impact
- **Current STL level:** Display with icon/badge, current multiplier (50% / 75% / 100% / 100%+bonus)
- **Earning rates by STL:** Table showing how commissions scale at each STL tier
- **STL upgrade path:** Next STL level, what's required (score, verification, activity), ETA
- **Bonus display:** Current STL bonus %, projected annual bonus earnings at each level
- **Action:** "Upgrade STL" button linking to STL improvement journey

### 6.10 Notifications
- **New referral alerts:** "User X joined via your link" (real-time)
- **Commission earned:** "You earned PKR 5,000 from referral commission" (daily digest)
- **Payout completed:** "Withdrawal of PKR 10,000 sent to your account" (transactional)
- **System updates:** Feature announcements, maintenance, policy changes (low-volume)
- **Notification settings:** Toggle each category, email vs in-app, frequency

### 6.11 Settings
- **Payout preferences:** Select default destination (wallet or bank), bank account auto-select
- **Notification configuration:** Email frequency, in-app notifications, SMS opt-in
- **Referral code customization:** View/regenerate referral code, custom vanity code (if enabled)
- **Profile:** Affiliate status, join date, total referrals, account restrictions (if any)
- **API keys:** Generate API key for programmatic access to affiliate data (optional, for advanced users)

## 7. Franchise Integration

Affiliates can earn substantial commissions by referring users to the Franchise system. Franchise tiers determine what affiliate actions are available:

| Franchise Tier | Affiliate Capabilities |
|---|---|
| **OF1 (Online Franchisee Starter)** | Can earn referral + product commission only. Cannot earn franchise commission. Cannot sell franchises. |
| **OF2 (Online Franchisee Standard)** | Can earn referral + product commission. Can earn franchise commission on referred franchise sales. Can refer other users to OF1/OF2. |
| **OF3 (Online Franchisee Professional)** | All OF2 rights. Higher product commission rates (bonus %). Can refer others to OF1–OF3. |
| **OF4 (Franchise Master)** | Full affiliate selling capability. Highest product rates. Can sell franchises directly (both OF1–OF4). Can build and manage franchisee network. |

**Commission on Franchise Sales:** When an affiliate (any OF tier) refers a user to the franchise system:
- Referrer earns 30% of franchise sale price (locked, unmodifiable)
- Commissions apply after STL multipliers (see §5)
- Example: L5 user refers L1 user to OF2 franchise (PKR 500,000) → earns PKR 150,000 × 100% = PKR 150,000 + 5% STL bonus = PKR 157,500

## 8. Anti-Abuse Rules

**DMO Up-Guard detects and blocks:**
- **Self-referral** — user cannot refer own account (detected via email/phone/IP)
- **Circular referrals** — A refers B, B refers A (network analysis)
- **Burst signups** — 50+ accounts from 1 IP in 24 hours → freeze all
- **Fake orders** — orders between referrer & referred user on same IP flagged
- **Account farming** — user creating 100+ fake accounts to trigger bonuses → instant ban
- **Inactive referrals** — if referred user has no activity 30 days → referral downgraded to "inactive" (earnings still apply, but flagged for review)
- **Duplicate referrals** — same user referred via multiple links (system picks first as canonical)
- **Bot-like behavior** — suspicious automation in link sharing, rapid clicks from same IP

**Penalties:**
- **First violation:** Warning + earnings held for 30 days (not clawed back, just delayed)
- **Second violation:** 50% of pending earnings clawed back, affiliate account warned
- **Third violation:** Affiliate account banned, all pending + available earnings forfeit, referral network reassigned to direct upstream affiliate

## 9. API Endpoints

### POST /affiliate/register
Generate/retrieve referral code for authenticated user

**Request:**
```json
{
  "user_id": "string (auto from JWT)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "referral_code": "ABC12XYZ9",
    "referral_url": "https://ehb.io/ref/ABC12XYZ9",
    "qr_code_url": "https://api.ehb.io/qr/ABC12XYZ9.png"
  }
}
```

### GET /affiliate/network/:user_id
View referral tree and stats (hierarchical, up to L3)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": "user_123",
    "referral_code": "ABC12XYZ9",
    "total_referrals": 42,
    "verified_referrals": 38,
    "network_depth": 3,
    "by_level": {
      "l1": { "count": 10, "verified": 9, "earnings_generated": 50000 },
      "l2": { "count": 25, "verified": 24, "earnings_generated": 35000 },
      "l3": { "count": 7, "verified": 5, "earnings_generated": 8000 }
    },
    "tree": [
      {
        "level": 1,
        "user_id": "ref_user_001",
        "name": "Ahmed Khan",
        "joined_at": "2026-04-10T08:30:00Z",
        "verification_status": "verified",
        "stl_level": 4,
        "earnings_generated": 15000,
        "children_count": 5
      }
    ]
  }
}
```

### GET /affiliate/earnings/:user_id
View commission earnings breakdown by source

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "earnings": {
      "product_commission": {
        "total": 45000,
        "by_category": {
          "electronics": 8000,
          "fashion": 18000,
          "health": 12000,
          "food": 3000,
          "services": 4000,
          "education": 0
        },
        "pending_approval": 2000
      },
      "referral_commission": {
        "total": 35000,
        "by_level": {
          "l1": 25000,
          "l2": 8000,
          "l3": 2000
        },
        "pending_approval": 1500
      },
      "franchise_commission": {
        "total": 20000,
        "count": 2,
        "pending_approval": 0
      },
      "total_all_sources": 100000
    },
    "withdrawn": 50000,
    "available": 46500,
    "pending_30_day_hold": 3500,
    "stl_multiplier": 1.0,
    "stl_level": "L5"
  }
}
```

### POST /affiliate/withdraw
Withdraw affiliate earnings to wallet or bank

**Request:**
```json
{
  "user_id": "string (auto from JWT)",
  "amount": 10000,
  "destination": "wallet|bank",
  "bank_account_id": "optional (required if destination=bank)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "withdrawal_id": "aff_w_001",
    "amount": 10000,
    "destination": "wallet",
    "status": "pending",
    "created_at": "2026-04-19T12:00:00Z",
    "estimated_completion": "2026-04-24T23:59:59Z"
  }
}
```

### GET /affiliate/dashboard/:user_id
Fetch all dashboard data (aggregated, for UI rendering)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "total_earnings": 100000,
      "today_earnings": 1500,
      "pending_approval": 3500,
      "available_balance": 46500,
      "total_referrals": 42,
      "active_referrals_this_month": 5,
      "stl_level": "L5",
      "commission_multiplier": 1.0
    },
    "earnings_30day": [
      { "date": "2026-04-18", "product": 500, "referral": 800, "franchise": 0 },
      { "date": "2026-04-19", "product": 700, "referral": 800, "franchise": 0 }
    ],
    "referral_growth": [
      { "date": "2026-04-10", "l1": 8, "l2": 20, "l3": 5 },
      { "date": "2026-04-19", "l1": 10, "l2": 25, "l3": 7 }
    ],
    "top_products": [
      { "name": "Wireless Headphones", "category": "electronics", "commissions": 8000 },
      { "name": "Winter Jacket", "category": "fashion", "commissions": 18000 }
    ]
  }
}
```

### POST /affiliate/campaign
Create a new tracked campaign

**Request:**
```json
{
  "user_id": "string (auto from JWT)",
  "campaign_name": "Summer Fashion Promotion",
  "description": "Sharing fashion products with friends",
  "target_audience": "friends"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "campaign_id": "camp_001",
    "tracking_code": "ref_ABC_SUMMER_001",
    "campaign_url": "https://ehb.io/ref/ABC12XYZ9?campaign=ref_ABC_SUMMER_001",
    "created_at": "2026-04-19T12:30:00Z"
  }
}
```

## 10. Anti-Fraud & Compliance

**Real-time monitoring:**
- Suspicious click patterns (10,000+ clicks/day from single IP → flag)
- Referral validity checks (signup must occur within 30 days of click)
- Commission reversal: If referred user refunds purchase within 90 days → commission clawed back
- STL impact: Fraud detection feeds into DMO STL calculation (potential downgrade)

**Regulatory:**
- Affiliate earnings are taxable income — user responsible for reporting
- Affiliates must comply with local advertising/disclosure laws (e.g., FTC "affiliate" disclosures)
- EHB does not withhold tax; user must file separately

## 11. Open Questions (Fully Resolved in v2.0)

1. ~~**Exact commission percentages**~~ **RESOLVED:** 3-source engine (Product: category %, Referral: 5%/3%/2%, Franchise: 30%)
2. ~~**Maximum referral depth**~~ **RESOLVED:** Exactly 3 levels (L1/L2/L3)
3. **Minimum qualifying action** — purchase value threshold to earn (suggest min PKR 300)?
4. ~~**Affiliate payout frequency**~~ **RESOLVED:** Daily accrual, 30-day hold, then withdrawable on-demand
5. **Pool bonus algorithm** — still TBD for future phases (not in v2.0; reserved for Phase 14)
6. ~~**Referrer STL requirement**~~ **RESOLVED:** L1+ can earn (reduced), L3+ earn full, L7+ earn bonus
7. ~~**Withdrawal hold period**~~ **RESOLVED:** 30 days (standard)
8. **Geographic restrictions** — Pakistan-only initially, or multi-country from launch?
9. ~~**Franchise override**~~ **RESOLVED:** Affiliates OF2+ can earn franchise commission (30%)
10. ~~**Mobile app referral**~~ **RESOLVED:** QR code in dashboard, deep linking in roadmap

---

## Changelog

| Date | Ver | Change |
|---|---|---|
| 2026-04-19 | 2.0 | Major update: 3-source commission engine (Product category %, Referral 5%/3%/2%, Franchise 30%). 11-section dashboard spec (Dashboard, Earnings, Referral Network, Products, Analytics, Network Growth, Wallet, Campaigns, STL Impact, Notifications, Settings). Attribution model confirmed (Last Click Wins, 30-day cookie). STL impact updated to 10-level system (L1–L2: 50%, L3–L4: 75%, L5–L6: 100% + 5% bonus, L7–L10: 100% + 10% bonus). Franchise tier integration (OF1–OF4 capabilities). Anti-fraud monitoring with real-time checks & reversal policies. Multiple open questions resolved; 3 remain for Phase 14. |
| 2026-04-18 | 1.0 | Complete canonical spec: 5 commission types, multi-level structure, STL-gated earning (L1 FREE → L5 ADVANCED), anti-abuse rules (DMO Up-Guard), 4 API endpoints, data model, referral flow, 10 open questions. Ready for Phase 13 implementation. |

---

*EHB Technologies (Pvt.) Ltd. · Affiliate Department v2.0 · 2026-04-19*
