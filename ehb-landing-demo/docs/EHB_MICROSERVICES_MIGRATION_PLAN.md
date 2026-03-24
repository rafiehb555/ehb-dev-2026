# EHB Microservices Migration Plan (Monolith -> Distributed)

This plan is implementation-focused and designed to keep current delivery speed while extracting services safely.

---

## Stage 0 — Stabilize Contracts (Current Sprint)

Goals:
- Freeze API contracts for Auth/PSS/DMO/STL.
- Freeze event names and payload shape.
- Add correlation ID propagation policy.

Deliverables:
- Service route map.
- Event contract table.
- Error code standard.

Exit criteria:
- Existing frontend works with stable gateway paths.

---

## Stage 1 — Extract PSS Service

Scope:
- Move `PSS cases`, `verify`, `decision`, `refill` logic to independent service runtime.

Integration:
- Gateway proxies `/pss/*` to PSS service.
- PSS publishes `pss.case.verified` and `pss.refill.expired`.

Risk controls:
- Dual-run mode for a short period (shadow requests in staging).
- Event idempotency check per `eventId`.

---

## Stage 2 — Extract DMO Service

Scope:
- Move applications queue, approvals, audit, registry endpoints.

Integration:
- Gateway proxies `/dmo/*` to DMO service.
- DMO consumes PSS/CRB/Franchise events.
- DMO publishes `dmo.application.approved`.

Risk controls:
- Strict status transition guards.
- Backfill script for old audit traces.

---

## Stage 3 — Extract STL Service

Scope:
- Trust computation and logs moved to dedicated service.

Integration:
- STL consumes DMO/PSS/Franchise events.
- STL publishes `stl.score.updated`.

Risk controls:
- Compare old/new STL outputs in staging.
- Threshold alert when deviation crosses tolerance.

---

## Stage 4 — Queue + Cache Hardening

Scope:
- Introduce production queue topology + DLQ.
- Redis cache for hot reads and idempotency windows.

Deliverables:
- Retry policies by event type.
- Dead-letter reprocess command.

---

## Stage 5 — Remaining Service Extraction

Services:
- CRB, Franchise, Industry, AI, Wallet.

Approach:
- One bounded context per release wave.
- Maintain gateway compatibility.

---

## Rollback Strategy

- Feature flags for each extracted domain route.
- Gateway can route back to monolith handlers instantly.
- Event consumers can be paused independently.

---

## Operational Checklist

- Health endpoint for each service (`/health`, `/ready`).
- Centralized metrics:
  - request latency
  - 5xx rate
  - queue lag
  - dead-letter count
- Alerting:
  - DMO approval latency SLA
  - refill expiry processing delay

---

## Ownership Matrix (Initial)

- Auth: Platform team
- PSS + DMO: Governance team
- STL + AI: Intelligence team
- CRB + Franchise: Operations team
- Wallet: Commerce team

