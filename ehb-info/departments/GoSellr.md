# GoSellr — EHB Marketplace

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_gosellr.md` (Batch-2, 2026-04-11) + Batch-1 detail in `DMO.md §22.15`
**Related:** `STL.md §4` (MIN rule) · `Wallet.md` · `Finance.md`

---

## 1. Purpose

GoSellr (also referenced as **GoSellr GSM — Global Shopping Management System** in the Industry list) is EHB's flagship **e-commerce + service marketplace**. It is the first industry that ships end-to-end and the reference implementation for every other EHB industry.

## 2. What it supports

- **Product selling** — physical goods, digital goods, subscriptions
- **Service marketplace** — freelancers, on-site services, home services
- **Delivery system** — rider network (LDS), last-mile fulfilment

## 3. User types (from Batch-1)

1. **Sellers** — product merchants, any STL
2. **Riders** — delivery providers (LDS integration)
3. **Service Providers** — freelancers and on-site service workers
4. **Companies** — bulk sellers with multiple SKUs and branches
5. **Franchisers** — territorial operators (see `Franchise.md`), separate STL ladder

## 4. Basic flow (Batch-2)

```
Search → Product → Order → Delivery
```

## 5. Full 10-step order flow (Batch-1 canonical, `DMO.md §22.15`)

```
1. Browse       — UI shows full STL chain on each card
2. Create       — cart build, address selection
3. Validate     — POST /api/stl/validate-product → finalStl + blockingLayer
4. Assign       — seller notification, rider dispatch (if physical)
5. Execute      — order fulfilment
6. Complete     — delivery confirmed, proof uploaded
7. Distribute   — revenue split (see §7)
8. STL impact   — positive activity, rating, possible STL bump
9. Complaint    — dispute window opens
10. Up-Guard    — fraud check on seller/rider/product patterns
```

## 6. Product card anti-fraud UI (Batch-1 canonical)

Every product card and product detail page **must** show the full STL chain so buyers see the weakest link:

```
┌───────────────────────────────────┐
│  [Product image]                  │
│  Product Name                     │
│  ★★★★☆ 4.3  ·  $24.99             │
├───────────────────────────────────┤
│  🛡 Trust chain                   │
│  Product   L7 PRO                 │
│  Seller    L6 HIGH                │
│  Company   L4 STANDARD  ← weakest │
│  Owner     L6 HIGH                │
│  Final     L4 STANDARD            │
└───────────────────────────────────┘
```

The weakest layer is highlighted — this is the "STL badge bleed" pattern from §23.3 suggestion S3.

## 7. Revenue split (resolution of Batch-1 vs legacy contradiction)

**Outer split — order-level (Batch-1):** every order divides as

| Party         | Share |
|---------------|------:|
| Seller        |  70%  |
| Rider         |  10%  |
| Franchise     |  10%  |
| Platform (EHB)|  10%  |

**Inner split — platform's 10% cascade (legacy):** the platform share further splits across the franchise chain

| Tier                  | Share of platform slice |
|-----------------------|-------------------------:|
| Country franchise     | 40% |
| Corporate             | 25% |
| Sub-franchise         | 20% |
| Platform (HQ)         | 15% |

This "outer + inner" interpretation reconciles both numbers without either being wrong. **Awaiting user confirmation** (`DMO.md §24 row 6`).

## 8. STL integration

Every order touches STL at three points:

1. **Pre-order** — validate product chain (MIN rule), block if any layer is FREE
2. **Post-order** — seller STL recalc based on rating + complaints
3. **Over rolling window** — activity score feeds DMO

## 9. Open questions for next batch

1. **First 3 GoSellr pages to ship** (home, product detail, order history? or cart, checkout, my-orders?)
2. **Return/refund policy** — who pays (seller, platform, rider)?
3. **Multi-seller cart** — one order or split orders?
4. **Rider assignment** — round-robin or STL-weighted?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created; merged Batch-2 basic flow with Batch-1 full 10-step + UI spec |
