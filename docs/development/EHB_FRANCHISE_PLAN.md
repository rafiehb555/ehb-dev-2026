# EHB-Franchise — Complete System Plan
> Franchise Hierarchy, Earning Distribution, Control System
> Version: 1.0 | April 2026 | Status: PLANNING

---

## PART 1: WHAT IS EHB FRANCHISE

**EHB Franchise System** is the physical distribution network that governs EHB's real-world presence.

- Every city, district, and region is managed by a franchise operator
- Franchises handle: CRB inspections, rider management, local seller onboarding, complaint resolution, STL enforcement
- Revenue flows UP the chain: Sub → Master → Corporate → Country → Head Office
- Responsibility flows DOWN: Head Office → Country → Corporate → Master → Sub

---

## PART 2: FRANCHISE HIERARCHY (COMPLETE)

### Structure:
```
🌐 EHB HEAD OFFICE (SUPER_ADMIN)
        ↓ (1 per country)
🏳️ COUNTRY FRANCHISE
        ↓ (multiple per country)
🏢 CORPORATE FRANCHISE
        ↓ (25 per Corporate)
🏬 MASTER FRANCHISE
        ↓ (25 per Master)
🏪 SUB FRANCHISE
        ↓
👷 INSPECTORS / RIDERS / LOCAL STAFF
```

### Capacity Calculation:
```
1 Corporate Franchise = 25 Master Franchises
1 Master Franchise    = 25 Sub Franchises
1 Corporate           = 25 × 25 = 625 Sub Franchises
1 Country             = N Corporates × 625
```

---

## PART 3: FRANCHISE LEVEL DETAILS

### Sub Franchise (L1 — Ground Level)
**Coverage:** Neighborhood / Street / Small area

**Responsibilities:**
- Physical premises (office/shop required)
- Local seller onboarding + support
- CRB inspection routing (receives + assigns)
- Local rider management
- Complaint first-line response (2hr SLA)
- STL monitoring for local users

**Requirements to Apply:**
- STL L3 minimum (60+ score)
- PSS fully complete (all 5 layers)
- CRB Standard certification
- Physical premises (verified by Master Franchise inspection)
- Franchise fee payment (EHBGC)
- 6-month performance contract (renewable)

**Earning:**
- 3% of all transactions in their area
- Inspection fee share (from CRB applications)
- Rider management commission
- Seller onboarding bonus (EHBGC/seller)

---

### Master Franchise (L2 — District Level)
**Coverage:** District / Town / Large area (25 Sub Franchises under)

**Responsibilities:**
- Manage + monitor 25 Sub Franchises
- CRB review (Sub → Master level approval)
- Complaint escalation handling (6hr SLA)
- STL override capability (limited)
- Inspector performance evaluation
- Sub Franchise contract renewal approval

**Requirements:**
- STL L4 minimum (75+ score)
- PSS complete + CRB Advanced
- Physical office (bigger premises)
- 2+ years Sub Franchise history OR corporate background
- Higher franchise fee

**Earning:**
- 2% of all transactions in their area
- Override of Sub Franchise commissions audit
- Monthly performance bonus (from HO)

---

### Corporate Franchise (L3 — Regional Level)
**Coverage:** Region / Province / State (25 Master Franchises under = 625 Sub total)

**Responsibilities:**
- Strategic oversight of region
- CRB final regional approval
- Master Franchise appointment + removal
- Regional compliance monitoring
- Major complaint resolution (12hr SLA)
- Revenue reporting to Country level

**Requirements:**
- STL L5 minimum (90+)
- CRB VIP certification
- Company registration (not individual)
- Significant franchise fee
- Board-level review + HO approval

**Earning:**
- 2% of all regional transactions
- Master + Sub Franchise fee share
- Bonus from regional performance metrics

---

### Country Franchise (L4 — National Level)
**Coverage:** Entire country

**Responsibilities:**
- National regulatory compliance
- Corporate Franchise appointment
- Country-wide policy enforcement
- Government / legal liaison
- Country-level complaint escalation (24hr SLA)
- Revenue and performance reporting to HO

**Requirements:**
- Invited by HO only (not open application)
- Corporate registration in country
- Full AML/KYC compliance
- Board-level vetting
- Legal + financial background check

**Earning:**
- 1% of all national transactions
- Franchise fee from all Corporates
- Country-level performance bonus

---

### Head Office (Super Admin — Global)
**Coverage:** Global

**Responsibilities:**
- Platform policy
- Token (EHBGC) governance
- Country Franchise appointment
- Final appeal authority
- Blockchain governance
- Platform development direction

---

## PART 4: FRANCHISE EARNING DISTRIBUTION

### Per Transaction (GoSellr Order Example):
| Entity | % of Order Value |
|--------|-----------------|
| EHB Head Office | 10% |
| Country Franchise | 1% |
| Corporate Franchise | 2% |
| Master Franchise | 2% |
| Sub Franchise | 3% |
| Seller | 70% |
| Rider | 5% |
| Affiliate (if any) | 7%* |

