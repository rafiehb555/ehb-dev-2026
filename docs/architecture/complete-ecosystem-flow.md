# EHB COMPLETE ECOSYSTEM USER FLOW

> End-to-End System Integration

---

# ECOSYSTEM COMPONENTS

| Component | Purpose |
|-----------|---------|
| **DMO** | Decentralized Management Office (central control) |
| **JPS** | Job Profile & Skill (professional profiles) |
| **PSS** | Proof & Security System (KYC/identity) |
| **CRB** | Certification & Registry Board (physical certification) |
| **STL** | Service Trust Level (AI trust scoring) |
| **AI Marketplace** | Services & products marketplace |
| **Franchise Network** | Physical operations & inspections |

---

# COMPLETE SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER / COMPANY                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ACCOUNT REGISTRATION                              │
│              (Email, Phone, Basic Info)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   JPS PROFILE CREATION                              │
│         (Skills, Experience, Education, Portfolio)                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  PSS IDENTITY VERIFICATION                          │
│           (ID Check, Liveness, AML Screening)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CRB CERTIFICATION                                │
│        (Skill Test, Interview, Inspection)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL TRUST SCORE                                  │
│              (AI Calculates Reputation)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DMO REGISTRY                                   │
│           (Official Platform Record Stored)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AI MARKETPLACE                                   │
│          (Products, Services, Jobs Access)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CUSTOMER INTERACTION                               │
│           (Orders, Reviews, Payments)                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

# USER ONBOARDING FLOW (DETAILED)

## Step 1 — Account Creation

User registers:
- Name
- Email
- Phone
- Password

**DMO creates basic account.**

---

## Step 2 — JPS Profile

User completes professional profile:
- Profession
- Skills (categorized)
- Experience (years, companies)
- Education (degrees, institutions)
- Portfolio projects

---

## Step 3 — PSS Verification (KYC)

Identity verification:
- ID document upload
- Liveness detection
- AML/sanctions screening

**Output:** Verified Identity + Risk Score

---

## Step 4 — CRB Certification

For service providers:
- Skill test
- Interview
- Workplace inspection

**Output:** Professional Certificate

---

## Step 5 — STL Trust Level

AI calculates trust score:

| Level | Score | Meaning |
|-------|-------|---------|
| Free | 0-30 | Unverified |
| Basic | 31-50 | Verified identity |
| Medium | 51-70 | Documents verified |
| High | 71-85 | Certified professional |
| VIP | 86-100 | Premium verified |

---

## Step 6 — DMO Registry

Verified professional record stored in DMO:
- Database entry
- Blockchain hash
- Searchable profile

---

# AI MARKETPLACE FLOW

## Customer Search Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER SEARCH                                  │
│              ("Electrician near me")                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AI SEARCH ENGINE                                  │
│         (Skill matching, location, availability)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL RANKING                                      │
│           (Results ordered by trust score)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               VERIFIED SERVICE PROVIDERS                            │
│         (VIP → High → Medium → Basic → Free)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Service Booking Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   CUSTOMER REQUEST                                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AI MATCHMAKING                                    │
│        (Best provider based on skill, location, STL)               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 PROFESSIONAL SELECTED                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SERVICE DELIVERED                                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   CUSTOMER REVIEW                                   │
│                  (Rating + Feedback)                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STL SCORE UPDATE                                  │
│           (AI adjusts trust score)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

# FRANCHISE MODEL FLOW

## Franchise Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EHB GLOBAL HQ                                   │
│               (Strategy, Technology, Finance)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CORPORATE FRANCHISE                                │
│              (National operations)                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   MASTER FRANCHISE                                  │
│              (Regional operations)                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUB FRANCHISE                                    │
│              (Local operations)                                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               LOCAL SERVICE PROVIDERS                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Franchise Responsibilities

| Level | Responsibilities |
|-------|------------------|
| **Sub Franchise** | Local inspections, onboarding, CRB field verification |
| **Master Franchise** | Regional operations, monitoring, certification audits |
| **Corporate Franchise** | National operations, compliance management |

---

## Franchise Verification Flow

```
Service Provider Apply → PSS Verification → 
Sub Franchise Inspection → CRB Certification → 
DMO Registry → STL Level Update → Marketplace Activation
```

---

# 6-MONTH REFILLING SYSTEM

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CERTIFICATION ACTIVE                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   6-MONTH TIMER                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                REFILLING NOTIFICATION                               │
│              (30 days before expiry)                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CRB RE-INSPECTION                                  │
│           (Skill retest, interview)                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL UPDATE                                       │
│           (Score adjusted based on results)                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Non-Compliance:**
```
7 Day Reminder → Services Hidden → STL Downgrade
```

---

# COMPLETE TRUST FLOW

```
User → JPS Profile → PSS Verification → CRB Certification → 
STL Trust Score → DMO Registry → AI Marketplace
```

---

*Complete Ecosystem Flow v1.0 | March 2026*
