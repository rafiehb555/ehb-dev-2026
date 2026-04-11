# EHB MICROSERVICES ARCHITECTURE

> Complete Backend Structure

---

# OVERVIEW

Large platforms like **Amazon, Uber, Alibaba** don't use monolithic systems. They use **microservices architecture** where each service is an **independent backend service**.

---

# BACKEND ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                     │
│              (Mobile App / Web App / Admin Portal)                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                  │
│     Authentication │ Rate Limiting │ Routing │ Load Balancing      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ AUTH SERVICE  │       │ USER SERVICE  │       │ WALLET SERVICE│
│               │       │               │       │               │
│ • Login       │       │ • Profiles    │       │ • Balances    │
│ • JWT Tokens  │       │ • Settings    │       │ • Transfers   │
│ • 2FA         │       │ • Preferences │       │ • Payments    │
└───────────────┘       └───────┬───────┘       └───────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        JPS SERVICE                                  │
│           Skills │ Experience │ Education │ Certifications         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  PSS SERVICE  │       │  CRB SERVICE  │       │  STL SERVICE  │
│               │       │               │       │               │
│ • KYC         │       │ • Certs       │       │ • Trust Score │
│ • AML         │       │ • Inspections │       │ • Rankings    │
│ • Verification│       │ • Registry    │       │ • AI Engine   │
└───────────────┘       └───────────────┘       └───────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DMO SERVICE                                  │
│             Central Control │ Registry │ Governance                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  MARKETPLACE  │       │  FRANCHISE    │       │  NOTIFICATION │
│   SERVICE     │       │   SERVICE     │       │   SERVICE     │
│               │       │               │       │               │
│ • Products    │       │ • Franchises  │       │ • Push        │
│ • Services    │       │ • Inspections │       │ • Email       │
│ • Orders      │       │ • Commissions │       │ • SMS         │
└───────────────┘       └───────────────┘       └───────────────┘
```

---

# MAIN MICROSERVICES

| Service | Purpose | Tech Stack |
|---------|---------|------------|
| **API Gateway** | Entry point, routing | Kong / AWS Gateway |
| **Auth Service** | Login, JWT, 2FA | Node.js, Redis |
| **User Service** | Profiles, settings | Node.js, PostgreSQL |
| **JPS Service** | Professional profiles | Node.js, PostgreSQL |
| **PSS Service** | KYC, verification | Python, TensorFlow |
| **CRB Service** | Certifications | Node.js, PostgreSQL |
| **STL Service** | Trust scoring | Python, ML models |
| **Marketplace Service** | Products, orders | Node.js, PostgreSQL |
| **Wallet Service** | Payments, balances | Node.js, PostgreSQL |
| **Franchise Service** | Franchise ops | Node.js, PostgreSQL |
| **Notification Service** | Push, email, SMS | Node.js, Redis |
| **Search Service** | Full-text search | Elasticsearch |
| **Analytics Service** | Metrics, reports | Python, BigQuery |
| **Blockchain Service** | Immutable records | Substrate/Polkadot |

---

# SERVICE DETAILS

## 1. API Gateway

**Purpose:** Single entry point for all clients

**Responsibilities:**
- Authentication (JWT validation)
- Rate limiting
- Request routing
- Load balancing
- SSL termination

**Endpoints:**
```
/api/v1/auth/*      → Auth Service
/api/v1/users/*     → User Service
/api/v1/jps/*       → JPS Service
/api/v1/pss/*       → PSS Service
/api/v1/crb/*       → CRB Service
/api/v1/stl/*       → STL Service
/api/v1/marketplace/* → Marketplace Service
/api/v1/wallet/*    → Wallet Service
```

---

## 2. Auth Service

**Purpose:** Authentication & authorization

**Endpoints:**
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/2fa/enable
POST /auth/2fa/verify
POST /auth/password/reset
```

**Tech:** Node.js, Redis, JWT

---

## 3. User Service

**Purpose:** User management

**Endpoints:**
```
GET    /users/:id
PUT    /users/:id
GET    /users/:id/settings
PUT    /users/:id/settings
DELETE /users/:id
```

**Tech:** Node.js, PostgreSQL

---

## 4. JPS Service

**Purpose:** Professional profiles

**Endpoints:**
```
GET    /jps/profiles/:id
PUT    /jps/profiles/:id
POST   /jps/skills
DELETE /jps/skills/:id
POST   /jps/experience
POST   /jps/education
GET    /jps/search
```

**Tech:** Node.js, PostgreSQL, Elasticsearch

---

## 5. PSS Service

**Purpose:** Identity verification

**Endpoints:**
```
POST /pss/verify/identity
POST /pss/verify/liveness
POST /pss/verify/address
GET  /pss/verification/:id
POST /pss/aml/screen
GET  /pss/risk-score/:userId
```

**Tech:** Python, TensorFlow, OCR

---

## 6. CRB Service

**Purpose:** Certifications

**Endpoints:**
```
POST /crb/applications
GET  /crb/applications/:id
POST /crb/inspections
POST /crb/skill-tests
GET  /crb/certificates/:id
POST /crb/refilling
```

**Tech:** Node.js, PostgreSQL

---

## 7. STL Service

**Purpose:** Trust scoring

**Endpoints:**
```
GET  /stl/scores/:userId
GET  /stl/rankings
POST /stl/calculate
GET  /stl/history/:userId
```

**Tech:** Python, ML models, Redis

---

## 8. Marketplace Service

**Purpose:** Products & services

**Endpoints:**
```
GET    /marketplace/products
POST   /marketplace/products
GET    /marketplace/services
POST   /marketplace/orders
GET    /marketplace/orders/:id
GET    /marketplace/search
```

**Tech:** Node.js, PostgreSQL, Elasticsearch

---

## 9. Wallet Service

**Purpose:** Financial transactions

**Endpoints:**
```
GET  /wallet/balance/:userId
POST /wallet/deposit
POST /wallet/withdraw
POST /wallet/transfer
GET  /wallet/transactions/:userId
```

**Tech:** Node.js, PostgreSQL

---

## 10. Notification Service

**Purpose:** All notifications

**Endpoints:**
```
POST /notifications/send
POST /notifications/push
POST /notifications/email
POST /notifications/sms
GET  /notifications/:userId
```

**Tech:** Node.js, Redis, Firebase

---

# SERVICE COMMUNICATION

## Synchronous (REST/gRPC)

```
Client → API Gateway → Service → Response
```

Used for:
- User requests
- Real-time data
- Critical operations

---

## Asynchronous (Message Queue)

```
Service A → Kafka/RabbitMQ → Service B
```

Used for:
- Event notifications
- Background processing
- Non-critical updates

---

# MESSAGE QUEUE EVENTS

| Event | Producer | Consumers |
|-------|----------|-----------|
| `user.created` | User Service | JPS, Wallet, Notification |
| `verification.complete` | PSS Service | STL, Notification |
| `certification.issued` | CRB Service | STL, Notification |
| `order.placed` | Marketplace | Wallet, Notification |
| `payment.complete` | Wallet | Marketplace, Notification |
| `review.posted` | Marketplace | STL Service |

---

# DATABASE PER SERVICE

Each microservice has its own database:

| Service | Database |
|---------|----------|
| Auth Service | PostgreSQL + Redis |
| User Service | PostgreSQL |
| JPS Service | PostgreSQL |
| PSS Service | PostgreSQL |
| CRB Service | PostgreSQL |
| STL Service | PostgreSQL + Redis |
| Marketplace | PostgreSQL |
| Wallet Service | PostgreSQL |
| Search Service | Elasticsearch |
| Analytics | BigQuery |

---

# DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                      KUBERNETES CLUSTER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ Auth (x3)   │  │ User (x3)   │  │ JPS (x3)    │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ PSS (x3)    │  │ CRB (x3)    │  │ STL (x3)    │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │Market (x5)  │  │Wallet (x5)  │  │Notif (x3)   │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Backend Microservices v1.0 | March 2026*
