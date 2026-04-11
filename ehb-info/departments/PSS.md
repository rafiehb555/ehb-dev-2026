# PSS — Personal Security System

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_pss.md` (Batch-2, 2026-04-11)
**Related:** `STL.md §3` (input) · `DMO.md §22.11` (Batch-1 PSS prompt) · `EHB-MASTER-INFO.md §4.1`

> ⚠️ **Naming note** — Batch-2 confirms **PSS = "Personal Security System"**, overriding legacy "Proof & Security System". The new name is now canonical. Codebase references to the old name should be rewritten on sight (no backup needed — the acronym stays the same).

---

## 1. Purpose

PSS is the **trust engine** of EHB. It validates *who* someone is, tracks complaints against them, and maintains a dynamic trust score used as a critical input to STL. PSS is the first layer of the MIN anti-fraud chain: if a user's PSS is broken, the whole chain collapses regardless of wallet, CRB, or activity.

## 2. Objectives

1. **Real user verification** (KYC) — prove the human behind the account
2. **Profile authenticity** — prevent impersonation, bot accounts, fake companies
3. **Complaint tracking & resolution** — single source of truth for user grievances
4. **Trust score calculation** — output a 0–100 number consumed by STL

## 3. KYC tiers

| Tier             | Requirements                                                |
|------------------|-------------------------------------------------------------|
| Unverified       | Email only. No earning, no listing, FREE STL cap.           |
| Basic Verified   | ID document + phone/email OTP                               |
| Fully Verified   | ID + liveness face match + address proof (utility / bank)   |

Liveness + face match is mandatory for Fully Verified. Address proof is country-specific and validated by the local franchise (CRB physical layer).

## 4. Trust score (0–100)

**Inputs:**

- KYC completion (tier weight)
- Profile completeness (photo, bio, category selection)
- Complaint ratio (valid complaints ÷ total interactions, rolling window)
- Behaviour consistency (login patterns, device fingerprint, geo consistency)

**Output tiers:**

- **Low** (0–39) — restricted, STL capped at FREE/BASIC
- **Medium** (40–74) — standard marketplace access
- **High** (75–100) — fast-track STL upgrades, priority dispute queue

## 5. Complaint system

**Flow:** User files complaint → stored (immutable) → routed to auto-review (AI) or manual reviewer (franchise / DMO) → decision → penalty applied (or reversed).

**Severity ladder:**

| Severity | Example                                      | Action                                  |
|----------|----------------------------------------------|-----------------------------------------|
| Low      | Delayed reply, minor UX friction             | Warning logged                          |
| Medium   | Wrong item delivered, bad service quality    | Trust score drop, STL downgrade risk    |
| High     | Fraud, abuse, fake product, identity misuse  | Account restriction / suspension        |

**False-report defence:** a user who repeatedly files invalid complaints gets their own PSS score penalised — prevents weaponising the complaint system.

## 6. Penalties

- Trust score reduction (weighted by severity)
- STL downgrade risk flag to DMO
- Feature limits (max listings, max daily orders)
- Account freeze (extreme cases, requires DMO L8 approval to unfreeze)

## 7. Security requirements

- **KYC data encrypted at rest** (AES-256), separate key per country (data sovereignty — see master §5 architecture)
- **Role-based access** — only verified KYC officers see full documents, general admins see only tier + score
- **Audit logs** — every read/write to PSS documents is logged; reviewed weekly
- **No bulk export** — PSS documents cannot be dumped; per-user access only

## 8. STL impact

PSS feeds directly into STL as `PSS_trust` in the composite formula (see `STL.md §3`). A high PSS unlocks faster level progression; a low PSS blocks upgrades outright and adds downgrade risk.

## 9. Open questions for next batch

1. **Complaint window** — rolling 30, 60, 90 days?
2. **False-report threshold** — how many invalid complaints before the reporter is penalised?
3. **KYC refresh cadence** — does a verified user need to re-verify yearly? on country change?
4. **Address proof fallback** — what if a country has no standard utility bill (rural)?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_pss.md`; name confirmed "Personal Security System" |
