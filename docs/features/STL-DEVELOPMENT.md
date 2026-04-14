# STL DEVELOPMENT GUIDE — Service Trust Level (10-Level System)

**Version:** 1.0  
**Updated:** 2026-04-14  
**Status:** Implementation in Sprint 3-4  

---

## Overview: STL Architecture

**STL (Service Trust Level)** is EHB's central trust score (0-9, 10 levels). All platform features — wallet limits, marketplace visibility, complaint resolution — depend on STL. 58 gold-master regression tests protect the formula.

**Key Principle:** STL = (PSS × 0.40) + (CRB × 0.15) + (Orders × 0.35) + (Payments × 0.10)

---

## 10-Level System Definition

| Level | Score Range | Label | Wallet Limit/Month | Marketplace | Features |
|-------|-------------|-------|-------------------|------------|----------|
| **L0** | 0-25 | Unverified | Blocked | Hidden | Suspended (no PSS) |
| **L1** | 26-50 | Basic | Blocked | Hidden | Can register, start PSS |
| **L2** | 51-75 | Verified | Blocked | Hidden | PSS approved, awaiting CRB |
| **L3** | 76-125 | Buyer | $500/month | Search only | Can view + message |
| **L4** | 126-175 | Seller | $2K/month | Can list products | Limited inventory (10 items) |
| **L5** | 176-225 | Trusted | $5K/month | Full featured | All features, 50 items |
| **L6** | 226-275 | Pro | $10K/month | Featured placement | Analytics dashboard |
| **L7** | 276-325 | Expert | $20K/month | Top 100 ranking | Wholesale pricing access |
| **L8** | 326-375 | Master | $50K/month | Exclusive deals | Bulk operations, API access |
| **L9** | 376-500 | Supreme | Unlimited | Partner status | Full white-label, L9 approval power |

**L9 → L10 (Premium Tier):** Reserved for Phase 2 (corporate accounts, franchises).

---

## Score Calculation Algorithm

### Pseudocode

```javascript
function calculateSTLScore(userId) {
  // 1. PSS Component (40% weight, max 40 points)
  const pssComponent = calculatePSSPoints(userId); // 0-40
  
  // 2. CRB Component (15% weight, max 15 points)
  const crbComponent = calculateCRBPoints(userId); // 0-15
  
  // 3. Orders Component (35% weight, max 35 points)
  const ordersComponent = calculateOrdersPoints(userId); // 0-35
  
  // 4. Payments Component (10% weight, max 10 points)
  const paymentsComponent = calculatePaymentsPoints(userId); // 0-10
  
  // 5. Combine
  let baseScore = pssComponent + crbComponent + ordersComponent + paymentsComponent;
  // baseScore is now 0-100 (normalized)
  
  // 6. Apply decay (if > 30 days inactive)
  const decayPenalty = applyDecay(userId); // -0 to -50
  
  // 7. Apply complaint penalty (if active)
  const complaintPenalty = getActiveComplaintPenalty(userId); // -15 or 0
  
  // 8. Apply manual overrides (admin)
  const manualAdjustment = getManualAdjustment(userId); // -50 to +50
  
  // Final score
  let finalScore = baseScore + decayPenalty + complaintPenalty + manualAdjustment;
  finalScore = Math.max(0, Math.min(500, finalScore)); // Clamp 0-500
  
  return {
    score: finalScore,
    level: scoreToLevel(finalScore), // L0-L9
    breakdown: {
      pss: pssComponent,
      crb: crbComponent,
      orders: ordersComponent,
      payments: paymentsComponent,
      decay: decayPenalty,
      complaint: complaintPenalty,
      manual: manualAdjustment,
    },
  };
}

function calculatePSSPoints(userId) {
  // Max 40 points from PSS verifications
  const verifications = [
    { type: 'id_document', points: 10 },      // +10
    { type: 'liveness', points: 3 },          // +3
    { type: 'face_match', points: 3 },        // +3
    { type: 'address', points: 3 },           // +3
    { type: 'aml', points: 3 },               // +3
    { type: 'device', points: 3 },            // +3
    // Phase 2: +5, +3, +3, +2, +2, +3, +2, +2, +2
  ];
  
  let total = 0;
  for (const v of verifications) {
    const result = getPSSVerification(userId, v.type);
    if (result && result.status === 'approved') {
      total += v.points;
    }
  }
  
  // Cap at 40
  return Math.min(total, 40);
}

function calculateCRBPoints(userId) {
  // Max 15 points from CRB skills (3 points per certified skill, max 5 skills)
  const skills = getCRBSkills(userId);
  const certifiedCount = skills.filter(s => s.verified).length;
  const points = Math.min(certifiedCount * 3, 15);
  return points;
}

function calculateOrdersPoints(userId) {
  // Max 35 points from order completion (2 per order, 17.5 orders max)
  const completedOrders = getCompletedOrders(userId);
  const points = Math.min(completedOrders.length * 2, 35);
  return points;
}

function calculatePaymentsPoints(userId) {
  // Max 10 points from payment reliability (1 per 10 orders on-time)
  const onTimeOrders = getOnTimeOrders(userId);
  const points = Math.min(Math.floor(onTimeOrders.length / 10), 10);
  return points;
}

function applyDecay(userId) {
  // Reduce points if no activity
  const lastActivity = getLastActivityDate(userId);
  const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
  
  if (daysSinceActivity <= 30) {
    return 0; // Grace period
  } else if (daysSinceActivity <= 60) {
    return -1 * Math.floor(daysSinceActivity - 30); // -1 to -30
  } else if (daysSinceActivity <= 90) {
    return -30 - 3 * Math.floor(daysSinceActivity - 60); // -30 to -60
  } else {
    return -60 - 5 * Math.floor(daysSinceActivity - 90); // -60 to -infinity
  }
}

function scoreToLevel(score) {
  const levels = [
    { level: 0, min: 0 },    // L0: 0-25
    { level: 1, min: 26 },   // L1: 26-50
    { level: 2, min: 51 },   // L2: 51-75
    { level: 3, min: 76 },   // L3: 76-125
    { level: 4, min: 126 },  // L4: 126-175
    { level: 5, min: 176 },  // L5: 176-225
    { level: 6, min: 226 },  // L6: 226-275
    { level: 7, min: 276 },  // L7: 276-325
    { level: 8, min: 326 },  // L8: 326-375
    { level: 9, min: 376 },  // L9: 376-500
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i].min) {
      return levels[i].level;
    }
  }
  
  return 0;
}
```

