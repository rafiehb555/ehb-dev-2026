# PSS – PROOF & SECURITY SYSTEM

> EHB Identity, Security & Compliance Engine

---

# OVERVIEW

PSS is EHB's core **identity verification and compliance engine** responsible for:

- Identity verification (KYC)
- Business verification (KYB)
- Fraud detection
- AML/CFT compliance
- Risk monitoring
- Ongoing user monitoring

**PSS operates within DMO and provides data to STL Trust Level System.**

---

# PSS SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                       USER / COMPANY                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PSS SYSTEM                                  │
│              (Proof & Security System)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   KYC ENGINE    │  │  AML SCREENING  │  │    BEHAVIOR     │    │
│  │                 │  │                 │  │   MONITORING    │    │
│  │ • ID Verify     │  │ • Sanctions     │  │ • Login Patterns│    │
│  │ • Liveness      │  │ • PEP Lists     │  │ • Activity      │    │
│  │ • Documents     │  │ • Watchlists    │  │ • Anomalies     │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   KYB ENGINE    │  │  TRANSACTION    │  │     RISK        │    │
│  │                 │  │   MONITORING    │  │    ENGINE       │    │
│  │ • Company Reg   │  │ • Wallet Txns   │  │ • Risk Scoring  │    │
│  │ • Directors     │  │ • Patterns      │  │ • Alerts        │    │
│  │ • Ownership     │  │ • Crypto Track  │  │ • Reports       │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DMO CORE                                   │
│                  (Data Management Office)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STL TRUST LEVEL                                │
│                (Trust Score Updated)                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PSS MODULES (10 Core Modules)

## Module 1: Identity Verification

### Purpose
Verify user's legal identity and prevent fake accounts.

### Supported Documents
| Document Type | Countries |
|---------------|-----------|
| Passport | Global |
| National ID | Country-specific |
| Driving License | Country-specific |
| Residence Permit | Country-specific |

### Verification Process
```
Upload Document → OCR Extraction → Data Validation → 
  Database Check → Fraud Detection → Result
```

### Checks Performed
- Document authenticity (MRZ, holograms, fonts)
- Data consistency (name, DOB, expiry)
- Face match (document photo vs selfie)
- Fraud detection (tampering, manipulation)

---

## Module 2: Liveness Detection

### Purpose
Ensure the user is a real, live person (not photo/video/deepfake).

### Methods
| Method | Description |
|--------|-------------|
| Passive Liveness | AI analyzes single selfie |
| Active Liveness | User performs actions (blink, turn head) |
| 3D Face Analysis | Depth detection for spoofing prevention |

### Attacks Prevented
- Photo attacks (printed/screen photos)
- Video attacks (pre-recorded videos)
- Deepfake attacks (AI-generated faces)
- Mask attacks (3D masks)

---

## Module 3: AML Screening

### Purpose
Check users against global watchlists for financial crime prevention.

### Screening Lists
| List Type | Source |
|-----------|--------|
| Sanctions | UN, OFAC, EU, UK, etc. |
| PEP (Politically Exposed Persons) | Global databases |
| Adverse Media | News monitoring |
| Law Enforcement | FBI, Interpol, etc. |
| Terrorist Watchlists | Global terrorism databases |

### Screening Flow
```
User Data → Global Database Check → Match Analysis → 
  Risk Assessment → Alert/Approval
```

---

## Module 4: Address Verification

### Purpose
Confirm user's physical address to prevent fraud.

### Methods
| Method | Description |
|--------|-------------|
| Utility Bill | Gas, electricity, water bills |
| Bank Statement | Official bank documents |
| Government Letter | Tax, postal documents |
| Database Check | Government address databases |
| Geolocation | IP/device location matching |

---

## Module 5: Ongoing ID Monitoring

### Purpose
Continuous monitoring after initial verification.

### Monitoring Types
| Type | Frequency | Action |
|------|-----------|--------|
| ID Expiry | Daily check | Re-verification alert |
| Sanctions Updates | Real-time | Auto re-screening |
| Risk Changes | Continuous | Alert & review |
| Periodic KYC | Yearly | Full re-verification |

