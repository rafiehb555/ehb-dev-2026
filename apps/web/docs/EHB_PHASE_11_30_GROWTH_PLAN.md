# EHB Phase 11–30 — Growth Plan (Complete)
**Status: In Progress | Readiness: 45% → Target: 100%**
**Focus: AI Integration · Marketplace Expansion · DMO Operational States**

---

## Overview

Phase 11–30 connects EHB's core systems (PSS, CRB, Wallet, STL) with intelligent automation.
Three parallel tracks run together:
1. **AI Fraud Detection** — smart risk triage across DMO
2. **AI Recommendations** — personalized suggestions for all users
3. **GoSellr + DMO Integration** — marketplace feeds into trust workflows

---

## Track 1 — AI Fraud Detection (Phase 11–15)

### Goal
Every application, transaction, and user action passes through an AI risk check before DMO sees it.

### Build Order

#### Phase 11 — Fraud Signal Collection
- [ ] Collect fraud signals from PSS cases: failed verifications, rapid submissions, location mismatches
- [ ] Store signals in `fraud_signals` table: `entity_id`, `signal_type`, `weight`, `created_at`
- [ ] API: `POST /api/fraud/signal` — PSS/CRB/STL write signals here
- [ ] Admin view: `/dmo/fraud` — live signal feed

#### Phase 12 — Risk Score Engine
- [ ] Build `lib/fraud/riskEngine.ts`
- [ ] Risk formula:
  ```
  RiskScore =
    (failed_verifications × 0.3) +
    (rapid_submissions × 0.25) +
    (location_mismatch × 0.2) +
    (incomplete_profile × 0.15) +
    (low_crb_badge × 0.1)
  ```
- [ ] Score range: 0–100 (0=safe, 100=high risk)
- [ ] Risk tiers: LOW (0–30), MEDIUM (31–60), HIGH (61–80), CRITICAL (81–100)
- [ ] API: `GET /api/fraud/score/:entityId`

#### Phase 13 — DMO Fraud Queue
- [ ] Auto-flag applications with riskScore > 60 → DMO fraud review queue
- [ ] DMO route: `/dmo/fraud` — shows flagged items with risk breakdown
- [ ] One-click actions: Approve / Reject / Escalate
- [ ] Auto-block: riskScore > 80 → application auto-paused, user notified

#### Phase 14 — Real-Time Fraud Alerts
- [ ] Alert system: high-risk entity → DMO notification + email to admin
- [ ] Notification type: `FRAUD_ALERT` with entity info and risk score
- [ ] Alert log in `audit_logs` table

#### Phase 15 — Fraud Analytics Dashboard
- [ ] DMO Analytics card: fraud signals per day, risk distribution chart
- [ ] Top flagged entities list
- [ ] False positive tracking (admin marks resolved)
- [ ] Weekly fraud report export (CSV)

---

## Track 2 — AI Recommendations (Phase 16–22)

### Goal
Every user sees personalized job, service, and marketplace suggestions based on their profile and behavior.

### Build Order

#### Phase 16 — User Behavior Tracking
- [ ] Track events: page_view, search, click, favourite, order, apply
- [ ] Store in `user_events` table: `user_id`, `event_type`, `entity_id`, `entity_type`, `timestamp`
- [ ] API: `POST /api/events/track` — silent background calls from frontend

#### Phase 17 — Recommendation Engine Core
- [ ] Build `lib/ai/recommendationEngine.ts`
- [ ] Score formula per item:
  ```
  Score =
    (skillMatch × 0.35) +
    (industryMatch × 0.25) +
    (locationMatch × 0.2) +
    (behaviourMatch × 0.15) +
    (priceFit × 0.05)
  ```
- [ ] Return top 10 ranked results per user
- [ ] API: `GET /api/ai/recommendations?userId=&type=jobs|services|products`

#### Phase 18 — Dashboard AI Insight Cards
- [ ] Component: `AIInsightCard` — message + CTA button
- [ ] Show on: `/dashboard`, `/industry/[slug]`, `/home`
- [ ] Example messages:
  - "IT services demand +22% in Rawalpindi this week"
  - "3 new jobs match your skills"
  - "Your delivery service has 12 new leads"
- [ ] API: `GET /api/ai/insights?userId=`

#### Phase 19 — Industry-Specific Trending
- [ ] Per-industry trending: top services, top providers, high-demand jobs
- [ ] Update every 6 hours (cron job or on-demand)
- [ ] Show on industry landing pages
- [ ] API: `GET /api/ai/trending?industry=it`

#### Phase 20 — Smart Search Enhancement
- [ ] Add AI suggestions to search: autocomplete + "People also searched"
- [ ] Keyword → industry mapping (e.g. "doctor" → health, "website" → IT)
- [ ] Search quality score: track which results are clicked
- [ ] API: `GET /api/search/suggest?q=`

