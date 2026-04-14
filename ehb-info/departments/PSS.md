# PSS — Personal Security System

**Status:** Deep spec (v2.0) · 27 verification features fully defined · Merged from user direct input (2026-04-13)
**Related:** `STL.md §3` (input) · `DMO.md §22.11` · `EHB-MASTER-INFO.md §4.1, §54`

> **Naming:** PSS = "Personal Security System" (canonical). Legacy "Proof & Security System" deprecated.

---

## 1. Purpose

PSS is the **security backbone** of the entire EHB platform. Every user (buyer, seller, rider, inspector, franchise owner) must pass through PSS verification gates before accessing platform features. PSS directly feeds the STL scoring formula (+40 points max out of 120 total).

## 2. Objectives

1. **Real user verification** (KYC/KYB) — prove the human/business behind the account
2. **Profile authenticity** — prevent impersonation, bot accounts, fake companies
3. **Ongoing monitoring** — continuous post-onboarding identity & behavior tracking
4. **Financial compliance** — AML, transaction monitoring, regulatory reporting
5. **Trust score calculation** — output 0–40 points consumed by STL formula

## 3. Master Flow

```
User Signup → Basic PSS (ID + Liveness) → Enhanced PSS (AML + Address)
→ Ongoing Monitoring → Periodic Re-verification → STL Score Update
```

## 4. 27 Verification & Security Features

### Category A: Identity Verification (Features 1-6)

| # | Feature | What | EHB Use | Phase |
|---|---------|------|---------|-------|
| 1 | ID Verification | Passport/CNIC/license scan + OCR + NADRA cross-check | ALL users at signup (STL L1 min) | 1 |
| 2 | Liveness Detection | Blink/smile/head turn anti-spoofing AI | Required with ID, prevents fake accounts | 1 |
| 3 | AML Screening | Sanctions/terrorist/PEP lists (OFAC, UN, EU) | Sellers L3+, franchise, high-value buyers 50K+ | 1 |
| 4 | Address Verification | Utility bill/bank statement + OCR + optional CRB physical | Sellers, franchise, riders | 1 |
| 5 | Ongoing ID Monitoring | Post-onboarding continuous checks, expiry alerts | All verified users | 2 |
| 6 | Questionnaires | Custom onboarding questions by role | Dynamic forms per user type/industry | 1 |

### Category B: Financial Monitoring (Features 7-8)

| # | Feature | What | EHB Use | Phase |
|---|---------|------|---------|-------|
| 7 | Transaction Monitoring | Suspicious money patterns, amounts, frequency | All wallet/escrow/affiliate transactions | 1→2 |
| 8 | Crypto Monitoring | Blockchain wallet risk, mixer/tumbler detection | EHBGC transactions, Polkadot integration | 2-3 |

### Category C: Business Verification (Feature 9)

| # | Feature | What | EHB Use | Phase |
|---|---------|------|---------|-------|
| 9 | KYB (Know Your Business) | SECP check, director verification, legitimacy | Corporate/Master franchise, Manufacturer/Wholesaler, 500K+ monthly | 1 |

### Category D: Behavioral & Device Intelligence (Features 10-11, 17-21)

| # | Feature | What | EHB Use | Phase |
|---|---------|------|---------|-------|
| 10 | Behavior Monitoring | Bot detection, account takeover, impossible travel | Fake orders, affiliate fraud, inspector manipulation | 1→2 |
| 11 | Face Auth 2FA | Face scan for sensitive operations | Withdrawals >10K, escrow release, STL changes | 1 |
| 17 | Applicant Scoring | Composite 0-100 score from ALL PSS data | Direct 0-40 mapping to STL formula | 1→2 |
| 18 | Device Intelligence | Fingerprint, multi-account, emulator, root detect | Max 2 accounts/device, fraud prevention | 1 |
| 19 | Email Risk Scoring | Disposable/temporary/fake email detection | Signup gate, disposable = blocked | 1 |
| 20 | Phone Risk Scoring | Burner/VoIP/SIM swap detection, PTA database | Signup gate, SIM swap = freeze | 1 |
| 21 | IP Scoring | VPN/proxy/Tor/datacenter, geo-mismatch | VPN = warning, Tor = blocked for finance | 1 |

