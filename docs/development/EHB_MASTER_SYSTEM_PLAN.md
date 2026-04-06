# EHB — MASTER SYSTEM PLAN
> Education Health Business — Global AI-Powered Ecosystem
> Version: 3.0 | April 2026 | Status: PLANNING COMPLETE

---

## DOCUMENT INDEX

| Document | Coverage |
|----------|----------|
| `EHB_MASTER_SYSTEM_PLAN.md` | This file — Architecture, Core Systems, Token |
| `EHB_STL_FULL_PLAN.md` | STL complete plan (already written) |
| `EHB_GOSELLR_PLAN.md` | GoSellr — Seller, Products, Orders, Delivery |
| `EHB_PSS_PLAN.md` | PSS — Identity, Face, KYC, Fraud |
| `EHB_CRB_PLAN.md` | CRB — Physical Verification, Inspector, Routing |
| `EHB_JPS_PLAN.md` | JPS — Jobs, Designations, Skills, Education |
| `EHB_FRANCHISE_PLAN.md` | Franchise Hierarchy + Control |
| `EHB_DMO_PLAN.md` | DMO — Governance, Dashboards, Communication |
| `EHB_WALLET_TOKEN_PLAN.md` | Wallet + EHBGC Token + Blockchain |
| `EHB_COMPLAINT_PENALTY_PLAN.md` | Complaint, Escalation, Penalty |
| `EHB_AFFILIATE_PLAN.md` | Affiliate + Network Earning |

---

## PART 1: WHAT IS EHB

**EHB (Education Health Business)** is a **Global AI-powered Super App Ecosystem** that combines:

- Multi-industry marketplace (GoSellr)
- Workforce & hiring platform (JPS)
- Trust & verification engine (PSS + CRB + STL)
- Franchise distribution network
- Decentralized governance (DMO)
- Blockchain-based trust records
- Native cryptocurrency (EHBGC Coin)

**One platform — everything from buying groceries to hiring a doctor to running a franchise.**

---

## PART 2: PLATFORM LAUNCH STRATEGY

### Phase 1: Pakistan Launch
- All core systems active
- Languages: Urdu + English
- Currencies: PKR primary
- Payment: JazzCash, EasyPaisa, UBL, Alfalah, Bank Transfer
- Focus cities: Lahore, Karachi, Islamabad, Rawalpindi

### Phase 2: UK Launch
- Expand to United Kingdom
- Languages: English
- Currencies: GBP primary
- Payment: Stripe, PayPal, Bank Transfer
- Regulatory: UK GDPR, FCA compliance

### Phase 3: Global Expansion
- UAE, US, EU, Australia
- Currencies: USD, EUR, AED, USDT
- Binance Pay integration
- Mosaic Highway integration

---

## PART 3: CORE MODULES (OVERVIEW)

| Module | Code | Role |
|--------|------|------|
| Global Shopping Management | GoSellr / GSM | Marketplace |
| Job Provider System | JPS | Hiring + Skills |
| Proof & Security System | PSS | Identity verification |
| Certification Registry Board | CRB | Physical verification |
| Service Trust Level | STL | AI trust scoring |
| Decentralized Management Office | DMO | Central governance |
| EHB Wallet | Wallet | Payments + Earnings |
| EHBGC Coin | Token | Platform currency |
| Affiliate System | Affiliate | Network earning |
| Franchise Network | Franchise | Distribution |
| Communication System | Comms | Notifications, Chat |

---

## PART 4: SYSTEM ARCHITECTURE

### Technology Stack:

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Mobile App | React Native (iOS + Android) |
| Backend | Node.js + Express / NestJS |
| Database | MongoDB + Prisma ORM |
| Cache | Redis |
| Auth | JWT + Cookie sessions |
| AI/ML | OpenAI GPT-4, Claude AI, Google Vision, AWS Rekognition, Custom ML |
| Blockchain | Plan now, choose chain later (Polkadot preferred) |
| Payments | Stripe, PayPal, JazzCash, EasyPaisa, UBL, Alfalah, Binance Pay, Mosaic Highway |
| Notifications | WhatsApp Business API + SMS Gateway + Email (SendGrid) |
| Storage | AWS S3 / Cloudflare R2 |
| CDN | Cloudflare |

### Architecture Layers:

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│         (Web App + Mobile App + Inspector App)          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    API GATEWAY                          │
│              (Rate limiting, Auth, RBAC)                │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  DMO CORE ENGINE                        │
│   PSS │ CRB │ STL │ JPS │ Franchise │ Wallet │ AI      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│               DATABASE + BLOCKCHAIN                     │
│           MongoDB │ Redis │ Blockchain Ledger           │
└─────────────────────────────────────────────────────────┘
```

---

## PART 5: USER ROLES (COMPLETE RBAC)

### All Platform Roles:

```
SUPER_ADMIN           → Head Office (EHB Global)
COUNTRY_FRANCHISE     → Country level authority
CORPORATE_FRANCHISE   → Regional authority
MASTER_FRANCHISE      → District/city level
SUB_FRANCHISE         → Local area operator
INSPECTOR             → Physical verification agent
DMO_ANALYST           → Data & monitoring
DMO_SUPPORT           → Customer support

