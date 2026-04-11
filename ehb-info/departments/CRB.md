# CRB — Certification & Refill Board

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_crb.md` (Batch-2, 2026-04-11)
**Related:** `STL.md §3` (input) · `DMO.md §22.12` (Batch-1 CRB prompt) · `EHB-MASTER-INFO.md §4.2`

> ⚠️ **Naming contradiction inside Batch-2** — `uploads/ehb_crb.md` says **"Certification & Refill Board"** but `uploads/EHB_Industry_System.md` calls it **"Certification & Regulatory Board"**. Legacy docs said **"Certification & Registry Board"**. This file treats **"Certification & Refill Board"** as canonical (since refills are the system's core recurring job) but flags all three for user resolution (`DMO.md §24 row 5`, `DMO.md §25.1`).

---

## 1. Purpose

CRB is the **verification + activity validation engine**. It proves *what* someone can do (skills, services, product legitimacy), validates the physical reality of listings, and enforces **ongoing activity via refills**. Where PSS answers "are you who you say you are", CRB answers "are you still delivering what you promised".

## 2. Four components

1. **Verification** — digital (document upload + AI validation) + physical (franchise on-site visit)
2. **Exams** — theory + practical tests per industry category
3. **Refill system** — periodic renewal cycles that a seller must satisfy to keep their level
4. **Multimedia proofs** — video demos, photo evidence, signed documents

## 3. Verification levels

| Level         | Requirements                                               |
|---------------|------------------------------------------------------------|
| Basic         | Document upload + digital cross-check                      |
| Advanced      | Basic + video proof + category exam                        |
| Professional  | Advanced + physical verification by franchise + practical exam |

## 4. Exam system

- Category-based (one exam set per industry × specialisation)
- Theory portion (MCQ) + practical portion (task submission, reviewed manually or by AI)
- Pass threshold per category (default 70%, industry-configurable)
- Reattempt rules: fail → 7-day cooldown for retake; repeated fails escalate cooldown

## 5. Refill system (core recurring)

**Purpose:** ensure a user doesn't go stale after passing an exam and then never lifting a finger. Refill = periodic activity + proof submission that "yes, I'm still active in this category".

**Level-wise cadence** (merged from Batch-1 `DMO.md §22.1` + Batch-2 ehb_crb.md):

| STL level | Refills per window | Missing refill → |
|-----------|-------------------:|------------------|
| L1 FREE   | 0                  | —                |
| L2 BASIC  | 1                  | upgrade block    |
| L3 NORMAL | 2                  | downgrade risk   |
| L4 STANDARD | 3                | downgrade risk   |
| L5 ADVANCED | 4                | downgrade        |
| L6 HIGH   | 5                  | downgrade        |
| L7 PRO    | 6                  | downgrade        |
| L8 VIP    | 7                  | downgrade        |
| L9 ELITE  | 8                  | downgrade        |
| L10 SUPREME | 10+              | downgrade + DMO review |

**Window length:** not yet specified by user (likely quarterly, awaiting confirmation — `DMO.md §25`).

## 6. Multimedia proof

- Video demos (e.g. a plumber showing a live repair)
- Photo evidence (product in packaging, workshop, storefront)
- Signed documents (diplomas, licenses, franchise letterheads)
- **Validation path:** AI pre-screen (fake detection, duplicate check, metadata tampering) → human reviewer (franchise/DMO) if flagged

## 7. Validation logic

- Authenticity checks — metadata consistency, duplicate detection, reverse image search
- Consistency with profile/category — does the uploaded proof match what they claim to do?
- **Cross-checks with PSS and DMO signals** — if PSS says risk is high, CRB reviewer is flagged to double-check

## 8. Failure conditions

1. Failed exam (after cooldown + max retries)
2. Rejected verification (document forgery, bad proof, inconsistency)
3. Missed refill (past window deadline)
4. Multimedia fraud flag confirmed

All three feed directly into STL as a downgrade signal or block upgrade.

## 9. STL impact

- More verified categories + on-time refills → higher STL growth rate
- Missing refill or failed verification → **blocks STL upgrade**, puts user on downgrade queue

## 10. Security & accountability

- Secure storage of proofs (encrypted, country-scoped)
- Anti-tamper logs (every reviewer decision is signed + auditable)
- **Reviewer accountability** — every approve/reject is attributed to a named officer with a weekly QA audit

## 11. Open questions for next batch

1. **Refill window length** — monthly, quarterly, yearly per level?
2. **Which categories require physical verification** vs digital-only?
3. **Exam library** — does EHB build its own or integrate with 3rd-party (e.g. Coursera, industry boards)?
4. **Franchise reviewer capacity** — how many reviews per franchise per day before SLA starts to slip?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_crb.md`; naming contradiction flagged (Refill vs Regulatory vs Registry) |
