# EHB-Complaint & Penalty — Complete System Plan
> Complaint Escalation, Penalty Engine, Resolution Framework
> Version: 1.0 | April 2026 | Status: PLANNING

---

## PART 1: WHAT IS THE COMPLAINT SYSTEM

**EHB Complaint System** handles all disputes, violations, and issues across every platform module (GoSellr, JPS, Franchise, PSS, CRB, Wallet).

**Two categories:**
1. **User Complaints** — Buyer/seller disputes, service issues, rider problems
2. **System Violations** — Fraud, fake reviews, rule breaches (AI-detected)

---

## PART 2: COMPLAINT ESCALATION CHAIN

### 6-Tier Escalation:
```
Tier 0: USER submits complaint (self-service)
        ↓ (2 hours to respond)
Tier 1: SUB FRANCHISE → First review
        ↓ (4 hours if not resolved)
Tier 2: MASTER FRANCHISE → Escalated review
        ↓ (6 hours if not resolved)
Tier 3: CORPORATE FRANCHISE → Regional decision
        ↓ (12 hours if not resolved)
Tier 4: COUNTRY FRANCHISE → National authority
        ↓ (24 hours if not resolved)
Tier 5: HEAD OFFICE → Final authority
        ↓ (48 hours)
Tier 6: PSS AUTHORITY → Fraud/Identity special cases
```

### SLA (Service Level Agreement):
| Tier | Handler | Response SLA | Resolution SLA |
|------|---------|-------------|---------------|
| 1 | Sub Franchise | 2 hours | 12 hours |
| 2 | Master Franchise | 4 hours | 24 hours |
| 3 | Corporate Franchise | 6 hours | 48 hours |
| 4 | Country Franchise | 12 hours | 72 hours |
| 5 | Head Office | 24 hours | 5 days |
| 6 | PSS Authority | 48 hours | 7 days |

### Auto-Escalation Rule:
- If SLA breached by current tier → Auto-escalate to next tier
- Sub Franchise misses 2hr response → Master auto-assigned
- All escalations logged with timestamp + reason

---

## PART 3: COMPLAINT TYPES

| Category | Sub-Type | Priority |
|----------|---------|---------|
| Order Dispute | Non-delivery, wrong item, damaged | HIGH |
| Seller Fraud | Fake product, misrepresentation | CRITICAL |
| Rider Issue | Late delivery, rude behavior, no delivery | MEDIUM |
| Payment Issue | Wrong charge, refund not received | HIGH |
| Review Fraud | Fake review, review manipulation | MEDIUM |
| Franchise Issue | Franchise misconduct, bribery | CRITICAL |
| Inspector Issue | Fake CRB report, inspector fraud | CRITICAL |
| Identity Fraud | CNIC fraud, account takeover | CRITICAL |
| STL Dispute | Disagree with score change | LOW |
| AML Hold | Payment frozen unfairly | HIGH |
| Harassment | Threats, abuse from user | CRITICAL |
| Service Issue | JPS service not delivered | MEDIUM |

### Priority Response Time:
| Priority | Auto-Assign To | Resolution Target |
|----------|---------------|-----------------|
| CRITICAL | Master/Corporate Franchise | 4 hours |
| HIGH | Sub Franchise | 12 hours |
| MEDIUM | Sub Franchise | 24 hours |
| LOW | AI auto-resolve or Sub | 72 hours |

---

## PART 4: COMPLAINT LIFECYCLE

