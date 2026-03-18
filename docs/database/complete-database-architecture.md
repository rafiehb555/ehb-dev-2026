# EHB COMPLETE DATABASE ARCHITECTURE

> 300+ Tables Enterprise Database System

---

# OVERVIEW

Large platforms like Amazon, Uber, Alibaba use **modular database architecture**. EHB follows the same pattern with ~300+ tables organized into modules.

---

# DATABASE MASTER STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DMO MASTER DATABASE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ├── User & Identity Module          (~30 tables)                  │
│  ├── JPS Professional Profiles       (~25 tables)                  │
│  ├── PSS Verification System         (~30 tables)                  │
│  ├── CRB Certification System        (~30 tables)                  │
│  ├── STL Trust Engine                (~20 tables)                  │
│  ├── Marketplace System              (~40 tables)                  │
│  ├── Wallet & Finance                (~30 tables)                  │
│  ├── Franchise Network               (~20 tables)                  │
│  ├── Application & Licensing         (~25 tables)                  │
│  ├── Notifications                   (~10 tables)                  │
│  └── Analytics & AI                  (~40 tables)                  │
│                                                                     │
│                         TOTAL: ~300+ tables                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# USER & IDENTITY MODULE (~30 tables)

```sql
-- Core User Tables
users                    -- Main user accounts
user_profiles            -- Extended profile data
user_roles               -- Role assignments
user_permissions         -- Permission grants
user_sessions            -- Active sessions
user_devices             -- Registered devices
user_addresses           -- Address book
user_contacts            -- Contact information
user_activity_logs       -- Activity tracking
user_preferences         -- Settings & preferences
user_notifications_settings -- Notification preferences

-- Authentication
auth_tokens              -- JWT/refresh tokens
auth_2fa                 -- 2FA configurations
auth_password_history    -- Password audit
auth_login_attempts      -- Login tracking
auth_recovery_codes      -- Account recovery

-- Organization
organizations            -- Company accounts
organization_members     -- Team members
organization_roles       -- Company roles
organization_invites     -- Pending invites
```

---

# JPS PROFESSIONAL PROFILES MODULE (~25 tables)

```sql
-- Core JPS
jps_profiles             -- Main professional profile
jps_skills               -- Skill entries
jps_skill_categories     -- Skill taxonomy
jps_experience           -- Work experience
jps_education            -- Educational background
jps_certifications       -- Professional certifications
jps_projects             -- Portfolio projects
jps_project_media        -- Project images/videos

-- Reviews & Ratings
jps_reviews              -- Customer reviews
jps_review_responses     -- Provider responses
jps_endorsements         -- Skill endorsements
jps_recommendations      -- Professional recommendations

-- Jobs
jps_job_applications     -- Job applications
jps_job_matches          -- AI job matches
jps_saved_jobs           -- Saved job listings

-- Skill Testing
jps_skill_tests          -- Available tests
jps_skill_results        -- Test results
jps_skill_badges         -- Earned badges
```

---

# PSS VERIFICATION MODULE (~30 tables)

```sql
-- Identity Verification
pss_identity_verification    -- ID verification records
pss_document_uploads         -- Uploaded documents
pss_document_analysis        -- OCR/AI analysis results
pss_liveness_checks          -- Liveness detection logs
pss_face_matches             -- Face comparison results

-- KYC/KYB
pss_kyc_records              -- Individual KYC
pss_kyb_records              -- Business KYB
pss_beneficial_owners        -- UBO declarations
pss_kyc_refresh              -- Periodic refresh logs

-- AML/Sanctions
pss_aml_screening            -- AML check results
pss_sanctions_hits           -- Sanctions matches
pss_pep_checks               -- PEP screening
pss_watchlist_monitoring     -- Ongoing monitoring

-- Risk & Fraud
pss_risk_scores              -- Risk assessments
pss_fraud_alerts             -- Fraud indicators
pss_fraud_investigations     -- Investigation records
pss_device_intelligence      -- Device fingerprints
pss_behavior_logs            -- Behavioral analysis
pss_ip_risk_scores           -- IP reputation

-- Verification History
pss_verification_history     -- All verification events
pss_document_expiry          -- Document expiration tracking
```

---

# CRB CERTIFICATION MODULE (~30 tables)

```sql
-- Applications
crb_applications             -- Certification applications
crb_application_documents    -- Supporting documents
crb_application_status       -- Status tracking

-- Inspections
crb_inspections              -- Inspection records
crb_inspection_reports       -- Detailed reports
crb_inspection_evidence      -- Photos, videos
crb_inspection_scores        -- Evaluation scores

-- Skill Testing
crb_skill_tests              -- Test definitions
crb_skill_test_results       -- Test outcomes
crb_interview_records        -- Interview notes
crb_interview_scores         -- Interview evaluations

-- Certificates
crb_certificates             -- Issued certificates
crb_certificate_templates    -- Certificate designs
crb_certificate_verification -- QR code verifications

-- Registry
crb_registry                 -- Official registry entries
crb_registry_audit           -- Registry changes

-- Refilling
crb_refilling_records        -- 6-month refilling
crb_refilling_reminders      -- Reminder tracking
crb_refilling_penalties      -- Non-compliance penalties

-- Products & Companies
crb_product_verifications    -- Product certifications
crb_company_certifications   -- Company verifications
```

---

# STL TRUST ENGINE MODULE (~20 tables)

```sql
-- Scores
stl_profiles                 -- STL profile data
stl_scores                   -- Current scores (cached)
stl_score_components         -- Score breakdown
stl_score_history            -- Score changes over time

-- Factors
stl_reviews                  -- Review data for scoring
stl_complaints               -- Complaint records
stl_complaint_resolutions    -- Resolution tracking

-- Adjustments
stl_rewards                  -- Reward transactions
stl_penalties                -- Penalty records
stl_refilling_scores         -- Refilling evaluation data

-- Rankings
stl_rankings                 -- Cached ranking positions
stl_ranking_history          -- Ranking changes
stl_level_changes            -- Level upgrade/downgrade logs

-- ML
stl_ml_features              -- Preprocessed ML features
stl_model_versions           -- ML model tracking
```

