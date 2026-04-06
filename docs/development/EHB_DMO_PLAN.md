# EHB-DMO — Complete System Plan
> Decentralized Management Office — Platform Governance Brain
> Version: 1.0 | April 2026 | Status: PLANNING

---

## PART 1: WHAT IS DMO

**DMO (Decentralized Management Office)** is EHB's central governance and control engine.

> "DMO = The brain of the entire EHB ecosystem"

DMO does NOT run operations — it oversees, controls, approves, and enforces rules across all modules:
- GoSellr (marketplace)
- JPS (jobs + hiring)
- PSS (identity verification)
- CRB (physical verification)
- STL (trust scoring)
- Franchise Network
- Wallet + EHBGC
- Complaint System
- Affiliate System

DMO is run by: **EHB staff + AI automation**

---

## PART 2: DMO STRUCTURE

### DMO Roles:
| Role | Code | Function |
|------|------|---------|
| Super Admin | SUPER_ADMIN | Full platform access, policy |
| DMO Director | DMO_DIRECTOR | Heads DMO, reports to board |
| DMO Manager | DMO_MANAGER | Module-specific management |
| DMO Analyst | DMO_ANALYST | Data monitoring, reporting |
| DMO Support | DMO_SUPPORT | Complaint handling, user support |
| DMO Inspector | DMO_INSPECTOR | CRB/PSS audit oversight |
| AI Engine | AI_SYSTEM | Automated decisions, scoring |

### DMO Hierarchy:
```
SUPER_ADMIN (EHB Board)
        ↓
DMO Director
        ↓
DMO Managers (per module)
        ↓
DMO Analysts + Support Staff
        ↓
AI Systems (automation layer)
```

---

## PART 3: MULTI-MODULE DMO DASHBOARDS

### Overview Dashboard (All Modules):
```
┌─────────────────────────────────────────────────────────┐
│  EHB DMO — CONTROL CENTER                              │
├─────────────────────────────────────────────────────────┤
│  TODAY STATS:                                          │
│  New Users: 342  │  Orders: 1,204  │  Complaints: 23  │
│  CRB Queue: 18   │  STL Alerts: 7  │  Fraud Signals: 4│
├─────────────────────────────────────────────────────────┤
│  CRITICAL ALERTS (4)     [View All]                    │
│  🔴 Inspector fraud signal - Sub Franchise #XYZ        │
│  🔴 AML flag - UserID #1234 - PKR 500,000 transfer     │
│  🟠 Complaint Tier 4 escalation - Order #9876          │
│  🟠 STL override request - DMO Analyst                 │
├─────────────────────────────────────────────────────────┤
│  QUICK LINKS:                                          │
│  [PSS Queue] [CRB Queue] [Complaint Queue]             │
│  [STL Controls] [Franchise Panel] [Wallet AML]         │
└─────────────────────────────────────────────────────────┘
```

---

## PART 4: MODULE-SPECIFIC DMO PANELS

