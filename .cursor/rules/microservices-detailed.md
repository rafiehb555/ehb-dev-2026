# EHB Microservices Detailed Reference

> Google/Amazon Style Backend

## Service Categories

### Identity Services
- Auth Service (/auth/*)
- User Service (/users/*)
- JPS Service (/jps/*)

### Marketplace Services
- Product Service (/products/*)
- Order Service (/orders/*)
- Payment Service (/payments/*)
- Review Service (/reviews/*)

### Verification Services
- PSS Service (/pss/*)
- CRB Service (/crb/*)
- STL Service (/stl/*)

### Platform Services
- Notification Service
- Search Service
- Recommendation Service

### Industry Services
- GoSellr, WMS, AGTS, OLS, SOT, HPS, HMS, Tube

## Infrastructure

```
Orchestration: Kubernetes
API Gateway:   Kong
Database:      PostgreSQL
Cache:         Redis
Search:        Elasticsearch
Queue:         Kafka
Monitoring:    Prometheus + Grafana
```

## Communication

| Pattern | Use Case |
|---------|----------|
| REST | User-facing requests |
| gRPC | Internal services |
| Kafka | Async events |

## Database Strategy
- Database per service
- SAGA for transactions
- Event Sourcing for audit

---

*Full details: docs/architecture/microservices-google-style.md*
