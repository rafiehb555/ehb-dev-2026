# DMO – DECENTRALIZED MANAGEMENT OFFICE

> Complete Developer-Ready Blueprint

## Visual References
- Data Flow & UI/UX: `assets/dmo-data-flow-ui.png`
- DMO + CRB + PSS Workflow: `assets/dmo-crb-pss-workflow.png`

---

# 1. DMO OVERVIEW

**DMO (Decentralized Management Office)** is the **core operating layer** of EHB ecosystem.

All applications (GoSellr, WMS, AGTS, OLS, etc.) **read/write data through DMO**.

## Principles

| Principle | Description |
|-----------|-------------|
| Single Source of Truth | Users, companies, certificates, STL, wallet, applications - all in DMO |
| Immutability | Critical records get blockchain hash |
| Policy Control | Verification, penalties, approvals via DMO rules |
| Plug-in Services | New services connect via DMO APIs |

---

# 2. HIGH-LEVEL ARCHITECTURE

```
Client Apps (Web / Mobile / Admin)
            │
        API Gateway
            │
        DMO Core
 ┌──────────┼───────────┐
 │          │           │
PSS       CRB         STL AI
 │          │           │
 └──────┬───┴───────┬───┘
        │           │
     DMO DB      Event Bus
        │           │
     Cache       Workers
        │
   Blockchain Anchor
```

## Core Components

| Component | Purpose |
|-----------|---------|
| API Gateway | Auth, rate-limiting |
| DMO Core Services | Users, companies, applications, certificates, wallet |
| PSS | AI online verification |
| CRB | Physical certification + 6-month refilling |
| STL AI | Trust scoring & ranking |
| Event Bus | Async workflows |
| Blockchain Anchor | Hash records |

---

# 3. DMO MODULES

## A) Identity & Profiles (JPS)

**Purpose:** User and company identity management

**Features:**
- User accounts
- Professional profile (skills, education)
- Company profiles
- Roles (user, provider, officer, franchise)

**Tables:**
- `users`
- `profiles`
- `skills`
- `companies`

---

## B) Verification Layer

### PSS – Proof & Security System

**Type:** Online AI Checks

| Check | Method |
|-------|--------|
| ID/KYC | Document scan |
| Degree | OCR validation |
| Documents | Fraud detection |
| Identity | Face match |

**Tables:**
- `pss_checks`
- `documents`
- `kyc_records`

---

### CRB – Central Record Blockchain

**Type:** Physical Checks

| Check | Method |
|-------|--------|
| Skills | Interview/test |
| Office | Inspection |
| Products | Verification |
| Refilling | 6-month cycle |

**Tables:**
- `crb_applications`
- `inspections`
- `certificates`
- `refilling_records`

---

## C) EHB STL (Trust Engine)

**AI Scoring Based On:**
- Verification results
- Customer reviews
- Complaint history
- Refilling performance

**Tables:**
- `stl_scores`
- `stl_history`

**Levels:** Free → Basic → Medium → High → VIP

---

## D) Wallet & Finance

**Operations:**
- User wallet management
- Service fees
- Penalties
- Franchise commission

**Tables:**
- `wallet_accounts`
- `transactions`
- `penalties`

---

## E) Application Workflow Engine

**Application Types:**
- Licenses
- Approvals
- Certifications
- Government services

**Auto-routing through officer hierarchy**

**Tables:**
- `applications`
- `workflow_steps`
- `approvals`

---

## F) Certificates & Registry

**Stores:**
- Licenses
- Diplomas
- CRB certificates
- Company registrations

**Tables:**
- `licenses`
- `certificates`
- `registry_entries`

---

## G) Notifications & Compliance

**Triggers:**
- Refilling due
- Penalties issued
- Approval decisions
- STL changes

**Tables:**
- `notifications`
- `alerts`

---

## H) Blockchain Anchoring

**Records Hashed:**
- Certificates
- Inspection reports
- STL changes
- Approvals

**Table:**
- `blockchain_hashes`

---

# 4. DMO DATABASE ENTITIES

```
Core Identity:
├── users
├── profiles
├── companies
└── documents

Verification:
├── pss_checks
├── crb_applications
├── inspections
├── certificates
└── refilling_records

Trust & Finance:
├── stl_scores
├── wallet_accounts
├── transactions
└── penalties

Workflow:
├── applications
├── workflow_steps
└── approvals

System:
├── notifications
└── blockchain_hashes
```

**Total: 16+ core tables**

---

# 5. API DESIGN

## Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/register | User registration |
| POST | /auth/login | Authentication |
| POST | /profiles/update | Update JPS profile |
| POST | /pss/verify | Submit PSS verification |
| GET | /pss/status | Check verification status |
| POST | /crb/apply | Apply for CRB certification |
| GET | /crb/certificates | Get user certificates |
| POST | /applications/submit | Submit application |
| GET | /applications/status | Check application status |
| GET | /stl/score/{user} | Get STL score |
| POST | /wallet/transfer | Wallet transaction |
| GET | /wallet/balance | Get balance |
| GET | /notifications | Get notifications |

