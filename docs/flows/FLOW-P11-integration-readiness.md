# FLOW-P11 — Integration, epics & implementation readiness

## Metadata

| Field | Value |
|-------|--------|
| **Flow ID** | FLOW-P11 |
| **Title** | End-to-end epics, open-question rollup, handoff checklist |
| **Status** | Draft |
| **Owner** | EHB design-flow |
| **Last updated** | 2026-04-07 (decisions pass; pre-push gate) |

## Purpose

Design-flow round **close-out**: multi-module stories jo **FLOW-P1–P10** ko jodte hain, sab **open questions** ek list, aur **implementation** shuru karte waqt minimum checklist — bina iske production code expand na kiya jaye (team policy).

---

## Traceability status (DOCUMENT INDEX → flows)

Har indexed plan file ka link: [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md). Anchor: [EHB_MASTER_SYSTEM_PLAN.md](../development/EHB_MASTER_SYSTEM_PLAN.md).

| Coverage | State |
|----------|--------|
| All 15 indexed plan rows mapped | Yes |
| Legacy USER/PROVIDER flows | Linked from matrix; optional future merge |

---

## End-to-end epics (for QA & build ordering)

### Epic A — New marketplace seller (trust → list → sell)

| Step | System | Flow doc |
|------|--------|----------|
| 1 | Register + PSS layers | [FLOW-P2](FLOW-P2-trust-stack.md) |
| 2 | CRB if required for category | [FLOW-P2](FLOW-P2-trust-stack.md), [FLOW-P7](FLOW-P7-franchise-network.md) routing |
| 3 | STL L2+ for listing | [FLOW-P2](FLOW-P2-trust-stack.md), [FLOW-P5](FLOW-P5-gosellr-marketplace.md) |
| 4 | Create store / products | [FLOW-P5](FLOW-P5-gosellr-marketplace.md) |
| 5 | Order, escrow, commission split | [FLOW-P5](FLOW-P5-gosellr-marketplace.md), [FLOW-P7](FLOW-P7-franchise-network.md), [FLOW-P8](FLOW-P8-affiliate-complaints.md) |
| 6 | Earnings wallet path | [FLOW-P6](FLOW-P6-wallet-token.md) |

### Epic B — Job seeker (profile → verify → earn trust)

| Step | System | Flow doc |
|------|--------|----------|
| 1 | JPS profile mandatory | [FLOW-P4](FLOW-P4-jps-workforce.md) |
| 2 | PSS + STL gates for designation | [FLOW-P4](FLOW-P4-jps-workforce.md), [FLOW-P2](FLOW-P2-trust-stack.md) |
| 3 | 6-month contract / exam cycle | [FLOW-P4](FLOW-P4-jps-workforce.md) |
| 4 | Salary / EHBGC | [FLOW-P4](FLOW-P4-jps-workforce.md), [FLOW-P6](FLOW-P6-wallet-token.md) |

### Epic C — Sub franchise operator (apply → lock → operate)

| Step | System | Flow doc |
|------|--------|----------|
| 1 | STL L3+, PSS, CRB, fee | [FLOW-P7](FLOW-P7-franchise-network.md) |
| 2 | Trusty mandatory stake | [FLOW-P6](FLOW-P6-wallet-token.md), [FLOW-P7](FLOW-P7-franchise-network.md) |
| 3 | CRB inspector assignment / rotation | [FLOW-P7](FLOW-P7-franchise-network.md) |
| 4 | Complaint Tier 1 SLA | [FLOW-P8](FLOW-P8-affiliate-complaints.md), [FLOW-P7](FLOW-P7-franchise-network.md) |
| 5 | Earnings settlement | [FLOW-P6](FLOW-P6-wallet-token.md) |

### Epic D — DMO analyst (oversight day)