*Affiliate commission comes from EHB's 10% share, not separate.

### CRB Inspection Fee Split:
| Entity | % of Inspection Fee |
|--------|-------------------|
| Sub Franchise (conducted) | 50% |
| Master Franchise | 20% |
| Corporate Franchise | 15% |
| Country Franchise | 10% |
| Head Office | 5% |

### Franchise Fee Income (New Sub onboarding):
| Fee Collection | Distribution |
|---------------|-------------|
| Sub Franchise Fee | 100% → Master (who approves) |
| Master Franchise Fee | 100% → Corporate |
| Corporate Franchise Fee | 100% → Country + HO split |

---

## PART 5: CRB ROUTING THROUGH FRANCHISE

### Anti-Corruption Rotation Flow:
```
CRB Application Received
        ↓
System: Pull user's GPS location
        ↓
Find eligible Sub Franchises in radius
        ↓
Filter: Exclude last franchise used by this user
        ↓
Filter: Only franchises with available inspector
        ↓
Rank remaining: By performance score + STL
        ↓
Random selection from top 5 eligible
        ↓
Assign Inspector from selected franchise
        ↓
All steps logged with timestamp + hash
```

### Rotation Rules:
1. Never same franchise twice in a row (anti-corruption)
2. Inspector cannot inspect someone they know (conflict check — AI-based)
3. Franchise receives blind assignment (no pre-knowledge of applicant relationship)
4. If no eligible franchise → CRB goes to next nearest district
5. If no franchise in country → CRB impossible, STL capped at L2

---

## PART 6: FRANCHISE STL CHAIN EFFECT

### Upward STL Influence:
```
Sub Franchise STL affects:
  → Local user STL cap
  → Local CRB approval weight

Master Franchise STL affects:
  → Sub Franchise STL cap
  → CRB trustworthiness score for region

Corporate Franchise STL affects:
  → Regional credibility multiplier
  → STL override power
```

### Low Performing Franchise Effect:
| Franchise STL | Impact |
|--------------|--------|
| < 40 (L1) | Cannot onboard new sellers |
| < 60 (L2) | Cannot conduct CRB inspections |
| < 75 (L3) | No complaint escalation authority |
| STL freezes | All operations paused |
| STL banned | Entire franchise removed, re-assigned |

---

## PART 7: FRANCHISE COMPLIANCE + MONITORING

### Auto-Monitored KPIs (AI):
| KPI | Target | Penalty for Miss |
|-----|--------|-----------------|
| Complaint response time | <2 hrs | -5 STL |
| CRB inspection accuracy | >95% | -10 STL |
| Rider on-time rate | >90% | -3 STL |
| Seller retention rate | >80% | Warning |
| Monthly report submission | 100% | -5 STL |

### Franchise Audit (DMO Triggered):
- Random audits (AI selects franchises monthly)
- Physical visit by Corporate inspector
- Financial records review
- Complaint log audit
- Staff (inspectors/riders) STL check

### Franchise Suspension Triggers:
1. STL drops below 40
2. 3+ unresolved major complaints
3. Inspector fraud detected in franchise
4. Financial irregularity found
5. Missed 2 consecutive monthly reports

---

## PART 8: FRANCHISE DASHBOARD (DMO VIEW)

### Each Franchise Level Sees:
| Dashboard Section | Sub | Master | Corporate | Country | HO |
|-------------------|-----|--------|-----------|---------|-----|
| Their own performance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Direct sub-units | ❌ | ✅ | ✅ | ✅ | ✅ |
| STL override tools | ❌ | Limited | ✅ | ✅ | ✅ |
| CRB approval panel | Submit | Approve L1 | Approve L2 | Final | ✅ |
| Complaint handling | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Final |
| Revenue data | Own | Area | Region | Country | All |
| Inspector management | View | Manage | Oversee | Monitor | All |

---

## PART 9: FRANCHISE APPLICATION PROCESS

### Sub Franchise Application Flow:
```
User Applies for Sub Franchise (via platform)
        ↓
System Checks:
  ✓ STL L3 minimum
  ✓ PSS complete
  ✓ No fraud history
  ✓ No active complaints
        ↓
DMO Preliminary Review
        ↓
Master Franchise in area reviews
        ↓
Physical Inspection of proposed premises
        ↓
Interview (video call with Master)
        ↓
Franchise Agreement Generated + Signed
        ↓
Franchise Fee Paid (EHBGC)
        ↓
Training Period (30 days, online + offline)
        ↓
Soft Launch (limited operations)
        ↓
Full Activation (after 30-day review)
        ↓
6-Month contract begins
```

### Documents Required:
- CNIC / Passport (PSS already covers this)
- Business registration (company or individual)
- Physical premises lease/ownership proof
- Franchise fee payment proof
- Reference from existing EHB user (for Sub level)

