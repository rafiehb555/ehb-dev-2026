# DMO GLOBAL DATA FLOW ARCHITECTURE

> End-to-End Data Movement in EHB Ecosystem

---

# OVERVIEW

All data in EHB ecosystem flows through **controlled workflows** managed by DMO.

---

# CORE DATA FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER / COMPANY                                  │
│                   (Data Origin Point)                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       JPS PROFILE                                   │
│              (Professional Identity Created)                        │
│     • Personal info • Skills • Education • Experience              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STL LEVEL APPLICATION                             │
│                (Trust Level Selection)                              │
│          Free → Basic → Medium → High → VIP                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   PSS ONLINE VERIFICATION                           │
│                    (AI-Powered Checks)                              │
│     • KYC/Identity • Document OCR • Fraud Detection • Face Match   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CRB PHYSICAL CERTIFICATION                         │
│                   (Human Verification)                              │
│     • Skill Tests • Interviews • Inspections • Product Tests       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DMO CORE                                   │
│              (Central Processing & Storage)                         │
│                                                                     │
│  ┌─────────────┬─────────────┬─────────────┬─────────────────────┐ │
│  │   Wallet    │ Applications│  Services   │    Certificates     │ │
│  │  Management │  Workflow   │ Activation  │      Registry       │ │
│  └─────────────┴─────────────┴─────────────┴─────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN REGISTRY                              │
│                  (Immutable Trust Layer)                            │
│          Certificate Hashes • STL Updates • Audit Logs             │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 3-LAYER DATA ARCHITECTURE

## Layer 1: Application Layer (User Interaction)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │   Mobile App  │  │    Web App    │  │ Officer Portal│          │
│  │               │  │               │  │               │          │
│  │ • iOS        │  │ • Next.js     │  │ • DMO Admin   │          │
│  │ • Android    │  │ • Responsive  │  │ • CRB Portal  │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │ Franchise App │  │  Seller App   │  │  Provider App │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Functions:**
- User registration & login
- Profile management
- Service browsing
- Transaction initiation
- Application submission

---

## Layer 2: Processing Layer (DMO Core)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      API GATEWAY                             │   │
│  │            Authentication │ Routing │ Rate Limiting          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│         ┌────────────────────┼────────────────────┐                │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐        │
│  │ Verification│      │  Workflow   │      │  Financial  │        │
│  │   Engine    │      │   Engine    │      │   Engine    │        │
│  │             │      │             │      │             │        │
│  │ • PSS AI    │      │ • Apps      │      │ • Wallet    │        │
│  │ • CRB Flow  │      │ • Approvals │      │ • Payments  │        │
│  │ • STL Calc  │      │ • Routing   │      │ • Escrow    │        │
│  └─────────────┘      └─────────────┘      └─────────────┘        │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                │
│                              │                                      │
│                    ┌─────────┴─────────┐                           │
│                    │    DMO DATABASE   │                           │
│                    │    (PostgreSQL)   │                           │
│                    └───────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Functions:**
- Verify data integrity
- Process applications
- Update STL scores
- Manage workflows
- Store records

---

## Layer 3: Trust Layer (Immutable Records)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRUST LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    BLOCKCHAIN NETWORK                        │   │
│  │                   (Polkadot Parachain)                       │   │
│  │                                                              │   │
│  │   Certificate Hashes │ STL Proofs │ Verification Records    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     AI VERIFICATION                          │   │
│  │                                                              │   │
│  │   OCR Engine │ Fraud Detection │ Face Recognition           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       AUDIT LOGS                             │   │
│  │                                                              │   │
│  │   Action Logs │ Access Logs │ Change History │ Compliance   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Functions:**
- Store tamper-proof records
- AI-powered verification
- Complete audit trail
- Compliance logging

---

# GLOBAL DATA FLOW

## Multi-Region Data Movement

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                                 │
│                    (Mobile / Web / Desktop)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CDN / EDGE LAYER                             │
│                   (CloudFlare / AWS CloudFront)                     │
│                     Low latency content delivery                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       REGIONAL SERVER                               │
│                    (Asia / Europe / America)                        │
│                      Regional load balancing                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      COUNTRY DMO NODE                               │
│                   (Pakistan / UAE / Germany)                        │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  LOCAL DATABASE                                              │  │
│   │  • User PII (stays in country)                              │  │
│   │  • KYC documents                                             │  │
│   │  • Medical records                                           │  │
│   │  • Financial data                                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                         Metadata Sync Only
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       GLOBAL DMO CORE                               │
│                     (Central Coordination)                          │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  GLOBAL DATABASE                                             │  │
│   │  • STL scores                                                │  │
│   │  • Service listings                                          │  │
│   │  • Analytics                                                 │  │
│   │  • Cross-border data                                         │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN ANCHOR                              │
│                   (Polkadot / Immutable Layer)                      │
│                                                                     │
│   • Certificate hashes                                              │
│   • Verification proofs                                             │
│   • Audit records                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

# DATA FLOW BY OPERATION

## 1. User Registration Flow

```
User Signup → Validate Email → Create Account → Generate Wallet 
    → Send Welcome → Log Activity
```

## 2. Verification Flow

```
Submit Docs → PSS AI Check → Fraud Scan → Face Match 
    → Result → Update STL → Blockchain Hash
```

## 3. Service Booking Flow

```
Select Service → Choose Provider → Schedule → Payment (Escrow)
    → Notification → Service Delivery → Release Escrow → Review
```

## 4. Application Flow

```
Submit App → DMO Validate → Officer Queue → Review → Approve/Reject
    → Notification → Certificate Issue → Blockchain Record
```

---

# DATA SYNC PATTERNS

| Data Type | Sync Pattern | Frequency |
|-----------|--------------|-----------|
| User PII | Never leaves country | N/A |
| STL Scores | Real-time sync | Immediate |
| Service Listings | Periodic sync | Every hour |
| Blockchain Hashes | On creation | Immediate |
| Analytics | Batch sync | Daily |

---

*DMO Data Flow Architecture v1.0 | March 2026*
