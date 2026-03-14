# DMO Database Modules Quick Reference

> 15 Modules, ~200 Tables

## Module Summary

| # | Module | Tables | Key Tables |
|---|--------|--------|------------|
| 1 | User & Identity | 16 | users, user_profiles, user_roles |
| 2 | Professional Profile | 13 | skills, user_skills, education_records |
| 3 | Company Management | 13 | companies, company_profiles, company_staff |
| 4 | Product Management | 14 | products, product_categories, product_inventory |
| 5 | Service Provider | 12 | services, service_providers, service_bookings |
| 6 | PSS Verification | 11 | pss_verifications, identity_verifications |
| 7 | CRB Certification | 13 | crb_applications, crb_certificates, crb_inspections |
| 8 | STL Trust System | 9 | stl_levels, stl_scores, stl_history |
| 9 | Application Workflow | 11 | applications, application_workflows |
| 10 | Officer Management | 10 | officers, officer_roles, officer_departments |
| 11 | Wallet & Finance | 12 | wallet_accounts, wallet_transactions |
| 12 | Franchise Management | 10 | franchises, franchise_commissions |
| 13 | Notifications | 10 | notifications, notification_templates |
| 14 | Blockchain Records | 6 | blockchain_records, blockchain_hashes |
| 15 | System Admin | 10 | system_settings, system_logs |

## Total: ~170-200 Tables (250+ in production)

## Core Relationships

```
users (1) ──→ (1) user_profiles
users (1) ──→ (N) user_skills ──→ skills
users (1) ──→ (N) pss_verifications
users (1) ──→ (1) stl_scores ──→ stl_levels
users (1) ──→ (1) wallet_accounts ──→ wallet_transactions
users (1) ──→ (N) service_providers ──→ services
companies (1) ──→ (N) products
companies (1) ──→ (N) company_staff ──→ users
```

## Tech Stack

```
PostgreSQL  → Primary DB
Redis       → Cache/Sessions
Elastic     → Search
Blockchain  → Hash anchoring
```

---

*Full schema: docs/database/dmo-master-database.md*
