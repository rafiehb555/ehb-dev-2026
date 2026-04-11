# COMPLETE KYC / KYB ONBOARDING FLOW

> Individual & Business Verification Journey

---

# OVERVIEW

| Term | Full Form | Applies To |
|------|-----------|------------|
| KYC | Know Your Customer | Individual users, professionals |
| KYB | Know Your Business | Companies, organizations |

**Purpose:**
- Identity verification
- Regulatory compliance
- Fraud prevention
- Trust scoring (STL)

---

# COMPLETE ONBOARDING FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                 USER / COMPANY REGISTRATION                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BASIC PROFILE CREATION (JPS)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│            KYC / KYB INFORMATION COLLECTION                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 PSS ONLINE VERIFICATION                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 RISK & AML SCREENING                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DMO RECORD CREATION                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CRB CERTIFICATION (if required)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              EHB STL TRUST LEVEL ASSIGNMENT                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                SERVICE ACCESS ACTIVATED                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

# KYC FLOW (INDIVIDUAL USERS)

## Step 1: Account Registration

**User provides:**
- Full name
- Email address
- Phone number
- Password

**System action:** Create basic account in DMO

---

## Step 2: JPS Profile Creation

**User completes:**
- Profession
- Skills
- Experience
- Education

**Purpose:** Prepare profile for STL evaluation

---

## Step 3: Identity Verification

**User uploads:**
- Passport / National ID
- Driver's License (optional)

**PSS checks:**
- Document authenticity (OCR, MRZ)
- Name match
- Expiration date
- Tampering detection

---

## Step 4: Liveness Check

**User performs:**
- Selfie capture
- Blink detection
- Head movement
- Smile detection

**Purpose:** Prevent photo/deepfake fraud

---

## Step 5: Address Verification

**User uploads:**
- Utility bill
- Bank statement
- Government letter

**System confirms:** Physical residence

---

## Step 6: AML Screening

**User screened against:**
- Sanctions lists (UN, OFAC, EU)
- PEP lists
- Global watchlists
- Adverse media

**If flagged:** → Manual review required

---

## Step 7: Risk Scoring

**AI calculates score based on:**
- Document validity
- AML results
- Device reputation
- IP location
- Email/phone risk

| Score | Risk Level | Action |
|-------|------------|--------|
| 0-30 | Low | Auto-approved |
| 31-60 | Medium | Additional checks |
| 61-100 | High | Manual review |

---

## Step 8: DMO Record Creation

**Data stored in:**
- DMO database (encrypted)
- Blockchain hash record

---

## Step 9: STL Level Assignment

| Verification Level | STL Level Assigned |
|-------------------|-------------------|
| Basic KYC only | Free |
| Document verified | Basic |
| Full KYC complete | Medium |
| CRB certified | High |
| VIP verification | VIP |

---

# KYB FLOW (BUSINESSES)

## Step 1: Company Registration

**Company submits:**
- Company name
- Registration number
- Country of incorporation
- Business type/industry

---

## Step 2: Document Submission

**Required documents:**
- Certificate of Incorporation
- Tax Registration Certificate
- Business License
- Memorandum of Association
- Shareholder Register

---

## Step 3: Ownership Verification

**Company declares:**
- Directors (with ID verification)
- Shareholders (ownership %)
- Ultimate Beneficial Owners (UBO)

**Each person undergoes individual KYC**

---

## Step 4: AML / Sanctions Screening

**System checks:**
- Company name
- All directors
- All shareholders
- UBOs
- Associated entities

**Against:** Global watchlists

---

## Step 5: KYB Risk Assessment

**Risk factors evaluated:**
| Factor | Risk Level |
|--------|------------|
| High-risk country | +20 |
| High-risk industry | +15 |
| Complex ownership | +10 |
| Shell company indicators | +25 |
| PEP involvement | +20 |

---

## Step 6: CRB Physical Verification

**For High STL level, CRB performs:**
- Office inspection
- Operational review
- Product/service verification
- Staff verification

---

## Step 7: DMO Registry Entry

**Company registered in:**
- EHB Business Registry
- Blockchain certificate log

---

# PERIODIC KYC / KYB REFRESH

| User Type | Refresh Frequency |
|-----------|-------------------|
| Low-risk users | 24 months |
| Normal users | 12 months |
| High-risk users | 6 months |
| Businesses | 6-12 months |
| High-value accounts | Quarterly |

---

# ONGOING MONITORING

**After onboarding, system monitors:**
- Transaction patterns
- Login locations
- Device changes
- Behavior anomalies
- Sanctions list updates

**If suspicious activity detected:**
```
Alert → DMO Review → Action (Block/Flag/Review)
```

---

# DOCUMENT STORAGE MODEL

```
┌─────────────────────────────────────────────────────────────────────┐
│              ENCRYPTED DOCUMENT STORAGE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │    Identity     │  │    Address      │  │    Business     │    │
│  │   Documents     │  │     Proof       │  │   Documents     │    │
│  │                 │  │                 │  │                 │    │
│  │ • Passport      │  │ • Utility Bill  │  │ • Inc. Cert     │    │
│  │ • National ID   │  │ • Bank Stmt     │  │ • Tax Reg       │    │
│  │ • Selfie        │  │ • Govt Letter   │  │ • License       │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│                    BLOCKCHAIN HASH ONLY                             │
│              (Raw documents never on chain)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# ONBOARDING DECISION ENGINE

| Decision | Criteria |
|----------|----------|
| **Approved** | All checks passed, low risk |
| **Pending** | Additional documents needed |
| **Manual Review** | Medium/high risk, flags detected |
| **Rejected** | High risk, sanctions hit, fraud detected |

---

# COMPLETE USER JOURNEY

```
User Signup
     │
     ▼
Profile Creation (JPS)
     │
     ▼
KYC Submission ───────────────┐
     │                        │
     ▼                        │
PSS Verification              │ If KYB
     │                        │
     ▼                        ▼
AML Screening ◄───── Company Documents
     │                        │
     ▼                        │
Risk Scoring ◄────── Ownership Verify
     │                        │
     ▼                        │
     ├────────────────────────┘
     │
DMO Storage
     │
     ▼
STL Trust Level
     │
     ▼
Platform Access
```

---

*KYC/KYB Onboarding Flow v1.0 | March 2026*
