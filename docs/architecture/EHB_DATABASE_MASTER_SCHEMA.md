# EHB Database Master Schema

EHB uses a modular database architecture that supports:

- 32 industries
- multiple services
- franchise network
- AI marketplace
- blockchain transactions
- affiliate system
- wallet & payments

The schema is divided into logical layers.

---

## 1. Database Layers

1. Identity Layer  
2. Verification Layer  
3. Industry Layer  
4. Service Layer  
5. Transaction Layer  
6. Franchise Layer  
7. AI Layer  
8. Blockchain Layer  
9. Analytics Layer  

---

## 2. Identity Layer

Manages **all platform users**.

### Table: users

| Field         | Type   |
|---------------|--------|
| id            | UUID   |
| email         |        |
| phone         |        |
| password_hash |        |
| status        |        |
| role          |        |
| created_at    |        |
| updated_at    |        |

**Roles:** consumer, provider, franchise_admin, industry_admin, super_admin

---

### Table: profiles

Connected with JPS system.

| Field            | Type |
|------------------|------|
| id               |      |
| user_id          |      |
| full_name        |      |
| profile_photo    |      |
| bio              |      |
| location         |      |
| experience_years |      |
| created_at       |      |

---

### Table: user_roles

| Field      | Type |
|------------|------|
| id         |      |
| user_id    |      |
| role       |      |
| assigned_by|      |
| assigned_at|      |

---

## 3. Verification Layer

Handles **PSS, CRB, STL systems**.

### Table: pss_verifications

| Field                | Type |
|----------------------|------|
| id                   |      |
| user_id              |      |
| document_type        |      |
| document_number      |      |
| verification_status  |      |
| verified_at          |      |

---

### Table: crb_certifications

| Field               | Type |
|---------------------|------|
| id                  |      |
| user_id             |      |
| certification_name  |      |
| issued_by           |      |
| valid_until         |      |
| status              |      |

---

### Table: stl_levels

| Field        | Type |
|--------------|------|
| id           |      |
| user_id      |      |
| trust_level  |      |
| trust_score  |      |
| last_updated |      |

**Levels:** Free, Basic, Normal, High, VIP

---

## 4. Industry Layer

Defines the **32 industries**.

### Table: industries

| Field       | Type |
|-------------|------|
| id          |      |
| name        |      |
| slug        |      |
| description |      |
| status      |      |
| created_at  |      |

---

### Table: categories

| Field       | Type |
|-------------|------|
| id          |      |
| industry_id |      |
| name        |      |
| description |      |

---

## 5. Service Layer

Defines services offered inside industries.

### Table: services

| Field        | Type |
|--------------|------|
| id           |      |
| industry_id  |      |
| category_id  |      |
| name         |      |
| description  |      |
| status       |      |
| created_at   |      |

---

### Table: service_providers

| Field        | Type |
|--------------|------|
| id           |      |
| service_id   |      |
| user_id      |      |
| price        |      |
| availability |      |
| rating       |      |
| verified     |      |
| created_at   |      |

---

### Table: bookings

| Field        | Type |
|--------------|------|
| id           |      |
| service_id   |      |
| provider_id  |      |
| customer_id  |      |
| status       |      |
| booking_time |      |
| price        |      |
| created_at   |      |

**Booking statuses:** pending, confirmed, completed, cancelled

---

## 6. Transaction Layer

Handles financial activity.

### Table: wallets

| Field     | Type |
|-----------|------|
| id        |      |
| user_id   |      |
| balance   |      |
| currency  |      |
| created_at|      |

---

### Table: transactions

| Field            | Type |
|------------------|------|
| id               |      |
| sender_id        |      |
| receiver_id      |      |
| amount           |      |
| currency         |      |
| transaction_type |      |
| status           |      |
| created_at       |      |

**Transaction types:** payment, refund, affiliate_commission, franchise_revenue, wallet_topup

---

### Table: escrow_transactions

