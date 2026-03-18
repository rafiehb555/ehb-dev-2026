# Microservices Architecture Quick Reference

> Complete Backend Structure

## Service List

| Service | Purpose |
|---------|---------|
| API Gateway | Entry point, routing |
| Auth Service | Login, JWT, 2FA |
| User Service | Profiles, settings |
| JPS Service | Professional profiles |
| PSS Service | KYC, verification |
| CRB Service | Certifications |
| STL Service | Trust scoring |
| Marketplace | Products, orders |
| Wallet Service | Payments |
| Franchise Service | Operations |
| Notification | Push, email, SMS |
| Search Service | Full-text search |
| Analytics | Metrics, reports |

## API Routing

```
/api/v1/auth/*      → Auth Service
/api/v1/users/*     → User Service
/api/v1/jps/*       → JPS Service
/api/v1/pss/*       → PSS Service
/api/v1/crb/*       → CRB Service
/api/v1/stl/*       → STL Service
/api/v1/marketplace/* → Marketplace
/api/v1/wallet/*    → Wallet Service
```

## Communication

- **Sync:** REST/gRPC for real-time
- **Async:** Kafka/RabbitMQ for events

## Database Strategy

Each service has its own database (PostgreSQL).

## Deployment

Kubernetes cluster with multiple replicas per service.

## Full Details

See: `docs/architecture/backend-microservices-complete.md`