**Security:** All APIs secured by JWT + role policies

---

# 6. MAIN USER FLOW

```
┌─────────────────────────────────────────────────────────┐
│                    USER JOURNEY                         │
└─────────────────────────────────────────────────────────┘

Step 1: Registration
    App → API Gateway → DMO.users
              │
              ▼
Step 2: JPS Profile
    Add profession, skills, education
    Stored in `profiles`
              │
              ▼
Step 3: STL Application
    Choose level: Free/Basic/Medium/High/VIP
              │
              ▼
Step 4: PSS Verification
    Upload ID, degree, documents
    AI validates
              │
              ▼
Step 5: CRB Certification
    Inspector performs:
    - Skill test
    - Interview
    - Workplace verification
              │
              ▼
Step 6: DMO Storage
    Records saved to database
    Blockchain hash created
              │
              ▼
Step 7: STL Calculation
    AI engine updates trust score
              │
              ▼
Step 8: Service Activation
    User appears in services (GoSellr, WMS, etc.)
```

---

# 7. REFILLING FLOW (Every 6 Months)

```
Timer Trigger
      ↓
Refilling Notification
      ↓
User Re-Test & Interview
      ↓
Company/Product Re-check
      ↓
CRB Evaluation
      ↓
STL Update
      ↓
DMO + Blockchain Record
```

## Non-Compliance Handling

| Day | Action |
|-----|--------|
| Day 1-7 | Reminders sent |
| Day 8 | Services hidden |
| Day 15 | STL downgrade |
| Day 30 | Account suspension |

---

# 8. APPLICATION APPROVAL FLOW

```
User Submit
     ↓
DMO Validation (auto-check)
     ↓
Junior Officer (review)
     ↓
Senior Officer (approve/escalate)
     ↓
Department Head (final)
     ↓
Decision (approved/rejected)
```

All actions logged in `workflow_steps`.

---

# 9. SECURITY MODEL

| Layer | Implementation |
|-------|----------------|
| Authentication | OAuth 2.0 / JWT |
| Authorization | Role-based access (RBAC) |
| Data Protection | Encrypted DB (AES-256) |
| Audit | Complete audit logs |
| Immutability | Blockchain records |

---

# 10. TECH STACK

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Node.js (NestJS) |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | Kafka / RabbitMQ |
| Blockchain | Polkadot / Substrate |
| AI | OCR, Anomaly detection, STL model |

---

# 11. DEPLOYMENT ARCHITECTURE

```
┌─────────────────┐
│       CDN       │
└────────┬────────┘
         │
┌────────▼────────┐
│  Load Balancer  │
└────────┬────────┘
         │
┌────────▼────────┐
│   API Gateway   │
└────────┬────────┘
         │
┌────────▼────────┐
│  Microservices  │
│    Cluster      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Postgres│ │ Redis │
└───┬───┘ └───────┘
    │
┌───▼───────────┐
│   Blockchain  │
│  Anchor Node  │
└───────────────┘
```

**Containerized via Docker + Kubernetes**

---

# 12. DMO + CRB + PSS INTEGRATED WORKFLOW

```
┌─────────────────────────────────────────────────────────┐
│              USER / COMPANY / INSTITUTION               │
│  • JPS Profile                                          │
│  • STL Level Selection                                  │
│  • Application Submission                               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼ Request & Application
┌─────────────────────────────────────────────────────────┐
│                        DMO                              │
│            Decentralized Management Office              │
│  ◆ Data Management                                      │
│  ◆ Blockchain Record                                    │
│  ◆ Workflow Control                                     │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
           ▼ Inspections & Certification  ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│         CRB          │    │            PSS              │
│ Certification &      │    │   Proof & Security System   │
│ Registry Board       │    │  ◆ ID Verification          │
│  ◆ Physical Inspect  │    │  ◆ Document Scanning        │
│  ◆ Skill & Product   │    │  ◆ Fraud Detection          │
│  ◆ Certification     │    │                             │
└──────────┬───────────┘    └──────────────┬──────────────┘
           │                               │
           └───────────────┬───────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Trusted Services │ Certificate │ STL Update │ Alerts  │
└─────────────────────────────┬───────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN RECORD                      │
│           Secure Data Storage • Immutable Records       │
└─────────────────────────────────────────────────────────┘
```

---

# 13. DMO BENEFITS

| Benefit | Description |
|---------|-------------|
| Unified Control | Single ecosystem management |
| Transparent Verification | Clear trust building |
| Automated Workflows | Efficient approvals |
| Global Compliance | Standardized framework |
| Scalable Architecture | Super-platform ready |

---

# 14. FINAL SYSTEM FLOW

```
User / Company
      ↓
JPS Profile Creation
      ↓
STL Level Application
      ↓
PSS AI Verification
      ↓
CRB Physical Certification
      ↓
DMO Storage
      ↓
Blockchain Hash
      ↓
Service Activation
      ↓
6-Month Refilling Cycle (repeat)
```

---

*DMO Blueprint Version: 1.0 | March 2026*
