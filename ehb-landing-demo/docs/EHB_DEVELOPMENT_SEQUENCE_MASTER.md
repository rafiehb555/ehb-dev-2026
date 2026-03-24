# EHB / DMO Development Sequence (Final Master Plan)

This is the official build order for production-safe, scalable development.

---

## Phase 0: Foundation (Done)

- UI structure
- DMO dashboard
- Applications
- Approvals
- Design system

Status: `DONE`

---

## Phase 1: PSS Module (Start First)

Why first:
- Trust lifecycle starts here.
- STL depends on verification outcomes.
- DMO queue quality depends on PSS signal quality.

Build order:
1. PSS cases table
2. Case detail with stepper UI
3. Step verification API
4. Final decision flow
5. DMO integration
6. Refilling system

Expected output:
- Verified users
- DMO applications auto-created from verified cases

---

## Phase 2: CRB Module

Why second:
- Certification is required for complete trust profile.

Build order:
1. Certification application
2. Document upload
3. Inspection assignment
4. Certificate issuance
5. Expiry and refill

Expected output:
- Certified services/products/entities

---

## Phase 3: Franchise System

Why third:
- Adds physical/ground verification.

Build order:
1. Franchise dashboard
2. Task assignment
3. Inspection report submission
4. Escalation flow

Expected output:
- Ground-truth verification signal

---

## Phase 4: STL Engine

Why fourth:
- Reliable scoring needs PSS + CRB + Franchise data.

Build order:
1. STL score logic
2. Score API
3. History and logs
4. UI score display

Expected output:
- Active trust scoring/ranking system

---

## Phase 5: Industry System

Why fifth:
- Advanced, sector-specific trust layer.

Build order:
1. Industry list (32 sectors)
2. Entity-industry mapping
3. Industry verification
4. Industry score weighting

Expected output:
- Multi-industry trust intelligence

---

## Phase 6: AI Engine

Why sixth:
- AI value appears after sufficient data maturity.

Build order:
1. Risk prediction
2. Recommendations
3. Automated decision support

Expected output:
- Smart system assistance across departments

---

## Phase 7: Wallet System

Why now:
- Transaction lifecycle starts once core trust flow is stable.

Build order:
1. Wallet balances
2. Transactions
3. Escrow flows

---

## Phase 8: Global Refilling

Why now:
- Enables full lifecycle governance.

Build order:
1. Refill scheduler
2. Expiry logic
3. STL impact automation

---

## Phase 9: AI Marketplace Layer

Why final:
- Product-level ranking and recommendations require complete trust + behavior data.

Build order:
1. Search
2. Ranking
3. Filters
4. Recommendations

---

## Final System Build Flow

```text
PSS -> CRB -> Franchise -> DMO -> STL -> Industry -> AI -> Wallet -> Refilling -> Marketplace
```

---

## Current Position

```text
DMO Core DONE
Applications DONE
Approvals DONE
NEXT -> PSS
```

Execution status: `PSS phase 1 started`