---

# MARKETPLACE MODULE (~40 tables)

```sql
-- Products
products                     -- Product listings
product_categories           -- Category taxonomy
product_variants             -- Size, color variants
product_inventory            -- Stock levels
product_images               -- Product media
product_pricing              -- Pricing rules

-- Services
services                     -- Service listings
service_categories           -- Service taxonomy
service_availability         -- Provider schedules
service_pricing              -- Service rates

-- Orders
orders                       -- Order records
order_items                  -- Order line items
order_status_history         -- Status tracking
order_payments               -- Payment records
order_refunds                -- Refund records

-- Service Orders
service_orders               -- Service bookings
service_order_assignments    -- Provider assignments
service_order_completion     -- Completion records

-- Reviews
marketplace_reviews          -- Product/service reviews
review_responses             -- Seller responses
review_reports               -- Reported reviews

-- Search & Discovery
search_history               -- User searches
search_suggestions           -- Auto-complete data
recommendations              -- AI recommendations
wishlists                    -- Saved items
```

---

# WALLET & FINANCE MODULE (~30 tables)

```sql
-- Accounts
wallet_accounts              -- Wallet records
wallet_balances              -- Current balances
wallet_balance_history       -- Balance changes

-- Transactions
wallet_transactions          -- All transactions
wallet_transfers             -- P2P transfers
wallet_deposits              -- Deposit records
wallet_withdrawals           -- Withdrawal records

-- Fees & Commissions
wallet_fees                  -- Fee calculations
wallet_commissions           -- Commission records
wallet_platform_fees         -- Platform fee tracking

-- Escrow
escrow_accounts              -- Escrow holdings
escrow_releases              -- Release records

-- Penalties
wallet_penalties             -- Penalty deductions
wallet_penalty_appeals       -- Appeal records

-- Reporting
wallet_invoices              -- Invoice generation
wallet_statements            -- Account statements
wallet_tax_reports           -- Tax documentation
```

---

# FRANCHISE NETWORK MODULE (~20 tables)

```sql
-- Franchises
franchises                   -- Franchise records
franchise_levels             -- Level definitions
franchise_owners             -- Ownership records
franchise_staff              -- Staff assignments

-- Regions
franchise_regions            -- Geographic regions
franchise_territories        -- Territory assignments

-- Operations
franchise_inspections        -- Inspection records
franchise_reports            -- Performance reports
franchise_audits             -- Compliance audits

-- Finance
franchise_commissions        -- Commission records
franchise_payouts            -- Payout tracking
franchise_fees               -- Franchise fees

-- Inspectors
franchise_inspectors         -- Inspector profiles
inspector_assignments        -- Task assignments
inspector_performance        -- Performance metrics
```

---

# APPLICATION & LICENSING MODULE (~25 tables)

```sql
-- Applications
applications                 -- Application records
application_types            -- Type definitions
application_documents        -- Required documents
application_uploads          -- Uploaded files

-- Workflow
application_workflows        -- Workflow definitions
application_steps            -- Step configurations
application_reviews          -- Review records
application_approvals        -- Approval decisions

-- Status
application_status           -- Current status
application_status_history   -- Status changes
application_comments         -- Review comments

-- Licenses
licenses                     -- Issued licenses
license_types                -- License categories
license_renewals             -- Renewal tracking
license_revocations          -- Revocation records
```

---

# NOTIFICATIONS MODULE (~10 tables)

```sql
notifications                -- Notification records
notification_templates       -- Message templates
notification_channels        -- Delivery channels
notification_preferences     -- User preferences
notification_delivery_log    -- Delivery tracking
notification_read_status     -- Read/unread status
scheduled_notifications      -- Scheduled messages
push_tokens                  -- Device tokens
email_queue                  -- Email queue
sms_queue                    -- SMS queue
```

---

# ANALYTICS & AI MODULE (~40 tables)

```sql
-- Events
analytics_events             -- Raw event data
analytics_sessions           -- Session tracking
analytics_page_views         -- Page view logs

-- Aggregations
analytics_daily_stats        -- Daily aggregates
analytics_weekly_stats       -- Weekly aggregates
analytics_monthly_stats      -- Monthly aggregates

-- AI Models
ai_model_registry            -- Model versions
ai_model_performance         -- Performance metrics
ai_feature_store             -- ML features
ai_predictions               -- Prediction logs
ai_training_data             -- Training datasets

-- Recommendations
recommendation_models        -- Rec system models
recommendation_scores        -- User-item scores
recommendation_feedback      -- User feedback

-- Search
search_index_metadata        -- Search index info
search_synonyms              -- Synonym mappings
search_analytics             -- Search metrics

-- Reporting
reports                      -- Report definitions
report_schedules             -- Scheduled reports
report_outputs               -- Generated reports
dashboards                   -- Dashboard configs
dashboard_widgets            -- Widget definitions
```

---

# ESTIMATED TABLE COUNT

| Module | Tables |
|--------|--------|
| User & Identity | 30 |
| JPS Professional | 25 |
| PSS Verification | 30 |
| CRB Certification | 30 |
| STL Trust Engine | 20 |
| Marketplace | 40 |
| Wallet & Finance | 30 |
| Franchise Network | 20 |
| Applications | 25 |
| Notifications | 10 |
| Analytics & AI | 40 |
| **TOTAL** | **~300+** |

---

*Complete Database Architecture v1.0 | March 2026*
