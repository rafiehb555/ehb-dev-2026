# EHB DATABASE MASTER STRUCTURE

> Enterprise-level database design for EHB Super App

## Database Layers Overview

```
EHB DATABASE
│
├── 1. Core Users Layer
├── 2. Verification Layer
├── 3. Services Layer
├── 4. Financial Layer
├── 5. Affiliate Layer
├── 6. Franchise Layer
├── 7. AI Marketplace Layer
├── 8. Blockchain Layer
└── 9. System Layer
```

---

# LAYER 1: CORE USERS

> Platform ki identity system

## Table: users

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | varchar | Full name |
| email | varchar | Unique email |
| phone | varchar | Phone number |
| password_hash | varchar | Encrypted password |
| role | enum | user/provider/admin/franchise |
| country | varchar | User country |
| created_at | timestamp | Registration date |

## Table: profiles (JPS System)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| headline | text | Professional headline |
| bio | text | About user |
| experience_years | int | Years of experience |
| location | varchar | City/Region |
| profile_image | varchar | Image URL |

## Table: skills

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| skill_name | varchar | Skill name |
| category | varchar | Skill category |

## Table: user_skills

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| skill_id | UUID | FK → skills |
| level | varchar | beginner/intermediate/expert |

---

# LAYER 2: VERIFICATION

> PSS, CRB, STL Systems

## Table: pss_verifications

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| document_type | varchar | CNIC/Passport/License |
| document_number | varchar | Document ID |
| status | enum | pending/verified/rejected |
| verified_at | timestamp | Verification date |

## Table: crb_certifications

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| certification_name | varchar | Certificate name |
| issued_by | varchar | Issuing authority |
| expiry_date | date | Expiration date |

## Table: stl_levels

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| level | enum | free/basic/medium/high/vip |
| trust_score | float | 0.0 - 100.0 |

---

# LAYER 3: SERVICES

> 700+ Services across 15+ Industries

## Table: industries

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | varchar | Industry name |
| code | varchar | GSM/WMS/HPS/etc. |
| description | text | Industry description |

## Table: categories

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| industry_id | UUID | FK → industries |
| name | varchar | Category name |
| description | text | Category description |

## Table: services

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| category_id | UUID | FK → categories |
| name | varchar | Service name |
| description | text | Service description |
| min_stl_level | enum | Required trust level |

## Table: service_providers

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| service_id | UUID | FK → services |
| price | decimal | Service price |
| currency | varchar | PKR/USD/etc. |
| availability | boolean | Is available |

## Table: bookings

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| service_id | UUID | FK → services |
| customer_id | UUID | FK → users |
| provider_id | UUID | FK → users |
| status | enum | pending/confirmed/completed/cancelled |
| booking_date | datetime | Appointment date |
| created_at | timestamp | Booking created |

---

# LAYER 4: FINANCIAL

> EHB Wallet & Transactions

## Table: wallets

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| balance | decimal | Current balance |
| currency | varchar | Default currency |

## Table: transactions

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| sender_id | UUID | FK → users |
| receiver_id | UUID | FK → users |
| amount | decimal | Transaction amount |
| currency | varchar | Transaction currency |
| type | enum | payment/refund/commission/payout |
| status | enum | pending/completed/failed |
| created_at | timestamp | Transaction time |

## Table: escrow_transactions

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| transaction_id | UUID | FK → transactions |
| release_status | enum | held/released/refunded |
| release_date | timestamp | When released |

---

# LAYER 5: AFFILIATE

> Referral & Commission System

## Table: affiliates

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| referral_code | varchar | Unique code |
| total_earnings | decimal | Lifetime earnings |

## Table: affiliate_commissions

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| affiliate_id | UUID | FK → affiliates |
| amount | decimal | Commission amount |
| source | varchar | booking/subscription/etc. |
| status | enum | pending/paid |
| created_at | timestamp | When earned |

---

# LAYER 6: FRANCHISE

> Franchise Network Management

## Table: franchises

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| type | enum | country/corporate/sub |
| name | varchar | Franchise name |
| country | varchar | Operating country |
| region | varchar | Operating region |
| owner_id | UUID | FK → users |
| parent_id | UUID | FK → franchises (for hierarchy) |

## Table: franchise_revenue

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| franchise_id | UUID | FK → franchises |
| amount | decimal | Revenue amount |
| source | varchar | services/subscriptions/etc. |
| period | varchar | Monthly period |
| created_at | timestamp | Record date |

---

# LAYER 7: AI MARKETPLACE

> AI Tools & Usage Tracking

## Table: ai_tools

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | varchar | Tool name |
| category | varchar | search/assistant/analytics |
| price | decimal | Per-use or subscription |
| description | text | Tool description |

## Table: ai_usage

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| tool_id | UUID | FK → ai_tools |
| usage_count | int | Number of uses |
| last_used | timestamp | Last usage time |

---

# LAYER 8: BLOCKCHAIN

> Immutable Records & Proof

## Table: blockchain_transactions

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| tx_hash | varchar | Blockchain hash |
| sender | varchar | Sender address |
| receiver | varchar | Receiver address |
| amount | decimal | Transaction amount |
| network | varchar | Polkadot/etc. |
| created_at | timestamp | Record time |

## Table: blockchain_proofs

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| record_type | varchar | verification/certification/transaction |
| record_id | UUID | Reference ID |
| tx_hash | varchar | Blockchain hash |
| created_at | timestamp | Proof creation |

---

# RELATIONSHIPS DIAGRAM

```
users
│
├─── profiles (1:1)
├─── user_skills (1:N) ──→ skills
├─── pss_verifications (1:N)
├─── crb_certifications (1:N)
├─── stl_levels (1:1)
│
├─── service_providers (1:N)
│       └─── services (N:1)
│               └─── categories (N:1)
│                       └─── industries (N:1)
│
├─── bookings (as customer) (1:N)
├─── bookings (as provider) (1:N)
│
├─── wallets (1:1)
│       └─── transactions (1:N)
│               └─── escrow_transactions (1:1)
│
├─── affiliates (1:1)
│       └─── affiliate_commissions (1:N)
│
└─── franchises (1:N)
        └─── franchise_revenue (1:N)
```

---

# TOTAL TABLES: 20+

| Layer | Tables |
|-------|--------|
| Core Users | 4 |
| Verification | 3 |
| Services | 5 |
| Financial | 3 |
| Affiliate | 2 |
| Franchise | 2 |
| AI Marketplace | 2 |
| Blockchain | 2 |
| **Total** | **23** |

---

*Database Version: 1.0 | March 2026*
