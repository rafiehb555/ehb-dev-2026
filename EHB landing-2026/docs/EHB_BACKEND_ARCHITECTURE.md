# EHB Backend Architecture (Node.js)

**Phase 45–60 · Modular / microservice-ready · Replit + Cursor ready**

Yeh layer **React/Next.js frontend** ko **Node.js backend, database, AI, future blockchain** se connect karta hai.

---

## Phase 45 — EHB Backend Overview

Backend **monolith nahi** — **modular service architecture**.

```
EHB Backend
│
├ API Gateway (or single Express/Fastify app)
├ Auth Service
├ User / Profile Service
├ Industry Service
├ Service Marketplace
├ Product Marketplace (GoSellr)
├ Job System (JPS)
├ Franchise System
├ Wallet Service
├ AI Engine
└ Notification Service
```

**Flow:** User Request → API Gateway / Router → Relevant Module (Controller → Service → DB).

---

## Phase 46 — Backend Folder Structure

**Node.js project (recommended):**

```
ehb-backend/
│
├ src/
│  ├ config/
│  │  ├ database.js      # DB connection (Prisma / TypeORM)
│  │  └ env.js           # env vars
│  │
│  ├ modules/
│  │  ├ auth/            # Phase 47
│  │  │  ├ controller.js
│  │  │  ├ service.js
│  │  │  ├ routes.js
│  │  │  └ middleware.js
│  │  ├ users/
│  │  ├ profiles/        # JPS
│  │  ├ industries/      # Phase 48
│  │  ├ services/        # Phase 49 – Service Marketplace
│  │  ├ products/        # Phase 50 – GoSellr
│  │  ├ orders/
│  │  ├ jobs/            # Phase 51 – JPS Jobs
│  │  ├ franchises/      # Phase 52
│  │  ├ wallet/          # Phase 53
│  │  ├ ai/              # Phase 54
│  │  └ notifications/   # Phase 55
│  │
│  ├ middleware/         # auth, rateLimit, validate
│  ├ utils/
│  └ app.js              # Express/Fastify entry
│
├ prisma/                 # or migrations/
│  └ schema.prisma
├ package.json
└ server.js
```

Har **module** apne routes, controller, service, (optional) repo rakhe.

---

## Phase 47 — Authentication System

**Channels:** Email, Phone; future: Wallet.

**Mechanism:**

- **JWT** access token (short-lived) + refresh token (long-lived).
- **Role-based access:** user, provider, seller, franchise_owner, admin.

**Endpoints:**

- `POST /api/auth/register` — body: name, email, phone, password, country, city.
- `POST /api/auth/login` — body: email, password (or phone/OTP).
- `POST /api/auth/refresh` — body: refresh_token.
- `GET /api/auth/me` — current user + profile (JWT required).

**Middleware:** Verify JWT, attach user to request, optional role check.

---

## Phase 48 — Industry Engine

**Responsibility:** 32 industries, industry pages, industry-scoped data.

**APIs:**

- `GET /api/industries` — list all (id, name, slug, icon, description).
- `GET /api/industries/:slug` — one industry.
- `GET /api/industries/:slug/services` — services in that industry.

Frontend: Top bar, `/landing/[industry]`, `/industry/[industry]` in same layout.

---

## Phase 49 — Service Marketplace Engine

**Responsibility:** Service CRUD, search, provider listing, bookings.

**APIs:**

- `POST /api/services` — create (industry_id, name, description, category).
- `GET /api/services` — list (query: industry, location, min_price, max_price).
- `GET /api/services/:id` — detail.
- `GET /api/services/providers` — providers for a service (or by service_id).
- `POST /api/provider-services` — user adds offer (user_id, service_id, price, location, etc.).

---

## Phase 50 — Product Marketplace (GoSellr)

**Responsibility:** Products, cart, orders, seller dashboard.

**APIs:**

- `POST /api/products` — create product.
- `GET /api/products` — list (category, seller_id, trending).
- `GET /api/products/trending` — trending.
- `GET /api/products/:id` — detail.
- `POST /api/orders` — create order (buyer_id, product_id, quantity).
- `GET /api/orders` — list for user (buyer/seller).
- `PATCH /api/orders/:id` — update status.