SELLER
  ├── COMPANY         → Manufacturer/Brand
  ├── DEALER          → Authorized dealer
  ├── DISTRIBUTOR     → Bulk distribution
  ├── WHOLESALER      → Bulk retail
  ├── RETAILER        → Direct consumer
  └── ONLINE_SELLER   → Virtual/dropship

DELIVERY_RIDER        → Delivery personnel
JOB_SEEKER            → JPS user
EMPLOYER              → Company hiring on JPS
SKILL_PROVIDER        → Training institute/trainer
BUYER                 → End customer
AFFILIATE             → Network marketer
VALIDATOR             → EHBGC coin validator
```

### Role Hierarchy:
```
SUPER_ADMIN
    ↓
COUNTRY_FRANCHISE (1 per country)
    ↓
CORPORATE_FRANCHISE (multiple per country)
    ↓
MASTER_FRANCHISE (25 per Corporate)
    ↓
SUB_FRANCHISE (25 per Master)
    ↓
INSPECTOR / SELLER / RIDER / USER
```

### Permission Matrix:

| Action | SUPER | COUNTRY | CORPORATE | MASTER | SUB | INSPECTOR | SELLER | USER |
|--------|-------|---------|-----------|--------|-----|-----------|--------|------|
| View all | ✅ | Country | Region | District | Local | Assigned | Own | Own |
| Override STL | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve CRB | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apply penalty | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit CRB report | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Create products | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Place orders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## PART 6: EHBGC COIN — TOKENOMICS

### EHBGC = EHB Global Coin

**Core Concept:**
- Native platform coin
- Everything on EHB settles in EHBGC
- Local currencies auto-convert to EHBGC on deposit
- Top of wallet shows EHBGC amount
- Bottom shows local currency equivalent value

### Wallet Structure:
```
┌────────────────────────────────────┐
│  EHB TRUST WALLET                  │
│                                    │
│  EHBGC Balance: 2,450.00          │
│  (≈ £1,225.00 GBP)                │
│  (≈ PKR 684,000)                  │
│                                    │
│  [Deposit]  [Withdraw]  [Send]    │
└────────────────────────────────────┘
```

### Auto-Conversion Flow:
```
User deposits £100 GBP
        ↓
System converts at current EHBGC rate
        ↓
EHBGC credited to wallet
        ↓
Used for all platform transactions
        ↓
Withdraw → convert back to local currency
```

### Token Use Cases:
1. **Transaction Currency** — Buy/sell on GoSellr in EHBGC
2. **Affiliate Earnings** — Commission paid in EHBGC
3. **STL Boost (Staking)** — Stake EHBGC to get temporary STL boost
4. **Governance Voting** — Token holders vote on platform changes
5. **Staking Rewards** — Hold EHBGC to earn staking yield
6. **Validator Earning** — Run validator node → earn EHBGC
7. **Franchise Fees** — Franchise payments in EHBGC

### Supported Payment Methods (into EHBGC):
| Method | Region | Type |
|--------|--------|------|
| Stripe | UK/EU | Card |
| PayPal | Global | Digital |
| JazzCash | Pakistan | Mobile |
| EasyPaisa | Pakistan | Mobile |
| UBL Bank | Pakistan | Bank |
| Bank Alfalah | Pakistan | Bank |
| Binance Pay | Global | Crypto |
| Mosaic Highway | Global | Payment rail |
| USDT | Global | Stablecoin |
| Bank Transfer | Global | Wire |

### Supported Currencies:
| Currency | Code | Region |
|----------|------|--------|
| Pakistani Rupee | PKR | Pakistan |
| British Pound | GBP | UK |
| US Dollar | USD | Global |
| Euro | EUR | EU |
| Tether (USDT) | USDT | Global crypto |

---

## PART 7: AI SYSTEM (COMPLETE)

### AI Tools Used:

| Tool | Purpose |
|------|---------|
| OpenAI GPT-4 | Recommendations, search, content, chatbot |
| Claude AI (Anthropic) | Analysis, governance decisions, document review |
| Google Vision API | Face verification, CNIC OCR |
| AWS Rekognition | Liveness detection, face matching |
| Custom ML Models | Fraud scoring, STL calculation, demand prediction |

### AI Functions Platform-wide:

1. **Identity AI (PSS)** — Face match, liveness, OCR, fake ID detection
2. **Trust AI (STL)** — Score calculation, fraud signal analysis
3. **Fraud AI** — Pattern detection, risk scoring (0–100)
4. **Matching AI (JPS)** — Candidate-job matching algorithm
5. **Search AI (GoSellr)** — Smart product/service ranking
6. **Price AI (GoSellr)** — Dynamic pricing suggestions
7. **Complaint AI** — Priority classification, escalation decisions
8. **Recommendation AI** — Personalized suggestions per user
9. **Chatbot AI** — Support, FAQ, first-line response
10. **Career Path AI (JPS)** — Skill gap analysis, growth roadmap

---

## PART 8: BLOCKCHAIN PLAN (DESIGN NOW, CHOOSE LATER)

### What Goes On Blockchain:
| Data | Why |
|------|-----|
| STL Score history | Tamper-proof trust records |
| CRB Certificates | Verifiable by anyone |
| Job/Work history | Immutable career proof |
| EHBGC Transactions | Decentralized ledger |
| Franchise records | Authority proof |
| Complaint resolutions | Accountability |
| Skill certificates (NFT) | Ownership proof |

### Blockchain Architecture Plan:
```
EHB Platform
    ↓
