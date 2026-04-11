# Franchise — EHB Territorial Operators

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_franchise.md` + `uploads/ehb_franchise_earnings.md` (Batch-2, 2026-04-11)
**Related:** `CRB.md` (physical verification) · `GoSellr.md §7` (revenue split) · `DMO.md §22.14`

---

## 1. Purpose

The Franchise system turns EHB from a pure software platform into a **physical + digital hybrid**. Franchisers are territorial operators who handle on-the-ground tasks (physical verification, local dispute resolution, rider coordination) in exchange for a slice of every order in their territory. They are EHB's feet on the street.

## 2. Four-level hierarchy

| Level    | Coverage                      | Typical STL entry bar |
|----------|-------------------------------|-----------------------|
| Online   | No territory — virtual only   | 5,000 EHBGC locked    |
| City     | One city                      | 20,000 EHBGC          |
| State    | One state/province            | 50,000 EHBGC          |
| Country  | One country                   | 100,000+ EHBGC        |

> ⚠️ **Note** — franchise STL ladder is **separate** from the seller/user STL ladder. A franchise has its own 4-tier progression, not the L1–L10 ladder. This is Batch-1 canonical (`DMO.md §22.14`) and Batch-2 keeps the same four levels.

## 3. Core functions

1. **CRB physical verification** — on-site visits to verify sellers, service providers, storefronts
2. **User onboarding** — local outreach, language support, cash deposit handling
3. **Area control** — disputes, complaints triage, rider oversight, local policy compliance
4. **Collection & escrow** — in countries without digital payments infra

## 4. Earning sources

1. **Commission on sales** in their territory (inner split of the platform slice — see `GoSellr.md §7`)
2. **Verification fees** — CRB physical verification charges
3. **Franchise network income** — passive income from sub-franchises under them
4. **Service charges** — cash handling, local support, premium SLAs

## 5. Earning logic

- Higher STL franchise → higher earning rate per order
- More users onboarded → more volume → more income
- **Performance factors:** area activity, user growth, complaint control, coin holding
- **Penalties:** low performance, high complaints, low coin balance → earning rate reduced or franchise suspended

## 6. Franchise → seller feedback loop (new suggestion — §23.3 S5)

A franchise's performance indirectly affects the sellers it verified. If a franchise has a bad complaint rate, the sellers it onboarded get a slight STL ceiling reduction (capped, so one bad franchise can't tank innocent sellers too hard). This is proposed, not yet confirmed — awaiting user in `DMO.md §25`.

## 7. Revenue split (cross-reference)

See `GoSellr.md §7` for the canonical outer/inner split. Franchise receives 10% of every order (outer) plus a share of the platform's 10% slice (inner) based on their position in the Country → Corporate → Sub-franchise chain.

## 8. Open questions for next batch

1. **Exact commission percentages** per franchise level per industry
2. **Exclusivity** — one franchise per city, or multiple competing?
3. **Sub-franchise caps** — how many sub-franchises can a country franchise spawn?
4. **Exit/termination process** — what happens to users + locked coins if a franchise quits?
5. **Initial launch country** — where does franchise Phase-1 roll out?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 franchise + franchise_earnings files |