#### Phase 21 — Provider Matching (Buyer Side)
- [ ] When client posts a need → AI suggests top 5 matching providers
- [ ] Score based on: skill match, CRB badge, rating, location, response time
- [ ] Auto-notify matched providers (notification + email)
- [ ] API: `POST /api/ai/match` — input: job/service request, output: ranked providers

#### Phase 22 — Recommendation Quality Feedback
- [ ] "Was this helpful?" thumbs on AI cards
- [ ] Track acceptance rate per recommendation type
- [ ] Admin analytics: recommendation CTR, acceptance rate
- [ ] Use feedback to improve score weights

---

## Track 3 — GoSellr + DMO Integration (Phase 23–30)

### Goal
GoSellr marketplace operations feed into DMO review and trust workflows automatically.

### Build Order

#### Phase 23 — GoSellr Trust Scoring
- [ ] Every product on GoSellr gets a TrustScore from STL + CRB + reviews
- [ ] TrustScore shows on product cards (Bronze/Silver/Gold badge)
- [ ] Products with TrustScore < 30 flagged for DMO review
- [ ] API: `GET /api/gosellr/trust/:productId`

#### Phase 24 — Seller Onboarding via DMO
- [ ] New seller registration → DMO application created automatically
- [ ] Seller cannot list products until DMO approves
- [ ] DMO route: `/dmo/applications` — filter by type "SELLER_ONBOARDING"
- [ ] Fast-track: CRB Gold/Platinum sellers auto-approved

#### Phase 25 — Order Review Queue
- [ ] Flagged orders (high value, new seller, cross-border) → DMO review queue
- [ ] Threshold: orders > $500 OR new seller's first 5 orders → manual review
- [ ] One-click: Approve / Hold / Investigate
- [ ] Auto-release after 24hrs if no action

#### Phase 26 — Complaint & Moderation System
- [ ] Buyer complaint → DMO moderation queue
- [ ] Complaint types: FAKE_PRODUCT, NOT_DELIVERED, FRAUD, QUALITY_ISSUE
- [ ] 3-step resolution: AI Review → Human Review → Final Decision (72hrs)
- [ ] API: `POST /api/gosellr/complaint`
- [ ] Routes: `/dmo/moderation` — complaint queue + resolution tools

#### Phase 27 — Anti-Fraud Review Scoring
- [ ] Review fraud detection: fake reviews, self-reviews, bot patterns
- [ ] AI auto-flag suspicious review patterns
- [ ] Flagged reviews → DMO review queue
- [ ] Penalty: fake review = CRB score deduction + warning

#### Phase 28 — Escrow-Aware Decision Support
- [ ] Escrow hold: payment held until buyer confirms delivery OR 7-day auto-release
- [ ] DMO can extend escrow hold if dispute active
- [ ] Escrow status visible in DMO: `/dmo/applications` → order detail
- [ ] API: `POST /api/gosellr/escrow/hold|release|extend`

#### Phase 29 — Marketplace DMO Analytics
- [ ] DMO analytics card: orders/day, complaints/day, fraud alerts, pending reviews
- [ ] Trend charts: 7-day, 30-day
- [ ] Export report (CSV/PDF)
- [ ] Route: `/dmo/analytics`

#### Phase 30 — Shared Queue Unification
- [ ] Single DMO queue showing ALL pending actions:
  - Applications (franchise, service, seller)
  - Fraud alerts
  - Order reviews
  - Complaints
  - Compliance expirations
- [ ] Priority sorting: CRITICAL → HIGH → MEDIUM → LOW
- [ ] Assignable to DMO operators
- [ ] Route: `/dmo/queue` — unified operations center

---

## Remaining Work Summary

| Track | Phases | Status | Estimated Tasks |
|-------|--------|--------|-----------------|
| AI Fraud Detection | 11–15 | 0% done | 18 tasks |
| AI Recommendations | 16–22 | 20% done | 22 tasks |
| GoSellr + DMO | 23–30 | 10% done | 26 tasks |

**Total remaining for Phase 11–30: ~55 tasks**

---

## Phase 11–30 Completion Criteria

- [ ] Fraud signals collected from all modules
- [ ] AI risk score working for every entity
- [ ] DMO fraud queue operational
- [ ] Recommendation engine returning personalized results
- [ ] AI insight cards on dashboard and industry pages
- [ ] GoSellr seller onboarding via DMO
- [ ] Complaint system active with 72hr resolution
- [ ] Unified DMO queue showing all pending items
- [ ] Analytics dashboard with all KPIs visible

---

*Owner: Rafi | Next action: Start Phase 11 — Fraud Signal Collection*