### Category E: Compliance & Screening (Features 12-16, 22-27)

| # | Feature | What | EHB Use | Phase |
|---|---------|------|---------|-------|
| 12 | Travel Rule | FATF crypto sender/receiver info sharing | Cross-border EHBGC transfers | 3 |
| 13 | Non-Doc Verification | NADRA/credit bureau/telco records | Alternative path, speeds onboarding | 1→2 |
| 14 | Reusable KYC | Verify once, use across all 50+ industries | Single PSS vault, user controls sharing | 1 |
| 15 | Age Estimation | AI face age vs. ID DOB cross-check | Mismatch = flag, child safety | 2 |
| 16 | Video Identification | Live video call with PSS agent or AI | L8+ STL, Country/Corporate franchise, inspector cert | 2 |
| 22 | Counterparty Screening | Transfer recipients vs. sanctions lists | Real-time on every outbound transfer | 1 |
| 23 | Institution Screening | Bank sanctions check | When adding payout bank accounts | 1 |
| 24 | Payment Details Screening | NLP scan of payment notes | Suspicious content detection | 2 |
| 25 | Suspicious Payment Details | Structuring/smurfing/wash detection | Rule engine + ML on metadata | 1→2 |
| 26 | Periodic Verifications | Scheduled re-verification by STL level | L1-3=annual, L4-6=semi-annual, L7+=quarterly | 1 |
| 27 | Regulatory Reports | SAR filing to FMU (State Bank Pakistan) | Auto-draft from flags → compliance review | 1→2 |

## 5. PSS → STL Point Mapping (40 points max)

| Category | Features | Points |
|----------|----------|--------|
| Identity Core | ID(1) + Liveness(2) + Address(4) | 15 |
| Financial Compliance | AML(3) + Transaction(7) + Counterparty(22) | 8 |
| Business | KYB(9) + Questionnaire(6) | 10 |
| Digital Trust | Email(19) + Phone(20) + Device(18) + IP(21) | 4 |
| Premium Verification | Video(16) + Non-Doc(13) | 3 |
| **TOTAL** | **27 features** | **40** |

## 6. PSS Requirements by User Role

| Role | Level | Required Features | Optional (Bonus) |
|------|-------|-------------------|-----------------|
| Buyer | Basic | ID, Liveness, Phone, Email | Address, AML for BSTL boost |
| Seller | Enhanced | ID, Liveness, AML, Address, KYB(if business), Device | Video for L8+ |
| Rider | Enhanced | ID, Liveness, Address, Phone, Device, Face 2FA | — |
| Inspector | Full | ID, Liveness, AML, Address, Video, Device, Face 2FA | — |
| Franchise | Full+KYB | ALL identity + KYB + AML + Video | Crypto for Phase 2 |
| Admin | Full+2FA | ID, Liveness, Face 2FA, Device, IP | — |

## 7. Security Requirements

- KYC data encrypted at rest (AES-256), separate key per country
- Role-based access — only verified KYC officers see full documents
- Audit logs — every read/write logged, reviewed weekly
- No bulk export — per-user access only
- GDPR/local privacy law compliant data handling

## 8. Open Questions (Resolved)

| Question | Answer |
|----------|--------|
| Complaint window | Rolling — integrated with §43 Complaint System |
| False-report threshold | BSTL system handles this (§41) |
| KYC refresh cadence | Feature 26: L1-3=annual, L4-6=semi-annual, L7+=quarterly |
| Address proof fallback | CRB physical verification (Feature 4 + Feature 13 non-doc) |

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_pss.md`; name confirmed "Personal Security System" |
| 2026-04-13 | 2.0 | **DEEP REWRITE** — 27 verification features fully defined with descriptions, EHB use cases, phase mapping, STL point allocation, and role-based requirements. All open questions resolved. Synced with EHB-MASTER-INFO.md §54. |
