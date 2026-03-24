# EHB PSS Phase 3 (Intelligence Layer)

Implemented capabilities:

- Risk engine API: `POST /api/pss/risk/calculate`
  - Dynamic score based on identity, AML flags, device reuse, behavior.
  - Level mapping: low/medium/high.
- Fraud detection API: `POST /api/pss/fraud/check`
  - Status: `SAFE`, `SUSPICIOUS`, `BLOCKED`.
  - Reasons include device reuse, failed attempts, AML flags.
- Refill alert intelligence in case list/detail:
  - `NORMAL`, `WARNING` (<=7 days), `EXPIRED`.
- Verification workflow integration:
  - step decisions recalculate and persist risk score/level.
  - high-risk trace emits manual-review audit action.
- Decision guard:
  - high-risk case final approval is blocked (manual-review required).

UI additions:
- Dashboard high-risk case widget.
- Dashboard refill alert widget.
- Drawer risk meter, fraud status, and refill alert indicator.

