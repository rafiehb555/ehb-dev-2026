# Finance — EHB Financial System

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_finance.md` (Batch-2, 2026-04-11)
**Related:** `Wallet.md` · `GoSellr.md §7` · `Franchise.md §5`

---

## 1. Purpose

EHB Finance is the **money-handling layer**. It sits above the wallet and below the DMO: the wallet *holds* money, finance *moves and accounts for* money, and DMO *approves* that movement. It is responsible for payments, fees, payouts, and financial fraud controls.

## 2. Components

1. **Wallet** — the Trusty Wallet (see `Wallet.md`)
2. **Earnings system** — ledger that tracks pending → approved → paid
3. **Payments** — customer → platform (order checkout), platform → seller/rider/franchise (payouts)
4. **Fees** — platform commission, lock fees, withdrawal fees

## 3. Revenue sources

- Transaction fees (per order, per transfer)
- Franchise fees (territory license, renewal)
- Verification fees (CRB physical + exam)
- Marketplace commissions (the 10% platform slice of every GoSellr order)

## 4. Earning distribution

Every successful order distributes to four parties (see `GoSellr.md §7` for numbers):

1. Seller income
2. Rider income
3. Franchise share
4. Platform fee

All four flows are **logged, auditable, and blockchain-anchored** (Phase-2+).

## 5. Financial control (DMO)

- **Validate earnings** — no payout is released without DMO approval (`POST /api/dmo/approve-earning`)
- **Apply penalties** — complaints, fraud flags, missed refills all hit the earning ledger
- **Detect fraud** — Up-Guard signals (abnormal transfer, round-trip loop, velocity spike) halt payouts

## 6. Goal

A controlled and transparent financial ecosystem where every EHBGC can be traced from source to destination.

## 7. Open questions for next batch

1. **Fiat on-ramp / off-ramp providers** per launch country
2. **Tax handling** — who collects VAT/GST/sales tax per country?
3. **Payout cadence** — instant, daily, weekly?
4. **Minimum payout threshold** before earnings can be withdrawn

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_finance.md` |