| Field          | Type |
|----------------|------|
| id             |      |
| transaction_id |      |
| release_status |      |
| released_at    |      |

---

## 7. Affiliate Layer

Tracks referral marketing.

### Table: affiliates

| Field         | Type |
|---------------|------|
| id            |      |
| user_id       |      |
| referral_code |      |
| created_at    |      |

---

### Table: affiliate_referrals

| Field        | Type |
|--------------|------|
| id           |      |
| affiliate_id |      |
| referred_user|      |
| status       |      |
| created_at   |      |

---

### Table: affiliate_commissions

| Field        | Type |
|--------------|------|
| id           |      |
| affiliate_id |      |
| transaction_id|     |
| amount       |      |
| status       |      |
| created_at   |      |

---

## 8. Franchise Layer

Tracks global franchise network.

### Table: franchises

| Field     | Type |
|-----------|------|
| id        |      |
| type      |      |
| country   |      |
| owner_id  |      |
| status    |      |
| created_at|      |

**Types:** country, corporate, sub

---

### Table: franchise_regions

| Field       | Type |
|-------------|------|
| id          |      |
| franchise_id|      |
| region_name |      |
| country     |      |
| created_at  |      |

---

### Table: franchise_revenue

| Field         | Type |
|---------------|------|
| id            |      |
| franchise_id  |      |
| transaction_id|      |
| amount        |      |
| created_at    |      |

---

## 9. AI Layer

Tracks AI tools and usage.

### Table: ai_tools

| Field     | Type |
|-----------|------|
| id        |      |
| tool_name |      |
| category  |      |
| price     |      |
| status    |      |
| created_at|      |

---

### Table: ai_usage

| Field      | Type |
|------------|------|
| id         |      |
| tool_id    |      |
| user_id    |      |
| usage_count|      |
| last_used  |      |

---

### Table: ai_requests

| Field          | Type |
|----------------|------|
| id             |      |
| tool_id        |      |
| user_id        |      |
| request_payload|      |
| response_time  |      |
| created_at     |      |

---

## 10. Blockchain Layer

Tracks blockchain interactions.

### Table: blockchain_transactions

| Field            | Type |
|------------------|------|
| id               |      |
| tx_hash          |      |
| sender_address   |      |
| receiver_address |      |
| amount           |      |
| block_number     |      |
| status           |      |
| created_at       |      |

---

### Table: validator_nodes

| Field       | Type |
|-------------|------|
| id          |      |
| node_address|      |
| stake_amount|      |
| status      |      |
| last_active |      |

---

## 11. Analytics Layer

Tracks system analytics.

### Table: usage_metrics

| Field      | Type |
|------------|------|
| id         |      |
| metric_name|      |
| value      |      |
| recorded_at|      |

---

### Table: industry_analytics

| Field          | Type |
|----------------|------|
| id             |      |
| industry_id    |      |
| total_users    |      |
| total_providers|      |
| total_revenue  |      |
| recorded_at    |      |

---

### Table: service_analytics

| Field            | Type |
|------------------|------|
| id               |      |
| service_id       |      |
| orders_count     |      |
| revenue_generated|      |
| recorded_at      |      |

---

## 12. Key Relationships

```
users
   ├── profiles
   ├── wallets
   ├── pss_verifications
   ├── crb_certifications
   └── stl_levels

industries
   ├── categories
   └── services

services
   ├── service_providers
   └── bookings

transactions
   ├── affiliate_commissions
   └── franchise_revenue
```

---

## 13. Database Strategy

**Recommended systems:**

- **PostgreSQL** → main relational database  
- **Redis** → caching  
- **ElasticSearch** → search indexing  
- **Object Storage** → files & documents  

---

## 14. Why This Schema Works

It supports:

- multi-industry platform  
- microservices architecture  
- shared tools  
- global franchise network  
- AI marketplace  
- blockchain integration  

---

## Related

- [EHB_MICROSERVICES_ARCHITECTURE.md](EHB_MICROSERVICES_ARCHITECTURE.md)
- [EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md](EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md)