### Implementation File

Create: `services/api/stl-replit/services/stlService.js`

```javascript
const User = require('../models/User');
const PSS_Verification = require('../models/PSS_Verification');
const CRB_Certificate = require('../models/CRB_Certificate');
const Order = require('../models/Order');
const STL_History = require('../models/STL_History');

exports.calculateSTLScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Calculate components
    const pss = await calculatePSSPoints(userId);
    const crb = await calculateCRBPoints(userId);
    const orders = await calculateOrdersPoints(userId);
    const payments = await calculatePaymentsPoints(userId);
    
    let baseScore = pss + crb + orders + payments;
    
    // Apply decay
    const decay = applyDecay(user.last_activity_at);
    
    // Apply complaint penalty
    const complaint = user.active_complaint ? -15 : 0;
    
    // Apply manual override
    const manual = user.stl_manual_adjustment || 0;
    
    // Final score
    let finalScore = baseScore + decay + complaint + manual;
    finalScore = Math.max(0, Math.min(500, finalScore));
    
    const level = scoreToLevel(finalScore);
    
    // Store history
    const prevLevel = user.stl_level;
    if (level !== prevLevel) {
      await STL_History.create({
        user_id: userId,
        old_level: prevLevel,
        new_level: level,
        score: finalScore,
        reason: 'automatic_recalculation',
        timestamp: new Date(),
      });
    }
    
    // Update user
    user.stl_level = level;
    user.stl_score = finalScore;
    user.stl_updated_at = new Date();
    await user.save();
    
    return {
      userId,
      score: finalScore,
      level,
      breakdown: {
        pss,
        crb,
        orders,
        payments,
        decay,
        complaint,
        manual,
      },
    };
  } catch (error) {
    logger.error('[STL] Calculation error', { userId, error: error.message });
    throw error;
  }
};

// Batch recalculation (nightly job)
exports.recalculateAllSTLScores = async () => {
  const users = await User.find({ stl_dirty: true });
  
  for (const user of users) {
    await exports.calculateSTLScore(user._id);
  }
  
  logger.info('[STL] Batch recalculation complete', { count: users.length });
};
```

---

## Migration: 9-Level → 10-Level (Feature Flag)

### 1. Backward Compatibility
Keep old 9-level formula intact during transition:

```javascript
const STL_VERSION = process.env.STL_VERSION || 'v1'; // 'v1' = 9-level, 'v2' = 10-level

exports.calculateSTL = async (userId) => {
  if (STL_VERSION === 'v2') {
    return calculateSTLv2(userId); // 10-level (0-9)
  } else {
    return calculateSTLv1(userId); // 9-level (1-9)
  }
};
```

### 2. Migration Script
```javascript
// scripts/migrate-stl-9-to-10.js
async function migrateLevels() {
  const users = await User.find({});
  
  for (const user of users) {
    // v1: level 1-9 → v2: level 0-9
    user.stl_level_v1 = user.stl_level; // Backup
    
    // Recalculate with v2 formula
    const v2Result = calculateSTLv2(user._id);
    user.stl_level = v2Result.level;
    
    await user.save();
  }
  
  console.log(`Migrated ${users.length} users`);
}
```

### 3. Rollback Plan
```javascript
async function rollback() {
  const users = await User.find({});
  for (const user of users) {
    user.stl_level = user.stl_level_v1;
    await user.save();
  }
}
```

---

## Database Schema Updates

### Users Collection
```javascript
{
  _id: ObjectId,
  // ... existing fields
  stl_level: Number,        // 0-9
  stl_score: Number,        // 0-500
  stl_updated_at: Date,
  stl_manual_adjustment: Number, // Admin override (-50 to +50)
  stl_dirty: Boolean,       // Flag for batch recalculation
  last_activity_at: Date,   // For decay calculation
  active_complaint: Boolean, // For penalty
}
```

### STL_History Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref User),
  old_level: Number,
  new_level: Number,
  score: Number,
  reason: String, // 'automatic_recalculation', 'manual_override', 'complaint_penalty', 'decay'
  details: {
    pss: Number,
    crb: Number,
    orders: Number,
    payments: Number,
  },
  admin_id: ObjectId, // If manual override
  timestamp: Date,
  // TTL: 90 days (auto-delete old records)
}
```

---

## API Endpoints

### GET `/api/stl/user/:userId`
Get current STL level + score breakdown.

**Response:**
```json
{
  "success": true,
  "user_id": "507f1f77bcf86cd799439011",
  "stl_level": 5,
  "stl_score": 215,
  "breakdown": {
    "pss": 35,
    "crb": 9,
    "orders": 28,
    "payments": 8,
    "decay": -5,
    "complaint": 0,
    "manual": 0
  },
  "wallet_limit": "$5,000/month",
  "next_level_at_score": 226,
  "days_to_decay": 18
}
```

### GET `/api/stl/history/:userId?limit=50`
Get STL history (level changes, reasons).

**Response:**
```json
{
  "data": [
    {
      "date": "2026-04-14T10:30:00Z",
      "old_level": 4,
      "new_level": 5,
      "reason": "Order completed",
      "score": 215
    },
    {
      "date": "2026-04-10T15:00:00Z",
      "old_level": 5,
      "new_level": 4,
      "reason": "Decay (30+ days inactive)",
      "score": 176
    }
  ]
}
```

### PATCH `/api/stl/manual-override/:userId` (Admin only)
Apply manual adjustment to STL.

**Request:**
```json
{
  "adjustment": -10,
  "reason": "Violation of terms of service"
}
```

**Response:**
```json
{
  "success": true,
  "new_level": 4,
  "new_score": 205,
  "audit_logged": true
}
```

### POST `/api/stl/recalculate/:userId` (Admin)
Force immediate recalculation.

**Response:**
```json
{
  "success": true,
  "old_level": 4,
  "new_level": 5,
  "reason": "Manual recalculation"
}
```

---

## Frontend Pages

### 1. STL Dashboard (`/stl/dashboard`)
```
┌─────────────────────────────────────┐
│ Your Trust Level                    │
├─────────────────────────────────────┤
│                                     │
│         L5 — TRUSTED                │
│     ████████████░░░░░░ 215/226      │
│                                     │
│ Next Level: L6 (Pro)               │
│ Points needed: 11 more              │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ Breakdown:                   │   │
│ │ • PSS Verification: 35/40 ✓  │   │
│ │ • CRB Skills: 9/15           │   │
│ │ │ Orders Completed: 28/35    │   │
│ │ • Payment Reliability: 8/10  │   │
│ │ • Decay: -5 (grace period)   │   │
│ └──────────────────────────────┘   │
│                                     │
│ [View History] [Upgrade Guide]      │
└─────────────────────────────────────┘
```

### 2. Upgrade Guide (`/stl/upgrade`)
```
How to reach L6 (Pro) — 11 points needed

