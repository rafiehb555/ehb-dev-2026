# EHB-PSS + CRB — Complete System Plan
> PSS: Proof & Security System | CRB: Certification Registry Board
> Version: 1.0 | April 2026 | Status: PLANNING

---

# SECTION A: PSS — PROOF & SECURITY SYSTEM

## A1: WHAT IS PSS

**PSS = EHB's Identity + Security + Trust Verification System**

Without PSS → No platform access
PSS score → Foundation of STL score (contributes 0–40 points)

---

## A2: PSS — 5 LAYERS

### Layer 1: Identity Verification (CNIC/Passport)
**Score: +15 STL**

| Step | Action | Auto/Manual |
|------|--------|------------|
| Upload CNIC / Passport | User uploads image | User |
| OCR Extract | AI reads text, extracts data | 🤖 Auto |
| NADRA/Database Match | Compare with national DB | 🤖 Auto |
| Fake ID Detection | AI flags suspicious docs | 🤖 Auto |
| Manual Review (if flagged) | DMO staff reviews | 👨‍💼 Manual |

**AI Tools:** Google Vision API for OCR, AWS Rekognition for validation

---

### Layer 2: Face Verification (Biometric)
**Score: +10 STL**

| Step | Action | Auto/Manual |
|------|--------|------------|
| Live Selfie | User takes selfie | User |
| Liveness Detection | Detects real person (not photo) | 🤖 Auto |
| Face-to-CNIC Match | Compare face with ID photo | 🤖 Auto |
| Anti-Spoof Check | Block photo/video attacks | 🤖 Auto |

**AI Tools:** AWS Rekognition, OpenAI Vision, Custom model

---

### Layer 3: Contact Verification
**Score: +5 STL**

| Step | Action |
|------|--------|
| Phone OTP | SMS/WhatsApp OTP sent, confirmed |
| Email OTP | Email link clicked |
| Both required | Must complete both |

---

### Layer 4: Device + Location Trust
**Score: +5 STL**

| Feature | Description |
|---------|------------|
| Device Fingerprint | Unique device ID stored |
| IP Tracking | Unusual IP change flagged |
| Location Consistency | Login from very different locations flagged |
| Multi-Device Detection | Same account, many devices = risk |
| Suspicious Login Alert | Email/SMS on new device login |

---

### Layer 5: Business/Role Verification (Optional)
**Score: +5 STL**

Required for: Sellers, Franchise Applicants, Inspectors

| Document | Role |
|---------|------|
| Business registration | Seller / Company |
| Tax/NTN certificate | Business seller |
| Shop photos | Physical retailer |
| Franchise license | Franchise applicant |
| Professional license | Inspector/medical/legal |

**Process:** Upload → AI review → DMO approval

---

## A3: PSS TOTAL SCORE

```
PSS Score (0–40):
  Layer 1 (Identity):  +15
  Layer 2 (Face):      +10
  Layer 3 (Contact):   +5
  Layer 4 (Device):    +5
  Layer 5 (Business):  +5
  ─────────────────────────
  MAXIMUM:             +40
```

---

## A4: PSS → STL CONNECTION

```
PSS Phase 0 completed → +0 STL (nothing done)
PSS Phase 1 completed → +30 STL (identity + device)
PSS Phase 2 completed → +40 STL (full KYC + AML)
PSS Phase 3+ → Capped at 40
```

Level unlock via PSS:
```
PSS score 0–15  → STL L1 (Low Trust)
PSS score 15–30 → STL L2 (Basic Verified)
PSS score 30–40 → STL L3 potential (need CRB for full L3)
```

---

## A5: PSS FRAUD CONTROL

### Detection Rules:
| Signal | Action |
|--------|--------|
| Fake CNIC | Account flagged, fraud signal |
| Face mismatch | Account held, review |
| 3+ accounts same device | Multiple accounts fraud signal |
| Location mismatch (extreme) | Suspicious activity flag |
| AML flag | Account held, DMO review |

