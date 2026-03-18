## EHB CORE GOVERNANCE & SERVICES MAP

This document captures the **official names and roles** of EHB’s core departments, and shows how they connect to main services and dashboards. It is used as a reference for architecture, UI structure, and system roles across the platform.

---

## 1️⃣ CORE GOVERNANCE SYSTEMS (FOUNDATION LAYER)

These are **platform control systems**, not end-user services:

| Code  | Full Name                      | Primary Purpose                          |
|-------|--------------------------------|------------------------------------------|
| STL   | Service Trust Level            | Service quality and trust ranking        |
| PSS   | Proof & Security System        | Identity verification and security       |
| CRB   | Certification & Registry Board | Skills and service certification         |
| DMO   | Decentralized Management Office| Business, service and operations control |

They sit **under** all industries and services and are reused everywhere.

---

## 2️⃣ STL – SERVICE TRUST LEVEL

**Role:** Rate and rank every provider and service.

Example levels:

- Free – unverified
- Basic – basic verification
- Normal – certified
- High – highly verified
- VIP – elite trusted

STL impacts:

- Search and listing visibility
- Order and lead priority
- Service charges and incentives
- Platform ranking and eligibility

---

## 3️⃣ PSS – PROOF & SECURITY SYSTEM

**Role:** Identity and security layer.

Responsibilities:

- KYC / identity verification
- Document verification (passport, CNIC, licenses, etc.)
- Security and fraud monitoring
- Wallet and account security

Applies to:

- Users (customers)
- Professionals (lawyers, doctors, etc.)
- Companies and businesses
- Franchise holders and operators

---

## 4️⃣ CRB – CERTIFICATION & REGISTRY BOARD

**Role:** Professional and service certification authority.

Examples:

- Lawyer certification
- Doctor certification
- Teacher certification
- Engineer / technician certification

Verification model:

- Online exams
- Practical tests
- Physical / franchise-based verification
- **Validity with periodic refresh** (e.g. 6‑month recertification)

If certification fails or expires, STL can be **downgraded** until issues are resolved.

---

## 5️⃣ DMO – DECENTRALIZED MANAGEMENT OFFICE

**Role:** Central business and operations management system.

Responsibilities:

- Business and provider registration
- Service catalog and package management
- Company / organization dashboards
- Operational analytics and controls

Example use cases:

- Restaurant management panels
- Law firm management
- Hospital and clinic management
- Online store (GoSellr seller) management

DMO powers:

- Seller dashboard
- Service provider dashboard
- Business / company dashboards

---

## 6️⃣ JPS – JOB PROFILE & SKILL SYSTEM

**Role:** Global job and skill identity.

Functions:

- Job posting and matching
- Professional resume / profile management
- Skill verification (integrated with CRB and STL)
- Employer dashboards

Example verticals:

- Developer jobs
- Lawyer jobs
- Doctor / medical roles
- Remote and hybrid jobs

---

## 7️⃣ GOSELLR GSM – GLOBAL SHOPPING MANAGEMENT

**Role:** EHB’s e‑commerce and product platform.

Modules:

- Product listing and catalogs
- Supply chain and inventory
- Order and delivery management
- Seller performance and analytics

Seller hierarchy:

- Manufacturer
- Dealer
- Wholesaler
- Trader
- Storekeeper / retailer

---

## 8️⃣ MAIN PLATFORM SERVICE DOMAINS

User-facing service domains built on top of governance systems:

- **GOSELLR GSM** – Products marketplace
- **Legal Services** – EHB OLS legal platform
- **World Medical Services (WMS)** – Doctors, hospitals, health services
- **JPS Jobs** – Jobs and career marketplace
- **Travel Services (AG Traveling, etc.)**
- **Education Services (HPS, etc.)**
- **Technology Services (SOT, etc.)**
- **Financial Services / Banking & fintech**

---

## 9️⃣ HIGH-LEVEL PLATFORM STRUCTURE

```text
EHB PLATFORM
│
├ Governance & Trust
│   ├ STL – Service Trust Level
│   ├ PSS – Proof & Security System
│   ├ CRB – Certification & Registry Board
│   └ DMO – Decentralized Management Office
│
└ Service Domains
    ├ GOSELLR GSM (Commerce)
    ├ Legal Services
    ├ Medical Services
    ├ JPS Jobs
    ├ Travel Services
    ├ Technology Services
    ├ Education Services
    └ Financial Services
```

Example provider onboarding flow:

```text
Provider joins →
  PSS identity verification →
  CRB certification (if required) →
  STL level assignment →
  Managed via DMO dashboards →
  Services exposed in marketplace
```

---

## 🔟 DASHBOARD STRUCTURE (SHARED LAYOUT)

All dashboards follow the same **navigation skeleton**; data and labels change per role:

- Overview
- Services / Products
- Orders / Cases / Appointments
- Verification (PSS / CRB / STL status)
- Wallet & Earnings
- Analytics
- Settings

Examples:

- **Provider dashboard**: services, clients, reviews, STL level, earnings.
- **Business dashboard**: branches, staff, performance, compliance status.
- **Franchise dashboard**: territory, inspections, local performance, revenue.

---

## 1️⃣1️⃣ LANDING PAGE GOVERNANCE BLOCK

On public landing and marketing pages, governance systems can be summarized as:

```text
EHB VERIFICATION ECOSYSTEM
│
├ PSS – Identity Verification
├ CRB – Professional Certification
├ STL – Service Trust Ranking
└ DMO – Business & Service Management
```

This block explains how EHB combines:

- LinkedIn-style professional trust,
- Amazon-style marketplace scaling,
- Upwork-style freelancer verification,
- Uber-style safety and identity checks,

into one **governed, multi-industry super app**.