### 4.1 PSS Panel (Identity Verification)
**What DMO Does:**
- Review flagged CNIC/passport uploads (AI couldn't auto-confirm)
- Approve/reject manual review cases
- Investigate identity fraud signals
- Manage PSS blacklist

**Dashboard Features:**
- Pending manual reviews queue (with priority)
- AI confidence score per submission
- Side-by-side: uploaded CNIC vs extracted data
- One-click: Approve / Request resubmission / Reject + flag fraud
- Daily PSS stats: submissions, auto-approved, manual, rejected

---

### 4.2 CRB Panel (Physical Verification)
**What DMO Does:**
- Final approval authority on CRB certificates
- Review inspection reports (photos, GPS, checklist)
- Investigate inspector fraud
- Manage CRB appeals
- Override CRB decisions

**Dashboard Features:**
- CRB applications queue (by status: Submitted → Under Review → Approved)
- Inspection report viewer (photos, GPS map, checklist data)
- Inspector accountability tracker
- CRB certificate management (issue/revoke/expire)
- Franchise CRB routing performance

---

### 4.3 STL Panel (Trust Scoring)
**What DMO Does:**
- Manual STL override (up or down, with reason)
- STL freeze/unfreeze
- Review STL appeals
- Bulk STL recalculation (after system events)
- Monitor anomalous STL changes

**Dashboard Features:**
- Live STL leaderboard (users/services/products)
- STL distribution graph (L1–L5 breakdown)
- Recent STL drops > 20 points (auto-alert)
- Override tool: enter userId + new score + reason
- Appeal queue: user disputes STL change
- STL audit log (who changed what, when, why)

---

### 4.4 GoSellr Panel (Marketplace)
**What DMO Does:**
- Review reported listings (fake products, prohibited items)
- Approve/reject product listings (for categories requiring DMO)
- Monitor commission splits (ensure correct distribution)
- Handle GoSellr-specific complaints
- Manage seller bans

**Dashboard Features:**
- Flagged products queue (AI detected issues)
- Commission ledger (all splits, daily reconciliation)
- Seller performance league (by STL + sales)
- Category management (add/restrict categories)
- Banned sellers list + reinstatement tool

---

### 4.5 JPS Panel (Jobs & Hiring)
**What DMO Does:**
- Approve designation upgrades (L5+)
- Manage exam system (review AI-proctored results)
- Handle JPS complaints (employer vs employee)
- Approve skill course listings
- Manage 6-month contract system

**Dashboard Features:**
- Pending designation upgrade requests
- Exam results (pass/fail distribution)
- Contract expiry calendar (next 30 days)
- Course approval queue
- Inspector designation management

---

### 4.6 Franchise Panel
**What DMO Does:**
- Approve franchise applications (Master+)
- Monitor franchise KPIs
- Audit franchise performance
- Suspend/terminate franchises
- Handle corruption complaints against franchises

**Dashboard Features:**
- Franchise map view (all active franchises geo-mapped)
- KPI performance heatmap (green/yellow/red by area)
- Franchise audit queue
- Application review pipeline
- Earning distribution verifier

---

### 4.7 Wallet & AML Panel
**What DMO Does:**
- Review AML-flagged accounts
- Approve large withdrawal requests
- Investigate financial fraud
- Manage EHBGC rate parameters
- Oversee escrow disputes

**Dashboard Features:**
- AML queue (sorted by risk score)
- Transaction anomaly feed (real-time)
- Escrow dispute list
- EHBGC rate history + adjustment tool
- Platform revenue tracker (fees earned)

---

### 4.8 Complaint Panel
**What DMO Does:**
- Final resolution authority (Tier 5 + 6)
- Override lower-tier decisions
- Apply penalties directly
- Monitor SLA breach patterns

**Dashboard Features:**
- Tier 5+ complaint queue
- Complaint trend analytics (by type, by region, by time)
- Franchise complaint handling scorecard
- Penalty application tool
- Bulk resolution for similar cases

---

## PART 5: DMO AUTOMATION LAYER

### Fully Automated (No Human Needed):
| Process | Trigger | Auto Action |
|---------|---------|------------|
| STL recalculation | Order completed | Auto-recalc for all parties |
| Fraud signal | STL < 40 | Auto fraud signal to PSS |
| SLA breach | Timer expires | Auto-escalate to next tier |
| AML low-risk flag | Small deposit | Auto-cleared if pattern normal |
| Complaint duplicate | Same issue filed | Auto-merge |
| CRB expiry reminder | 30 days before | Auto-notification |
| Contract renewal notice | Day 150 | Auto-email + dashboard alert |
| Low inventory alert | Stock threshold | Auto-notify seller |

### Human Required (Always):
- PSS identity manual review
- CRB final certificate approval
- STL override requests
- Franchise suspension/termination
- Account banning
- AML high-risk decisions
- Tier 5+ complaint resolution

### AI + Human Hybrid:
- AI proposes → Human confirms
- Used for: Complaint resolution, STL appeals, franchise audits

---

## PART 6: DMO REPORTING SYSTEM

### Report Types:
| Report | Frequency | Audience |
|--------|-----------|---------|
| Daily Platform Summary | Daily | DMO Director |
| Weekly KPI Report | Weekly | HO Board |
| Monthly Earnings Report | Monthly | Franchise + HO |
| STL Distribution Report | Weekly | DMO Analysts |
| Fraud Intelligence Report | Weekly | PSS Authority |
| CRB Performance Report | Monthly | Franchise Chain |
| Complaint Resolution Report | Monthly | All Franchise |
| AML Compliance Report | Monthly | Legal + Compliance |

### Report Auto-Generation:
```
Scheduled Task (cron) → Fetch data from all modules
        ↓
AI Summarizes trends + anomalies
        ↓
PDF/Excel generated
        ↓
Delivered to relevant roles (email + dashboard)
        ↓
Stored in DMO archive
```

---

## PART 7: DMO COMMUNICATION SYSTEM

### Channels DMO Can Use:
| Channel | Purpose |
|---------|---------|
| Platform Bell | All users |
| Email (SendGrid) | Official notices |
| WhatsApp API | Urgent alerts |
| SMS | OTPs, critical |
| Push Notification | Mobile app users |
| Dashboard Banner | Login-time warning |
| In-app Chat | Direct to franchise/user |

### DMO Message Types:
- **Policy Announcements** — Platform-wide
- **STL Alerts** — "Your STL dropped / improved"
- **Complaint Updates** — "Your complaint #XYZ has been resolved"
- **CRB Reminders** — "Your CRB refilling is due in 30 days"
- **Contract Reminders** — "Your 6-month contract expires in 30 days"
- **Penalty Notices** — "Action applied to your account"
- **Fraud Warnings** — "Suspicious activity detected"
- **Welcome Messages** — New user, new franchise

---

## PART 8: DMO ACCESS CONTROL (RBAC)

### What Each Role Can Access:
| Action | SUPER | DIRECTOR | MANAGER | ANALYST | SUPPORT |
|--------|-------|----------|---------|---------|---------|
| Override STL | ✅ | ✅ | Limited | ❌ | ❌ |
| Ban account | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve CRB | ✅ | ✅ | ✅ | ❌ | ❌ |
| Resolve complaint | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all data | ✅ | ✅ | Module only | Module only | Limited |
| Issue penalty | ✅ | ✅ | ✅ | ❌ | ❌ |
| Generate reports | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage DMO staff | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## PART 9: DMO AUDIT TRAIL

### Every DMO Action is Logged:
```
DMO Audit Log {
  id
  actionType (STL_OVERRIDE/ACCOUNT_BAN/CRB_APPROVE/PENALTY_APPLIED/...)
  dmoUserId (who did it)
  targetId (affected userId/entityId)
  previousValue
  newValue
  reason (required — cannot leave blank)
  timestamp
  ipAddress
  sessionId
}
```

### Audit Rules:
- No DMO action without reason (system enforced)
- All overrides require 2-step: propose → senior confirm
- Audit logs immutable (no edit/delete possible)
- High-risk actions (ban, freeze) → Blockchain hash stored
- Monthly audit review by DMO Director

---

## PART 10: ADVANCED DMO FEATURES (BONUS)

### 1. AI Decision Assistant
- Before DMO makes manual decision → AI shows:
  - Evidence summary
  - Historical precedents (similar cases)
  - Recommended outcome (with confidence %)
  - Risk of wrong decision (appeal likelihood)
- DMO still makes final call — AI only assists

### 2. DMO Performance Scorecard
- Each DMO staff member has a performance score
- Based on: decision accuracy (appeal outcome), speed (SLA), quantity handled
- Monthly review → Top performers get bonuses
- Consistently wrong decisions → Retraining + supervision

### 3. Real-Time Anomaly Feed
- AI streams anomalies to DMO dashboard 24/7
- Anomalies: sudden STL drops, AML patterns, fraud clusters
- Color-coded: Red (act now), Orange (watch), Yellow (note)
- One-click investigation from anomaly → relevant panel

### 4. Cross-Platform Fraud Intelligence
- If fraud signal in GoSellr → check JPS + PSS + Wallet simultaneously
- AI connects signals across modules automatically
- "User X has fraud signal in 3 modules → Priority investigation"

### 5. Compliance Calendar
- Auto-populates with: KYC renewals, CRB refilling due dates, franchise contract renewals, STL review dates
- DMO staff assigned to manage each upcoming event
- SLA tracking for each compliance item

### 6. DMO Knowledge Base
- Internal searchable database of all past decisions
- New DMO staff can search: "similar cases to this complaint"
- AI extracts precedents automatically
- Builds institutional knowledge over time

---

## PART 11: DATABASE MODELS

```prisma
model DMOUser {
  id
  userId
  dmoRole (DIRECTOR/MANAGER/ANALYST/SUPPORT/INSPECTOR)
  moduleAccess: String[]
  performanceScore (0-100)
  casesHandled (Int)
  decisionAccuracyRate (Decimal)
  isActive (Boolean)
  joinedAt
}

model DMOAuditLog {
  id
  dmoUserId
  actionType
  targetId
  targetType (USER/FRANCHISE/COMPLAINT/CRB/STL/WALLET/...)
  previousValue: Json
  newValue: Json
  reason (required)
  ipAddress
  sessionId
  blockchainHash (optional, for critical actions)
  timestamp
}

model DMOAlert {
  id
  type (FRAUD_SIGNAL/AML_FLAG/SLA_BREACH/ANOMALY/CRITICAL_COMPLAINT)
  priority (CRITICAL/HIGH/MEDIUM/LOW)
  entityId
  entityType
  description
  assignedTo (dmoUserId, optional)
  status (NEW/ACKNOWLEDGED/IN_REVIEW/RESOLVED)
  createdAt
  resolvedAt
}

model DMOReport {
  id
  type (DAILY_SUMMARY/WEEKLY_KPI/MONTHLY_EARNINGS/...)
  generatedAt
  generatedBy (SYSTEM/dmoUserId)
  period
  fileUrl (PDF/Excel)
  distributedTo: String[]
}

model PlatformConfig {
  key (unique)
  value
  description
  lastUpdatedBy (dmoUserId)
  lastUpdatedAt
  changeLog: Json
}
```

---

## PART 12: API ROUTES PLAN

```
# DMO Dashboard
GET    /api/dmo/dashboard              → Overview stats + alerts
GET    /api/dmo/alerts                 → All active alerts
PATCH  /api/dmo/alerts/[id]            → Acknowledge / resolve alert

# PSS Controls
GET    /api/dmo/pss/queue              → Pending manual reviews
PATCH  /api/dmo/pss/review/[id]        → Approve/reject/flag

# CRB Controls
GET    /api/dmo/crb/queue              → Pending CRB applications
PATCH  /api/dmo/crb/approve/[id]       → Final CRB approval
GET    /api/dmo/crb/reports            → All inspection reports
PATCH  /api/dmo/crb/certificate/revoke → Revoke CRB certificate

# STL Controls
POST   /api/dmo/stl/override           → STL manual override
POST   /api/dmo/stl/freeze/[userId]    → Freeze STL
POST   /api/dmo/stl/recalc/bulk        → Bulk recalculation
GET    /api/dmo/stl/appeals            → STL appeal queue
PATCH  /api/dmo/stl/appeals/[id]       → Resolve STL appeal

# User Controls
GET    /api/dmo/users/[id]             → Full user profile (all data)
POST   /api/dmo/users/[id]/ban         → Ban account
POST   /api/dmo/users/[id]/freeze      → Freeze account
POST   /api/dmo/users/[id]/restrict    → Apply restriction

# Platform Config
GET    /api/dmo/config                 → All platform settings
PATCH  /api/dmo/config/[key]           → Update setting

# Reports
GET    /api/dmo/reports                → All reports
POST   /api/dmo/reports/generate       → Trigger report generation
GET    /api/dmo/reports/[id]           → Download report

# Audit
GET    /api/dmo/audit                  → DMO audit log (all)
GET    /api/dmo/audit/[dmoUserId]      → Specific staff audit log

# AI
GET    /api/dmo/ai/anomalies           → Real-time anomaly feed
GET    /api/dmo/ai/suggestions/[caseId] → AI decision suggestion
```

---

*DMO Plan v1.0 | April 2026 | Planning Phase*
