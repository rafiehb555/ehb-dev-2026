# EHB economics — master reference (design)

> **Single place** for percentage splits copied from [EHB_GOSELLR_PLAN.md](../development/EHB_GOSELLR_PLAN.md), [EHB_FRANCHISE_PLAN.md](../development/EHB_FRANCHISE_PLAN.md), [EHB_AFFILIATE_PLAN.md](../development/EHB_AFFILIATE_PLAN.md). Adjust only with cross-plan review + update here.

## 1. Standard order (GoSellr / marketplace)

**% of order value** — [EHB_GOSELLR_PLAN.md](../development/EHB_GOSELLR_PLAN.md) Part 8 / [EHB_FRANCHISE_PLAN.md](../development/EHB_FRANCHISE_PLAN.md) Part 4 (sums to **100%**):

| Entity | % |
|--------|---|
| EHB Head Office | 10% |
| Country Franchise | 1% |
| Corporate Franchise | 2% |
| Master Franchise | 2% |
| Sub Franchise | 3% |
| Seller | 70% |
| Rider / Delivery | 5% |
| Affiliate (if any) | 7% |

**Accounting rule (affiliate):** Per [EHB_AFFILIATE_PLAN.md](../development/EHB_AFFILIATE_PLAN.md), affiliate is **not** taken from the seller’s 70%; treat the 7% row as the affiliate pool when a referral applies, funded from platform-side economics (detail in finance policy).

## 2. Platform commission by seller STL (GoSellr Part 6)

| Seller STL | Platform commission % |
|------------|------------------------|
| L1 | 15% |
| L2 | 15% |
| L3 | 12% |
| L4 | 10% |
| L5 | 7% |

### Precedence: §1 vs §2 (MVP)

- **§1** is the **full order** stakeholder split (franchise chain + seller 70% + rider + affiliate row) — use this for **settlement / reporting** unless finance replaces the model.
- **§2** is **STL-tiered platform commission** from the GoSellr plan — use when the product charges sellers a **variable take rate** by trust level. **Do not** add §2 on top of §1 as two independent % of the same order total without a **finance-approved** combined formula (risk of double counting).
- **Default:** implement **§1** first for MVP; add §2 only when the pricing engine defines how it maps to EHB/franchise take vs seller net.

## 3. Affiliate network (from EHB’s platform share)

**% of EHB platform share** (not of seller share):

| Network level | % of platform share |
|---------------|---------------------|
| L1 (direct referral) | 5% |
| L2 | 2% |
| L3 | 1% |
| L4 | 0.5% |

## 4. CRB inspection fee split

| Entity | % of inspection fee |
|--------|---------------------|
| Sub (conducting) | 50% |
| Master | 20% |
| Corporate | 15% |
| Country | 10% |
| Head Office | 5% |

## 5. Withdrawal daily limits (STL) — align P5 / P6 / STL full

| STL | PKR (example) | GBP (example) |
|-----|---------------|----------------|
| L1 | Blocked | Blocked |
| L2 | 10,000 | £50 |
| L3 | 50,000 | £250 |
| L4 | 200,000 | £1,000 |
| L5 | Unlimited | Unlimited |

Source: [EHB_GOSELLR_PLAN.md](../development/EHB_GOSELLR_PLAN.md) Part 15 & [EHB_WALLET_TOKEN_PLAN.md](../development/EHB_WALLET_TOKEN_PLAN.md) Part 6 — **must match** in code.

---

*Last updated: 2026-04-07 (§1 vs §2 precedence added)*