DMO Decision Engine
    ↓
Hash Generator
    ↓
Blockchain Layer (Polkadot preferred)
    ↓
Immutable Record
    ↓
Public Verification Portal
```

### Preferred Chain: Polkadot (existing EHB decision)
- Parachain-based scalability
- Cross-chain compatibility
- Low transaction fees
- EHBGC can be native token on parachain

---

## PART 9: NOTIFICATION SYSTEM

### Channels:
| Channel | Use Case |
|---------|---------|
| Platform Bell | All events |
| Email | Important updates, reports |
| WhatsApp Business API | Urgent alerts, OTPs |
| SMS Gateway | Backup for WhatsApp |
| Push Notification | Mobile app users |
| Dashboard Banner | Login-time warnings |

---

## PART 10: DELIVERY SYSTEM (ALL OPTIONS)

### Delivery Types:
1. **EHB Riders (platform employed)** — Core delivery workforce
2. **Franchise Riders** — Each sub franchise manages local riders
3. **Third-party Integration** — Rider, Bykea, other APIs
4. **Seller Self-Delivery** — Seller uses own courier/delivery
5. **All options** — Seller chooses at order time

### Rider Levels (JPS Designation):
| Level | Title | Role |
|-------|-------|------|
| L1 | Trainee Rider | Learning |
| L2 | Rider | Standard delivery |
| L3 | Verified Rider | CRB certified |
| L4 | Senior Rider | Priority orders |
| L5 | Fleet Leader | Manages riders |
| L6 | Logistics Manager | Area management |

---

## PART 11: 6-MONTH CONTRACT SYSTEM (UNIVERSAL)

### Applies to ALL roles:
- Sellers → 6-month seller license renewal
- Riders → 6-month performance review
- Franchise operators → 6-month area contract renewal
- Inspectors → 6-month performance + exam
- JPS employees → 6-month designation contract

### Evaluation Criteria:
1. Performance Score (AI tracked)
2. Knowledge Exam (field-specific)
3. Physical Verification (CRB inspection)
4. Complaint Ratio (must be < threshold)

### Competition System:
```
Seat → Multiple candidates compete
       ↓
All take exam + CRB check
       ↓
Highest scorer → Gets/keeps seat
       ↓
2nd → Lower designation
       ↓
Fail → Removed, reapply after 30 days
```

---

## PART 12: INSPECTOR APP (DUAL — MOBILE + WEB)

### Mobile App (Android/iOS):
- GPS location tracking (auto on during inspection)
- Photo/video capture with geo-tag + timestamp
- Offline form fill (sync when online)
- Report submission
- Assigned task list

### Web Panel:
- Same features via browser
- Large screen reporting
- Document uploads
- Case history view

---

## PART 13: COMPLETE SYSTEM FLOW

```
USER JOURNEY (FULL)

Register
    ↓
PSS Verification (Identity + Face + OTP + Device)
    ↓
STL L1 Generated
    ↓
JPS Profile Created (Skills, Experience, Education)
    ↓
Choose Role: Seller / Job Seeker / Buyer / Franchise
    ↓
Apply for CRB (Physical verification)
    ↓
Inspector Assigned (Random, rotating franchise)
    ↓
CRB Certificate Issued → STL Boost
    ↓
Go Live (Services / Products / Jobs)
    ↓
Orders / Transactions / Work
    ↓
Performance tracked (AI)
    ↓
Reviews + Ratings
    ↓
STL Recalculated (real-time)
    ↓
6-Month Review (Exam + CRB Refilling)
    ↓
Promotion / Demotion / Contract Renewal
    ↓
Earnings in EHBGC Wallet
    ↓
Withdraw to local currency / bank
```

---

## PART 14: INDUSTRIES (ALL)

EHB covers ALL global industries through DMO's multi-industry framework:

**Priority 4 (Phase 31-35 — In Progress):**
- IT & Technology (SOT)
- Healthcare (WMS)
- Education (HPS)
- Logistics & Delivery

**Phase 46-50 (Planned):**
- E-commerce (GoSellr base)
- Legal Services (OLS)
- Travel (AGTS)
- Machinery (HMS)
- Construction
- Electrical
- Solar
- Automotive
- Plumbing, HVAC
- Food & Grocery
- Fashion
- Media (EHB Tube)
- Financial Services
- Real Estate
- ... all 32+ industries

---

*Document Created: April 2026*
*Status: PLANNING PHASE — Awaiting development go-ahead*
