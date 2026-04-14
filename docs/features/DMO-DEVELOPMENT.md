# DMO DEVELOPMENT GUIDE — Decentralized Management Office

**Version:** 1.0  
**Updated:** 2026-04-14  
**Status:** Phase 2 (Weeks 3-4 post-launch)  

---

## Overview: DMO Architecture

**DMO (Decentralized Management Office)** is EHB's governance engine. It orchestrates all platform decisions: complaint resolution, policy enforcement, L8+ approvals, fraud investigation, and dispute arbitration. DMO consists of 7 engines operating in parallel.

**Key Principle:** All major platform decisions are logged, auditable, and reversible (except account bans, which require L9 vote).

---

## 7 DMO Engines

### 1. Decision Engine
Routes decisions to correct handler (auto vs. manual, SLA tier).

**Input:** Event (complaint filed, L8 approval needed, policy change)  
**Output:** Decision queued → Handler assigned → Result

```javascript
async function routeDecision(event) {
  const { type, priority } = event;
  
  // L0-L7 automatic approval if clear
  if (event.type === 'stl_upgrade' && event.stl_level <= 7) {
    return auto_approve(event); // L0-L7: auto, <2s
  }
  
  // L8+ requires manual approval
  if (event.stl_level >= 8) {
    return queue_for_manual_review(event, 'L8_APPROVAL'); // 30-min SLA
  }
  
  // Complaints always manual
  if (event.type === 'complaint') {
    return queue_for_manual_review(event, 'COMPLAINT_REVIEW'); // 1-hour SLA for P1
  }
  
  // Fraud signals escalate immediately
  if (event.fraud_score > 80) {
    return escalate_to_l9(event); // 15-min SLA
  }
}
```

### 2. Risk Engine
Pre-screens decisions using AI + rules.

**Fraud Detection:**
- Velocity: 10 registrations in 1 hour → BLOCK
- Device fingerprint match (10+ users same device) → ALERT
- IP geolocation mismatch (uploaded ID from US, IP from CN) → ALERT
- Payment fraud (chargeback, failed 3x) → SUSPEND
- AML sanctions match → REJECT immediately

**Implementation:**
```javascript
async function assessRisk(userId, event) {
  const signals = [];
  
  // Check velocity
  const recentRegs = await User.countDocuments({
    created_at: { $gt: Date.now() - 60*60*1000 },
    device_id: user.device_id,
  });
  if (recentRegs > 10) signals.push({ type: 'velocity', score: 90 });
  
  // Check device
  const sameDevice = await User.find({ device_id: user.device_id, _id: { $ne: userId } });
  if (sameDevice.length > 10) signals.push({ type: 'multi_account', score: 85 });
  
  // Check IP/geolocation
  const ipCountry = maxmind.lookup(user.ip);
  const idCountry = user.pss_verified.issuing_country;
  if (ipCountry !== idCountry) signals.push({ type: 'geo_mismatch', score: 60 });
  
  // Calculate combined risk
  const riskScore = Math.min(100, signals.reduce((sum, s) => sum + s.score, 0));
  
  return {
    risk_score: riskScore,
    signals,
    recommendation: riskScore > 80 ? 'BLOCK' : riskScore > 60 ? 'ALERT' : 'APPROVE',
  };
}
```

### 3. Trust Engine
Evaluates user trust + determines if L8+ eligible.

**Criteria for L8 (Master):**
- STL score ≥ 326
- PSS: All 6 verifications approved
- CRB: ≥ 5 skills certified
- Orders: ≥ 20 completed, zero disputes
- Payments: 100% on-time
- Account age: ≥ 60 days
- No active complaints

**Implementation:**
```javascript
async function evaluateTrustForL8(userId) {
  const user = await User.findById(userId);
  const pss = await PSS_Verification.find({ user_id: userId, status: 'approved' });
  const crb = await CRB_Certificate.find({ user_id: userId, verified: true });
  const orders = await Order.find({ seller_id: userId, status: 'completed' });
  const onTime = orders.filter(o => o.delivery_date <= o.promised_date).length;
  
  const checks = {
    stl_score: user.stl_score >= 326,
    pss_complete: pss.length >= 6,
    crb_skills: crb.length >= 5,
    orders_completed: orders.length >= 20,
    zero_disputes: orders.length === onTime,
    payments_ontime: onTime / orders.length === 1.0,
    account_age: (Date.now() - user.created_at) / (1000*60*60*24) >= 60,
    no_complaints: !(await Complaint.exists({ user_id: userId, status: 'open' })),
  };
  
  const passed = Object.values(checks).filter(v => v).length;
  
  return {
    eligible: passed === Object.keys(checks).length,
    checks,
    missing: Object.entries(checks).filter(([k, v]) => !v).map(([k]) => k),
  };
}
```

