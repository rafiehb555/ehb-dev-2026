## EHB Snapshot Data (DMO + Home Page Fill)

This file consolidates extracted “source-of-truth” text/data from the repo docs so the EHB home page (/) and related development docs can be filled consistently.

Last built: 2026-03-18

---

## 1) DMO (Admin System) — Sidebar Navigation (docs/ui-ux/dmo-admin-system.md)

Main menu (14 items):
- `/admin` — `Dashboard` — Overview & stats
- `/admin/users` — `User Management` — All platform users
- `/admin/providers` — `Service Providers` — Verified providers
- `/admin/companies` — `Companies` — Registered companies
- `/admin/officers` — `Government Officers` — DMO officers
- `/admin/franchise` — `Franchise Network` — Franchise management
- `/admin/pss` — `Verification (PSS)` — AI verifications
- `/admin/crb` — `Certification (CRB)` — Physical certifications
- `/admin/certificates` — `Certificates & Licenses` — Issued documents
- `/admin/applications` — `Application Management` — All applications
- `/admin/finance` — `Financial Management` — Transactions, fees
- `/admin/notifications` — `Notifications & Penalties` — Alerts, penalties
- `/admin/blockchain` — `Blockchain Records` — Immutable records
- `/admin/settings` — `Settings` — System settings

---

## 2) Development Control Dashboard — DMO-aligned Modules (docs/ui-ux/development-control-dashboard.md)

Main sections:
1. Platform Structure
2. Development Progress
3. System Flow Monitor
4. Shared Tools Map
5. AI Integration Map
6. Affiliate Integration Map
7. Franchise System Map
8. Industries Development Map

Key reference flows:
- User flow: `User signup → PSS verification → JPS profile creation → Service access (consumer side)`
- Provider flow: `Provider signup → PSS identity verification → CRB skill certification → STL level assignment → Service listing via DMO → Orders and earnings`
- Franchise flow: `Country franchise → Corporate franchise → Sub franchise → Providers onboarding → Local orders management`

Sample missing-connection warnings (demo logic):
- `⚠ AI recommendation not connected with marketplace`
- `⚠ PSS not enforcing verification on providers in X industry`
- `⚠ Franchise revenue not linked to Finance service`

---

## 3) Trust Badge System + Trust Card Data Sources (docs/ui-ux/trust-card-system.md)

Trust badge meaning:
- `🛡️` = `PSS Verified` (Green)
- `🏛️` = `CRB Certified` (Blue)
- `⭐` = `STL Level` (Gold)
- `🌐` = `DMO Registered` (Purple)
- `🏢` = `Franchise Verified` (Orange)
- `🔁` = `Refilling Count` (Gray)
- `⚠` = `Complaints` (Red/Green)

Trust card data sources:
- DMO → Registry ID
- JPS → Profession / Skills
- PSS → KYC Verification Status
- CRB → Certification Status
- STL → Trust Level & Score
- Franchise → Inspection Authority
- Refilling → Refilling Count & History
- Complaints → Complaints Record
- Industry → Industry Verification

---

## 4) Industry Verification + STL Impact + Security Levels (docs/ui-ux/industry-stl-impact-system.md)

STL level thresholds:
- `FREE` — `0-30` (Industry requirement: None)
- `BASIC` — `31-50` (Industry requirement: 0-1 industry)
- `MEDIUM` — `51-70` (Industry requirement: 1-2 industries)
- `HIGH` — `71-85` (Industry requirement: 2-3 industries)
- `VIP` — `86-100` (Industry requirement: 3+ industries)

Security levels:
- `Basic Secure` — Basic verification — Document upload
- `Medium Secure` — Documents + audit — On-site audit
- `High Secure` — Inspection + certification — CRB inspection + certificate
- `Premium Secure` — Multi-audit verification — Multiple industry certifications

Industry verification STL impact examples:
- Electrical Services → `+5` STL — Security: High
- Solar Installation → `+5` STL — Security: High
- Construction → `+4` STL — Security: High
- IT & Electronics → `+4` STL — Security: Medium
- Automotive → `+3` STL — Security: Medium
- Plumbing → `+3` STL — Security: Medium
- HVAC → `+3` STL — Security: Medium
- Healthcare → `+5` STL — Security: Premium
- Legal → `+5` STL — Security: Premium
- Security → `+4` STL — Security: High

Industry audit schedule examples (cycle + grace):
- Electrical / Solar / Construction: `6 months` — `14 days` grace
- Healthcare: `3 months` — `7 days` grace
- Legal: `12 months` — `30 days` grace
- IT: `6 months` — `14 days` grace

---

## 5) Industry Verification System Flow + DMO Application → CRB → STL (docs/ui-ux/industry-verification-system.md)

Flow:
`User applies for Industry Verification → DMO Application → Franchise inspection → CRB certification → Industry verification approved (added to trust card) → STL score increase → Audit schedule created (next audit date - 6 months)`

Industry badges examples (for “industry verification” UI):
- `⚡` Electrical Verified
- `🔧` Mechanical Verified
- `💻` IT/Technology Verified
- `🏥` Medical/Healthcare Verified
- `⚖️` Legal Verified
- `🚗` Automotive Verified
- `🏗️` Construction Verified
- `☀️` Solar/Renewable Verified
- `🔒` Security Verified
- `🌊` Plumbing Verified

---

## 6) Roadmap Phases (docs/roadmap/MASTER-ROADMAP.md)

Phases overview:
- Phase 1 — Foundation (DMO, PSS, CRB, STL, Wallet)
- Phase 2 — Marketplace (GoSellr, Products, Services)
- Phase 3 — Professional Network (JPS, Jobs, Freelance)
- Phase 4 — Service Platforms (WMS, AGTS, OLS, SOT, HPS)
- Phase 5 — Digital Governance (Applications, Licenses)
- Phase 6 — Global Expansion (Multi-country)
- Phase 7 — AI Ecosystem (ML, Fraud Detection, NLP)
- Phase 8 — Blockchain Governance (Trust Network, Smart Contracts)

