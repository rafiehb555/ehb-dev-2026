# EHB DMO Technical Flow (API + Database + Automation)

This document converts DMO from conceptual flow into an implementation-ready system blueprint.

---

## 1) End-to-End Technical Pipeline

```text
User Action -> API Route -> DB Transaction -> Business Rules -> DMO Queue -> Automation Event -> STL Update -> UI Refresh
```

Core principle:
- Every business action must create a durable DB state.
- Every critical state change must create an audit log.
- Every cross-module side effect should run through automation events.

---

## 2) Canonical DMO Status State Machine

```text
NEW -> IN_REVIEW -> UNDER_INSPECTION -> APPROVED
                              \-------> REJECTED
```

Guard rules:
- Only `ADMIN` and `SUPER_ADMIN` can approve/reject.
- `FRANCHISE` can contribute inspection/report evidence but not final approval.
- Invalid transitions must be blocked at API layer and logged as audit anomalies.

---

## 3) Step-by-Step Technical Flow

### Step 1: User Registration
- API: `POST /api/auth/register`
- DB writes: `User`, `Profile`
- Audit: `USER_CREATED`

### Step 2: PSS Submission
- API: `POST /api/pss/submit` (or existing submit flow equivalent)
- DB writes: `PSSVerification`, `PSSDocument[]`
- Audit: `PSS_CASE_CREATED`

### Step 3: PSS Step Verification
- API: `POST /api/pss/verify`
- DB writes: `PSSStepReview`, `PSSVerification` (step/risk/status)
- Audit: `PSS_STEP_DECIDED`

### Step 4: PSS Final Decision
- API: `POST /api/pss/decision`
- If approved:
  - Create `Application` with `type = PSS_VERIFICATION`, `status = NEW`, `sourceSystem = PSS`
  - Optional registry draft creation
- Audit: `PSS_FINAL_APPROVED` or `PSS_FINAL_REJECTED`

### Step 5: DMO Queue Operations
- APIs:
  - `GET /api/dmo/applications`
  - `PATCH /api/dmo/applications/[id]`
- DB updates:
  - `Application.status`
  - `Application.assignedToId`
  - Queue metadata: risk, SLA, priority
- Audit: `APPLICATION_UPDATED`, `APPLICATION_ASSIGNED`

### Step 6: Final DMO Decision
- API: `POST /api/dmo/approvals`
- DB writes:
  - `Approval`
  - `AuditLog`
- Side effects:
  - enqueue automation event for registry/STL pipeline

### Step 7: Registry
- API: `POST /api/dmo/registry`
- DB writes: `RegistryRecord`
- Audit: `REGISTRY_CREATED`

### Step 8: STL Engine
- API: internal service job or `POST /api/stl/calculate`
- DB writes: `STLScore`, `STLLog`
- Audit: `STL_RECALCULATED`

### Step 9: Refilling
- API: scheduled job + refill routes
- DB writes: `PSSRefill`
- Decisions:
  - completed refill -> trust maintained
  - expired refill -> STL downgrade + visibility penalties

---

## 4) Database Design Mapping (DMO Core)

Primary tables:
- `applications`: queue source of truth
- `approvals`: immutable decision records
- `audit_logs`: timeline + compliance trail
- `registry_records`: verified entity registry
- `stl_scores`, `stl_logs`: trust intelligence
- `pss_verifications`, `pss_documents`, `pss_step_reviews`, `pss_refills`

Queue intelligence fields in `applications`:
- `source_system`, `source_ref_id`
- `priority`
- `risk_score`, `risk_level`
- `stl_impact`
- `sla_due_at`

---

## 5) Automation Engine (Event-Driven)

Automation tables:
- `automation_rules`
- `automation_events`

Suggested events:
- `PSS_APPROVED`
- `DMO_APPROVED`
- `STL_UPDATED`
- `REFILL_EXPIRED`

Suggested actions:
- create DMO queue item
- create registry record
- recalculate STL
- update marketplace visibility
- notify admin/user/franchise

Retry policy:
- `PENDING -> PROCESSING -> DONE`
- On failure: increment attempts and set `next_retry_at`
- Move to `DEAD_LETTER` after retry cap

---

## 6) API Contracts (Minimum Required)

DMO:
- `GET /api/dmo/applications`
- `PATCH /api/dmo/applications/[id]`
- `POST /api/dmo/approvals`
- `POST /api/dmo/registry`

PSS:
- `GET /api/pss/cases`
- `GET /api/pss/cases/[id]`
- `POST /api/pss/verify`
- `POST /api/pss/decision`

Automation/Internal:
- `POST /api/jobs/pss-refill-scan`
- `POST /api/jobs/crb-expiry-scan`

---

## 7) Operational Rules

- Every final decision must write both `Approval` and `AuditLog`.
- UI should never infer final truth from client state; always re-fetch from API after mutation.
- Automation must be idempotent using `correlation_id`.
- SLA coloring should come from `sla_due_at` and current timestamp only.

---

## 8) Implementation Order (Execution)

1. Lock schema + migrations for PSS/DMO/Automation tables.
2. Finalize state-machine validators in DMO APIs.
3. Emit automation events from PSS and DMO final decision endpoints.
4. Add worker job to consume automation events.
5. Add integration tests for full chain: PSS approved -> DMO app -> Approval -> Registry -> STL.