### 4. Compliance Engine
Enforces policies + prevents rule violations.

**Policy Types:**
- **Rate limits:** Max 10 complaints filed/day (per user)
- **Account restrictions:** Ban after 3 false complaints
- **Payment rules:** Max $50K/day in L9 (FATF travel rule)
- **Promotional:** No more than 2 free shipping offers/month
- **Scheduled bans:** Automatic suspension if account inactive 180+ days

**Implementation:**
```javascript
async function enforcePolicy(userId, action) {
  const user = await User.findById(userId);
  const policy = await Policy.findOne({ action_type: action });
  
  // Check rate limit
  const recent = await DMO_Decision.countDocuments({
    user_id: userId,
    action: action,
    created_at: { $gt: Date.now() - 24*60*60*1000 },
  });
  
  if (recent >= policy.rate_limit) {
    throw new AppError(`Rate limit exceeded (${policy.rate_limit}/day)`, 429, true);
  }
  
  // Check restrictions
  if (user.false_complaints >= 3) {
    throw new AppError('Account banned (3+ false complaints)', 403, true);
  }
  
  // Check scheduled actions
  if (user.inactive_days >= 180) {
    await User.updateOne({ _id: userId }, { status: 'suspended' });
    throw new AppError('Account auto-suspended (180+ days inactive)', 403, true);
  }
  
  return true;
}
```

### 5. Finance Engine
Manages escrow, refunds, and revenue distribution.

**Escrow States:**
```
Order placed
  ↓ [Buyer balance: free → locked]
Seller confirms
  ↓ [Hold for 24h]
Buyer receives (opt-in confirm)
  ↓ [Soft release 24h]
Dispute window closes (7 days)
  ↓ [Escrow release to seller]
```

**Refund Rules:**
- Seller liable (wrong item, damaged): Full refund to buyer
- Buyer liable (false claim): No refund (appeal available)
- Both liable (50/50): Split refund

**Implementation:**
```javascript
async function processComplaintResolution(complaintId, decision) {
  const complaint = await Complaint.findById(complaintId);
  const { seller_liable, buyer_liable, refund_amount } = decision;
  
  // Update escrow
  if (refund_amount > 0) {
    const escrow = await Escrow.findOne({
      order_id: complaint.order_id,
      status: 'locked',
    });
    
    if (seller_liable) {
      // Full refund to buyer
      escrow.status = 'released_to_buyer';
      await Wallet.updateOne(
        { user_id: complaint.buyer_id },
        { $inc: { free_balance: refund_amount } }
      );
    }
  }
  
  // Update STL
  if (seller_liable) {
    user.stl_manual_adjustment -= 15;
    user.stl_dirty = true;
  }
  if (buyer_liable) {
    user.stl_manual_adjustment -= 5;
    user.stl_dirty = true;
  }
  
  // Log decision
  await DMO_Decision.create({
    complaint_id: complaintId,
    decision,
    decided_by: admin_id,
    timestamp: new Date(),
  });
}
```

### 6. Operations Engine
Manages workflows, queues, and SLAs.

**Queue Types:**
- `L8_APPROVAL`: STL L8+ decisions (30-min SLA)
- `COMPLAINT_REVIEW`: Complaints (1-hour P1, 4-hour P2, 24-hour P3)
- `FRAUD_ESCALATION`: High-risk signals (15-min SLA)
- `POLICY_CHANGE`: Policy updates (24-hour review)
- `ACCOUNT_BAN`: Account suspension (1-hour SLA)

