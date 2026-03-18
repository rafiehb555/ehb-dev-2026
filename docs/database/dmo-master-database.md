# DMO MASTER DATABASE STRUCTURE

> Enterprise-Level Modular Architecture (200+ Tables)

---

# DATABASE OVERVIEW

## Module Summary

| # | Module | Tables | Purpose |
|---|--------|--------|---------|
| 1 | User & Identity (JPS) | 16 | User accounts & profiles |
| 2 | Professional Profile | 13 | Skills & employment |
| 3 | Company Management | 13 | Organizations |
| 4 | Product Management | 14 | GoSellr products |
| 5 | Service Provider | 12 | Services & bookings |
| 6 | PSS Verification | 11 | AI verification |
| 7 | CRB Certification | 13 | Physical certification |
| 8 | EHB STL Trust | 9 | Trust scoring |
| 9 | Application Workflow | 11 | Approvals |
| 10 | Officer Management | 10 | DMO officers |
| 11 | Wallet & Finance | 12 | Payments |
| 12 | Franchise Management | 10 | Franchise network |
| 13 | Notifications | 10 | Alerts & messages |
| 14 | Blockchain Records | 6 | Immutable records |
| 15 | System Admin | 10 | Configuration |
| | **TOTAL** | **~170-200** | |

---

# MODULE 1: USER & IDENTITY (JPS)

> User identity and profiles management

## Tables (16)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Core user accounts | id, email, phone, password_hash, role |
| `user_profiles` | Extended profile data | user_id, bio, headline, avatar |
| `user_roles` | Role definitions | id, name, permissions |
| `user_permissions` | Access permissions | user_id, permission_id |
| `user_sessions` | Active sessions | user_id, token, device, expires_at |
| `user_login_history` | Login records | user_id, ip, device, timestamp |
| `user_devices` | Registered devices | user_id, device_id, type, name |
| `user_addresses` | Address book | user_id, type, address, city, country |
| `user_contacts` | Contact information | user_id, type, value |
| `user_languages` | Language preferences | user_id, language, proficiency |
| `user_settings` | User preferences | user_id, key, value |
| `user_security_logs` | Security events | user_id, event, details, timestamp |
| `user_activity_logs` | Activity tracking | user_id, action, resource, timestamp |
| `user_status` | Account status | user_id, status, reason, updated_at |
| `user_referrals` | Referral tracking | user_id, referred_by, code |
| `user_blocklist` | Blocked users | user_id, blocked_id, reason |

---

# MODULE 2: PROFESSIONAL PROFILE

> Skills, education, and employment data

## Tables (13)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `skills` | Skill definitions | id, name, category_id |
| `skill_categories` | Skill categories | id, name, parent_id |
| `user_skills` | User's skills | user_id, skill_id, level, verified |
| `education_records` | Education history | user_id, institution, degree, year |
| `degree_records` | Degree details | id, name, type, field |
| `experience_records` | Work experience | user_id, company, role, duration |
| `portfolio_items` | Portfolio/work samples | user_id, title, url, type |
| `professional_certificates` | Professional certs | user_id, name, issuer, expiry |
| `employment_history` | Employment records | user_id, employer_id, role, period |
| `designation_levels` | Job levels | id, name, rank |
| `designation_history` | Level changes | user_id, level_id, date |
| `skill_tests` | Test definitions | id, skill_id, questions, duration |
| `skill_test_results` | Test results | user_id, test_id, score, passed |

---

# MODULE 3: COMPANY MANAGEMENT

> Companies and organizations

## Tables (13)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `companies` | Company accounts | id, name, registration_no, type |
| `company_profiles` | Extended company info | company_id, description, logo |
| `company_branches` | Branch offices | company_id, name, address, type |
| `company_staff` | Company employees | company_id, user_id, role, status |
| `company_documents` | Company documents | company_id, type, file_url |
| `company_certifications` | Company certs | company_id, cert_id, issued_date |
| `company_categories` | Business categories | id, name, parent_id |
| `company_products` | Company's products | company_id, product_id |
| `company_services` | Company's services | company_id, service_id |
| `company_reviews` | Company reviews | company_id, user_id, rating, text |
| `company_complaints` | Complaints | company_id, user_id, type, status |
| `company_status_history` | Status changes | company_id, status, reason, date |
| `company_audit_logs` | Audit trail | company_id, action, details, timestamp |

