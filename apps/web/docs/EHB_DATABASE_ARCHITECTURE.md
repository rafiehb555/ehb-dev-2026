# EHB Global Database Architecture

**Phase 31–44 · Node.js + React + future blockchain scaling**

Yeh **modular database structure** decide karta hai ke platform kaise scale karega (32 industries, 700+ services, millions of users).

---

## Phase 31 — EHB Core Database Overview

```
EHB CORE DATABASE
│
├ Users
├ Profiles (JPS)
├ Industries
├ Services
├ Providers / ProviderServices
├ Products
├ Orders
├ Jobs / JobApplications
├ Franchise
├ Wallet / Transactions
├ AI Data
```

---

## Phase 32 — Users System

**Table:** `users`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| name | varchar(255) | |
| email | varchar(255) UNIQUE | |
| phone | varchar(50) | |
| password_hash | varchar(255) | Never store plain password |
| country | varchar(100) | |
| city | varchar(100) | |
| role | enum | user, provider, seller, franchise_owner, admin |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** email, phone, role, created_at.

---

## Phase 33 — Profile System (JPS Core)

**Table:** `profiles`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| user_id | FK → users.id | UNIQUE, 1:1 |
| username | varchar(100) UNIQUE | For /profile/[username] |
| profile_photo | varchar(500) | URL |
| frame | varchar(100) | Profile frame/badge style |
| stl_level | varchar(50) | Basic, Intermediate, Advanced, Expert |
| verification_status | enum | pending, verified, rejected |
| skills | jsonb / text[] | Array of skills |
| rating | decimal(3,2) | 0–5 |
| bio | text | |
| headline | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example row:** Name: Rafi, STL Level: Basic, Skills: Web Development, Rating: 4.8.

**Indexes:** user_id, username, verification_status, rating.

---

## Phase 34 — Industries Table

**Table:** `industries`

| Field | Type | Notes |
|-------|------|--------|
| id | bigint PK | |
| name | varchar(255) | |
| slug | varchar(100) UNIQUE | e.g. health, education, it |
| icon | varchar(500) | URL or icon key |
| description | text | |
| sort_order | int | For top bar order |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** 1 Education, 2 Health, 3 IT, 4 Law.  
**Seed:** 32 rows from `lib/industries.ts` (or config).

**Indexes:** slug.

---

## Phase 35 — Services Table

**Table:** `services`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| industry_id | FK → industries.id | |
| name | varchar(255) | e.g. Web Development, Doctor Consultation |
| slug | varchar(100) | |
| description | text | |
| category | varchar(100) | Optional sub-category |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** Web Development, Graphic Design, Doctor Consultation, Delivery Rider.

**Indexes:** industry_id, slug, is_active.

---

## Phase 36 — Providers Table (User ↔ Service)

Users jo **service offer** karte hain.

**Table:** `provider_services` (or `providers`)

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| user_id | FK → users.id | |
| service_id | FK → services.id | |
| profile_id | FK → profiles.id | Optional, for JPS |
| price | decimal(12,2) | e.g. 200 |
| price_unit | varchar(20) | per hour, per project, fixed |
| location | varchar(255) | City / area |
| location_lat | decimal | Optional geo |
| location_lng | decimal | Optional geo |
| availability | varchar(50) | available, busy, away |
| verification_status | enum | pending, verified |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** Provider: Rafi, Service: Web Development, Price: $200, City: Rawalpindi.

**Unique:** (user_id, service_id) or allow multiple listings per user with different details.  
**Indexes:** user_id, service_id, location, verification_status, is_active.

---

## Phase 37 — Products Table (GoSellr)

**Table:** `products`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| seller_id | FK → users.id | |
| industry_id | FK → industries.id | Optional |
| name | varchar(255) | |
| slug | varchar(100) | |
| description | text | |
| category | varchar(100) | Electronics, Fashion, etc. |
| price | decimal(12,2) | |
| stock | int | |
| image_url | varchar(500) | or multiple in product_images |
| rating | decimal(3,2) | Computed or stored |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** Product: Laptop, Price: $800, Seller: Tech Store.

**Indexes:** seller_id, industry_id, category, is_active.

---

## Phase 38 — Orders Table

**Table:** `orders`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| buyer_id | FK → users.id | |
| seller_id | FK → users.id | |
| product_id | FK → products.id | |
| quantity | int | default 1 |
| price | decimal(12,2) | Snapshot at order time |
| status | enum | pending, paid, shipped, delivered, cancelled |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** Buyer: Ali, Product: Laptop, Price: $800, Status: Delivered.

**Indexes:** buyer_id, seller_id, product_id, status, created_at.

---

## Phase 39 — Jobs Table (JPS)

