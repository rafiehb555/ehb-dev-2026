# DMO Design Start (Refilling + Affiliate + Notifications + Penalty)

This document starts the DMO design phase for the self-running economy layer.

---

## 1) Design Goals

- Build operator-first control surfaces for trust, earnings, alerts, and discipline.
- Keep every screen decision-oriented: see risk fast, act fast, audit fast.
- Ensure all modules follow one consistent DMO visual language.

---

## 2) New DMO Screens (Phase Design Scope)

### A) Refilling Control Center (`/dmo/refilling`)

Sections:
- KPI strip: Active, Warning (7d), Expired, Completed.
- Refill queue table.
- Timeline panel: upcoming expiries by day/week.
- Action drawer for refill case detail.

Table columns:
- Entity/User
- Refill Type (PSS/CRB/Industry/STL)
- Due Date
- Days Left
- Status
- STL Impact
- Actions

UI states:
- Active = emerald
- Warning = amber
- Expired = rose
- Completed = cyan

---

### B) Affiliate Command Dashboard (`/dmo/affiliate`)

Sections:
- KPI strip: total referrals, active referrals, monthly payout, pending payout.
- Earnings breakdown cards: registration, certification, orders, franchise.
- Referral network table.
- Opportunity panel (AI suggestions).

Table columns:
- Referrer
- Level
- Referred User
- Source
- Conversion State
- Earnings
- Last Activity

---

### C) Smart Notification Center (`/dmo/notifications`)

Sections:
- Priority buckets: Critical, Action Required, Informational.
- Notification feed with filters.
- AI "next action" rail.
- Channel delivery metrics (App/Email/SMS).

Feed columns:
- Event
- Priority
- Source Module
- Recipient
- Channel
- Sent At
- Status

---

### D) Penalty Control Panel (`/dmo/penalties`)

Sections:
- KPI strip: total penalties, open disputes, collected amount, blocked accounts.
- Violation queue.
- Penalty decision drawer.
- Escalation flow tracker (System -> Franchise -> Corporate).

Table columns:
- Violation ID
- Subject
- Violation Type
- Source
- Severity
- Proposed Penalty
- STL Impact
- Status

Penalty tiers:
- Minor: 10-99
- Moderate: 100-999
- Major: 1000+

---

## 3) Shared DMO UI Components

- `SystemKpiStrip`
- `StatusFilterBar`
- `ActionableTable`
- `CaseDetailDrawer`
- `RiskMeter`
- `StlImpactBadge`
- `SlaCountdownBadge`
- `DecisionActionBar`
- `AuditTimeline`

All new module pages should reuse these to keep consistency and speed.

---

## 4) Navigation Update (Sidebar)

Add DMO sidebar items:
- Refilling
- Affiliate
- Notifications (DMO scope)
- Penalties

Proposed routes:
- `/dmo/refilling`
- `/dmo/affiliate`
- `/dmo/notifications`
- `/dmo/penalties`

---

## 5) API-to-UI Mapping (Design-Level)

### Refilling
- `GET /api/refilling/queue`
- `POST /api/refilling/remind`
- `POST /api/refilling/force-status`

### Affiliate
- `GET /api/affiliate/overview`
- `GET /api/affiliate/referrals`
- `GET /api/affiliate/payouts`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications/send`
- `PATCH /api/notifications/:id/read`

### Penalties
- `GET /api/penalties`
- `POST /api/penalties/apply`
- `POST /api/penalties/escalate`
- `POST /api/penalties/waive`

---

## 6) Interaction Rules (UX)

- No full-page reload for core actions.
- Every mutation shows toast + inline status update.
- Drawer-based workflows for review/decision.
- All decisions must show STL impact preview before confirm.

---

## 7) Cursor-Ready Implementation Prompt

```txt
Act as a senior product UI engineer.

Implement DMO design layer for:
- /dmo/refilling
- /dmo/affiliate
- /dmo/notifications
- /dmo/penalties

Requirements:
1) Reuse DMO visual system (cards, gradients, table style, drawer pattern).
2) Add KPI strips + filter bars + actionable tables.
3) Add detail drawers with decision actions and audit timeline.
4) Add no-reload interactions (fetch + optimistic update where safe).
5) Add loading, empty, and error states for every section.

Focus on control-center UX quality.
```