---

## Module 6: Enhanced Due Diligence (EDD) Questionnaires

### Purpose
Collect additional information for high-risk users.

### Standard Questions
- Source of funds
- Source of wealth
- Intended platform use
- Expected transaction volume
- Profession/Business details

### Triggered By
- High-risk country
- PEP status
- High transaction volume
- Suspicious patterns

---

## Module 7: Transaction Monitoring

### Purpose
Monitor financial transactions for suspicious activity.

### Rules Engine
| Rule | Detection |
|------|-----------|
| Velocity | Unusual transaction frequency |
| Amount | Large/round numbers |
| Pattern | Structuring (smurfing) |
| Geography | High-risk countries |
| Timing | Unusual hours |

### Alert Flow
```
Transaction → Rules Check → Risk Score → 
  Alert (if high) → Investigation → Report (if suspicious)
```

---

## Module 8: Crypto Monitoring

### Purpose
Monitor blockchain transactions for fraud and compliance.

### Checks
| Check | Purpose |
|-------|---------|
| Wallet Screening | Identify high-risk addresses |
| Transaction Tracing | Follow fund flow |
| Mixing Detection | Identify laundering attempts |
| Exchange Identification | Know counterparty |

### Risk Categories
- Scam wallets
- Darknet markets
- Ransomware addresses
- Sanctioned addresses
- Mixer/tumbler usage

---

## Module 9: Business Verification (KYB)

### Purpose
Verify companies and their beneficial owners.

### Verification Steps
```
1. Company Registration Check
2. Legal Entity Verification
3. Director/Owner Identification
4. UBO (Ultimate Beneficial Owner) Check
5. Business Address Verification
6. AML Screening on All Parties
```

### Documents Required
- Certificate of Incorporation
- Memorandum of Association
- Director ID documents
- Proof of address
- Shareholder register

---

## Module 10: Behavior Monitoring

### Purpose
Detect anomalous user behavior indicating fraud.

### Monitored Behaviors
| Behavior | Risk Indicator |
|----------|----------------|
| Login location changes | Account takeover |
| Rapid activity | Bot/automation |
| Multiple accounts | Identity fraud |
| Device switching | Suspicious access |
| Time patterns | Unusual usage |

---

# SECURITY MODULES

## Face Authentication (2FA)

**High-risk actions requiring face verification:**
- Large withdrawals
- Account changes
- New device login
- Beneficiary changes

## Device Intelligence

| Data Collected | Purpose |
|----------------|---------|
| Device fingerprint | Unique identification |
| OS/Browser | Risk profiling |
| IP address | Location verification |
| Screen resolution | Bot detection |

## Email Risk Scoring

| Risk Factor | Score Impact |
|-------------|--------------|
| Disposable email | High risk (+30) |
| Free email (business) | Medium risk (+10) |
| Email age < 30 days | Medium risk (+15) |
| Domain reputation | Variable |

## Phone Risk Scoring

| Risk Factor | Score Impact |
|-------------|--------------|
| VoIP number | High risk (+25) |
| Virtual number | High risk (+20) |
| Carrier mismatch | Medium risk (+10) |
| Recently ported | Medium risk (+10) |

## IP Risk Scoring

| Risk Factor | Score Impact |
|-------------|--------------|
| VPN detected | Medium risk (+15) |
| Proxy detected | High risk (+25) |
| Tor exit node | High risk (+30) |
| High-risk country | Variable |
| Data center IP | High risk (+20) |

---

# RISK ENGINE

## Applicant Risk Scoring

### Score Calculation
```
Base Score: 0

+ Identity Verification Result
+ Liveness Check Result
+ AML Screening Result
+ Address Verification Result
+ Device Intelligence Score
+ Email Risk Score
+ Phone Risk Score
+ IP Risk Score
+ Behavior Analysis Score

= Total Risk Score (0-100)
```

### Risk Levels

| Score Range | Risk Level | Action |
|-------------|------------|--------|
| 0-30 | Low | Auto-approve |
| 31-60 | Medium | Enhanced review |
| 61-80 | High | Manual review |
| 81-100 | Critical | Reject/Block |

