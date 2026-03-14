# EHB SUPER APP MICROSERVICES ARCHITECTURE

> Enterprise-level microservices design for EHB Platform

## Architecture Overview

```
EHB SUPER APP
│
├── API Gateway
│
├── Identity Service
├── Verification Service
├── Industry Service
├── Booking Service
├── Payment Service
├── AI Service
├── Affiliate Service
├── Franchise Service
├── Blockchain Service
└── Notification Service
```

---

# HIGH LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                     │
│         Web App │ Mobile Web │ Admin Dashboard          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY                          │
│      Authentication │ Rate Limiting │ Routing           │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                   MICROSERVICES                         │
│  Identity │ Verification │ Industry │ Booking │ Payment │
│  AI │ Affiliate │ Franchise │ Blockchain │ Notification │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│      PostgreSQL │ Redis Cache │ Message Queue           │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               BLOCKCHAIN NETWORK                        │
│                  Polkadot Ecosystem                     │
└─────────────────────────────────────────────────────────┘
```

---

# SERVICE 1: API GATEWAY

> Entry point for all requests

## Responsibilities
- Authentication & Authorization
- Rate limiting
- Request routing
- Logging & monitoring
- Load balancing

## Endpoints Pattern
```
api.ehb.com/v1/users/*        → Identity Service
api.ehb.com/v1/verify/*       → Verification Service
api.ehb.com/v1/services/*     → Industry Service
api.ehb.com/v1/bookings/*     → Booking Service
api.ehb.com/v1/payments/*     → Payment Service
api.ehb.com/v1/ai/*           → AI Service
api.ehb.com/v1/affiliates/*   → Affiliate Service
api.ehb.com/v1/franchises/*   → Franchise Service
api.ehb.com/v1/blockchain/*   → Blockchain Service
```

---

# SERVICE 2: IDENTITY SERVICE

> User management & authentication

## Manages
- Users registration/login
- Profiles (JPS)
- Skills management
- Session management
- JWT tokens

## Key Endpoints
```
POST   /users/register
POST   /users/login
GET    /users/profile
PUT    /users/profile
GET    /users/skills
POST   /users/skills
```

## Database Tables
- users
- profiles
- skills
- user_skills

---

# SERVICE 3: VERIFICATION SERVICE

> PSS, CRB, STL management

## Manages
- PSS identity verification
- CRB certifications
- STL trust levels
- Document verification

## Key Endpoints
```
POST   /verify/pss/submit
GET    /verify/pss/status
POST   /verify/crb/submit
GET    /verify/crb/certificates
GET    /verify/stl/level
PUT    /verify/stl/upgrade
```

## Database Tables
- pss_verifications
- crb_certifications
- stl_levels

---

# SERVICE 4: INDUSTRY SERVICE

> Industries, categories, services management

## Manages
- Industries (9 platforms)
- Categories
- Services (700+)
- Service providers

## Key Endpoints
```
GET    /services/industries
GET    /services/categories/:industryId
GET    /services/list/:categoryId
GET    /services/providers/:serviceId
POST   /services/providers/register
```

## Database Tables
- industries
- categories
- services
- service_providers

---

# SERVICE 5: BOOKING SERVICE

> Appointment & booking management

## Used By
- WMS (Medical appointments)
- OLS (Legal consultations)
- HPS (Tutoring sessions)
- AGTS (Travel bookings)
- Local services

## Key Endpoints
```
POST   /bookings/create
GET    /bookings/my-bookings
GET    /bookings/:id
PUT    /bookings/:id/status
DELETE /bookings/:id/cancel
```

## Database Tables
- bookings

## Flow
```
Customer creates booking
        ↓
Provider receives notification
        ↓
Provider confirms
        ↓
Payment processed
        ↓
Service delivered
        ↓
Booking completed
```

---

# SERVICE 6: PAYMENT SERVICE

> Financial operations

## Manages
- EHB Wallet
- Transactions
- Escrow
- Affiliate payouts
- Franchise revenue

## Key Endpoints
```
GET    /payments/wallet/balance
POST   /payments/wallet/topup
POST   /payments/transfer
GET    /payments/transactions
POST   /payments/escrow/create
POST   /payments/escrow/release
```

## Database Tables
- wallets
- transactions
- escrow_transactions

## Payment Flow
```
Customer pays
    ↓
Amount held in escrow
    ↓
Service completed
    ↓
Escrow released to provider
    ↓
Commissions distributed (affiliate + franchise)
```

---

# SERVICE 7: AI SERVICE

> AI-powered features

## Modules
- AI Assistant (chatbot)
- AI Search (service discovery)
- AI Analytics (insights)
- AI Automation (workflows)

## Key Endpoints
```
POST   /ai/search
POST   /ai/assistant/chat
GET    /ai/recommendations
POST   /ai/analyze
GET    /ai/tools
POST   /ai/tools/:id/use
```

## Database Tables
- ai_tools
- ai_usage

## Integrations
- OpenAI APIs
- OCR for document verification
- Fraud detection models

---

# SERVICE 8: AFFILIATE SERVICE

> Referral & commission system

## Manages
- Referral codes
- Commission tracking
- Payout processing

## Key Endpoints
```
POST   /affiliates/register
GET    /affiliates/code
GET    /affiliates/commissions
GET    /affiliates/earnings
POST   /affiliates/payout
```

## Database Tables
- affiliates
- affiliate_commissions

## Commission Flow
```
User signs up with referral code
        ↓
User makes purchase/booking
        ↓
Commission calculated
        ↓
Commission credited to affiliate
        ↓
Payout processed
```

---

# SERVICE 9: FRANCHISE SERVICE

> Franchise network management

## Manages
- Country franchises
- Corporate franchises
- Sub franchises
- Revenue distribution

## Key Endpoints
```
GET    /franchises/list
GET    /franchises/:id
POST   /franchises/apply
GET    /franchises/revenue
GET    /franchises/sub-franchises
```

## Database Tables
- franchises
- franchise_revenue

## Hierarchy
```
Country Franchise
    └── Corporate Franchise
            └── Sub Franchise
```

---

# SERVICE 10: BLOCKCHAIN SERVICE

> Immutable records & proof

## Manages
- Transaction logging
- Verification proofs
- Smart contracts
- Audit trails

## Key Endpoints
```
POST   /blockchain/record
GET    /blockchain/verify/:hash
GET    /blockchain/history/:recordId
```

## Database Tables
- blockchain_transactions
- blockchain_proofs

## What Gets Recorded
- PSS verifications
- CRB certifications
- High-value transactions
- Important documents

---

# SERVICE 11: NOTIFICATION SERVICE

> Communication management

## Channels
- Email
- SMS
- Push notifications
- In-app notifications

## Key Endpoints
```
POST   /notifications/send
GET    /notifications/list
PUT    /notifications/:id/read
POST   /notifications/preferences
```

## Triggers
- Booking created/confirmed/completed
- Payment received/sent
- Verification status change
- New messages

---

# SERVICE COMMUNICATION

## Protocols
| Type | Use Case |
|------|----------|
| REST APIs | Synchronous requests |
| gRPC | High-performance internal calls |
| Event Queue | Async operations |

## Message Queue (Kafka/RabbitMQ)

```
Booking Service ──publish──→ [booking.created]
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            Payment Service  Notification    AI Service
            (process payment) (send alert)  (analytics)
```

---

# EXAMPLE FLOW: Doctor Booking

```
1. User searches "cardiologist"
        ↓
   AI Service (search)
        ↓
2. User selects doctor
        ↓
   Industry Service (provider details)
        ↓
3. User creates booking
        ↓
   Booking Service
        ↓
4. User pays
        ↓
   Payment Service (escrow)
        ↓
5. Doctor confirms
        ↓
   Notification Service
        ↓
6. Service delivered
        ↓
7. Escrow released
        ↓
   Payment Service
        ↓
8. Commissions distributed
        ↓
   Affiliate Service + Franchise Service
        ↓
9. Record on blockchain
        ↓
   Blockchain Service
```

---

# TECHNOLOGY STACK PER SERVICE

| Service | Framework | Database |
|---------|-----------|----------|
| API Gateway | Kong / Express | Redis |
| Identity | NestJS | PostgreSQL |
| Verification | NestJS | PostgreSQL |
| Industry | NestJS | PostgreSQL |
| Booking | NestJS | PostgreSQL |
| Payment | NestJS | PostgreSQL |
| AI | Python/FastAPI | PostgreSQL |
| Affiliate | NestJS | PostgreSQL |
| Franchise | NestJS | PostgreSQL |
| Blockchain | NestJS | PostgreSQL + Chain |
| Notification | NestJS | Redis + PostgreSQL |

---

# DEPLOYMENT STRATEGY

```
┌─────────────────────────────────────┐
│          KUBERNETES CLUSTER         │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ Pod │ │ Pod │ │ Pod │ │ Pod │   │
│  │ ID  │ │ Ver │ │ Ind │ │ Book│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ Pay │ │ AI  │ │ Aff │ │ Fran│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│         LOAD BALANCER               │
└─────────────────────────────────────┘
```

---

# STRATEGIC BUILD ORDER

## Phase 1: Foundation
1. API Gateway
2. Identity Service
3. Verification Service

## Phase 2: Core Business
4. Industry Service
5. Booking Service
6. Payment Service

## Phase 3: Growth Features
7. Affiliate Service
8. Franchise Service

## Phase 4: Advanced
9. AI Service
10. Blockchain Service
11. Notification Service

---

*Architecture Version: 1.0 | March 2026*