**Workflow:**
```javascript
async function processQueue(queueType) {
  const items = await DMO_Queue.find({
    type: queueType,
    status: 'pending',
  }).sort({ priority: -1, created_at: 1 }).limit(20);
  
  for (const item of items) {
    // Check SLA
    const elapsed = Date.now() - item.created_at;
    const sla = getSLA(queueType);
    
    if (elapsed > sla.threshold) {
      item.sla_exceeded = true;
      // Escalate or auto-resolve
      if (sla.auto_resolve) {
        item.status = 'auto_resolved';
        item.resolution = sla.default_action;
      }
    }
    
    // Assign to available admin
    const admin = getNextAvailableAdmin(queueType);
    item.assigned_to = admin._id;
    item.status = 'in_progress';
    
    await item.save();
  }
}
```

### 7. Analytics Engine
Tracks trends, reports, and compliance metrics.

**Reports:**
- **Daily:** Complaints filed, resolved, avg resolution time, SLA breaches
- **Weekly:** User segments by STL, churn rate, fraud signals, refund rate
- **Monthly:** Revenue by tier, franchise payout, policy changes, appeals

**Implementation:**
```javascript
async function generateDailyReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const complaints = await Complaint.find({
    created_at: { $gte: today },
  });
  
  const resolved = complaints.filter(c => c.status === 'resolved');
  
  const report = {
    date: today,
    complaints_filed: complaints.length,
    complaints_resolved: resolved.length,
    avg_resolution_hours: resolved.length > 0 ?
      resolved.reduce((sum, c) => sum + (c.resolved_at - c.created_at) / (1000*60*60), 0) / resolved.length :
      0,
    sla_breaches: complaints.filter(c => c.sla_exceeded).length,
    refund_total: resolved.reduce((sum, c) => sum + (c.refund_amount || 0), 0),
    seller_penalties: resolved.filter(c => c.seller_liable).length,
    buyer_penalties: resolved.filter(c => c.buyer_liable).length,
  };
  
  await DMO_Report.create(report);
  
  // Alert if metrics bad
  if (report.sla_breaches > 10) {
    await sendAlert('[DMO] SLA breaches high', report);
  }
}
```

---

## Complaint System (9 Categories)

| Category | Definition | AI Review | Admin SLA | Refund Rate |
|----------|-----------|-----------|-----------|------------|
| **Wrong Item** | Received different product | Auto-screen docs | 4 hours | Usually full |
| **No Delivery** | Order not received by date | Auto-flag | 1 hour | Full + L3 delay |
| **Damaged Item** | Item arrived damaged | Photo AI analysis | 4 hours | Full if evidence |
| **Scam/Fraud** | Payment taken, item missing | Auto-escalate | 15 min P1 | Full + ban seller |
| **Quality Issue** | Item doesn't match description | AI photo match | 24 hours | Partial (20-50%) |
| **Account Hacked** | Unauthorized purchases | Auto-disable account | 30 min | Full + reset |
| **Policy Violation** | User violated ToS | AI + manual | 2 hours | Case-by-case |
| **Dispute with Seller** | Disagreement on terms | Manual mediation | 4 hours | Negotiated |
| **Other** | Unclassified | Routing queue | 24 hours | Case-by-case |

**Complaint Filing Flow:**
```
1. User files complaint (category, evidence, description)
2. AI pre-screens: calc risk score, extract key facts
3. Route to queue (P1/P2/P3 based on risk)
4. Admin assigned (P1 = senior admin)
5. Admin reviews evidence (24-48 hours)
6. Decision: approve refund / reject / negotiate
7. Notification + appeal window (5 days)
8. Resolve + close case
```

---

## Database Schema

### Collections

