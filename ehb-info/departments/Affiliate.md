# Affiliate — EHB Referral & Growth Engine

**Status:** Canonical spec (v1.0) · 2026-04-18  
**Related:** `Wallet.md` · `Finance.md` · `DMO.md`

---

## 1. Purpose

The Affiliate system turns users into growth engines. Anyone can refer new users to EHB and earn commissions — both one-time bonuses and recurring percentages of referred user activity. Enables multi-level network building with fraud prevention through DMO oversight.

## 2. Core Components

### 2.1 Referral Code Generation
- **Unique code per user** — auto-generated at signup (alphanumeric, 8–12 chars)
- **Shareable link** — `https://ehb.io/ref/{referral_code}`
- **User tracking** — system records referrer → referred user mapping
- **Link expiry** — none (permanent, unless user flagged for abuse)

### 2.2 Commission System

Five commission types drive growth:

| Type | Trigger | Payout | Frequency |
|------|---------|--------|-----------|
| **Direct Bonus** | Referred user verifies PSS (L1+) | Fixed amount (TBD) | One-time |
| **Level Bonus** | Referred user completes purchase/service | % of sale (TBD per level) | Per transaction |
| **Auto Pool Bonus** | User in referral network earns | Share of daily/monthly pool | Periodic (weekly) |
| **Franchise Bonus** | Referred user in franchise territory | % of territory earnings | Monthly |
| **Product Commission** | Referred user sells products (if seller) | % per product sold | Per sale |

### 2.3 Multi-Level Structure

Referrals organized in levels:
- **Level 1 (Direct)** — users you directly referred (earn highest %)
- **Level 2–5** — transitive referrals (earn decreasing %)
- **Depth cap** — TBD (suggest max 5 levels to prevent pyramid schemes)
- **Direct-only earning** — some schemes only Level 1 earns

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
      "verification_status": "pending|verified|banned"
    }
  ],
  "earnings": {
    "direct_bonus": 0,
    "level_bonus": 0,
    "pool_bonus": 0,
    "franchise_bonus": 0,
    "product_commission": 0,
    "total": 0,
    "pending_approval": 0
  },
  "stats": {
    "total_referrals": 0,
    "verified_referrals": 0,
    "banned_referrals": 0,
    "avg_referral_order_value": 0
  },
  "settings": {
    "affiliate_enabled": true,
    "auto_withdraw": false,
    "bank_account": "optional"
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
   - Link tracked in session/attribution cookies

3. **New user signs up via link**
   - System detects referral_code in URL
   - Creates link: new_user → existing_user

4. **New user verifies PSS**
   - Direct bonus credited to referrer's wallet (pending DMO approval)
   - Status changes to "verified" in referral list

5. **On qualifying action (purchase/service)**
   - Commission calculated (% of order value)
   - Auto-distributed to referrer's wallet (pending DMO approval)
   - Multi-level: Level 2–5 referrers earn decreasing % of same action

6. **Periodic pool distribution**
   - Weekly/monthly, top affiliates earn from system-wide bonus pool
   - Allocation based on referral count + order volume + STL

## 4. Anti-Abuse Rules

**DMO Up-Guard detects and blocks:**
- **Self-referral** — user cannot refer own account (detected via email/phone/IP)
- **Circular referrals** — A refers B, B refers A (network analysis)
- **Burst signups** — 50+ accounts from 1 IP in 24 hours → freeze all
- **Fake orders** — orders between referrer & referred user on same IP flagged
- **Account farming** — user creating 100+ fake accounts to trigger bonuses → instant ban
- **Inactive referrals** — if referred user has no activity 30 days → bonus clawed back

**Penalties:**
- First violation: warning + bonus held for 30 days
- Second violation: 50% of earnings clawed back
- Third violation: affiliate account banned, all pending earnings forfeit

## 5. STL Impact on Affiliate Earnings

**High STL = Higher Commission %:**

| Referrer STL | Direct Bonus | Level Bonus | Pool Eligible |
|--------------|--------------|-------------|---------------|
| L1–L2 FREE | 50% | 25% | No |
| L3 TRUSTED | 75% | 50% | Yes (low) |
| L4 VERIFIED | 90% | 75% | Yes (med) |
| L5+ ADVANCED | 100% | 100% | Yes (high) |

- **Minimum STL to earn** — L1+ (all users can earn, but low amounts)
- **Earnings cap at L0** — if referrer drops to L0 → affiliate account freezes pending restoration

## 6. API Endpoints

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
View referral tree and stats

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": "user_123",
    "referral_code": "ABC12XYZ9",
    "total_referrals": 42,
    "verified_referrals": 38,
    "network_depth": 4,
    "tree": [
      {
        "level": 1,
        "count": 10,
        "total_orders": 250,
        "avg_order_value": 5000
      },
      {
        "level": 2,
        "count": 25,
        "total_orders": 145,
        "avg_order_value": 3500
      }
    ]
  }
}
```

### GET /affiliate/earnings/:user_id
View commission earnings breakdown

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "earnings": {
      "direct_bonus": 50000,
      "level_bonus": 35000,
      "pool_bonus": 12000,
      "franchise_bonus": 0,
      "product_commission": 8000,
      "total": 105000,
      "pending_approval": 5000
    },
    "withdrawn": 50000,
    "available": 55000,
    "pending_30_day_hold": 5000
  }
}
```

### POST /affiliate/withdraw
Withdraw affiliate earnings to wallet or bank

**Request:**
```json
{
  "user_id": "string",
  "amount": 10000,
  "destination": "wallet|bank",
  "bank_account_id": "optional"
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
    "status": "pending_approval",
    "created_at": "2026-04-18T12:00:00Z"
  }
}
```

## 7. Open Questions (For Phase 13 Refinement)

1. **Exact commission percentages** — direct bonus (e.g., PKR 1000?), level bonus (5%? 10%?), pool allocation?
2. **Maximum referral depth** — 5 levels? unlimited?
3. **Minimum qualifying action** — purchase value threshold (e.g., min PKR 500)?
4. **Affiliate payout frequency** — weekly? monthly? on-demand?
5. **Pool bonus algorithm** — top 10 affiliates? top 1%? volume-based?
6. **Referrer STL requirement** — can L0 earn anything?
7. **Withdrawal hold period** — 30 days? 7 days? none?
8. **Geographic restrictions** — Pakistan-only initially?
9. **Franchise override** — if referred user joins franchise, does franchise owner take commission?
10. **Mobile app referral** — QR code in-app? universal deep linking?

---

## Changelog

| Date | Ver | Change |
|---|---|---|
| 2026-04-18 | 1.0 | Complete canonical spec: 5 commission types, multi-level structure, STL-gated earning (L1 FREE → L5 ADVANCED), anti-abuse rules (DMO Up-Guard), 4 API endpoints, data model, referral flow, 10 open questions. Ready for Phase 13 implementation. |

---

*EHB Technologies (Pvt.) Ltd. · Affiliate Department v1.0 · 2026-04-18*