---

# MODULE 4: PRODUCT MANAGEMENT (GoSellr)

> E-commerce product catalog

## Tables (14)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `products` | Product catalog | id, name, sku, company_id, price |
| `product_categories` | Main categories | id, name, slug, icon |
| `product_subcategories` | Sub categories | id, category_id, name |
| `product_brands` | Brand definitions | id, name, logo |
| `product_models` | Model definitions | id, brand_id, name |
| `product_variants` | Product variants | product_id, sku, attributes |
| `product_inventory` | Stock management | product_id, quantity, warehouse |
| `product_images` | Product images | product_id, url, is_primary |
| `product_documents` | Product docs | product_id, type, url |
| `product_reviews` | Customer reviews | product_id, user_id, rating, text |
| `product_ratings` | Aggregated ratings | product_id, avg_rating, count |
| `product_verifications` | Verification status | product_id, status, verified_at |
| `product_status` | Product status | product_id, status, reason |
| `product_complaints` | Product complaints | product_id, user_id, type, status |

---

# MODULE 5: SERVICE PROVIDER

> Services and bookings

## Tables (12)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `services` | Service definitions | id, name, category_id, description |
| `service_categories` | Service categories | id, name, industry_id |
| `service_providers` | Provider profiles | user_id, service_id, price, available |
| `service_packages` | Service packages | id, provider_id, name, price |
| `service_locations` | Service areas | provider_id, location, radius |
| `service_reviews` | Service reviews | service_id, user_id, rating, text |
| `service_ratings` | Aggregated ratings | service_id, avg_rating, count |
| `service_bookings` | Booking records | id, service_id, customer_id, datetime |
| `service_orders` | Service orders | id, booking_id, status, amount |
| `service_history` | Service history | user_id, service_id, completed_at |
| `service_verification` | Verification status | provider_id, status, verified_at |
| `service_complaints` | Service complaints | service_id, user_id, type, status |

---

# MODULE 6: PSS VERIFICATION

> AI-powered online verification

## Tables (11)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `pss_verifications` | Main verification records | id, user_id, type, status |
| `identity_verifications` | ID verification | verification_id, doc_type, result |
| `document_verifications` | Document checks | verification_id, doc_type, ai_score |
| `degree_verifications` | Degree verification | verification_id, institution, result |
| `license_verifications` | License checks | verification_id, license_type, result |
| `product_verifications` | Product verification | verification_id, product_id, result |
| `face_verifications` | Face matching | verification_id, confidence, result |
| `fraud_detection_logs` | Fraud alerts | verification_id, risk_score, flags |
| `verification_status` | Status tracking | verification_id, status, updated_at |
| `verification_history` | Status history | verification_id, status, timestamp |
| `verification_documents` | Uploaded docs | verification_id, type, file_url |

---

# MODULE 7: CRB CERTIFICATION

> Physical verification and certification

## Tables (13)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `crb_applications` | Cert applications | id, user_id, type, status |
| `crb_certificates` | Issued certificates | id, user_id, type, issued_at, expiry |
| `crb_inspections` | Inspection records | id, application_id, inspector_id, date |
| `crb_interviews` | Interview records | id, application_id, interviewer_id |
| `crb_skill_tests` | Skill test records | id, application_id, test_id, score |
| `crb_product_tests` | Product testing | id, application_id, product_id, result |
| `crb_company_tests` | Company verification | id, application_id, company_id, result |
| `crb_inspection_reports` | Inspection reports | inspection_id, findings, recommendation |
| `crb_designation_scores` | Designation scores | application_id, score, level |
| `crb_refilling_records` | Refilling records | certificate_id, due_date, status |
| `crb_refilling_tests` | Re-verification tests | refilling_id, test_type, result |
| `crb_refilling_interviews` | Re-interviews | refilling_id, interviewer_id, result |
| `crb_refilling_products` | Product re-check | refilling_id, product_id, result |

---

