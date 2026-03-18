# EHB Microservices Quick Reference

> 11 services for EHB Super App

## Services Overview

| # | Service | Purpose | Tech |
|---|---------|---------|------|
| 1 | API Gateway | Entry point, auth, routing | Kong/Express |
| 2 | Identity | Users, profiles, JPS | NestJS |
| 3 | Verification | PSS, CRB, STL | NestJS |
| 4 | Industry | Industries, services, providers | NestJS |
| 5 | Booking | Appointments, reservations | NestJS |
| 6 | Payment | Wallet, transactions, escrow | NestJS |
| 7 | AI | Search, assistant, analytics | FastAPI |
| 8 | Affiliate | Referrals, commissions | NestJS |
| 9 | Franchise | Franchise network, revenue | NestJS |
| 10 | Blockchain | Immutable records, proofs | NestJS |
| 11 | Notification | Email, SMS, push | NestJS |

## API Endpoints Pattern

```
api.ehb.com/v1/users/*        → Identity
api.ehb.com/v1/verify/*       → Verification
api.ehb.com/v1/services/*     → Industry
api.ehb.com/v1/bookings/*     → Booking
api.ehb.com/v1/payments/*     → Payment
api.ehb.com/v1/ai/*           → AI
api.ehb.com/v1/affiliates/*   → Affiliate
api.ehb.com/v1/franchises/*   → Franchise
api.ehb.com/v1/blockchain/*   → Blockchain
```

## Communication

| Type | Use |
|------|-----|
| REST | Sync requests |
| gRPC | Internal high-perf |
| Kafka/RabbitMQ | Async events |

## Build Order

1. API Gateway + Identity + Verification (Foundation)
2. Industry + Booking + Payment (Core Business)
3. Affiliate + Franchise (Growth)
4. AI + Blockchain + Notification (Advanced)

---

*Full architecture: docs/architecture/microservices-architecture.md*