---

## Phase 51 — Job System (JPS)

**Responsibility:** Jobs, applications, company profiles.

**APIs:**

- `POST /api/jobs` — create job (company_id, title, industry_id, salary, location, type).
- `GET /api/jobs` — list (industry, location, type).
- `GET /api/jobs/:id` — detail.
- `POST /api/jobs/:id/apply` — apply (user_id, job_id).
- `GET /api/jobs/:id/applications` — list applications (company only).

---

## Phase 52 — Franchise Engine

**APIs:**

- `GET /api/franchise/opportunities` — list cities/opportunities.
- `POST /api/franchise/apply` — apply (user_id, city, investment, etc.).
- `GET /api/franchise/dashboard` — for franchise owner (city analytics, orders, revenue, commission).
- `GET /api/franchise/:id/analytics` — revenue reports, provider count.

---

## Phase 53 — Wallet System

**APIs:**

- `GET /api/wallet` — balance, affiliate_income, service_income, product_income, franchise_income.
- `POST /api/wallet/deposit` — (future: payment gateway).
- `POST /api/wallet/withdraw` — withdraw request.
- `GET /api/wallet/transactions` — list (type, limit, offset).

---

## Phase 54 — AI Engine

**Responsibility:** Insights, recommendations (demand, location, skills).

**APIs:**

- `GET /api/ai/insights` — list (industry_id, location optional).
- `GET /api/ai/recommendations` — for user (location, profile skills, industry).

**Example response:** "Delivery demand increased 24% in Rawalpindi. Activate delivery service."

**Implementation:** Rule-based first; later OpenAI / TensorFlow / demand pipeline.

**Full AI system (Phase 76–85):** See `EHB_AI_SYSTEM_ARCHITECTURE.md` — Recommendation, Demand Prediction, Affiliate Coach, Smart Search, Fraud Detection, Business Analytics, Location Intelligence, Automation, Data Pipeline.

---

## Phase 55 — Notification System

**Channels:** In-app, email, push (future).

**Events:** order update, job alert, AI suggestion, earnings update.

**APIs:**

- `GET /api/notifications` — list for user.
- `PATCH /api/notifications/:id/read` — mark read.

**Backend:** Queue (Bull/Redis) for sending email/push without blocking request.

---

## Phase 56 — Blockchain Integration Layer (Future)

**Reserve for:**

- EHB Token (rewards, payments).
- Validator rewards.
- Wallet-linked payments.

**Placeholder:** Wallet table me `wallet_address`; later connect Moonbeam/BSC.

**Full blueprint:** See `EHB_BLOCKCHAIN_ARCHITECTURE.md` — EHB token, validator model, loyalty rewards, on-chain payments, Moonbeam + BSC, hybrid Web2+Web3.

---

## Phase 57 — Performance & Scaling

- **Load balancer** in front of Node app(s).
- **CDN** for static + images.
- **Redis** cache: sessions, hot data (industries, trending).
- **Queue** (Kafka, Bull, SQS): orders, notifications, AI jobs.

---

## Phase 58 — AI + Data Pipeline

**Data sources:** User data, market trends, orders, services.

**Use:** Service demand, industry growth, earning opportunities.

**Implementation:** Batch jobs to compute `ai_insights`; API sirf read kare.

---

## Phase 59 — Deployment Architecture

| Component | Tech |
|-----------|------|
| Frontend | Next.js (Replit / Vercel) |
| Backend | Node.js API (Replit / Railway / Render) |
| Database | PostgreSQL (Supabase / Neon / Railway) |
| Storage | Cloud Storage (S3 / R2) for images |
| AI | OpenAI / custom APIs |

---

## Phase 60 — Global Infrastructure (Future)

- Region-specific servers (Asia, Europe, USA).
- Country/city franchises + data locality.
- Same API contract; deploy per region if needed.

---

*Rafi bhai — Replit me `ehb-backend` folder bana kar isi structure se modules add kar sakte ho. Next: `EHB_DEVELOPMENT_ROADMAP.md` + Prisma schema.*
