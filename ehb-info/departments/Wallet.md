# Trusty Wallet — EHB Wallet System

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_trusty_wallet.md` (Batch-2, 2026-04-11)
**Related:** `STL.md §3` · `Blockchain.md` · `Finance.md` · `DMO.md §22.13` (Batch-1 wallet prompt)

> ⚠️ **Bucket contradiction** — Batch-2 says wallet has **2 buckets** (Total = Locked + Free). Legacy docs said **3 wallets** (Main, Earnings, Lock). Resolution adopted here: **Free balance is the active bucket**, **Locked balance is the STL collateral bucket**, and **Earnings flow from "pending" → "approved" → Free balance** as a ledger state rather than a third wallet. Flagged for confirmation in `DMO.md §25`.

---

## 1. Purpose

The Trusty Wallet is the **financial backbone** of EHB. It does three things no ordinary wallet does:

1. **Trust-based coin locking** — coins staked as collateral for STL level
2. **Earning distribution** — a ledger that tracks pending → approved → available earnings
3. **Direct integration with STL, DMO, PSS, CRB** — wallet events immediately feed trust & ranking systems

It's called "Trusty" because holding EHBGC is how you *prove* you trust the system enough to stake on it.

## 2. Wallet structure

Every user has exactly one wallet with three views:

| Bucket       | Meaning                                   | Spendable? |
|--------------|-------------------------------------------|:----------:|
| Total Balance | Locked + Free (display only)             |     —     |
| Locked (🔒) | Staked as STL collateral — Trusty Lock    |   **No**  |
| Free          | Usable for purchases, withdrawals, P2P    |   **Yes** |

**Example:** Total 5000 EHBGC → Locked 2000 → Free 3000.

Earnings flow internally as a ledger state:

```
Approved Earnings → Free balance (immediate)
Pending Earnings  → Held (not visible as Free until DMO approves)
Rejected Earnings → Cancelled (never credited)
```

## 3. Coin lock ladder (STL collateral)

**Canonical minimums** from Batch-2 `uploads/ehb_trusty_wallet.md`:

| Level | Min locked EHBGC |
|-------|-----------------:|
| L1 FREE       | 0 |
| L2 BASIC      | 20 |
| L3 NORMAL     | 40 |
| L4 STANDARD   | 100 |
| L5 ADVANCED   | 200 |
| L6 HIGH       | 400 |
| L7 PRO        | 800 |
| L8 VIP        | 2000 |
| L9 ELITE      | 4000 |
| L10 SUPREME   | 10000+ |

> ⚠️ **Batch-1 contradiction** — Batch-1 `DMO.md §22.1` used a **dual-number** ladder (e.g. L2 50/20, L3 100/40) and different numbers for higher levels (L8 5000, L10 25000+). Batch-2 overrides with the simpler single-number ladder above. **This file treats Batch-2 as canonical** and the Batch-1 dual-number table is now deprecated pending explicit user confirmation. Flagged in `DMO.md §25`.

**Critical rule:** `locked_coins < required(STL_level)` → STL downgrade risk → earnings limit → system restriction. This is evaluated on every lock/unlock event.

## 4. Lock duration bonuses (new — answers earlier §23.3 S4)

Users can **voluntarily** lock their coins for a fixed term to earn extra benefits:

| Term    | Benefit                                      |
|---------|-----------------------------------------------|
| 1 year  | Reduced platform fees                         |
| 2 years | More fee reductions + priority earnings       |
| 3 years | Max benefits (lowest fees, highest payout tier) |

Bonuses stack on top of the base STL level benefits. **Early unlock = forfeit bonus + STL recalculation** (possible downgrade if freed coins drop below level minimum).

## 5. Transactions supported

- **Deposit** (on-chain → wallet, via selected chain — BSC in Phase-1)
- **Withdrawal** (wallet → on-chain or fiat off-ramp)
- **Transfer** (user → user, subject to PSS/DMO checks)
- **Internal system deductions** (fees, penalties, stake slashes)

## 6. Transaction flow

```
User Action → Validation (PSS + DMO Up-Guard) → Wallet Update → Blockchain Log
```

Every wallet mutation is double-booked: a local DB entry (fast path) and an on-chain event (slow path, async). Reconciliation runs hourly.

## 7. Blockchain integration phases

1. **Phase 1: Binance Smart Chain (BSC)** — EHBGC is a BEP-20 token. Cheapest + fastest to ship.
2. **Phase 2: Mosaic Blockchain** — EHB's own chain (permissioned or hybrid).
3. **Phase 3: Polkadot Parachain** — full decentralised rollout, cross-chain bridges.

See `Blockchain.md` for the full roadmap.

## 8. STL integration

Wallet events that affect STL:

- `lock_increase` → possible STL upgrade check
- `lock_decrease` → possible STL downgrade check
- `earning_approved` → activity score bump (DMO) + STL recalc
- `earning_rejected` → complaint signal (PSS) + STL drop

## 9. Security

- Encrypted wallet data (keys separated by country partition)
- Private key protection — managed custody for Phase-1 (users don't hold keys directly), self-custody optional from Phase-2
- **Fraud detection by DMO Up-Guard** — abnormal patterns trigger freeze
- **Rate limiting** — max transactions per minute per user

## 10. Fraud protection (Up-Guard signals)

Detect:
- Fake/duplicate transaction attempts
- Abnormal transfers (10× normal volume, round-trip loops, rapid withdrawals)
- Device fingerprint mismatches

Actions (in order of severity):
1. Flag for manual review
2. Pending earnings frozen
3. Full wallet freeze (requires DMO L8 approval to unfreeze)

## 11. Edge cases

- **New user** — zero balance, STL capped at L1 FREE until deposit
- **Voluntary unlock** — triggers STL recalc within 60 seconds; if level drops, outstanding earnings paid at the lower-tier rate
- **Large transaction** (> threshold, country-specific) — auto-routed to extra validation queue

## 12. Open questions for next batch

1. **Exact fee rates** per STL level
2. **Lock duration bonus numbers** (how much fee reduction for 1yr vs 3yr?)
3. **Cross-country transfer policy** — does PSS block international moves until re-verification?
4. **Custody model** — managed-only for Phase-1, self-custody from Phase-2? Or both from day-1?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_trusty_wallet.md`; coin lock ladder now canonical, Batch-1 dual-ladder deprecated |
