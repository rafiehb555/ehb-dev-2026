# STL — Service Trust Level

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_stl.md` (Batch-2, 2026-04-11)
**Related:** `DMO.md §22` (Batch-1) · `DMO.md §24` (contradictions) · `EHB-MASTER-INFO.md §4.3`
**Code:** `services/api/stl-replit/services/stlService.js` (legacy L0-L8, protected by 58 gold-master tests)

---

## 1. Purpose

STL is the **core ranking + trust score** that controls a user's, seller's, product's, or franchise's **visibility, earnings, access, and fee tier** across the entire EHB ecosystem. Every entity in EHB has an STL. The system is designed to be **fraud-resistant, dynamic, and auditable**.

## 2. Canonical 10-level ladder (Batch-2 confirmed)

| Level | Name      | Score band | Role in ecosystem                              |
|-------|-----------|-----------:|------------------------------------------------|
| L1    | FREE      |       0–20 | Entry — no verification, heavy restrictions    |
| L2    | BASIC     |      21–40 | Phone/email verified, basic listing            |
| L3    | NORMAL    |      41–60 | KYC verified, standard marketplace access      |
| L4    | STANDARD  |      61–75 | CRB basic + activity streak                    |
| L5    | ADVANCED  |      76–85 | CRB advanced, regular refills                  |
| L6    | HIGH      |      86–92 | CRB professional, low complaints               |
| L7    | PRO       |      93–96 | Verified professional, priority ranking        |
| L8    | VIP       |      97–98 | Top-tier earnings, lower fees                  |
| L9    | ELITE     |         99 | By DMO invitation / performance               |
| L10   | SUPREME   |        100 | Manual DMO approval + full coin lock + 0 complaints |

> ⚠️ **Code migration pending** — production code + 58 gold-master tests currently use legacy **L0 → L8 SUPREME (9 levels)**. Migration plan: feature flag `STL_V2_ENABLED`, legacy→new mapping in `DMO.md §23.3 S1`. **Do not rewrite `stlService.js` until user sign-off and test gold-masters are regenerated.**

## 3. Composite score inputs

`STL_SCORE = w_pss · PSS_trust + w_crb · CRB_verify + w_dmo · DMO_activity + w_lock · lock_factor − w_complaint · complaint_penalty`

Weights (w_*) are **not yet defined numerically** — placeholder 25/25/25/25 minus complaint penalty. Awaiting user input (see `DMO.md §25.2`).

Inputs:

1. **PSS** — identity trust (0–100)
2. **CRB** — verification + exams + refill adherence (0–100)
3. **DMO** — activity + behaviour signals (0–100)
4. **Wallet** — locked EHBGC vs level minimum (boolean + overflow bonus)
5. **Complaints** — weighted count over rolling window (negative)

## 4. Master anti-fraud rule (MIN chain)

```
FINAL_EHB_STL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)
```

If **any** layer is FREE → the whole chain is FREE. This cannot be bypassed by upgrading the product alone. Surface API: `POST /api/stl/validate-product` returning `{ finalStl, blockingLayer }` so UI can display which layer is dragging the chain down (see `DMO.md §22.2`, suggestion S3 "STL badge bleed").

## 5. Upgrade conditions

A user may upgrade to level N+1 only if **all five** hold:

1. PSS trust stable above floor for N+1
2. CRB requirements met (verifications + exam pass + refill adherence)
3. DMO activity score above floor for N+1
4. Wallet locked EHBGC ≥ minimum for N+1 (see `Wallet.md §3`)
5. Complaints ≤ cap for N+1

## 6. Downgrade conditions

Any one of these triggers a downgrade candidate (DMO confirms):

- Complaints breach level cap
- Locked coins fall below required minimum
- Activity drops below floor for rolling window
- Missed/expired refill
- Up-Guard fraud flag (see `DMO.md §22.7`)

## 7. Effects by level

- **Higher STL** → better search ranking, lower platform fees, higher earning cap, faster payout, verified badge
- **Lower STL** → reduced visibility, capped daily earnings, fewer categories, manual review on big orders

## 8. Recalculation model

- **Event-driven:** order complete, complaint filed, refill submitted, coin lock change, exam pass
- **Periodic:** nightly sweep for decay, streak bonuses, complaint window rollover

## 9. Security invariants

- No manual STL edits from admin UI — everything is derived from events
- Every STL delta is logged (audit trail) and optionally on-chain (see `Blockchain.md §3`)
- The STL formula is **protected by 58 gold-master regression tests** — any change that breaks even one test must be rolled back

## 10. Open questions for next batch

1. **Weight numbers** (w_pss, w_crb, w_dmo, w_lock, w_complaint) — what are the production values?
2. **Decay rate** — if a user is idle, how fast does STL drop?
3. **Complaint window** — 30, 60, 90 days?
4. **Score bands for entities other than users** — do products use the same 0–100 bands?
5. **L10 SUPREME approval** — who exactly approves? (DMO council? founder?)

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_stl.md` with Batch-1 master MIN rule + migration flag |