| Step | System | Flow doc |
|------|--------|----------|
| 1 | Queues: PSS, CRB, STL, industry | [FLOW-P3](FLOW-P3-dmo-governance.md) |
| 2 | STL override / appeals | [FLOW-P2](FLOW-P2-trust-stack.md), [FLOW-P3](FLOW-P3-dmo-governance.md) |
| 3 | AML / wallet flags | [FLOW-P3](FLOW-P3-dmo-governance.md), [FLOW-P6](FLOW-P6-wallet-token.md) |

### Epic E — Public landing → industry → trust message

| Step | System | Flow doc |
|------|--------|----------|
| 1 | Tier bar + cards | [FLOW-P10](FLOW-P10-industries-ui.md) |
| 2 | Brand / color | [FLOW-P1](FLOW-P1-foundation-ui.md) |
| 3 | STL showcase | [FLOW-P10](FLOW-P10-industries-ui.md), [FLOW-P2](FLOW-P2-trust-stack.md) |

---

## Decisions log (2026-04-07)

| Topic | Decision | Where |
|-------|----------|--------|
| Body text color | **`#B0BAD3`** canonical | [FLOW-P1](FLOW-P1-foundation-ui.md) |
| Industry tier bar gradient | Brand gradients from **color plan** / FLOW-P1, not raw Tailwind blue/purple | [FLOW-P10](FLOW-P10-industries-ui.md) |
| PSS layers vs engine | Engine uses **phases**; layers map to phase state — [PSS_TO_STL_ENGINE_MAPPING.md](PSS_TO_STL_ENGINE_MAPPING.md) | P2 |
| EARN vs Trusty | Earnings → **EARN**; locks/stake → **TRUSTY** | [FLOW-P6](FLOW-P6-wallet-token.md) |
| Affiliate payout | EHBGC affiliate → **EARN** | [FLOW-P6](FLOW-P6-wallet-token.md), [FLOW-P8](FLOW-P8-affiliate-complaints.md) |
| Order % + affiliate | Single reference table | [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) |
| Complaint tiers | Tier 0–6 handler table | [FLOW-P8](FLOW-P8-affiliate-complaints.md) |
| STL on-chain | **MVP default:** off-chain STL + optional **anchor** later; full history on-chain = Phase 4+ per [FLOW-P9](FLOW-P9-blockchain-trust.md) | Product |
| §1 vs §2 economics | **§1 first** for MVP settlement; §2 STL-tier fee when pricing engine exists — see [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) | Finance + product |
| UIUX body hex | [EHB_UIUX_DESIGN_PLAN.md](../development/EHB_UIUX_DESIGN_PLAN.md) Part 2 body color = `#B0BAD3` | Aligned with FLOW-P1 |

## Remaining open questions (need owner)

| # | Topic | Owner suggestion |
|---|--------|------------------|
| 1 | DMO route parity (`/dmo/stl` on Vercel) | DevOps — redeploy app including `app/dmo/stl` route; local build lists `/dmo/stl` as static |

**Resolved (2026):** Tailwind `ehb.textBody` / `textMuted` — in `tailwind.config.ts` + component rollout per [FLOW-P1](FLOW-P1-foundation-ui.md). **`GET /api/health`** — [`app/api/health/route.ts`](../../EHB%20landing-2026/app/api/health/route.ts) for uptime/deploy smoke (`gitSha` on Vercel). **`700+ services`** — interim rule in [FLOW-P10](FLOW-P10-industries-ui.md) open questions. **§1 vs §2** — [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) §2 “Precedence”.

---

## Implementation readiness checklist (first sprint — suggestive)

**Foundation**

- [ ] Env: DB, auth, Stripe/crypto flags per region doc
- [x] Tailwind `ehb` text tokens + rollout from [FLOW-P1](FLOW-P1-foundation-ui.md) + [EHB_COLOR_SCHEME_PLAN.md](../development/EHB_COLOR_SCHEME_PLAN.md)
- [ ] Naming lint or constants from [GLOSSARY_EHB.md](GLOSSARY_EHB.md)
- [x] Health endpoint for deploy smoke: `GET /api/health` ([`route.ts`](../../EHB%20landing-2026/app/api/health/route.ts))