### Auto Penalties:
```
1 fraud signal → Warning + STL -10
2 fraud signals → Account hold
3 fraud signals → Account freeze + investigation
Proven fraud → Account ban + PSS blacklist
```

---

## A6: PSS REFILLING (RE-VERIFICATION)

| STL Level | Frequency |
|-----------|-----------|
| L1 | Not required |
| L2 | 12 months |
| L3 | 6 months |
| L4 | 3 months |
| L5 | 1–2 months |

### What's Re-checked:
- Face re-scan (ensure still same person)
- Device security check
- Business documents (if any expired)
- AML re-screening

---

## A7: PSS DATABASE MODELS

```prisma
model PSSVerification {
  userId
  phaseCompleted (0-3)
  identityStatus (PENDING/VERIFIED/FAILED)
  faceStatus
  contactStatus
  deviceStatus
  businessStatus
  overallScore (0-40)
  lastRefillingAt
  nextRefillingAt
  amlStatus
}

model DeviceSession {
  userId
  deviceFingerprint
  ipAddress
  location
  firstSeen
  lastSeen
  isTrusted
  flaggedAt
}

model AMLRecord {
  userId
  checkDate
  status (CLEAR/FLAGGED/REVIEW)
  flagReason
}
```

---

## A8: PSS API ROUTES PLAN

```
POST   /api/pss/start               → Begin PSS process
POST   /api/pss/identity            → Upload CNIC
POST   /api/pss/face                → Submit face scan
POST   /api/pss/otp/send            → Send OTP
POST   /api/pss/otp/verify          → Verify OTP
GET    /api/pss/status              → Current PSS status
POST   /api/pss/business            → Upload business docs
GET    /api/pss/history             → PSS history log
GET    /api/dmo/pss/queue           → DMO: pending manual reviews
PATCH  /api/dmo/pss/review/[id]     → DMO: approve/reject
```

---

# SECTION B: CRB — CERTIFICATION REGISTRY BOARD

## B1: WHAT IS CRB

**CRB = EHB's Physical Verification & Certification System**

PSS = Digital trust (online identity)
CRB = Physical trust (real-world verification)

Without CRB → STL stays at L1/L2 maximum
With CRB → STL can reach L3, L4, L5

---

## B2: CRB FLOW (COMPLETE)

```
User Applies for CRB
        ↓
DMO Reviews Application
        ↓
AI Routes to Available Franchise (RANDOM rotation)
        ↓
Sub Franchise Assigned
        ↓
Inspector Dispatched
        ↓
Physical Visit (GPS logged, timestamped)
        ↓
Inspector Checks:
  → Identity match
  → Business premises
  → Products/Services
  → Location verification
  → Activity proof
        ↓
Inspector Submits Report + Photos/Videos
        ↓
Sub Franchise Supervisor Reviews
        ↓
Master Franchise Reviews
        ↓
Corporate Franchise Approves
        ↓
DMO Final Decision
        ↓
CRB Certificate Issued → Blockchain Hash
        ↓
STL Boost Applied (+10 to +20)
```

---

## B3: CRB CERTIFICATE LEVELS

| Level | Name | Process | STL Boost |
|-------|------|---------|-----------|
| L1 | None | No CRB | 0 |
| L2 | Light CRB | Document review only | +5 |
| L3 | Standard CRB | Physical visit | +10 |
| L4 | Advanced CRB | Deep inspection | +15 |
| L5 | VIP CRB | Full audit + continuous | +20 |

---

## B4: INSPECTOR SYSTEM

### Inspector App Features:

**Mobile App (Android/iOS):**
- Login with inspector credentials
- View assigned tasks (with deadline)
- GPS auto-on during inspection (proof of location)
- Camera: Photo + Video with geo-tag + timestamp (tamper-proof)
- Offline mode: Fill forms without internet, sync on connect
- Checklist form (customizable per industry)
- Report submission

**Web Panel:**
- Same features via browser
- Document upload support
- Case history and prior reports
- Communication with DMO

