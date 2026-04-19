# CRB — Central Record Blockchain

**Status:** Canonical spec (v2.0) · Renamed 2026-04-19 per founder confirmation
**Related:** `STL.md §3` (input) · `DMO.md §22.12` (Batch-1 CRB prompt) · `EHB-MASTER-INFO.md §4.2`

---

## 1. Purpose

CRB is the **verification + activity validation engine**. It proves *what* someone can do (skills, services, product legitimacy), validates the physical reality of listings, and enforces **ongoing activity via refills**. Where PSS answers "are you who you say you are", CRB answers "are you still delivering what you promised".

## 2. Four components

1. **Verification** — digital (document upload + AI validation) + physical (franchise on-site visit)
2. **Exams** — theory + practical tests per industry category
3. **Refill system** — periodic renewal cycles that a seller must satisfy to keep their level
4. **Multimedia proofs** — video demos, photo evidence, signed documents

## 3. Verification levels (10-level ladder, PSS v3.0 aligned)

| Level | Name | Requirements | STL Points | Refills per Window |
|---|---|---|---|---|
| L1 | Basic Docs | Document upload + digital cross-check | 4 | 1 |
| L2 | Compliance Verified | Basic + compliance fields validated | 8 | 1 |
| L3 | Financially Verified | Financial records + business registration | 12 | 2 |
| L4 | Category Verified | Category-specific exam + video proof | 16 | 3 |
| L5 | Professional Verified | Practical exam + proof submission | 20 | 4 |
| L6 | Franchise Endorsed | Physical verification by franchise + checklist | 24 | 5 |
| L7 | Expert Verified | Expert-level audit + physical inspection evidence | 28 | 6 |
| L8 | Certified Professional | Full certification + multi-source validation | 32 | 7 |
| L9 | High Assurance | Continuous validation + re-verification | 36 | 8 |
| L10 | Certified Elite | All criteria maximum score + clean history | 40 | 10+ |

**Note:** CRB L0–L10 ladder is independent of PSS L0–L10. They feed **different components** into the STL formula. CRB level = verification + exams + refill adherence. See `PSS.md §3` for how PSS + CRB + DMO compose into final STL.

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

## 10. Security & accountability (PSS v3.0 update)

- Secure storage of proofs (encrypted, country-scoped)
- Anti-tamper logs (every reviewer decision is signed + auditable)
- **Reviewer accountability** — every approve/reject is attributed to a named officer with a weekly QA audit
- **CRB Officer Edit Authority** — CRB officers can **EDIT submitted entity data** before making approval/rejection decision. Example: correct typos in address or company name without forcing seller resubmission. All edits logged in immutable audit trail with officer ID + timestamp.

## 11. Open questions for next batch

1. **Refill window length** — monthly, quarterly, yearly per level?
2. **Which categories require physical verification** vs digital-only?
3. **Exam library** — does EHB build its own or integrate with 3rd-party (e.g. Coursera, industry boards)?
4. **Franchise reviewer capacity** — how many reviews per franchise per day before SLA starts to slip?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-19 | 2.0 | CRB renamed from 'Certification & Refill Board' to 'Central Record Blockchain' per founder confirmation |
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_crb.md`; naming contradiction flagged (Refill vs Regulatory vs Registry) |
