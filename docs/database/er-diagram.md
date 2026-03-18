# DMO MASTER ER DIAGRAM

> Database Relationship Map (Simplified View)

---

# CORE ENTITY RELATIONSHIPS

```
USERS (Central Entity)
 │
 ├─── user_profiles (1:1)
 ├─── user_roles (N:M)
 ├─── user_devices (1:N)
 └─── user_sessions (1:N)

USERS
 │
 ├──< PROFESSIONAL_PROFILES (1:N)
 │       ├─ skills
 │       ├─ education_records
 │       └─ experience_records
 │
 ├──< COMPANIES (1:N)
 │       ├─ company_profiles
 │       ├─ company_documents
 │       └─ company_staff
 │
 ├──< PRODUCTS (via companies) (1:N)
 │       ├─ product_categories
 │       ├─ product_inventory
 │       └─ product_reviews
 │
 ├──< SERVICES (1:N)
 │       ├─ service_providers
 │       ├─ service_orders
 │       └─ service_reviews
 │
 ├──< PSS_VERIFICATIONS (1:N)
 │       ├─ identity_verifications
 │       ├─ document_verifications
 │       └─ fraud_detection_logs
 │
 ├──< CRB_CERTIFICATIONS (1:N)
 │       ├─ inspections
 │       ├─ skill_tests
 │       └─ refilling_records
 │
 ├──< STL_SCORES (1:1)
 │       ├─ stl_history
 │       ├─ stl_reviews
 │       └─ stl_penalties
 │
 ├──< APPLICATIONS (1:N)
 │       ├─ application_documents
 │       ├─ workflow_steps
 │       └─ approvals
 │
 ├──< WALLET_ACCOUNTS (1:1)
 │       ├─ transactions
 │       ├─ transfers
 │       └─ invoices
 │
 └──< NOTIFICATIONS (1:N)
         ├─ alerts
         └─ logs
```

---

# KEY RELATIONSHIPS TABLE

| Parent Entity | Child Entity | Relationship | Foreign Key |
|---------------|--------------|--------------|-------------|
| users | profiles | 1-to-1 | user_id |
| users | user_roles | Many-to-Many | user_id, role_id |
| users | companies | 1-to-Many | owner_id |
| users | professional_profiles | 1-to-1 | user_id |
| users | wallet_accounts | 1-to-1 | user_id |
| users | stl_scores | 1-to-1 | user_id |
| users | pss_verifications | 1-to-Many | user_id |
| users | crb_certifications | 1-to-Many | user_id |
| users | applications | 1-to-Many | user_id |
| users | notifications | 1-to-Many | user_id |
| companies | products | 1-to-Many | company_id |
| companies | company_staff | 1-to-Many | company_id |
| companies | company_documents | 1-to-Many | company_id |
| products | product_reviews | 1-to-Many | product_id |
| products | product_inventory | 1-to-1 | product_id |
| services | service_providers | 1-to-Many | service_id |
| services | service_orders | 1-to-Many | service_id |
| wallet_accounts | transactions | 1-to-Many | wallet_id |
| applications | workflow_steps | 1-to-Many | application_id |
| applications | approvals | 1-to-Many | application_id |

---

# VISUAL ER DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USERS                                     │
│  id | email | phone | password_hash | role | created_at            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  PROFILES   │         │  COMPANIES  │         │   WALLET    │
│  (1:1)      │         │  (1:N)      │         │   (1:1)     │
└─────────────┘         └──────┬──────┘         └──────┬──────┘
                               │                       │
                               ▼                       ▼
                        ┌─────────────┐         ┌─────────────┐
                        │  PRODUCTS   │         │TRANSACTIONS │
                        │  (1:N)      │         │   (1:N)     │
                        └─────────────┘         └─────────────┘

       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    PSS      │         │    CRB      │         │    STL      │
│ Verification│         │Certification│         │   Scores    │
│   (1:N)     │         │   (1:N)     │         │   (1:1)     │
└─────────────┘         └─────────────┘         └─────────────┘

       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ APPLICATIONS│         │  SERVICES   │         │NOTIFICATIONS│
│   (1:N)     │         │   (1:N)     │         │   (1:N)     │
└──────┬──────┘         └──────┬──────┘         └─────────────┘
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  WORKFLOW   │         │  BOOKINGS   │
│   STEPS     │         │   (1:N)     │
└─────────────┘         └─────────────┘
```

---

# RELATIONSHIP TYPES LEGEND

| Symbol | Meaning |
|--------|---------|
| 1:1 | One-to-One |
| 1:N | One-to-Many |
| N:M | Many-to-Many |
| ──< | Has Many |
| ──> | Belongs To |
| ─── | Has One |

---

# MODULE CONNECTIONS

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DMO CORE DATABASE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   IDENTITY          VERIFICATION         TRUST                     │
│   ┌───────┐         ┌───────┐           ┌───────┐                  │
│   │ Users │────────►│  PSS  │──────────►│  STL  │                  │
│   └───┬───┘         └───────┘           └───────┘                  │
│       │                  │                   │                      │
│       │             ┌────┴────┐              │                      │
│       │             │   CRB   │──────────────┘                      │
│       │             └─────────┘                                     │
│       │                                                             │
│   BUSINESS          FINANCIAL            GOVERNANCE                │
│   ┌───────┐         ┌───────┐           ┌───────┐                  │
│   │Company│────────►│Wallet │──────────►│ Apps  │                  │
│   └───┬───┘         └───────┘           └───────┘                  │
│       │                                      │                      │
│       ▼                                      ▼                      │
│   ┌───────┐                             ┌───────┐                  │
│   │Product│                             │Workflow│                  │
│   │Service│                             │Approval│                  │
│   └───────┘                             └───────┘                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*ER Diagram Version 1.0 | March 2026*
