# EHB STL Calculator Skill

> **Version:** 3.0 (3-Dimensional Multi-Layer Trust Architecture)  
> **Last updated:** 2026-04-14  
> **Owner:** EHB Technologies (Pvt.) Ltd.  
> **Critical:** STL formula protected by 58 gold-master regression tests. NEVER modify existing tests without explicit approval from Head of Engineering.  
> **Architecture:** v4.0 — PSS (L1-L10) + CRB (L1-L10) + DMO (L1-L10) → HYBRID → Final EHB-STL

---

## §1 — What is STL?

**STL = Service Trust Level** (formerly SQL — Central Record Blockchain Trust Level)

- **World's first 3-Dimensional Trust System** combining Identity, Physical, and Behavioral trust
- Ranges from **L1 (FREE)** to **L10 (SUPREME)**
- Built from 3 independent sub-level systems:
  - **PSS (Identity Trust):** L1-L10 — 27 verification features (Email→Phone→CNIC→FaceMatch→Address→Liveness→DeviceBind→Video→ContinuousMonitor→FullVerified)
  - **CRB (Physical Trust):** L1-L10 — Inspector-based certification (None→Basic→1Pass→2Passes→Verified→Rechecked→MultiCategory→DualInspector→ContinuousAudit→PremiumVerified)
  - **DMO (Behavioral Trust):** L1-L10 — 7 governance engines (New→Clean→Active→Verified→Trusted→Strong→HighCompliance→Elite→Premium→Supreme)