### Inspector Accountability:
```
Inspector submits fake report → Fraud signal
Inspector gives wrong approval → STL drop + investigation
Inspector fraud confirmed → Ban + legal action
```

---

## B5: ANTI-CORRUPTION ROUTING SYSTEM (CRITICAL FEATURE)

### Problem: Same franchise = potential corruption
### Solution: Random Rotating Assignment

**Rules:**
1. First inspection → AI randomly assigns from nearby franchises
2. Refilling → DIFFERENT franchise assigned each time (never same twice in a row)
3. If no local franchise → Nearest available area
4. If no franchise in country → CRB not possible → STL capped at L2

### Rotation Logic:
```
CRB Request
    ↓
System pulls: User's location
    ↓
Available Sub Franchises in radius (sorted by performance + STL)
    ↓
Exclude: Last franchise used (anti-repeat)
    ↓
Randomly select from eligible list
    ↓
Assign Inspector from selected franchise
```

---

## B6: CRB REFILLING (RE-VERIFICATION)

| STL Level | Physical Refilling |
|-----------|-------------------|
| L1 | Not required |
| L2 | 12 months |
| L3 | 6 months |
| L4 | 3 months |
| L5 VIP | 1–2 months + random surprise inspections |

**L5 Special Rule:**
- Random surprise inspections (no advance notice)
- AI can trigger unscheduled inspection if anomaly detected
- Continuous monitoring

### Refilling Failure Consequences:
| Status | Effect |
|--------|--------|
| Passed | STL maintained/increased |
| Pending | Warning issued |
| Failed | STL drops, re-apply required |
| Missed | Auto-downgrade |

---

## B7: CRB + ALL SYSTEMS

| System | CRB Role |
|--------|---------|
| STL | CRB score = 0–20 STL component |
| PSS | CRB verifies physical presence (extends PSS) |
| GoSellr | "CRB Verified Seller" badge on store |
| JPS | Skill/work physical verification |
| Franchise | Mandatory CRB for all franchise operators |
| Blockchain | Certificate hash stored on-chain |

---

## B8: CRB DATABASE MODELS

```prisma
model CRBApplication {
  id
  applicantId (userId)
  assignedFranchiseId
  inspectorId
  status (PENDING/ASSIGNED/IN_PROGRESS/SUBMITTED/APPROVED/REJECTED)
  inspectionDate
  reportSubmittedAt
  masterApprovedAt
  corporateApprovedAt
  dmoApprovedAt
  certLevel
}

model InspectionReport {
  id
  applicationId
  inspectorId
  photos: String[] (URLs)
  videos: String[] (URLs)
  gpsLocation
  visitTimestamp
  checklistData: Json
  score (0-100)
  fraudSuspected: Boolean
  notes
}

model CRBCertificate {
  id
  entityId
  type (USER/SERVICE/PRODUCT)
  level (LIGHT/STANDARD/ADVANCED/VIP)
  status (ACTIVE/EXPIRED/REVOKED)
  issuedAt
  expiryDate
  blockchainHash
}

model CRBRefillSchedule {
  entityId
  lastInspectionDate
  nextDueDate
  lastFranchiseId (for rotation)
  gracePeriodDays
}
```

---

## B9: CRB API ROUTES PLAN

```
POST   /api/crb/apply                → Submit CRB application
GET    /api/crb/status               → User's CRB status
GET    /api/crb/certificate          → Active certificate

POST   /api/crb/inspect/report       → Inspector submits report
GET    /api/crb/inspect/tasks        → Inspector's assigned tasks

PATCH  /api/dmo/crb/review/[id]      → DMO: approve/reject
GET    /api/dmo/crb/queue            → DMO: all pending CRB
GET    /api/dmo/crb/reports          → All inspection reports

POST   /api/crb/refilling/apply      → Apply for refilling
GET    /api/crb/refilling/schedule   → User's refilling schedule
```

---

*PSS + CRB Plan v1.0 | April 2026 | Planning Phase*