Option 1: Complete 1 more order
├─ Current orders: 14/17.5 for max points
├─ Next order: +2 points
└─ Time: 1-7 days

Option 2: Get 2 more CRB skills certified
├─ Current skills: 3/5 certified
├─ Each skill: +3 points
└─ Time: 1-2 weeks

Option 3: Improve payment reliability
├─ Current: 8/10
├─ Need: 10 on-time payments
├─ Time: 1 month
```

### 3. History Page (`/stl/history`)
```
STL Changes (Last 90 days)

2026-04-14  L4 → L5  +39 pts  "Order completed"
2026-04-10  L5 → L4  -39 pts  "Decay (30+ days)"
2026-03-28  L4 → L5  +40 pts  "Address verified (PSS)"
...
```

### 4. Admin Panel (`/admin/stl/override`)
```
Manual STL Adjustment

Search user: [______________]

Current: L5, Score 215

Adjustment: [-] [0] [+]

Reason:
└─ [Violation of ToS] [Fraud detected] [Custom reason]

Notes:
└─ [Text field]

[Apply Override] [Cancel]

Audit Trail:
├─ 2026-04-14 10:30 Admin Jane -10 pts "Violation"
├─ 2026-04-12 15:00 Admin Bob +5 pts "Appeal granted"
```

---

## Gold-Master Test Protection

**Critical:** These 58 tests must ALWAYS pass. No exceptions.

```bash
npm run test:stl
```

Expected output:
```
[PASS] 58/58 STL Gold-Master Tests
  ✓ Score calculation (PSS, CRB, Orders, Payments)
  ✓ Level assignment (0-9)
  ✓ Decay algorithm (30/60/90 day tiers)
  ✓ Complaint penalty (-15 STL)
  ✓ Manual override (+/- 50)
  ✓ Edge cases (null users, zero scores, overflow)
  ✓ Batch recalculation (1M users, <5s)
  ... 50 more tests
```

**If any test fails:**
1. Revert the change
2. Log the failure + commit hash
3. Escalate to CTO
4. Never merge without 58/58 pass

---

## Decay Implementation

### 30-Day Tiers
```javascript
function applyDecay(lastActivityDate) {
  const today = new Date();
  const days = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
  
  if (days <= 30) {
    return 0; // No decay
  } else if (days <= 60) {
    // Slow decay: 1-2 points per day
    return -(days - 30) * 1;
  } else if (days <= 90) {
    // Medium decay: 3-5 points per day
    return -30 - (days - 60) * 3;
  } else {
    // Aggressive decay: 5-10 points per day
    return -60 - (days - 90) * 5;
  }
}
```

### Scheduled Job (Nightly)
```javascript
// jobs/decayJob.js
async function runDecayJob() {
  const users = await User.find({});
  
  for (const user of users) {
    const oldLevel = user.stl_level;
    
    // Recalculate with current decay
    const result = await calculateSTLScore(user._id);
    
    // Notify user if level dropped
    if (result.level < oldLevel) {
      await sendNotification(user._id, {
        title: 'STL Level Decreased',
        message: `Your trust level dropped from L${oldLevel} to L${result.level} due to inactivity.`,
        action_url: '/stl/upgrade',
      });
    }
  }
  
  logger.info('[Decay Job] Complete', { timestamp: new Date() });
}

// Schedule (nightly at 02:00 UTC)
cron.schedule('0 2 * * *', runDecayJob);
```

---

## Refill Cycle

Users can earn points back via:

| Action | Points | Frequency | Max |
|--------|--------|-----------|-----|
| Complete order | +2 | 1/day | None |
| Perfect week (no complaints) | +5 | 1/week | 20 total |
| Get CRB skill certified | +3 | 1/week | 15 total |
| Receive 10 positive reviews | +1 | Unlimited | None |

**Dashboard shows:** "You need 11 more points to reach L6. Complete 6 orders or get 4 skills certified."

---

## Key Rules (Non-Negotiable)

1. **STL gates everything.** Wallet limits, marketplace visibility, feature access.
2. **Gold-master tests are sacred.** 58/58 must pass before every merge.
3. **Decay is real.** No manual bypass; users must stay active.
4. **Complaints are heavy.** One unresolved complaint = -15 STL.
5. **Immutable history.** Every level change logged with reason + admin (if manual).
6. **Feature flags for migration.** 9→10 level transition must be reversible.

---

*EHB Technologies (Pvt.) Ltd. — STL Development Guide v1 — 2026-04-14*