- **HYBRID Formula:** Threshold → Weighted (PSS×40% + CRB×35% + DMO×25%) → Cap by lowest+1 → Wallet multiplier
- **MIN Rule still applies for entities:** FINAL_STL = MIN(product, seller, company, owner)
- **Role-based formulas:** Different roles use different dimensions (e.g., Buyers don't need CRB)
- Used to: Gate features, unlock seller tools, determine commission rates, enable franchise opportunities

---

## §1B — HYBRID Combination Formula (CORE — v4.0)

### Step 1: Threshold Check
```
For target EHB-STL level, ALL sub-levels must meet minimum:
  L1: PSS≥L1, CRB≥L1, DMO≥L1
  L2: PSS≥L2, CRB≥L1, DMO≥L2
  L3: PSS≥L3, CRB≥L1, DMO≥L3
  L4: PSS≥L4, CRB≥L3, DMO≥L4
  L5: PSS≥L5, CRB≥L5, DMO≥L5
  L6: PSS≥L6, CRB≥L5, DMO≥L6
  L7: PSS≥L7, CRB≥L7, DMO≥L7
  L8: PSS≥L8, CRB≥L8, DMO≥L8
  L9: PSS≥L9, CRB≥L9, DMO≥L9
  L10: PSS≥L10, CRB≥L10, DMO≥L10
If ANY sub-level < required → BLOCK upgrade
```

### Step 2: Weighted Calculation
```
Standard (Seller/ServiceProvider/Inspector/Franchise):
  Weighted = (PSS-Level × 0.40) + (CRB-Level × 0.35) + (DMO-Level × 0.25)

Buyer/Admin (no CRB):
  Weighted = (PSS-Level × 0.55) + (DMO-Level × 0.45)

Rider (no CRB, has RPS):
  Weighted = (PSS-Level × 0.45) + (DMO-Level × 0.35) + (RPS/10 × 0.20)

Round down to nearest integer.
```

### Step 3: Cap by Lowest +1
```
Final EHB-STL CANNOT exceed lowest sub-level + 1
Example: PSS=L8, CRB=L3, DMO=L7 → Max = L3+1 = L4 (even if weighted = L6)
```

### Step 4: Wallet Multiplier
```
No lock     → ×1.00
Small lock  → ×1.05  (+5%)
Medium lock → ×1.10  (+10%)
High lock   → ×1.15  (+15%)
Maximum lock→ ×1.20  (+20%)
Final = min(10, floor(level × multiplier))
```

### Implementation
```typescript
function calculateEHBSTL(
  pssLevel: number, crbLevel: number, dmoLevel: number,
  role: string, walletLock: number, rps?: number
): number {
  // Step 1: Find max achievable based on thresholds
  const thresholds = STL_THRESHOLDS; // from §88.4
  let maxByThreshold = 1;
  for (let target = 10; target >= 1; target--) {
    if (pssLevel >= thresholds[target].minPSS &&
        crbLevel >= thresholds[target].minCRB &&
        dmoLevel >= thresholds[target].minDMO) {
      maxByThreshold = target;
      break;
    }
  }

  // Step 2: Weighted calculation (role-based)
  let weighted: number;
  if (role === 'buyer' || role === 'admin') {
    weighted = (pssLevel * 0.55) + (dmoLevel * 0.45);
  } else if (role === 'rider') {
    weighted = (pssLevel * 0.45) + (dmoLevel * 0.35) + ((rps || 0) / 10 * 0.20);
  } else {
    weighted = (pssLevel * 0.40) + (crbLevel * 0.35) + (dmoLevel * 0.25);
  }
  let level = Math.floor(weighted);

  // Step 3: Cap by lowest sub-level + 1
  const applicableLevels = (role === 'buyer' || role === 'admin')
    ? [pssLevel, dmoLevel]
    : [pssLevel, crbLevel, dmoLevel];
  const lowest = Math.min(...applicableLevels);
  level = Math.min(level, lowest + 1);

  // Step 4: Threshold cap
  level = Math.min(level, maxByThreshold);

  // Step 5: Wallet multiplier
  const boost = getWalletMultiplier(walletLock);
  level = Math.min(10, Math.floor(level * boost));

  return level;
}
```

---

## §2 — Legacy Score Formula (Still used for internal component scoring)

> **Note:** The 100-point scoring below is the INTERNAL scoring used within each
> dimension. PSS sub-level is determined by verification steps (§85), CRB by
> inspections (§86), DMO by behavioral factors (§87). The flat 0-100 score
> below feeds into each dimension's internal level calculation.

### 2.1 Internal Score Components (100-point scale)

```
RAW_INTERNAL_SCORE = (
  PSS_Score(0-40)           +  // Proof & Security System: KYC, liveness, AML
  CRB_Score(0-15)           +  // Central Record Blockchain: Business docs, legal
  Behavior_Score(0-20)      +  // Payment on time, returns, disputes
  Wallet_Score(0-20)        +  // EHBGC locked, available liquidity
  Activity_Score(0-15)      +  // Sales volume, orders, engagement
  History_Score(0-10)       -  // Cumulative positive rating
  Penalty_Score(0-10)       -  // Complaints, chargebacks, returns
  Risk_Score(0-10)          -  // Fraud signals, AML flags, device risk
)
NOTE: This score is used WITHIN dimensions, not as the final EHB-STL anymore.
The final EHB-STL comes from the HYBRID formula in §1B.
```

### 2.2 Component Breakdown

#### **PSS Score (0-40 points)**
```
40 pts  — Liveness check: PASSED
20 pts  — KYC: Name + ID verified (phone/national ID)
10 pts  — Address verification: GPS + billing match
5 pts   — AML check: No sanctions/watchlist hits
5 pts   — Device fingerprint: No shared devices detected
```

**Penalty:** If PSS expired > 60 days, **automatic -20 pts**, can't sell until renewed.

#### **CRB Score (0-15 points)**
```
15 pts  — Business registration (food trader, company, etc.)
10 pts  — Tax ID on file (if applicable)
8 pts   — Physical address verified by inspector
5 pts   — Legal documents submitted (licenses, permits)
```

**Penalty:** If CRB expired > 90 days, **automatic suspension** (can browse but can't sell).

#### **Behavior Score (0-20 points)**
```
20 pts  — 95%+ on-time delivery / payment
15 pts  — <1% return rate
10 pts  — <2% complaint rate
5 pts   — Responds to messages within 24h
```

**Decay Rule:** Each late delivery = -1 pt (rolling 6-month window).

#### **Wallet Score (0-20 points)**
```
20 pts  — EHBGC locked (amount = tier requirement met)
15 pts  — Available balance > 10K PKR
10 pts  — No failed payments in last 30 days
5 pts   — Auto-refill enabled
```

**Calculation:** `wallet_score = locked_amount / tier_requirement * 20`

Example: Seller with L5 requirement = 700K EHBGC lock
- Locked 700K = 20 pts
- Locked 350K = 10 pts
- Locked 0K = 0 pts

#### **Activity Score (0-15 points)**
```
15 pts  — >10 products listed
12 pts  — >50 orders in last 90 days
10 pts  — >1M PKR GMV in last quarter
8 pts   — Listed in 3+ categories
5 pts   — Platform member > 6 months
```

**New sellers:** Start with 5 pts (member bonus). Gain up to +1 pt/week for first 10 weeks.

#### **History Score (0-10 points)**
```
10 pts  — Avg rating 4.8-5.0 stars
8 pts   — Avg rating 4.5-4.79 stars
6 pts   — Avg rating 4.0-4.49 stars
4 pts   — Avg rating 3.5-3.99 stars
2 pts   — Avg rating 2.5-3.49 stars
0 pts   — Avg rating <2.5 stars
```

#### **Penalty Score (0-10 points deducted)**
```
-3 pts  — Per complaint filed
-2 pts  — Per chargeback (unauthorized transaction)
-5 pts  — Per return (if dispute won by buyer)
-1 pt   — Per 1-star review received
```

**Cap:** Max -10 pts/month (prevents catastrophic drop).

#### **Risk Score (0-10 points deducted)**
```
-5 pts  — AML flag (sanctions, PEP)
-3 pts  — Device fingerprint: Shared IP with banned account
-2 pts  — High transaction velocity (>50 txn in 1 hour)
-2 pts  — Multiple failed payments
-1 pt   — Geographic mismatch (location ≠ ID address)
```

**Max deduction:** -10 pts.

---

## §3 — 10-Level Ladder

### 3.1 Level Definitions

| Level | Score | Min Lock | Features | Fee | Use Case |
|-------|-------|----------|----------|-----|----------|
| **L1 FREE** | 0-20 | None | Browse, review | None | New user, unverified |
| **L2 TRUSTED** | 21-30 | None | Can buy (limited) | None | Verified buyer |
| **L3 VERIFIED** | 31-40 | 100K EHBGC | Can sell (limited) | 2% | New seller |
| **L4 ACCREDITED** | 41-50 | 350K EHBGC | Full seller access | 2% | Active seller |
| **L5 CERTIFIED** | 51-60 | 700K EHBGC | Franchise eligibility | 2% | Master seller |
| **L6 PREMIUM** | 61-70 | 2M EHBGC | Premium seller badge, priority support | 1.5% | High-volume seller |
| **L7 ELITE** | 71-80 | 5M EHBGC | Franchise owner rights, territory control | 1.5% | Franchise-ready |
| **L8 ENTERPRISE** | 81-90 | 10M EHBGC | Multi-territory, corporate seller | 1% | Enterprise partner |
| **L9 PLATINUM** | 91-98 | 25M EHBGC | API access, custom integrations | 1% | Strategic partner |
| **L10 SUPREME** | 99-100 | 30M EHBGC | Voting rights (DMO), unlimited GMV, white-label | 0.5% | Platform co-founder |

### 3.2 Lock Requirements

**EHBGC Wallet Lock = Collateral + Insurance**

- Seller can't withdraw locked EHBGC
- Released when account deleted or downgraded
- If complaint filed = 10% of lock held until resolved
- Required to **sell on platform** (Levels L3+)

### 3.3 Level Auto-Calculations

```typescript
function calculateSTLLevel(score: number): Level {
  if (score >= 99) return 10; // L10 SUPREME
  if (score >= 91) return 9;  // L9 PLATINUM
  if (score >= 81) return 8;  // L8 ENTERPRISE
  if (score >= 71) return 7;  // L7 ELITE
  if (score >= 61) return 6;  // L6 PREMIUM
  if (score >= 51) return 5;  // L5 CERTIFIED
  if (score >= 41) return 4;  // L4 ACCREDITED
  if (score >= 31) return 3;  // L3 VERIFIED
  if (score >= 21) return 2;  // L2 TRUSTED
  return 1; // L1 FREE
}
```

---

## §4 — The MIN Rule (Most Important)

```
FINAL_STL = MIN(product_stl, seller_stl, company_stl, owner_stl)
```

### Example 1: Seller Downgrade Blocks Product

```
Product STL:  L7 (high quality)
Seller STL:   L3 (new, few sales) ← WEAKEST LINK
Company STL:  L5 (established)
Owner STL:    L4 (decent history)

RESULT: Customer sees this product as L3 trust.
Reason: Seller is newest, least vetted.
```

### Example 2: Company Bankruptcy Blocks Everything

```
Product STL:  L6
Seller STL:   L8
Company STL:  L1 (company shut down, under litigation) ← BROKEN LINK
Owner STL:    L7

RESULT: Product immediately gated to L1.
Action: Seller must either change company or appeal to DMO.
```

---

## §5 — Decay & Renewal Rules

### 5.1 Automatic Decay (30/60/90 Day Warnings)

```
If any component (PSS, CRB) expires or falls below threshold:

Day 30: Warning email sent
  "Your PSS verification expires in 30 days. Renew at [link]"

Day 60: Score reduced by 20 points
  STL drops by one level if score was borderline
  Example: L5 (score 55) → L4 (score 35)

Day 90: Suspension
  Can't sell anymore
  Can still browse as buyer
  Escrow transactions frozen (already-shipped orders complete)
```

### 5.2 Renewal Cycle

Every **6 months**, sellers must refill EHBGC lock to maintain level.

| Level | Annual Fee | Lock to Refill |
|-------|-----------|-----------------|
| L1-2 | 0 | 0 |
| L3 | 500 PKR | 100K EHBGC |
| L4 | 1,000 PKR | 350K EHBGC |
| L5 | 2,000 PKR | 700K EHBGC |
| L6 | 5,000 PKR | 2M EHBGC |
| L7 | 5,000 PKR | 5M EHBGC |
| L8 | 10,000 PKR | 10M EHBGC |
| L9 | 10,000 PKR | 25M EHBGC |
| L10 | 50,000 PKR | 30M EHBGC |

**Payment:** Deducted from seller's wallet balance or card.
**Non-payment:** Automatic downgrade to L2 after 30-day grace.

---

## §6 — EHBGC Lock Ladder for Service Providers (Non-Sellers)

**Service Providers** = Riders, Inspectors, Franchise Owners

| Role | L3 Lock | L5 Lock | L7 Lock | L10 Lock |
|------|---------|---------|---------|----------|
| **Rider** | 100K | 700K | 3M | 30M |
| **Inspector** | 50K | 350K | 2M | 25M |
| **Franchise (Sub)** | 50K | 700K | 5M | 30M |
| **Franchise (Master)** | 200K | 2M | 10M | 30M+ |
| **Franchise (Corporate)** | 500K | 5M | 25M | 100M+ |
| **Franchise (Country)** | 1M | 10M | 50M | 500M+ |

**Release condition:** 6 months of zero complaints + no penalties.

---

## §7 — Franchise Lock Requirements

**Cannot franchise without STL L5+**

| Franchise Tier | Min STL | Lock | Territory | Sub-Sellers |
|---|---|---|---|---|
| **Sub** | L4 | 50K | City/Zone | Up to 5 |
| **Master** | L5 | 200K | Province/Region | Up to 20 |
| **Corporate** | L6 | 500K | Country | Up to 100 |
| **Country** | L7 | 1M | Multi-country | 500+ |

**Lock calculation:**
```
LOCK = BASE_LOCK × (1 + sub_sellers_count × 0.1)

Example: Master (200K base) with 10 sub-sellers
= 200K × (1 + 10 × 0.1) = 400K lock required
```

---

## §8 — Gold-Master Test Protection

### 8.1 The 58 Tests

File: `services/api/stl-replit/__tests__/stlService.test.js`

**NEVER modify without approval from Head of Engineering.**

The 58 tests cover:

```
✓ 8 tests — Score calculation (each component)
✓ 5 tests — MIN rule (multi-entity scenarios)
✓ 10 tests — Level assignment (boundaries, rounding)
✓ 7 tests — Decay rules (30/60/90 day triggers)
✓ 5 tests — Lock validation (seller tiers)
✓ 5 tests — Refill cycle (renewal, non-payment)
✓ 5 tests — Service provider locks (rider/inspector/franchise)
✓ 5 tests — Penalty application (complaints, chargebacks)
✓ 3 tests — Risk score deductions (AML, device risk)
✓ 2 tests — Edge cases (division by zero, null scores, extremes)
```

### 8.2 Test Execution

```bash
# Run STL tests
npm run test:stl

# Must output: ✓ 58 tests passed (0 skipped)
# If ANY test fails: DO NOT MERGE

# Run with verbose output
npm run test:stl -- --verbose
```

### 8.3 Adding New Tests (After Formula Change)

If you modify the STL formula:

1. **Add tests for the change first** (test-driven)
2. **Run: `npm run test:stl`** — should fail at first
3. **Update formula code**
4. **Run: `npm run test:stl`** — must pass all 58+
5. **Get 2 approvals** from senior engineers
6. **Merge PR** with test coverage number in commit message

---

## §9 — STL Simulation Tool

Use this to predict score changes:

### 9.1 CLI Simulator

```bash
# Interactive STL calculator
npm run stl-simulator

# Example interaction:
# > Enter seller name: john_seller
# > PSS score (0-40): 35
# > CRB score (0-15): 12
# > Behavior score (0-20): 18
# > Wallet score (0-20): 15
# > Activity score (0-15): 10
# > History score (0-10): 8
# > Penalties (0-10): 3
# > Risk deductions (0-10): 2
#
# ============ RESULTS ============
# Raw Score: 93
# Level: L9 PLATINUM
# Recommendations:
#   - Increase locked EHBGC to 25M to maintain level
#   - Address 3 recent penalties (respond to complaints)
# ============
```

### 9.2 Web Dashboard (Admin)

File: `apps/web/app/admin/stl-simulator/page.tsx`

```tsx
// Admin can simulate other users' STLs
export default function STLSimulator() {
  return (
    <Card>
      <h1>STL Score Simulator</h1>
      
      {/* Input fields */}
      <Input placeholder="User ID or email" />
      <Slider label="PSS Score" min={0} max={40} step={1} />
      <Slider label="CRB Score" min={0} max={15} step={1} />
      {/* ... more fields ... */}
      
      {/* Real-time output */}
      <STLResultCard score={score} level={level} />
      <RecommendationsList />
    </Card>
  );
}
```

### 9.3 API Endpoint

```
POST /api/v1/admin/stl-simulate

Request:
{
  "userId": "user_abc123",
  "components": {
    "pss": 35,
    "crb": 12,
    "behavior": 18,
    "wallet": 15,
    "activity": 10,
    "history": 8,
    "penalties": 3,
    "risk": 2
  }
}

Response:
{
  "rawScore": 93,
  "level": 9,
  "levelName": "PLATINUM",
  "breakdown": { ... },
  "recommendations": [
    "Increase locked EHBGC to maintain level",
    "Address recent penalties"
  ],
  "predictedAction": "No change (stable)"
}
```

---

## §10 — Migration: 9-Level → 10-Level System

### 10.1 Feature Flag

```javascript
// .env
STL_V2_ENABLED=false  // Set to true after data migration
```

### 10.2 Migration Steps

```javascript
// scripts/migrate-stl-9-to-10.js

async function migrateSTLv2() {
  // Fetch all users
  const users = await User.find();
  
  for (const user of users) {
    // Old 9-level score
    const oldLevel = user.stlLevel; // 1-9
    const oldScore = user.stlScore; // 10-90
    
    // Map to 10-level
    const newScore = ((oldScore - 10) / 80) * 100; // Normalize to 0-100
    const newLevel = calculateSTLLevel(newScore);
    
    // Update
    await User.updateOne(
      { _id: user._id },
      {
        stlScore: newScore,
        stlLevel: newLevel,
        stlMigrated: true,
        stlMigratedAt: new Date(),
      }
    );
  }
  
  console.log(`Migrated ${users.length} users to STL v2`);
}
```

### 10.3 Rollback Plan

If v2 breaks critical functionality:

```bash
# 1. Set feature flag to false
# STL_V2_ENABLED=false

# 2. Revert user data
npm run migrate:stl-revert

# 3. Run tests
npm run test:stl

# 4. Verify scores are restored
```

---

## §11 — Common Scenarios & Calculations

### Scenario 1: New Seller Starting Out

```
User: Alice (just signed up)
Status: PSS verified, no CRB yet, no activity

Scores:
- PSS: 40 (verified)
- CRB: 0 (not submitted)
- Behavior: 0 (no history)
- Wallet: 0 (no lock)
- Activity: 5 (new user bonus)
- History: 0 (no rating)
- Penalties: 0
- Risk: 0

RAW = 40 + 0 + 0 + 0 + 5 + 0 - 0 - 0 = 45
LEVEL = L4 ACCREDITED
NEXT STEP: Submit CRB docs, lock 350K EHBGC to reach L4 minimum
```

### Scenario 2: Established Seller with One Bad Complaint

```
User: Bob (has been selling 2 years)
Status: All verified, good history, but recent complaint

Scores:
- PSS: 40 (fresh renewal)
- CRB: 15 (business doc verified)
- Behavior: 18 (95% on-time, but complaint pending)
- Wallet: 18 (locked 680K of 700K required)
- Activity: 15 (100+ orders/quarter)
- History: 9 (avg 4.7 stars, but 1-star review pending)
- Penalties: -3 (complaint filed)
- Risk: 0

RAW = 40 + 15 + 18 + 18 + 15 + 9 - 3 - 0 = 112 → capped at 100
LEVEL = L10 SUPREME? NO — cap is 100
ACTUAL = 95 → L9 PLATINUM

IMPACT: Complaint resolved = remove -3, likely recovers to L10
```

### Scenario 3: Rider with Expired PSS

```
User: Charlie (rider, PSS expired 70 days ago)
Status: PSS verification lapsed

Original Scores (60 days ago):
- PSS: 35
- Activity (orders): 12
- Behavior: 10
- ... = 60 (L5)

Current Scores (at 70-day mark):
- PSS: 35 - 20 = 15 (penalty applied)
- Activity: 12
- Behavior: 10
- ... = 45 (L4)

ACTION: System sends message: "Your PSS expired. Renew at [link] to keep earning. 20 days until suspended."
```

---

## §12 — Admin Commands

```bash
# View user's current STL
npm run cli:stl-view <user_id>
# Output: Level 5, Score 58, Components breakdown

# Manually adjust score (audit trail logged)
npm run cli:stl-adjust <user_id> <delta> --reason="Fraud investigation cleared"
# Requires ADMIN role + 2FA

# Reset user (hard reset to L1)
npm run cli:stl-reset <user_id> --reason="Data cleanup"

# Bulk apply penalty
npm run cli:stl-penalty <complaint_id> --amount=5
# Deducts from all parties involved

# Check expiry warnings (due 30 days)
npm run cli:stl-expiries
# Output: 42 users' PSS expiring, 15 users' CRB expiring

# Simulate formula change impact
npm run cli:stl-impact --formula-change="behavior: 20→25"
# Output: Would affect 2,341 users, 14% would downgrade
```

---

## §13 — Monitoring & Alerts

### 13.1 Key Metrics

```
Dashboard: /admin/stl-metrics

- Avg STL by role (buyers, sellers, riders)
- STL distribution (% at each level)
- Decay events (30/60/90 day warnings)
- Lock utilization (how much EHBGC locked)
- Churn due to STL suspension
- Appeal queue (manual reviews pending)
```

### 13.2 PagerDuty Alerts

```
Critical:
- >1% of active sellers suspended in 1h
- STL calculation error (test failure)

Warning:
- >10 STL appeals pending >7 days
- >5% lock utilization drop in 24h
```

---

## §14 — Summary Checklist

When working with STL:

- [ ] Understand the formula (§2)
- [ ] Know all 10 levels (§3)
- [ ] Remember the MIN rule (§4)
- [ ] Don't touch the 58 tests (§8)
- [ ] Simulate impact before changing formula (§9)
- [ ] Use `npm run test:stl` before committing
- [ ] Auto-apply naming convention (SQL → STL)
- [ ] Log all manual adjustments (audit trail)
- [ ] Check monitoring dashboard weekly
- [ ] Update this skill if formula changes

---

**Maintainer:** Head of Engineering  
**Last Review:** 2026-04-14  
**Test Count:** 58 gold-master tests  
**Next Review:** 2026-05-14