**Table:** `jobs`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| company_id | FK → users.id or companies.id | |
| title | varchar(255) | |
| industry_id | FK → industries.id | |
| description | text | |
| salary_min | decimal(12,2) | Optional |
| salary_max | decimal(12,2) | Optional |
| salary_display | varchar(100) | e.g. "$1200" or "Negotiable" |
| location | varchar(255) | |
| job_type | enum | full_time, part_time, freelance, remote |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** Company: Software House, Job: Web Developer, Salary: $1200, Location: Islamabad.

**Table:** `job_applications`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| job_id | FK → jobs.id | |
| user_id | FK → users.id | |
| status | enum | applied, shortlisted, rejected, hired |
| created_at | timestamp | |

**Indexes (jobs):** company_id, industry_id, location, job_type, is_active.

---

## Phase 40 — Franchise System

**Table:** `franchises`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| city | varchar(100) | |
| state | varchar(100) | Optional |
| country | varchar(100) | |
| owner_id | FK → users.id | |
| investment | decimal(12,2) | |
| commission_rate | decimal(5,2) | e.g. 10.00 |
| status | enum | active, suspended | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Example:** City: Islamabad, Owner: Rafi, Commission: 10%.

**Table:** `franchise_analytics` (or aggregate in app)

| Field | Type | Notes |
|-------|------|--------|
| franchise_id | FK → franchises.id | |
| date | date | |
| orders_count | int | |
| revenue | decimal(12,2) | |
| commission | decimal(12,2) | |
| providers_count | int | |

**Indexes:** country, city, owner_id, status.

---

## Phase 41 — Wallet System

**Table:** `wallets`

| Field | Type | Notes |
|-------|------|--------|
| user_id | FK → users.id PK | 1:1 |
| balance | decimal(14,2) | EHBGC or fiat |
| affiliate_income | decimal(14,2) | |
| service_income | decimal(14,2) | |
| product_income | decimal(14,2) | |
| franchise_income | decimal(14,2) | |
| updated_at | timestamp | |

**Table:** `transactions`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| user_id | FK → users.id | |
| amount | decimal(14,2) | + credit, - debit |
| type | enum | deposit, withdraw, order, earning, affiliate, franchise | |
| status | enum | pending, completed, failed | |
| reference_id | varchar(100) | order_id, job_id, etc. |
| created_at | timestamp | |

**Indexes (transactions):** user_id, type, status, created_at.

---

## Phase 42 — AI Data System

**Table:** `ai_insights`

| Field | Type | Notes |
|-------|------|--------|
| id | UUID / bigint PK | |
| industry_id | FK → industries.id | |
| location | varchar(255) | City / region |
| service_id | FK → services.id | Optional |
| service_demand | varchar(50) | high, medium, low |
| trend_score | decimal(5,2) | 0–100 |
| insight_text | text | e.g. "Delivery demand increased 24%" |
| date | date | |
| created_at | timestamp | |

**Example:** Industry: Delivery, Location: Rawalpindi, Demand: High.

**Indexes:** industry_id, location, date.

---

## Phase 43 — API Architecture (Node.js)

Backend APIs (high-level):

| Area | Methods | Example |
|------|--------|--------|
| Users | GET, POST, PATCH | /api/users, /api/users/:id |
| Auth | POST | /api/auth/login, /api/auth/register, /api/auth/refresh |
| Industries | GET | /api/industries, /api/industries/:slug |
| Services | GET, POST | /api/services, /api/industries/:slug/services |
| Providers | GET, POST | /api/providers, /api/providers/:id |
| Products | GET, POST | /api/products, /api/products/trending |
| Orders | GET, POST | /api/orders, /api/orders/:id |
| Jobs | GET, POST | /api/jobs, /api/job-apply |
| Franchise | GET, POST | /api/franchise/opportunities, /api/franchise/dashboard |
| Wallet | GET, POST | /api/wallet, /api/wallet/withdraw, /api/wallet/transactions |
| AI | GET | /api/ai/insights, /api/ai/recommendations |

---

## Phase 44 — Performance & Scaling

| Concern | Approach |
|---------|----------|
| Cache | Redis for sessions, hot reads (industries, trending products) |
| CDN | Static assets, images |
| DB | Indexes on FKs, slug, status, created_at; read replicas later |
| Queue | Job queue (Kafka, Bull, SQS) for orders, notifications, AI jobs |
| Storage | Cloud storage (S3/R2) for images, documents |

---

*Rafi bhai — Replit + Node.js backend me isi structure ke hisaab se Prisma/TypeORM schema bana sakte ho. Next: `EHB_BACKEND_ARCHITECTURE.md`.*
