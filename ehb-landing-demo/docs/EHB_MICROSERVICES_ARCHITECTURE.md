# EHB Microservices Architecture (Scalable System Blueprint)

This document defines how EHB moves from Next.js monolith APIs to a distributed microservices architecture.

---

## 1) Target High-Level Topology

```text
Frontend (Next.js)
    ->
API Gateway / BFF
    ->
Auth | PSS | CRB | DMO | STL | Franchise | Industry | AI | Wallet
    ->
PostgreSQL + Redis + Queue + Object Storage + Observability
```

Core principles:
- Domain ownership per service (data and logic boundaries).
- API-first + event-driven communication.
- Zero direct tight coupling between business services.
- Backward compatibility during migration.

---

## 2) Service Boundaries

### Auth Service
- Users, sessions, JWT, RBAC.
- Owns auth policies and token lifecycle.

### PSS Service
- KYC cases, step verification, risk, refill schedules.
- Emits verification lifecycle events.

### CRB Service
- Certification applications, inspections, certificates.
- Emits certification status events.

### DMO Service
- Applications queue, approvals, assignments, audit, registry orchestration.
- Consumes PSS/CRB/Franchise events.

### STL Service
- Trust score computation, level, history.
- Emits score updates for ranking and visibility.

### Franchise Service
- Inspection tasks/reports/escalations.
- Emits inspection completion/fraud events.

### Industry Service
- Industry mapping and verification state.

### AI Service
- Risk scoring, recommendations, optimization hints.

### Wallet Service
- Balance/transactions/payouts.

---

## 3) Communication Model

### Sync (request/response)
- Frontend -> API Gateway -> service.
- Service-to-service sync only when strict immediate response is required.

### Async (event-driven)
- Service publishes domain events to queue/topic.
- Consumers update local state and trigger automation rules.

Rule of thumb:
- User-facing read/write path: sync.
- Side effects, fan-out, automations: async.

---

## 4) Event Backbone

Queue options:
- Kafka (high throughput, durable streams) OR RabbitMQ (routing flexibility).

Initial event set:
- `auth.user.registered`
- `pss.case.verified`
- `pss.refill.expired`
- `dmo.application.approved`
- `stl.score.updated`
- `franchise.report.submitted`

Event envelope must include:
- `eventId`, `type`, `source`, `occurredAt`, `correlationId`, `payloadVersion`, `payload`.

---

## 5) Data Ownership

- Each service owns its write model and migrations.
- Cross-service views are built via events/materialized read models.
- Shared DB is transitional only; final goal is per-service schema (or DB).

Transitional path:
1. Monolith DB with schema ownership tags.
2. Logical isolation by service.
3. Physical separation when load/compliance requires.

---

## 6) API Gateway Responsibilities

- Route by domain prefix (`/auth`, `/pss`, `/dmo`, etc.)
- Auth token verification and propagation.
- Rate limiting + request ID injection.
- Basic traffic policies (timeouts/retries/circuit break hints).
- API composition for frontend where needed.

---

## 7) Non-Functional Standards

- **Observability**: OpenTelemetry traces, central logs, metrics per service.
- **Resilience**: retries with backoff, idempotency keys, DLQ for failed events.
- **Security**: mTLS/internal auth (later), strict RBAC, secret manager.
- **Performance**: Redis for hot reads/sessions/short-lived projections.

---

## 8) Deployment Model

- Dockerized services with independent release cycles.
- Kubernetes for orchestration (HPA, rolling deploys, health probes).
- Environment tiers: dev -> staging -> production.

Recommended deployment split:
- Tier 1: API Gateway + Auth + DMO + PSS + STL.
- Tier 2: CRB + Franchise + Industry + Wallet + AI.

---

## 9) Migration Strategy (Phased)

Phase A (Now):
- Keep Next.js app as frontend + API layer.
- Introduce service contracts and event contracts.

Phase B:
- Extract PSS, DMO, STL into independent runtime services.
- Keep gateway facade stable for frontend.

Phase C:
- Introduce queue-backed async workflows and event replay tooling.

Phase D:
- Full service decomposition and scaling policies per domain.

---

## 10) Success Criteria

- Gateway contract stable while internals evolve.
- No direct business coupling across services.
- Critical flows fully event-capable:
  - `PSS verified -> DMO queue -> DMO approval -> STL update -> visibility update`
- End-to-end traceability with correlation IDs.