---

## PART 10: FRANCHISE CONTRACT RENEWAL (6-MONTH)

### Renewal Evaluation:
| Criterion | Weight |
|-----------|--------|
| Complaint response KPIs | 25% |
| CRB accuracy rate | 20% |
| Revenue growth | 15% |
| STL score maintained | 15% |
| Inspector performance | 15% |
| DMO audit result | 10% |

### Renewal Outcomes:
| Score | Outcome |
|-------|---------|
| 80–100 | Renewed + performance bonus |
| 60–79 | Renewed (standard) |
| 40–59 | Renewed on probation (3-month review) |
| < 40 | Not renewed → franchise removed → re-tendered |

### Franchise Competition (if removed):
- Seat is re-tendered
- Eligible applicants in area can compete
- Selection: AI ranks + Master Franchise interview
- Previous holder can re-apply after 60-day cooldown

---

## PART 11: ADVANCED FRANCHISE FEATURES (BONUS)

### 1. Franchise Performance League
- Monthly ranking of all Sub Franchises per Master area
- Top 3 → bonus EHBGC reward
- Bottom 3 → warning + improvement plan
- Public leaderboard (franchise names visible)

### 2. Franchise Mentorship Program
- New Sub Franchise paired with a Top-10 performing Sub
- Mentor receives EHBGC incentive per mentee milestone
- Reduces early failure rate

### 3. Franchise Emergency Protocol
- If Sub Franchise goes offline/suspended:
  - Master auto-takes over that area temporarily
  - Users redirected to adjacent Sub
  - SLA maintained

### 4. Multi-Area Franchise
- Top-performing Sub Franchise (L5 STL + 12 months clean) can apply for 2nd area
- Maximum 3 Sub areas per operator
- Each area counts separately for KPIs

### 5. Franchise Credit System
- High-performing franchises earn EHBGC credit
- Credit usable for: franchise fee waiver, priority tech support, advanced training
- Credit lost if KPIs drop

### 6. Investor Franchise Mode
- Silent investor can co-fund a franchise
- Operator runs daily operations
- Investor earns % of franchise income
- All tracked transparently on-chain

---

## PART 12: DATABASE MODELS

```prisma
model FranchiseProfile {
  id
  userId (operator)
  level (SUB/MASTER/CORPORATE/COUNTRY/HEAD_OFFICE)
  parentFranchiseId
  area (city/district/region/country)
  gpsCoordinates
  status (PENDING/ACTIVE/SUSPENDED/TERMINATED)
  stlScore
  premises (verified: Boolean)
  activatedAt
  contractExpiresAt
  kpiScore (0-100)
}

model FranchiseContract {
  id
  franchiseId
  startDate
  endDate
  status (ACTIVE/COMPLETED/TERMINATED/COMPETING)
  renewalScore
  renewed (Boolean)
  replacedByFranchiseId
}

model FranchiseEarning {
  id
  franchiseId
  sourceType (TRANSACTION/INSPECTION/ONBOARDING)
  sourceId
  amount (EHBGC)
  earnedAt
  distributed (Boolean)
}

model FranchiseAudit {
  id
  franchiseId
  auditType (RANDOM/COMPLAINT/SCHEDULED)
  conductedBy
  findingSummary
  score
  actionRequired
  auditedAt
}

model FranchiseApplication {
  id
  applicantId
  level
  area
  status (SUBMITTED/UNDER_REVIEW/APPROVED/REJECTED)
  masterFranchiseDecision
  dmoDecision
  appliedAt
}
```

---

## PART 13: API ROUTES PLAN

```
# Franchise Profile
GET    /api/franchise/profile               → Own franchise data
GET    /api/franchise/area                  → Area coverage info
GET    /api/franchise/earnings              → Earning history
GET    /api/franchise/kpis                 → Live KPI dashboard

# Applications
POST   /api/franchise/apply                → Apply for franchise
GET    /api/franchise/application/status   → Check application status

# Contract
GET    /api/franchise/contract             → Active contract
POST   /api/franchise/contract/renew       → Apply for renewal

# CRB Routing
POST   /api/franchise/crb/route            → Assign CRB inspector
GET    /api/franchise/crb/queue            → Pending CRB in area
PATCH  /api/franchise/crb/approve/[id]     → Master: approve CRB report

# Inspectors
GET    /api/franchise/inspectors           → Manage inspectors
PATCH  /api/franchise/inspectors/[id]      → Update inspector status

# DMO Controls
GET    /api/dmo/franchise/all              → All franchises
GET    /api/dmo/franchise/[id]             → Franchise detail
PATCH  /api/dmo/franchise/[id]/suspend     → Suspend franchise
GET    /api/dmo/franchise/leaderboard      → Performance ranking
GET    /api/dmo/franchise/audit/[id]       → Audit franchise
```

---

*Franchise Plan v1.0 | April 2026 | Planning Phase*
