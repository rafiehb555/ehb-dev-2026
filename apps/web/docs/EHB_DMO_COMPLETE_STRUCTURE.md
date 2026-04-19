# DMO Complete Department Structure (Final)

DMO is the central control system for the EHB operating layer.

## Full Department Tree

```text
DMO (Decentralized Management Office) - Central Control System

├── Dashboard (Overview)
│   → System-wide analytics, KPIs, alerts, and quick actions
│   → Shows real-time data from all departments
│
├── Applications (All System Requests)
│   → Central queue for all applications (PSS, CRB, Industry, Franchise)
│   → Status tracking: NEW → IN_REVIEW → ASSIGNED → APPROVED/REJECTED
│   → Includes SLA timers, risk levels, STL impact preview
│
├── Approvals (Decision Engine)
│   → Final decision system for all applications
│   → Approve / Reject / Assign with notes
│   → Includes audit logs, approval history, and decision tracking
│
├── JPS (Job Profile & Skill)
│   → User professional profiles, skills, experience, and services
│   → Acts like LinkedIn + Fiverr system
│   → Used as base identity for services and jobs
│
├── PSS (Proof & Security System)
│   → Identity verification (KYC/KYB), AML checks, liveness detection
│   → Risk scoring, fraud detection, device intelligence
│   → Refilling system for periodic re-verification
│
├── CRB (Central Record Blockchain)
│   → Certification of skills, services, products, and companies
│   → Inspection system + certificate issuing + expiry tracking
│   → Works with franchise for physical verification
│
├── Franchise (Verification Network)
│   → Ground-level inspection system (Sub, Master, Corporate)
│   → Task assignment, inspection reports, escalation system
│   → Ensures real-world validation
│
├── EHB-STL (Service Trust Level)
│   → AI-based trust scoring system (0–100)
│   → Calculates trust using:
│       PSS + CRB + Performance + Behavior + Refilling
│   → Determines ranking, visibility, and platform trust level
│
├── Industry (Multi-Industry Verification System)
│   → 32+ industry sectors (Health, Tech, Manufacturing, etc.)
│   → Each entity can be verified by multiple industries
│   → Adds extra trust layer and boosts STL score
│
├── Refilling (Verification Renewal System)
│   → Periodic re-verification system (every 6 months)
│   → Applies to PSS, CRB, and Industry
│   → Controls STL stability and marketplace visibility
│
├── Affiliate (Earning & Growth System)
│   → Referral-based earning system (Direct + Level + Franchise)
│   → Tracks earnings, referrals, and network growth
│   → Integrated with all services and marketplace
│
├── Notifications (Smart Alert System)
│   → AI-driven alerts and system notifications
│   → Includes:
│       - PSS alerts
│       - Approval alerts
│       - Refill reminders
│       - Risk warnings
│   → Multi-channel (App, Email, SMS)
│
├── Penalty (Compliance & Control System)
│   → Automated and manual penalty system
│   → Applied by:
│       - AI/System (auto penalties)
│       - Franchise (field issues)
│       - Company (major violations)
│   → Impacts STL score, visibility, and access
│
└── Settings (System Configuration & Control)
    → Role management (Admin, Franchise, User)
    → Permissions (RBAC system)
    → System configurations and controls
```

## Short Forms

| Short | Full Form |
| --- | --- |
| DMO | Decentralized Management Office |
| JPS | Job Profile & Skill |
| PSS | Proof & Security System |
| CRB | Central Record Blockchain |
| EHB-STL | EHB Service Trust Level |

## Final System View

```text
User → JPS → PSS → CRB → Franchise → DMO → Approval → Registry →
EHB-STL → Industry → Marketplace → Refilling → Notifications → Penalty → Loop
```

## Architectural Notes

- DMO is a governance OS, not only a dashboard.
- Every department must emit automation events and audit entries.
- STL and marketplace visibility should be continuously influenced by verification, behavior, and compliance loops.

