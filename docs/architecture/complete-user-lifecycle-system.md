# EHB COMPLETE USER LIFECYCLE SYSTEM

> 8-stage lifecycle from signup → income, with DMO, JPS, PSS, CRB, STL, Franchise & Marketplace

---

## 1. STAGE 1 — USER SIGNUP

User (individual) or company registers on the platform.

Required data (minimum):

- Name
- Phone
- Email
- Country

System action:

```text
DMO User ID created (Stage S1)
```

Result:

- Basic DMO account exists.
- User can access the Super App but is not yet trusted/visible as a provider.

---

## 2. STAGE 2 — JPS PROFILE CREATION

User creates their **JPS (Job Profile & Skill)**.

Example fields:

- Profession
- Skills
- Experience
- Education

Example:

```text
Name: Ali
Profession: Electrician
Experience: 5 Years
Skills: Wiring, Solar Installation
```

Result:

- Professional profile is ready.
- Still not fully verified – requires PSS, industry, and CRB.

---

## 3. STAGE 3 — PSS VERIFICATION

**PSS (Proof & Security System)** verifies identity and basic risk.

Checks:

- ID verification
- Face verification / liveness
- AML screening
- Address verification

Output:

```text
PSS Result:
- Verified Identity
- Risk Score (Low / Medium / High)
```

Initial STL impact:

```text
STL Level: Free → Basic
```

User is now **identity-verified**, but not fully certified for services.

---

## 4. STAGE 4 — INDUSTRY VERIFICATION

User applies for **industry-specific verification** via franchises and authorities.

Example: Electrician

Involved industries:

- Construction (building wiring)
- Energy (electrical systems)
- Safety / Security (electrical safety)
- Education (technical training)

Flow:

```text
User Apply for Industry Verification
           │
           ▼
   Industry Franchise Inspection
           │
           ▼
   Industry Authority Decision
           │
           ▼
   Verification Approved / Rejected
```

Result:

- Industry-level badges and STL boosts become available.
- DMO records which industries have cleared this user/company.

---

## 5. STAGE 5 — CRB CERTIFICATION

**CRB (Central Record Blockchain)** issues official certifications.

CRB checks:

- Skill tests (practical & written)
- Interviews
- On-site inspection (workshop, office, etc.)

Flow:

```text
Industry Verification
       │
       ▼
     CRB Inspection
       │
       ▼
 Certification Issued + Registry Entry
```

Result:

- Certificates stored in **CRB registry** + **DMO database** + (optionally) **blockchain hash**.
- CRB status feeds into STL and visibility.

---

## 6. STAGE 6 — STL TRUST LEVEL

**STL (Service Trust Level)** is calculated based on multiple factors:

- PSS verification results
- Industry verifications
- CRB certifications
- Reviews & ratings
- Complaints & resolution history
- Refilling (re-certification) history

STL levels:

| Score | Level  |
|-------|--------|
| 0–30  | Free   |
| 31–50 | Basic  |
| 51–70 | Medium |
| 71–85 | High   |
| 86–100| VIP    |

Result:

- Determines **search ranking**, **marketplace visibility**, and **limits/permissions**.
- Appears on **Trust Card**, **Trust Radar**, and **Trust Score Dashboard**.

---

## 7. STAGE 7 — MARKETPLACE ACTIVATION

Once sufficient STL is reached and required verifications/certifications are in place, user is **activated in the marketplace**.

Example listing:

```text
Ali Electric
Electrician – Lahore

STL Level: High (82)
Rating: 4.8
Verified by: Construction, Energy, Safety
```

Customer experience:

- Searches like **“Electrician near me”**.
- AI Matching + STL + distance + rating decide ranking.
- Only trusted / verified providers are promoted to the top.

---

## 8. STAGE 8 — INCOME GENERATION

User or company now earns via:

- Services (bookings, appointments)
- Product sales (via GoSellr)
- Franchise commissions (if they own a franchise)

Payment flow:

```text
Customer Payment
       │
       ▼
     EHB Wallet
       │
       ▼
  Revenue Distribution
       │
       ├→ Service Provider Income
       ├→ Franchise Share
       └→ Platform Fee
```

Example revenue split:

| Share            | Example |
|------------------|---------|
| Service Provider | 70%     |
| Franchise        | 10%     |
| Platform         | 20%     |

Result:

- Funds tracked in **Wallet Service**.
- Visible in **DMO** for compliance and audit.

---

## REFILLING SYSTEM (EVERY 6 MONTHS)

Certifications and some verifications **expire** and must be refreshed.

Flow:

```text
Certification Active
       │
       ▼
   6 / 12 Month Timer
       │
       ▼
 Refilling Notification
       │
       ▼
 CRB Re-Inspection / Re-Test
       │
       ▼
   STL Update
```

If user ignores refilling:

- Repeated reminders.
- Services may be **hidden or downgraded**.
- STL level is **reduced** (e.g. High → Medium or Basic).

---

## COMPLETE USER LIFECYCLE FLOW

End-to-end:

```text
Signup
   │
   ▼
JPS Profile
   │
   ▼
PSS Verification
   │
   ▼
Industry Verification
   │
   ▼
CRB Certification
   │
   ▼
STL Trust Level
   │
   ▼
Marketplace Listing
   │
   ▼
Customer Orders
   │
   ▼
Income
```

This flow is **repeated and strengthened** with every refilling cycle and positive performance.

---

## ROLE OF DMO IN THE LIFECYCLE

DMO is present at **every stage**:

- **Stage 1–2**: User & JPS registry.
- **Stage 3**: Stores PSS results & risk scores.
- **Stage 4–5**: Orchestrates industry + CRB workflows and approvals.
- **Stage 6**: Stores STL scores and history.
- **Stage 7**: Controls activation/deactivation flags for marketplace visibility.
- **Stage 8**: Monitors wallet transactions & franchise revenue.
- **Refilling**: Schedules, reminders, and enforcement (hiding/downgrading).

Summary view:

```text
Users / Companies
        │
        ▼
       JPS
        │
        ▼
       PSS
        │
        ▼
Industry Verification
        │
        ▼
       CRB
        │
        ▼
       STL
        │
        ▼
       DMO
        │
        ▼
Marketplace + Wallet
        │
        ▼
Income
```

---

*EHB Complete User Lifecycle System v1.0 | March 2026*

