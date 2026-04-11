# FLOW-P10 — 35 industries + UI strategy

## Metadata

| Field | Value |
|-------|--------|
| **Flow ID** | FLOW-P10 |
| **Title** | Tiered industries, landing UI, card states, AI search, DMO control |
| **Status** | Draft |
| **Owner** | EHB design-flow |
| **Last updated** | 2026-04-07 |
| **Source plans** | [EHB_INDUSTRIES_UI_PLAN.md](../development/EHB_INDUSTRIES_UI_PLAN.md) |

## Summary

**35 active industries** (+ **8 future** in plan) ko **3 tiers** mein organize kiya gaya: **Core** (glow, priority), **Main** (visible), **Other** (scroll, mostly under dev). Har industry ka **LIVE / Coming Soon / Under Development** state cards, top bar, aur **AI search** (kabhi industry hide nahi) se control hota hai. **DMO** `/dmo/industries` se status toggle + interest signups. Full numbered list: source plan **Part 2**.

## Tier rules (plan Part 1)

| Tier | UX |
|------|-----|
| 1 Core | Highlight, glow, larger, left |
| 2 Main | Normal chips |
| 3 Other | Smaller, scroll, mostly locked |

## Industry inventory (35 — abbreviated)

**Tier 1:** E-commerce (GoSellr), Education (HPS), Health (WMS), Law (OLS), Franchise (ESF/EMF/ECF).  
**Tier 2:** SOT, BRS, EFS, ERS, LDS, Tube, AGTS, EAS, HMS/ITS, JPS — per plan table with status emoji.  
**Tier 3:** Insurance through Local Services (35) — see [EHB_INDUSTRIES_UI_PLAN.md](../development/EHB_INDUSTRIES_UI_PLAN.md) Part 2.

**Future 36–43:** Space, Robotics, Metaverse, IoT, Smart Cities, Biotech, Nano, Quantum — post Phase 3.

## Top bar layout (plan Part 3)

Three horizontal bands: Core glow row → Main row → More (scroll). **CSS samples** in plan use generic blue/purple glow — **align** with [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) (Health Blue / Platform Purple / dark layers).

## Card states (plan Part 4)

| State | Badge | CTA |
|-------|-------|-----|
| LIVE | Green | Open platform |
| Coming Soon | Yellow | Notify me |
| Under Development | Lock + blur | Register interest |

## AI search (plan Part 5)

Search **all** industries; always return results with correct status — never hide.

## Homepage blocks (plan Part 6)

Header → industry bar → hero → **industry grid** → EHB-STL showcase → franchise strip → stats → footer.

## DMO (plan Part 7)

`/dmo/industries`: toggle status, CRUD industry, traffic, interest counts — `Industry` + `IndustryInterest` model sketch in source plan.

## Naming in UI

Follow [GLOSSARY_EHB.md](GLOSSARY_EHB.md) — **FULL NAME (SHORT-NAME)** on cards where space allows.

## Cross-flow links

| Topic | Doc |
|-------|-----|
| Brand colors / badges | [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) |
| STL showcase copy | [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) |
| Franchise strip | [FLOW-P7-franchise-network.md](FLOW-P7-franchise-network.md) |
| DMO industry workspace | [FLOW-P3-dmo-governance.md](FLOW-P3-dmo-governance.md) (`/dmo/industry` in app) |

## Resolved (implementation)

- **Tier 1 core chip gradient:** use [FLOW-P1](FLOW-P1-foundation-ui.md) / [EHB_COLOR_SCHEME_PLAN.md](../development/EHB_COLOR_SCHEME_PLAN.md) — e.g. `linear-gradient(135deg, #29ABE2, #7C3AED)` (Health Blue → Platform Purple) or brand full gradient; **do not** ship raw `#3B82F6` / `#8B5CF6` from old Part 3 samples.

## Open questions

- **700+ services** — **Interim:** static marketing figure from [EHB_INDUSTRIES_UI_PLAN.md](../development/EHB_INDUSTRIES_UI_PLAN.md) until a **single counted source** (DB or CMS) exists; owner: **Product** to confirm when to replace with live aggregate.

## Traceability

| Plan file | Topics |
|-----------|--------|
| EHB_INDUSTRIES_UI_PLAN.md | Parts 1–8+ tiers, 35 list, UI, search, homepage, DMO, code names |

---

*FLOW-P10 | Industries design anchor for P11 integration.*