```
Step 1: User Submits Complaint
  → Select type, describe issue
  → Attach evidence (photos, screenshots, tracking)
  → Complaint ID issued

Step 2: AI Pre-screening
  → AI classifies complaint type
  → AI assigns priority
  → AI checks for duplicate complaints
  → AI suggests resolution (for simple cases)

Step 3: Sub Franchise Review
  → Franchise sees complaint in dashboard
  → Contacts both parties if needed
  → Can resolve immediately (for clear cases)
  → Or escalate up

Step 4: Resolution Attempt
  → Mediator proposes resolution
  → Both parties accept/reject
  → If rejected → escalate

Step 5: Decision Issued
  → Clear winner/loser determined
  → Penalty applied (if violation)
  → STL updated
  → Refund/compensation processed (if applicable)

Step 6: Appeal Period
  → 48 hours to appeal any decision
  → Appeal goes to next tier up
  → Final appeal = Head Office (no further appeal)

Step 7: Outcome Recorded
  → Blockchain hash stored (for high-severity cases)
  → Complaint marked RESOLVED
  → Performance tracking updated for all parties
```

---

## PART 5: EVIDENCE SYSTEM

### What Users Can Submit:
- Screenshots (order details, chat messages)
- Photos (damaged goods, wrong items)
- Videos (delivery proof, inspection proof)
- GPS data (auto-attached for riders)
- Order tracking records (auto-fetched)
- Payment receipts

### Evidence Weight (AI scoring):
| Evidence Type | AI Trust Score |
|---------------|---------------|
| GPS-tagged photo (platform) | 95% |
| GPS-tagged video (platform) | 98% |
| Platform order data | 99% |
| User-uploaded photo | 60% |
| User-uploaded screenshot | 50% |
| Chat log (platform) | 90% |
| Third-party receipt | 40% |

---

## PART 6: PENALTY ENGINE

### Penalty Categories:

**A: STL Score Penalties**
| Violation | STL Penalty |
|-----------|------------|
| Fake product listing | -30 STL |
| Non-delivery (confirmed) | -30 STL |
| Fake reviews | -20 STL |
| Order cancellation (seller side) | -5 STL |
| Late delivery (rider) | -5 STL |
| Order damaged (rider fault) | -15 STL |
| Complaint not responded (franchise) | -5 STL |
| Fake CRB report (inspector) | -50 STL |
| Fake CNIC submitted | -50 STL |
| AML violation | -30 STL |
| Harassment confirmed | -40 STL |
| Refund abuse | -20 STL |
| Inspector bribery | -100 STL (ban) |
| Identity fraud | -100 STL (ban) |

**B: Financial Penalties**
| Violation | Financial Action |
|-----------|-----------------|
| Non-delivery (seller) | Full refund to buyer from escrow |
| Order fraud | Refund + 10% platform penalty |
| Fake review (reviewer) | EHBGC earning freeze (30 days) |
| Inspector fraud | Inspection fee forfeited |
| Franchise misconduct | % of monthly earnings withheld |

**C: Account Actions**
| Signal Count | Action |
|-------------|--------|
| 1 violation | Warning issued |
| 2 violations (same type) | 7-day account restriction |
| 3 violations | 30-day restriction + STL freeze |
| Proven fraud | Account ban + PSS blacklist |
| Criminal activity | Platform ban + legal referral |

---

## PART 7: COMPLAINT LOCK SYSTEM

### What is a Complaint Lock?
When a user has an active unresolved complaint against them, certain platform functions are restricted.

### Lock Levels:
| Lock Level | Triggered By | Restrictions Applied |
|------------|-------------|---------------------|
| Soft Lock | 1 active complaint | Cannot withdraw earnings |
| Medium Lock | 2+ active complaints | Cannot list new products / apply for jobs |
| Hard Lock | Critical complaint | All transactions paused |
| Full Freeze | Fraud investigation | Account read-only, all funds held |

### Lock Release:
- Soft/Medium → Auto-release when complaint resolved
- Hard Lock → DMO manual review required
- Full Freeze → PSS Authority release only

---

## PART 8: REFUND SYSTEM