---

# REGULATORY COMPLIANCE

## Travel Rule

For crypto transactions above threshold:
- Sender name, account, address
- Receiver name, account
- Transaction details

## Periodic Verification

| User Type | Frequency |
|-----------|-----------|
| Standard | Yearly |
| High-risk | 6 months |
| VIP/High-volume | Quarterly |

## Regulatory Reports

| Report | Trigger |
|--------|---------|
| SAR (Suspicious Activity Report) | Suspicious transaction |
| CTR (Currency Transaction Report) | Large transactions |
| AML Report | Periodic compliance |

---

# PSS DATABASE STRUCTURE

## Core Tables

```sql
-- Identity Verification
pss_verifications
identity_documents
document_verifications
liveness_checks
face_matches

-- AML & Screening
aml_screenings
pep_matches
sanction_matches
adverse_media_hits
watchlist_results

-- Address & Contact
address_verifications
address_documents
geolocation_logs

-- Risk Assessment
risk_scores
risk_factors
risk_history
manual_reviews

-- Device & Behavior
device_fingerprints
device_intelligence
login_history
behavior_logs
anomaly_detections

-- Email & Phone
email_risk_scores
phone_risk_scores
email_verifications
phone_verifications

-- IP Analysis
ip_logs
ip_risk_scores
vpn_detections
proxy_detections

-- Transaction Monitoring
transaction_alerts
transaction_patterns
suspicious_activities
monitoring_rules

-- Crypto
crypto_wallets
crypto_screenings
wallet_risk_scores
blockchain_traces

-- KYB (Business)
kyb_verifications
company_documents
director_verifications
ubo_verifications
business_addresses

-- Compliance
regulatory_reports
sar_filings
periodic_reviews
compliance_logs
audit_trails
```

**Total: ~40+ PSS Tables**

---

# PSS USER FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    1. USER REGISTRATION                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              2. IDENTITY VERIFICATION (KYC)                         │
│           Upload ID → OCR → Validation → Face Match                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   3. LIVENESS CHECK                                 │
│              Real-time face verification                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   4. AML SCREENING                                  │
│          Check against sanctions, PEP, watchlists                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                5. ADDRESS VERIFICATION                              │
│              Utility bill or database check                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               6. RISK SCORE CALCULATION                             │
│          Aggregate all factors → Calculate score                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ┌─────────┐  ┌─────────────┐  ┌─────────┐
              │ APPROVE │  │MANUAL REVIEW│  │ REJECT  │
              │ (Low)   │  │  (Medium)   │  │ (High)  │
              └────┬────┘  └──────┬──────┘  └─────────┘
                   │              │
                   └──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    7. DMO STORAGE                                   │
│               Store verification results                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  8. STL LEVEL UPDATE                                │
│              Update trust score based on results                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PSS IMPACT ON STL TRUST LEVEL

## Score Adjustments

| Verification Result | STL Impact |
|---------------------|:----------:|
| Identity Verified | +10 |
| Liveness Passed | +5 |
| AML Clear | +10 |
| Address Verified | +5 |
| Low Risk Score | +5 |
| **Total Positive** | **+35** |

| Risk Factors | STL Impact |
|--------------|:----------:|
| AML Hit (PEP) | -15 |
| AML Hit (Sanctions) | -50 |
| High Risk Score | -20 |
| Failed Liveness | -10 |
| Suspicious Behavior | -15 |
| Document Fraud | -30 |

---

# PSS POSITION IN EHB SYSTEM

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER                                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               PSS (Identity + Compliance)                           │
│           First line of defense - AI verification                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CRB (Physical Certification)                           │
│           Second line - Human verification                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DMO (Data Management)                              │
│                Central storage & governance                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STL (Trust Level System)                           │
│                  Trust score & ranking                              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EHB SERVICES                                    │
│        GoSellr, WMS, AGTS, OLS, SOT, etc.                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

*PSS Security & Compliance Architecture v1.0 | March 2026*