# MODULE 8: EHB STL TRUST SYSTEM

> Trust level scoring and ranking

## Tables (9)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `stl_levels` | Level definitions | id, name, min_score, max_score |
| `stl_scores` | User scores | user_id, score, level_id, calculated_at |
| `stl_history` | Score history | user_id, old_score, new_score, reason |
| `stl_reviews` | Review impact | user_id, review_id, impact |
| `stl_complaints` | Complaint impact | user_id, complaint_id, impact |
| `stl_penalties` | Penalty records | user_id, reason, points_deducted |
| `stl_rewards` | Reward records | user_id, reason, points_added |
| `stl_refilling_scores` | Refilling impact | user_id, refilling_id, impact |
| `stl_rankings` | User rankings | user_id, rank, category, period |

---

# MODULE 9: APPLICATION WORKFLOW

> Government and organization approvals

## Tables (11)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `applications` | Main applications | id, user_id, type_id, status |
| `application_types` | Application types | id, name, workflow_id, requirements |
| `application_documents` | Submitted docs | application_id, type, file_url |
| `application_workflows` | Workflow definitions | id, name, steps |
| `application_steps` | Workflow steps | id, workflow_id, order, role_id |
| `application_reviews` | Review records | application_id, reviewer_id, decision |
| `application_approvals` | Approval records | application_id, approver_id, level |
| `application_rejections` | Rejection records | application_id, reason, reviewer_id |
| `application_history` | Status history | application_id, status, timestamp |
| `application_comments` | Review comments | application_id, user_id, comment |
| `application_status` | Current status | application_id, status, updated_at |

---

# MODULE 10: OFFICER MANAGEMENT

> DMO officers and authorities

## Tables (10)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `officers` | Officer accounts | id, user_id, department_id, badge |
| `officer_roles` | Role definitions | id, name, level, permissions |
| `officer_permissions` | Access rights | officer_id, permission_id |
| `officer_departments` | Departments | id, name, parent_id, head_id |
| `officer_login_logs` | Login records | officer_id, ip, timestamp |
| `officer_sessions` | Active sessions | officer_id, token, expires_at |
| `officer_activity_logs` | Activity tracking | officer_id, action, resource |
| `officer_designations` | Rank/designation | officer_id, designation, since |
| `officer_performance` | Performance metrics | officer_id, period, score |
| `officer_reviews` | Performance reviews | officer_id, reviewer_id, rating |

---

# MODULE 11: WALLET & FINANCE

> Payment and financial operations

## Tables (12)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `wallet_accounts` | Wallet accounts | id, user_id, currency, created_at |
| `wallet_balances` | Balance records | wallet_id, balance, updated_at |
| `wallet_transactions` | All transactions | id, wallet_id, type, amount, status |
| `wallet_transfers` | Transfer records | id, from_wallet, to_wallet, amount |
| `wallet_fees` | Fee records | transaction_id, fee_type, amount |
| `wallet_commissions` | Commission records | id, user_id, source, amount |
| `wallet_penalties` | Penalty payments | id, user_id, reason, amount |
| `wallet_refunds` | Refund records | id, transaction_id, amount, reason |
| `wallet_subscriptions` | Subscription payments | id, user_id, plan_id, status |
| `wallet_audit_logs` | Financial audit | transaction_id, action, details |
| `wallet_payment_methods` | Payment methods | id, user_id, type, details |
| `wallet_invoices` | Invoice records | id, user_id, items, total |

---

# MODULE 12: FRANCHISE MANAGEMENT

> Franchise network operations

## Tables (10)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `franchises` | Franchise records | id, type, name, owner_id, region |
| `franchise_levels` | Level definitions | id, name (sub/master/corporate) |
| `franchise_owners` | Ownership records | franchise_id, user_id, share |
| `franchise_staff` | Franchise employees | franchise_id, user_id, role |
| `franchise_regions` | Operating regions | franchise_id, region, country |
| `franchise_reports` | Performance reports | franchise_id, period, metrics |
| `franchise_inspections` | Inspections | franchise_id, date, result |
| `franchise_commissions` | Commission records | franchise_id, source, amount |
| `franchise_performance` | KPI tracking | franchise_id, period, score |
| `franchise_audit_logs` | Audit trail | franchise_id, action, details |