### Refund Eligibility:
| Scenario | Refund Eligible | Refund Source |
|----------|----------------|--------------|
| Item not delivered (confirmed) | ✅ Full | Escrow |
| Wrong item received | ✅ Full + return | Seller wallet |
| Damaged in delivery | ✅ Partial/Full | Rider bond / Seller |
| Item not as described | ✅ Full | Seller wallet |
| Buyer changed mind | ❌ | N/A |
| Digital product opened | ❌ | N/A |
| Delayed (but delivered) | 🔶 Partial comp | Platform bonus |

### Refund Processing:
```
Complaint Approved (buyer wins)
        ↓
Source determined (seller, rider, escrow)
        ↓
EHBGC reversed to buyer wallet
        ↓
Commission reversed proportionally
        ↓
STL penalty applied to guilty party
        ↓
Refund log recorded
```

---

## PART 9: AI COMPLAINT INTELLIGENCE

### Auto-Resolved Complaint Types (No human needed):
- Order delivered (GPS confirmed) but buyer claims not → AI shows proof → Auto-closed
- Refund for cancelled order < PKR 500 → Auto-refund
- Duplicate complaint (same issue filed twice) → Auto-merged
- Complaint filed > 7 days after delivery → Auto-rejected (time limit)

### AI Fraud Detection in Complaints:
| Pattern | AI Action |
|---------|-----------|
| Same user files 10+ complaints/month | Flagged as abuse |
| Buyer + seller collaboration fraud | Cross-reference signal |
| Coordinated complaint campaign (multiple accounts) | Fraud ring detected |
| Complaint filed immediately after refund → re-order | Pattern flagged |

### AI Complaint Priority Scoring:
```
Priority Score (0–100) =
  Complaint Type Weight (40%)
  + Evidence Quality Score (30%)
  + User STL (10%)
  + Financial Impact (20%)
```

---

## PART 10: FRANCHISE PENALTY FOR COMPLAINT MISHANDLING

| Franchise Failure | Penalty |
|------------------|---------|
| Miss 2hr response SLA | -5 STL |
| Wrong resolution (overturned by Master) | -10 STL |
| Biased resolution (proven) | -20 STL + investigation |
| Complaint suppression (hiding from system) | -30 STL + suspension |
| Bribery to close complaint | -100 STL + ban |

---

## PART 11: COMPLAINT DASHBOARD VIEWS

### User View:
- My active complaints (with status + SLA countdown)
- My resolved complaints (history)
- Submit new complaint (step-by-step)
- Upload evidence
- Accept/reject resolution

### Franchise View (Sub/Master/Corporate):
- Queue of complaints in my tier
- SLA countdown (color-coded: green/yellow/red)
- Complaint details + evidence viewer
- Resolution tools: Mediate / Approve / Reject / Escalate
- Auto-escalate on SLA breach (red = auto)
- My complaint resolution performance stats

### DMO View (Head Office):
- All complaints across platform (filterable)
- Critical/High priority quick view
- Bulk resolution tools
- Complaint trend analytics (by type, region, time)
- Franchise performance by complaint handling
- AI anomaly detection alerts

---

## PART 12: ADVANCED FEATURES (BONUS)

### 1. Complaint Prediction AI
- AI predicts likelihood of complaint based on order patterns
- High-risk orders → Pre-warned seller/rider
- Prevents complaints before they happen

### 2. Smart Mediation
- AI proposes fair resolution (based on evidence scores)
- Parties can accept AI proposal directly
- Human escalation only if AI proposal rejected by both

### 3. Reputation Impact Transparency
- User can see exactly why STL dropped
- "Your STL dropped -10 because: complaint ID #XYZ was confirmed against you"
- Full transparency log available

### 4. Repeat Offender Registry
- Privately tracked by DMO
- Users with 5+ complaints in 90 days → Extra scrutiny on orders
- Not shown publicly but affects AI risk scoring

### 5. Complaint Bond System
- High-value complaints → both parties deposit EHBGC bond
- Losing party forfeits bond
- Deters frivolous complaints

