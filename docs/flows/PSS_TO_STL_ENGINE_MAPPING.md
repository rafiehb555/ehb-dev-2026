# PSS → STL engine mapping (design)

> **Source of truth for scores:** [EHB_STL_FULL_PLAN.md](../development/EHB_STL_FULL_PLAN.md) §3 — **PSS 0–40** by verification **phase**.  
> **UX steps:** [EHB_PSS_CRB_PLAN.md](../development/EHB_PSS_CRB_PLAN.md) **5 layers** (points add to +40 max).

## Rule

- The **engine** exposes PSS as **0–40** with **phase** semantics (Phase 0 → 0 pts; Phase 1 → 30; Phase 2+ → 40 cap) per STL full plan.
- The **PSS product UI** can still show **layers** (identity, face, contact, device, business) — each layer completion updates backend **phase** state so the engine reads one PSS score.

## Implementation sketch

| Engine expectation | Product meaning |
|--------------------|-----------------|
| PSS 0 | No phase complete |
| PSS 30 | Phase 1 complete (identity + device minimum — align with API) |
| PSS 40 | Phase 2+ complete (full KYC / AML as defined in PSS service) |

**Do not** add layer points in the engine separately if they duplicate phase totals — avoid double counting.

## Traceability

- [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md)

---

*2026-04-07 — closes FLOW-P11 open Q2.*