---

# MODULE 13: NOTIFICATIONS & ALERTS

> Communication and alerts

## Tables (10)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `notifications` | Notification records | id, user_id, type, message, read |
| `notification_types` | Type definitions | id, name, template, channel |
| `notification_templates` | Message templates | id, type_id, content, variables |
| `notification_logs` | Delivery logs | notification_id, sent_at, status |
| `alerts` | System alerts | id, type, severity, message |
| `alert_types` | Alert types | id, name, priority |
| `alert_logs` | Alert history | alert_id, triggered_at, resolved_at |
| `email_logs` | Email records | id, user_id, subject, sent_at |
| `sms_logs` | SMS records | id, user_id, message, sent_at |
| `push_notifications` | Push records | id, user_id, title, sent_at |

---

# MODULE 14: BLOCKCHAIN RECORDS

> Immutable record storage

## Tables (6)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `blockchain_records` | All records | id, type, reference_id, hash |
| `blockchain_hashes` | Hash storage | id, record_id, tx_hash, network |
| `blockchain_transactions` | TX records | id, hash, sender, receiver, amount |
| `blockchain_certificates` | Cert proofs | certificate_id, tx_hash, verified |
| `blockchain_verifications` | Verification proofs | verification_id, tx_hash |
| `blockchain_audit_logs` | Audit trail | record_id, action, timestamp |

---

# MODULE 15: SYSTEM ADMIN

> System configuration and management

## Tables (10)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `system_settings` | Global settings | key, value, type, description |
| `system_modules` | Module config | id, name, enabled, version |
| `system_permissions` | Permission defs | id, name, description |
| `system_logs` | System logs | id, level, message, timestamp |
| `system_errors` | Error logs | id, type, message, stack_trace |
| `system_backups` | Backup records | id, type, file_path, created_at |
| `system_updates` | Update history | id, version, applied_at |
| `system_api_keys` | API key management | id, name, key_hash, permissions |
| `system_integrations` | External integrations | id, name, config, status |
| `system_audit_logs` | Admin audit | id, admin_id, action, details |

---

# DATABASE ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                      DMO CORE DATABASE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ User &      │  │ Professional│  │ Company     │             │
│  │ Identity    │  │ Profile     │  │ Management  │             │
│  │ (16 tables) │  │ (13 tables) │  │ (13 tables) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Product     │  │ Service     │  │ PSS         │             │
│  │ Management  │  │ Provider    │  │ Verification│             │
│  │ (14 tables) │  │ (12 tables) │  │ (11 tables) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ CRB         │  │ STL Trust   │  │ Application │             │
│  │ Certification│ │ System      │  │ Workflow    │             │
│  │ (13 tables) │  │ (9 tables)  │  │ (11 tables) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Officer     │  │ Wallet &    │  │ Franchise   │             │
│  │ Management  │  │ Finance     │  │ Management  │             │
│  │ (10 tables) │  │ (12 tables) │  │ (10 tables) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Notifications│ │ Blockchain  │  │ System      │             │
│  │ & Alerts    │  │ Records     │  │ Admin       │             │
│  │ (10 tables) │  │ (6 tables)  │  │ (10 tables) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│                    TOTAL: ~170-200 Tables                       │
│              (250+ with indexes, logs, analytics)               │
└─────────────────────────────────────────────────────────────────┘
```

---

# DATABASE TECHNOLOGY STACK

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary relational database |
| Redis | Caching, sessions |
| ElasticSearch | Full-text search |
| Neo4j | Relationship graphs (optional) |
| IPFS | Document storage |
| Polkadot | Blockchain anchoring |

---

# SCALING CONSIDERATIONS

## Partitioning Strategy
- `user_activity_logs` - partition by date
- `wallet_transactions` - partition by date
- `notifications` - partition by date

## Indexing Strategy
- All foreign keys indexed
- Search fields indexed
- Composite indexes for common queries

## Replication
- Master-slave replication
- Read replicas for reporting
- Geographic distribution

---

*DMO Master Database v1.0 | ~200 Tables | March 2026*