### 6. Anonymous Whistleblower
- Special anonymous complaint type for:
  - Inspector bribery reports
  - Franchise corruption reports
  - Internal EHB staff misconduct
- Goes directly to PSS Authority (bypasses franchise chain)
- Reporter identity fully protected

---

## PART 13: DATABASE MODELS

```prisma
model Complaint {
  id
  complainantId (userId)
  respondentId (userId)
  type (ORDER/FRAUD/RIDER/PAYMENT/REVIEW/FRANCHISE/INSPECTOR/IDENTITY/STL/AML/HARASSMENT/SERVICE)
  priority (CRITICAL/HIGH/MEDIUM/LOW)
  status (OPEN/ASSIGNED/IN_REVIEW/ESCALATED/RESOLVED/CLOSED/REJECTED)
  currentTier (1-6)
  currentAssigneeId (franchise/dmo user)
  description
  orderId (optional)
  financialImpact (EHBGC amount)
  slaBreach (Boolean)
  createdAt
  resolvedAt
}

model ComplaintEvidence {
  id
  complaintId
  submittedBy (userId)
  type (PHOTO/VIDEO/SCREENSHOT/GPS_DATA/ORDER_DATA/CHAT_LOG)
  url (S3/R2)
  aiTrustScore (0-100)
  uploadedAt
}

model ComplaintResolution {
  id
  complaintId
  decisionTier
  decidedBy (userId)
  outcome (BUYER_WINS/SELLER_WINS/PARTIAL_REFUND/DISMISSED/DRAW)
  penaltiesApplied: Json
  refundAmount (EHBGC)
  refundSource
  notes
  decidedAt
  appealedAt (optional)
  appealOutcome
}

model PenaltyRecord {
  id
  userId
  complaintId (optional)
  penaltyType (STL_DEDUCT/ACCOUNT_RESTRICT/EARNING_FREEZE/BAN)
  amount (STL points or EHBGC)
  reason
  appliedBy
  appliedAt
  expiresAt (optional)
  reversed (Boolean)
  reversedAt
}

model ComplaintLock {
  userId
  lockLevel (SOFT/MEDIUM/HARD/FREEZE)
  reason
  appliedAt
  expiresAt (optional)
  releasedAt (optional)
  releasedBy
}

model EscalationLog {
  id
  complaintId
  fromTier
  toTier
  reason (SLA_BREACH/MANUAL/AUTO)
  escalatedAt
  escalatedBy
}
```

---

## PART 14: API ROUTES PLAN

```
# Complaint Submission
POST   /api/complaint                    → File complaint
GET    /api/complaint                    → My complaints
GET    /api/complaint/[id]               → Complaint detail
POST   /api/complaint/[id]/evidence      → Upload evidence
POST   /api/complaint/[id]/respond       → Respondent reply
POST   /api/complaint/[id]/appeal        → Appeal resolution
POST   /api/complaint/[id]/accept        → Accept resolution
POST   /api/complaint/[id]/reject        → Reject resolution

# Franchise Handling
GET    /api/franchise/complaints         → My tier's complaint queue
PATCH  /api/franchise/complaints/[id]    → Resolve / escalate
GET    /api/franchise/complaints/stats   → My complaint KPIs

# AI
GET    /api/complaint/[id]/ai-suggestion → AI resolution suggestion

# DMO
GET    /api/dmo/complaints               → All complaints
GET    /api/dmo/complaints/critical      → Critical queue
PATCH  /api/dmo/complaints/[id]/resolve  → DMO resolution
GET    /api/dmo/complaints/analytics     → Trend analytics
GET    /api/dmo/penalties                → All penalties issued

# Penalties
GET    /api/penalties/me                 → My penalty history
GET    /api/dmo/penalties/[userId]       → User penalty history
POST   /api/dmo/penalties/reverse/[id]   → Reverse a penalty
```

---

*Complaint & Penalty Plan v1.0 | April 2026 | Planning Phase*