**Trust**

- [ ] STL engine + triggers wired to PSS/CRB/order events ([FLOW-P2](FLOW-P2-trust-stack.md))
- [ ] Prisma models aligned with STL full plan §16 (as applicable)

**Commerce**

- [ ] Order + escrow + split behind feature flag ([FLOW-P5](FLOW-P5-gosellr-marketplace.md))

**Ops**

- [ ] DMO routes deployed parity (e.g. `/dmo/stl`) per ops audit docs

**Chain (later phase)**

- [ ] ERC-20 / staking scope from [FLOW-P9](FLOW-P9-blockchain-trust.md) Part 11 — not blocking MVP UX if off-chain first

---

## Pre-push gate (EHB landing-2026)

Before pushing a branch that changes the landing app, from `EHB landing-2026/`:

| Step | Command | Notes |
|------|---------|--------|
| 1 | `npm run ci:local` | Typecheck, tests, lint, production build — same core steps as [`.github/workflows/ehb-landing-ci.yml`](../../.github/workflows/ehb-landing-ci.yml) after `npm ci` |
| 2 | `npm run audit:info` | Same high-level audit as CI; may exit non-zero while known transitive highs remain |

Cross-links: [LOCAL_DEPLOY_PARITY_CHECKLIST.md](../development/LOCAL_DEPLOY_PARITY_CHECKLIST.md) (CI-aligned commands), [INDEX.md](../INDEX.md) (**CI (landing app)**).

---

## Design phase sign-off criteria

- [x] TRACEABILITY_MATRIX: no empty flow column for indexed plans
- [x] Major open questions triaged ([Decisions log](#decisions-log-2026-04-07) + [Remaining](#remaining-open-questions-need-owner))
- [x] **P1 text tokens (incl. OLS law mirror):** main app `app/` / `components/` / `lib/`; law reference UI [`ols-law-source/nextjs-app/src`](../../EHB%20landing-2026/content/industries/law/ols-law-source/nextjs-app/src) — `@theme` adds `--color-ehb-textBody` / `--color-ehb-textMuted` in [`globals.css`](../../EHB%20landing-2026/content/industries/law/ols-law-source/nextjs-app/src/app/globals.css); gold/white buttons keep `text-slate-900` for contrast ([FLOW-P1](FLOW-P1-foundation-ui.md))
- [ ] At least **one** epic A/B/C walkthrough approved by product

---

## Master flow index (P1–P11)

| ID | File |
|----|------|
| P1 | [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) |
| P2 | [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) |
| P3 | [FLOW-P3-dmo-governance.md](FLOW-P3-dmo-governance.md) |
| P4 | [FLOW-P4-jps-workforce.md](FLOW-P4-jps-workforce.md) |
| P5 | [FLOW-P5-gosellr-marketplace.md](FLOW-P5-gosellr-marketplace.md) |
| P6 | [FLOW-P6-wallet-token.md](FLOW-P6-wallet-token.md) |
| P7 | [FLOW-P7-franchise-network.md](FLOW-P7-franchise-network.md) |
| P8 | [FLOW-P8-affiliate-complaints.md](FLOW-P8-affiliate-complaints.md) |
| P9 | [FLOW-P9-blockchain-trust.md](FLOW-P9-blockchain-trust.md) |
| P10 | [FLOW-P10-industries-ui.md](FLOW-P10-industries-ui.md) |
| P11 | This file |
| — | [INDEX.md](INDEX.md) (folder index) |
| — | [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) |
| — | [PSS_TO_STL_ENGINE_MAPPING.md](PSS_TO_STL_ENGINE_MAPPING.md) |

---

*FLOW-P11 — Design-flow phase complete; implementation phase follows product priority.*
