 # EHB JPS DESIGNATION ENGINE

*(Flexible Designation + STL + Affiliate Integration)*

This document defines the **Job Profile System (JPS) Designation Engine** for EHB. It combines:

- Flexible, industry-specific designation ladders.
- STL (Service Trust Level)–based quality control.
- Integration with Affiliate leadership and Franchise eligibility.

---

## 1️⃣ FLEXIBLE DESIGNATION SYSTEM

Designations are **not limited to 10 fixed levels**. Each industry can define its own ladder with up to **50 levels**.

Structure:

```text
Industry
   │
   ▼
Designation Ladder
   │
   ├ Level 1
   ├ Level 2
   ├ Level 3
   ├ ...
   ├ Level 10
   └ Level 11+ (up to 50)
```

System supports **unlimited conceptual levels**, with a practical cap (e.g., 50).

---

## 2️⃣ INDUSTRY-BASED DESIGNATION LADDERS

Each industry defines its own **titles and levels**.

### Example – Technology Industry

| Level | Title               |
|-------|---------------------|
| 1     | Intern              |
| 2     | Junior Developer    |
| 3     | Developer           |
| 4     | Senior Developer    |
| 5     | Team Lead           |
| 6     | Project Manager     |
| 7     | Engineering Manager |
| 8     | Director            |
| 9     | Senior Director     |
| 10    | CTO                 |
| 11    | Technology Advisor  |

### Example – Health Industry

| Level | Title                   |
|-------|-------------------------|
| 1     | Medical Intern          |
| 2     | Junior Doctor           |
| 3     | General Physician       |
| 4     | Specialist              |
| 5     | Senior Specialist       |
| 6     | Consultant              |
| 7     | Medical Director        |
| 8     | Hospital Director       |
| 9     | Senior Medical Director |
| 10    | Chief Medical Officer   |

---

## 3️⃣ INDUSTRY SELECTION (JPS)

Industry selection is managed by **JPS**:

- Each user can select up to **3 industries**.
- One becomes the **Primary Industry**; others are **Secondary**.

Flow:

```text
User Signup
   │
   ▼
JPS Profile Creation
   │
   ▼
Select up to 3 Industries
```

---

## 4️⃣ PRIMARY INDUSTRY ACTIVATION

Primary Industry is activated only when the user:

1. Passes **PSS identity verification**.
2. Completes relevant **CRB certification(s)**.
3. Publishes at least one **verified service** in that industry.

Flow:

```text
Industry Selected
   │
   ▼
Identity Verification (PSS)
   │
   ▼
Skill / Industry Certification (CRB)
   │
   ▼
Service Listing Published
   │
   ▼
Primary Industry Activated
```

---

## 5️⃣ DESIGNATION SCORE MODEL

Designation promotion is based on a **Designation Score**, not just affiliate team size.

Example scoring model:

```text
Designation Score =
  Experience Score
+ Certification Score
+ Service Performance Score
+ Leadership Score
+ Affiliate Contribution Score
```

Factors:

- **Experience** – years, project count, complexity.
- **Certifications** – CRB + industry-level certifications.
- **Service Performance** – completion rates, ratings.
- **Leadership** – team management, mentoring (JPS signals).
- **Affiliate Contribution** – responsible leadership, but not sole driver.

Promotion thresholds are configured **per industry & per level**.

---

## 6️⃣ PRIMARY VS SECONDARY INDUSTRIES

Rules:

- **Designation upgrades occur only in the Primary Industry.**
- Secondary industries:
  - Allow **services, earnings, team building**.
  - Do **not** affect designation ladder.

Example:

```text
User:
  Primary Industry   = Technology
  Secondary Industries = Education, Marketing
```

Result:

- Designation:
  - Upgrades only along the Technology ladder.
- Income:
  - Can come from all industries (cross-industry referrals, services, etc.).

---

## 7️⃣ ADMIN CONFIGURATION & FLEXIBILITY

Admin tools per industry:

```text
Industry Settings
│
├ Designation Levels (title, level, order)
├ Promotion Criteria (thresholds, weights)
└ Certification Requirements (mandatory/optional)
```

Admins can:

- Define or change **titles and level counts** per industry.
- Adjust **promotion thresholds** and required STL.
- Update **certification requirements** (e.g. mandatory CRB levels).

---

## 8️⃣ STL (SERVICE TRUST LEVEL) INTEGRATION

STL integrates directly with designations:

- STL is a **0–100 score** mapped to levels (STL-0 to STL-5).
- Promotion requires:
  - Meeting **Designation Score thresholds**.
  - Having **minimum STL**.

Example mapping:

| Designation       | Min STL Level |
|-------------------|--------------:|
| Junior Specialist | STL-1         |
| Specialist        | STL-2         |
| Senior Specialist | STL-3         |
| Manager           | STL-4         |
| Director          | STL-5         |

STL is influenced by:

- Reviews and complaints.
- Service completion and activity.
- Certification and refilling status.

---

## 9️⃣ 6-MONTH REFILLING & DESIGNATION FREEZE

The **6-month refilling system** interacts with the Designation Engine:

- Every 6 months, professionals must renew:
  - Key documents.
  - Certifications (if expiring).
  - Performance & complaint checks.

If refilling is **missed or failed**:

- Services may be **temporarily hidden**.
- STL score is **reduced**.
- **Designation promotions are frozen** until issues are resolved.

Flow:

```text
Refilling due
   │
   ▼
Completed on time → STL maintained / boosted → Eligible for promotion
Missed / failed   → STL penalized → Designation freeze
```

---

## 🔟 AFFILIATE & FRANCHISE INTEGRATION

Designation, STL, Affiliate, and Franchise all connect:

- **Affiliate**:
  - Can earn income from all industries.
  - Leadership and contribution influence **Leadership Score** in designation, but:
    - Cannot override low STL or poor professional performance.
- **Franchise Eligibility**:
  - Minimum STL + designation levels + rank required.
  - Ensures only **high-trust, high-designation** professionals lead franchises.

High-level interaction:

```text
STL & Performance
      │
      ▼
Designation Eligibility (Primary Industry)
      │
      ▼
Affiliate Leadership Credibility
      │
      ▼
Franchise Eligibility
```

---

## RESULT

The JPS Designation Engine delivers:

- ✔ **Flexible, industry-specific career ladders** (up to 50 levels).
- ✔ **Quality-controlled promotions** via STL and performance.
- ✔ **Balanced integration** of:
  - Professional career growth.
  - Affiliate leadership contribution.
  - Franchise and authority roles.

This makes EHB a true **Career + Trust + Affiliate + Franchise hybrid ecosystem** with a robust, AI-ready promotion engine.