```javascript
// dmo_decisions
{
  _id: ObjectId,
  type: String, // 'complaint_resolution', 'l8_approval', 'policy_enforcement'
  user_id: ObjectId,
  related_complaint_id: ObjectId,
  decision: Object, // varies by type
  decided_by: ObjectId, // Admin user ID
  created_at: Date,
  updated_at: Date,
  reversible: Boolean,
}

// dmo_complaints
{
  _id: ObjectId,
  buyer_id: ObjectId,
  seller_id: ObjectId,
  order_id: ObjectId,
  category: String, // 'wrong_item', 'no_delivery', 'damaged', 'scam', 'quality', 'account_hacked', 'policy_violation', 'dispute', 'other'
  status: String, // 'open', 'under_review', 'resolved', 'appealed', 'closed'
  description: String,
  evidence_urls: [String], // Photos, receipts, messages
  ai_result: {
    risk_score: Number, // 0-100
    recommendation: String,
    key_facts: [String],
  },
  resolution: {
    decision: String, // 'approved', 'rejected', 'partial'
    refund_amount: Number,
    reason: String,
    decided_by: ObjectId,
    decided_at: Date,
  },
  appeal: {
    filed_at: Date,
    appeal_notes: String,
    final_decision: Object,
  },
  created_at: Date,
}

// dmo_policies
{
  _id: ObjectId,
  name: String,
  description: String,
  rule: Object, // e.g., { max_complaints_per_day: 10 }
  effective_date: Date,
  end_date: Date,
  version: Number,
  created_by: ObjectId,
  changelog: [
    { version: Number, change: String, date: Date }
  ],
}

// dmo_audit_log (immutable)
{
  _id: ObjectId,
  action: String,
  actor_id: ObjectId,
  actor_role: String,
  target: Object,
  timestamp: Date,
  // TTL: 2 years
}
```

---

## API Endpoints

### Complaint Management

#### POST `/api/dmo/complaint`
File a complaint.

**Request:**
```json
{
  "category": "wrong_item",
  "order_id": "507f1f77bcf86cd799439011",
  "description": "Received blue shirt instead of red",
  "evidence_urls": ["s3://bucket/photo1.jpg", "s3://bucket/receipt.pdf"]
}
```

#### GET `/api/dmo/complaints?status=open&priority=P1`
Admin queue.

#### PATCH `/api/dmo/complaint/:id/resolve`
Resolve complaint (admin only).

**Request:**
```json
{
  "decision": "approved",
  "refund_amount": 45.99,
  "reason": "Seller error. Full refund approved."
}
```

### L8+ Approvals

#### POST `/api/dmo/l8-approval/:userId`
Initiate L8 approval (internal).

#### GET `/api/dmo/l8-queue`
Admin L8 review queue.

#### PATCH `/api/dmo/l8/:userId`
Approve or reject L8 (admin only).

### Policy Management

#### GET `/api/dmo/policies`
List active policies.

#### POST `/api/dmo/policies` (Admin)
Create new policy.

#### PATCH `/api/dmo/policies/:id`
Update policy (with version + audit trail).

---

## Admin Dashboard (`/admin/dmo`)

```
┌────────────────────────────────────────────────┐
│ DMO Dashboard                  [Queue] [Report]│
├────────────────────────────────────────────────┤
│                                                │
│ Today's Metrics:                              │
│ • Complaints: 15 filed, 12 resolved          │
│ • Avg resolution time: 2.3 hours             │
│ • SLA breaches: 0                             │
│ • Refunds issued: $487.50                     │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ Complaint Queue (7 pending)               │  │
│ ├──────────────────────────────────────────┤  │
│ │ P1 Fraud: Order 123 (30 min old) [Review]│  │
│ │ P2 Damage: Order 456 (2h old) [Review]   │  │
│ │ P3 Quality: Order 789 (5h old) [Review]  │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ L8 Approvals (3 pending)                 │  │
│ ├──────────────────────────────────────────┤  │
│ │ User ID 789 - Score 340, 60d old [Review]│  │
│ │ User ID 456 - Score 355, 75d old [Review]│  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ Policy Changes (versioning)              │  │
│ ├──────────────────────────────────────────┤  │
│ │ Max complaints/day: 10 (v3, eff. 2026-04│  │
│ │ L8 account age: 60d (v2, eff. 2026-04)   │  │
│ └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Key Rules (Non-Negotiable)

1. **Every decision is logged.** Immutable audit trail. No exceptions.
2. **L8+ requires manual approval.** No auto-upgrade to L8 or L9.
3. **Complaints drive STL decay.** One unresolved = -15 STL (heavy penalty).
4. **Appeals are available.** 5-day window after complaint decision.
5. **Policies are versioned.** No "surprise" rule changes. 24-hour advance notice.
6. **Reversible decisions only.** No permanent bans without L9 vote.
7. **SLA is sacred.** P1 complaints must be reviewed within 1 hour.
8. **Fraud escalates immediately.** Risk score >80 = 15-min SLA + L9 alert.

---

*EHB Technologies (Pvt.) Ltd. — DMO Development Guide v1 — 2026-04-14*
