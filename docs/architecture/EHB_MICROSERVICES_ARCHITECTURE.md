# EHB Microservices Architecture

EHB is designed as a modular super-app platform using microservices.

Each major platform component runs as an independent service.

**Benefits:**

- scalability
- independent development
- fault isolation
- faster updates

---

## 1. Architecture Overview

```
Frontend (Next.js Super App)
        │
API Gateway
        │
Microservices Layer
        │
Database Cluster
        │
Blockchain Network
```

---

## 2. API Gateway

The API gateway is the **single entry point** for the entire platform.

**Example domain:** `api.ehb.com`

**Responsibilities:**

- authentication
- request routing
- rate limiting
- logging
- security filtering

**Example routes:**

- `/api/users`
- `/api/services`
- `/api/bookings`
- `/api/payments`
- `/api/franchise`
- `/api/ai-tools`

---

## 3. Identity Service

**Service name:** `identity-service`

Handles user identity and authentication.

**Responsibilities:**

- user registration
- login authentication
- profile management
- JPS integration

**Database tables:** `users`, `profiles`, `user_roles`, `sessions`

---

## 4. Verification Service

**Service name:** `verification-service`

Handles all trust systems.

**Systems managed:**

- PSS – identity verification
- CRB – certification verification
- STL – service trust level

**Tables:** `pss_verifications`, `crb_certifications`, `stl_levels`

---

## 5. Industry Service

**Service name:** `industry-service`

**Responsibilities:**

- industry management
- service categories
- service listings
- provider connections

**Tables:** `industries`, `categories`, `services`, `service_providers`

---

## 6. Booking Service

**Service name:** `booking-service`

Handles service bookings across industries.

**Used in industries:** medical appointments, legal consultations, education classes, local services, travel bookings

**Tables:** `bookings`, `booking_status`, `appointments`

---

## 7. Payment Service

**Service name:** `payment-service`

**Modules:**

- wallet system
- transactions
- escrow system
- refund processing

**Tables:** `wallets`, `transactions`, `escrow_transactions`, `payouts`

---

## 8. Affiliate Service

**Service name:** `affiliate-service`

**Responsibilities:**

- referral tracking
- commission calculation
- affiliate payouts

**Tables:** `affiliates`, `referrals`, `affiliate_commissions`

---

## 9. Franchise Service

**Service name:** `franchise-service`

**Responsibilities:**

- country franchise
- corporate franchise
- sub franchise
- revenue distribution

**Tables:** `franchises`, `franchise_revenue`, `franchise_regions`

---

## 10. AI Service

**Service name:** `ai-service`

**Modules:**

- AI Assistant
- AI Agents
- AI Recommendation Engine
- AI Analytics
- AI Automation
- AI Marketplace

**Tables:** `ai_tools`, `ai_usage`, `ai_requests`

---

## 11. Blockchain Service

**Service name:** `blockchain-service`

**Responsibilities:**

- validator network
- smart contract execution
- blockchain transactions
- ledger synchronization

**Tables:** `blockchain_transactions`, `validator_nodes`, `contract_logs`

---

## 12. Notification Service

**Service name:** `notification-service`

**Supports:** email, SMS, push notifications, system alerts

**Tables:** `notifications`, `notification_logs`

---

## 13. Search Service

**Service name:** `search-service`

**Responsibilities:**

- search indexing
- provider search
- service search
- AI recommendations

**Technologies often used:** ElasticSearch, OpenSearch

---

## 14. Analytics Service

**Service name:** `analytics-service`

**Responsibilities:**

- user analytics
- industry analytics
- provider analytics
- AI analytics
- revenue analytics

**Tables:** `usage_metrics`, `service_analytics`, `industry_analytics`

---

## 15. Microservices Communication

Services communicate using: **REST APIs**, **gRPC**, **Event Messaging**

**Event systems often used:** Kafka, RabbitMQ

**Example flow:**

```
User books doctor → Booking Service → Payment Service → Wallet Transaction → Affiliate Commission → Franchise Revenue
```

---

## 16. Service Deployment Model

Each service runs independently.

```
services
├── identity-service
├── verification-service
├── industry-service
├── booking-service
├── payment-service
├── affiliate-service
├── franchise-service
├── ai-service
├── blockchain-service
├── notification-service
├── search-service
└── analytics-service
```

---

## 17. Container Architecture

Production systems usually use: **Docker**, **Kubernetes**

This allows: auto scaling, load balancing, service isolation

---

## 18. Development Strategy

**Phase 1:** Next.js UI, Static Data, Mock APIs

**Phase 2:** Connect API Gateway, Create Microservices, Connect Database

**Phase 3:** Add Blockchain, Add AI systems, Enable Wallet

---

## 19. Why Microservices Are Critical

EHB includes: 32 industries, AI marketplace, blockchain, franchise network, financial systems.

A monolithic system would **collapse under this complexity**. Microservices allow **independent scaling**.

---

## Related

- [EHB_DATABASE_MASTER_SCHEMA.md](EHB_DATABASE_MASTER_SCHEMA.md)
- [EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md](EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md)
- [EHB_SUPER_ADMIN_CONTROL_PANEL.md](EHB_SUPER_ADMIN_CONTROL_PANEL.md)
