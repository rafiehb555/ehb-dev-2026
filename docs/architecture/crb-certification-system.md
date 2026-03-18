# CRB — Certification & Registry Board

> Official Certification Authority for EHB Ecosystem

---

# DEFINITION

**CRB (Certification & Registry Board)** is EHB's **official certification authority** that verifies:
- Professionals (doctors, engineers, lawyers, mechanics)
- Companies (businesses, agencies, institutions)
- Products (authenticity, safety, compliance)
- Services (quality, standards)

---

# PURPOSE

CRB objectives:
- Create verified professionals
- Eliminate fake companies
- Ensure product authenticity
- Maintain service quality

---

# CRB SYSTEM POSITION

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER / COMPANY                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PSS VERIFICATION                                 │
│            (Online Identity & Document Check)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CRB CERTIFICATION                                │
│           (Physical Inspection & Skill Testing)                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DMO REGISTRY                                   │
│               (Official Platform Record)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL TRUST LEVEL                                  │
│              (AI-Based Trust Score Assignment)                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

# CRB MAIN FUNCTIONS

## 1. Professional Certification

**Who gets certified:**
- Doctors
- Engineers
- Mechanics
- Lawyers
- Accountants
- Teachers
- All service professionals

**Verification Steps:**
1. Document validation
2. Skill tests (practical/written)
3. Interviews
4. Background checks

---

## 2. Company Verification

**Required Checks:**
- Business registration documents
- Legal compliance documents
- Tax registration
- Operational verification (office visit)
- Ownership verification

---

## 3. Product Verification

**Checks Performed:**
- Authenticity verification
- Manufacturer details
- Safety compliance
- Quality standards
- Certification marks

---

## 4. Service Certification

**Evaluation Criteria:**
- Experience verification
- Service quality assessment
- Customer feedback analysis
- Complaint history review

---

# CRB CERTIFICATION PROCESS

```
┌─────────────────────────────────────────────────────────────────────┐
│                  APPLICATION SUBMITTED                              │
│         (User/Company applies for certification)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT REVIEW                                  │
│       (CRB team reviews submitted documents)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               INSPECTION / SKILL TEST                               │
│     (Inspector visits / conducts practical test)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 CERTIFICATION ISSUED                                │
│          (Official CRB certificate generated)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DMO REGISTRY ENTRY                                 │
│      (Record stored in DMO + Blockchain hash)                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

# CRB REFILLING SYSTEM (6-Month Cycle)

CRB certification is **NOT permanent**. Every **6 months**, refilling is required.

## Refilling Includes:
- Skill retest
- Interview
- Company re-verification
- Product re-verification
- Performance review

## Refilling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  CERTIFICATION ISSUED                               │
│                    (Valid 6 months)                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   6-MONTH TIMER                                     │
│               (System tracks expiry)                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                REFILLING NOTIFICATION                               │
│        (30 days before expiry, alerts sent)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   RE-INSPECTION                                     │
│       (Inspector conducts re-evaluation)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                CERTIFICATION RENEWAL                                │
│          (New certificate, fresh 6-month cycle)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

# NON-COMPLIANCE PENALTIES

If refilling is not completed:

| Timeline | Action |
|----------|--------|
| Day 1-7 | Reminder notifications |
| Day 8-14 | Warning alerts |
| Day 15+ | Services temporarily hidden |
| Day 30+ | STL downgrade |
| Day 60+ | Account suspension |

---

# CRB DATABASE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CRB DATABASE TABLES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  crb_applications          - Certification applications            │
│  crb_certificates          - Issued certificates                   │
│  crb_inspections           - Inspection records                    │
│  crb_skill_tests           - Test results                          │
│  crb_interviews            - Interview records                     │
│  crb_company_checks        - Company verification records          │
│  crb_product_verifications - Product inspection results            │
│  crb_refilling_records     - Refilling history                     │
│  crb_registry              - Official registry entries             │
│  crb_inspectors            - Inspector profiles                    │
│  crb_penalties             - Non-compliance records                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# CRB CERTIFICATION TYPES

| Type | Target | Validity |
|------|--------|----------|
| Professional | Individuals | 6 months |
| Company | Businesses | 6 months |
| Product | Goods | 6 months |
| Service | Service providers | 6 months |
| Premium | VIP verified | 6 months |

---

*CRB Certification System v1.0 | March 2026*
