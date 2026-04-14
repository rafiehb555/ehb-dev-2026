# SPRINT PLAN — EHB Technologies v1 Launch

**Duration:** 4 weeks (2026-04-14 → 2026-05-12)  
**Goal:** Build Phase-1 foundation for PSS, STL, DMO, Wallet, and GoSellr (6 core industries)  
**Team:** 1 backend dev, 1 frontend dev, 1 AI specialist, 1 DevOps engineer  

---

## Sprint 0: Pre-Development (Week 0 — Complete)

**Status:** DONE ✓

### Checklist
- [x] Environment setup (Node 20, MongoDB 7, Next.js 14, all ports verified)
- [x] Codebase 30% audit (monorepo structure, git history, .env templates)
- [x] Skills created (.claude/skills/, populated with PSS/STL/DMO/Wallet templates)
- [x] .md files created (CLAUDE.md, AGENTS.md, DEVELOPMENT-STANDARDS.md, SPRINT-PLAN.md, INTEGRATION-MAP.md, 4 feature guides)
- [x] Gold-master STL test suite validated (58/58 pass)
- [x] Backup strategy established (backup/ gitignored, pre-change snapshots mandatory)

---

## Sprint 1: PSS Database Models + Auth Routes + Register/Login (Week 1)

**Goal:** Build user registration, authentication, and PSS foundation.  
**Points:** 40  
**Days:** Mon-Fri

### Daily Tasks

| Day | AI-Assigned | Dev-Assigned | Status | Notes |
|-----|------------|-------------|--------|-------|
| **Mon 04/15** | Design PSS collection schema | Scaffold Express routes | Pending | models/PSS*.js, validation/* |
| | Mongoose PSS models (users, pss_verifications, pss_alerts) | Create JWT auth middleware | Pending | Extract from stlService.js |
| **Tue 04/16** | API endpoint list for PSS (GET/POST/PATCH) | Frontend pages: RegisterForm, LoginForm | Pending | Zod schemas, error handling |
| | Input validation (Zod, 50+ test cases) | TypeScript strict mode setup | Pending | Import paths, types/pss.ts |
| **Wed 04/17** | Auth route tests (register, login, token refresh) | Dashboard skeleton (authenticated) | Pending | /auth, /register, /login routes |
| | Mongo connection recovery + /health endpoint | Shadcn/ui button + card components | Pending | Use @/components/ui/*, no Card.tsx |
| **Thu 04/18** | Password hashing + salting (bcrypt) | Email verification flow UI | Pending | Resend SDK integration |
| | 2FA skeleton (QR code generation) | Form validation feedback | Pending | Real-time error messages |
| **Fri 04/19** | Integration test: register → login → dashboard | Code review + bug fixes | Pending | GitHub branch: feature/pss-auth |
| | Backup sprint 1 work | Commit PR (feat(pss): auth v1) | Pending | Test coverage >80% |

### Deliverables
- [ ] `services/api/stl-replit/models/User.js` (email, password hash, phone, role, status)
- [ ] `services/api/stl-replit/models/PSS_Verification.js` (type, doc_url, status, result_json, review_notes)
- [ ] `services/api/stl-replit/validation/authSchemas.js` (register, login, refresh Zod schemas)
- [ ] `services/api/stl-replit/routes/authRoutes.js` (POST /register, POST /login, POST /refresh, GET /verify-email)
- [ ] `apps/web/app/auth/register/page.tsx` + `apps/web/app/auth/login/page.tsx`
- [ ] `apps/web/components/auth/RegisterForm.tsx` + `apps/web/components/auth/LoginForm.tsx`
- [ ] Auth middleware + JWT validation helper
- [ ] `.env.example` with AUTH_SECRET, DB_URI, JWT_EXPIRES

**Testing:** Unit tests (auth), integration tests (register flow), E2E (login → dashboard)  
**PR Acceptance:** >80% coverage, STL tests still 58/58 pass, TypeScript strict mode

---

## Sprint 2: PSS Verification Flows + Admin Review Panel (Week 2)

**Goal:** Implement all 6 Phase-1 PSS verification types + admin review.  
**Points:** 50  
**Days:** Mon-Fri

### Daily Tasks

| Day | AI-Assigned | Dev-Assigned | Status | Notes |
|-----|------------|-------------|--------|-------|
| **Mon 04/22** | PSS verification state machine (pending→approved/rejected) | Admin dashboard skeleton | Pending | 6 types: ID, Liveness, FaceMatch, Address, AML, Device |
| | OpenAI Vision API integration (ID document parsing) | Role-based access control (admin/user) | Pending | Extract text/DOB/expiry |
| **Tue 04/23** | Liveness detection (Twilio/Stripe integration test) | Verification card component (photo upload UI) | Pending | Real-time video capture |
| | Face matching algorithm (similarity >85% threshold) | Progress tracker (step 1-6 of PSS) | Pending | Visual indicator + time estimate |
| **Wed 04/24** | Address verification (GeoCoding API + AML check) | Document review panel (admin filters by status) | Pending | Flag suspicious addresses |
| | Fraud alert system (trigger rules + logging) | Review actions: approve/reject/request-resubmit | Pending | Audit trail in pss_alerts collection |
| **Thu 04/25** | Device fingerprinting (TrustDevice SDK) | Verification result email + webhook | Pending | Notify user of status change |
| | Scoring integration (PSS result → +40 STL points) | SMS notification option | Pending | Opt-in flow |
| **Fri 04/26** | PSS tests (100+ cases, edge cases) | E2E: user flow from ID upload to approval | Pending | GitHub branch: feature/pss-verification |
| | Backup sprint 2 work | Code review + PR merge | Pending | All 6 types working, no gaps |

### Deliverables
- [ ] `services/api/stl-replit/services/pssService.js` (verification orchestration)
- [ ] `services/api/stl-replit/routes/pssRoutes.js` (POST /verify/id, /verify/liveness, etc.)
- [ ] OpenAI Vision adapter + Liveness detection module (Twilio/Stripe)
- [ ] Face matching service (python-face-recognition OR Clarifai)
- [ ] `apps/web/app/pss/[type]/page.tsx` (6 pages: id, liveness, face-match, address, aml, device)
- [ ] `apps/web/components/pss/VerificationCard.tsx` + `VerificationReview.tsx` + `AdminReviewPanel.tsx`
- [ ] Admin dashboard: `/admin/pss/queue` (sortable, filterable)
- [ ] Email + SMS notification templates
- [ ] Test suite (100+ cases, all 6 flows, edge cases)

**Testing:** Unit (fraud detection), Integration (OpenAI + liveness), E2E (full PSS journey)  
**PR Acceptance:** All 6 types working, <2s response time, audit trail complete

---

## Sprint 3: STL 10-Level System + Score Calculation + Dashboard (Week 3)

**Goal:** Implement STL scoring, dashboard, and admin controls.  
**Points:** 45  
**Days:** Mon-Fri

### Daily Tasks

| Day | AI-Assigned | Dev-Assigned | Status | Notes |
|-----|------------|-------------|--------|-------|
| **Mon 04/29** | STL 10-level migration (feature flag, backward compat) | STL data model (stl_level, points, earned_by) | Pending | L0→L9 (10 levels), keep SQL→STL rename |
| | Score calculation algorithm (50+ inputs) | Seed 10-level thresholds + point mappings | Pending | See STL-DEVELOPMENT.md formula |
| **Tue 04/30** | PSS→STL point mapper (+40 ID, +8 liveness, +7 face, etc.) | Dashboard skeleton (L0 → L9 visual ladder) | Pending | Glassmorphism cards, progress bar |
| | CRB→STL point mapper (+15 per skill) | Level badge component (icon + color gradient) | Pending | L0=gray, L9=gold, L9→L10=platinum |
| **Wed 05/01** | Historical score tracking (snapshots per day) | Score details page (earnings breakdown) | Pending | MongoDB TTL index 90-day retention |
| | Recalculation trigger (PSS approval, CRB verify, complaint) | Trust indicators (icons: verified, certified, complaint-free) | Pending | Layered icons, tooltips |
| **Thu 05/02** | Gold-master test validation (58/58 pass still) | Admin panel: manual override + recalc button | Pending | Audit log each manual change |
| | Fraud alert on L7+ jumps | Dispute resolution (tie STL to complaint) | Pending | Require evidence + appeal |
| **Fri 05/03** | E2E: PSS approval → STL bump → dashboard reflects | Code review + merge | Pending | GitHub branch: feature/stl-10-level |
| | Backup sprint 3 work | Performance test (1M users, <100ms score fetch) | Pending | Caching strategy, Redis if needed |

### Deliverables
- [ ] Migration script: 9-level → 10-level (with rollback)
- [ ] `services/api/stl-replit/services/stlService.js` (updated with 10-level formula)
- [ ] Point mapper for PSS + CRB integrations
- [ ] `apps/web/app/stl/dashboard/page.tsx` (user STL view)
- [ ] `apps/web/components/stl/LevelCard.tsx` + `LevelLadder.tsx` + `ScoreBreakdown.tsx`
- [ ] Admin page: `/admin/stl/override` (manual adjustment)
- [ ] Historical snapshot collection (TTL index, 90-day)
- [ ] Test suite (all 10 levels, transitions, edge cases, 58 gold-master tests)

**Testing:** Unit (score calc), Integration (PSS→STL), Gold-master (58/58 ✓), E2E (dashboard reflects)  
**PR Acceptance:** STL tests 58/58 still pass, <100ms fetch, feature flag toggles cleanly

---

## Sprint 4: STL Decay/Refill/Upgrade + Admin Panel (Week 4)

**Goal:** Complete STL lifecycle + admin tooling + launch readiness.  
**Points:** 40  
**Days:** Mon-Fri

### Daily Tasks

| Day | AI-Assigned | Dev-Assigned | Status | Notes |
|-----|------------|-------------|--------|-------|
| **Mon 05/06** | Decay algorithm (30/60/90 day tiers) | Admin user management (suspend/restore/reset) | Pending | L7+ decay faster, lose 1-5 pts/day |
| | Refill mechanics (earn points via orders/skills) | Refill simulator (sandbox testing tool) | Pending | Orders=+2, CRB skill=+3, perfect week=+5 |
| **Tue 05/07** | Upgrade/downgrade triggers (threshold crossing) | Dashboard upgrade guide (path to L8/L9) | Pending | "You need 250 pts" + action buttons |
| | Complaint penalty (-15 pts, requires proof) | History timeline (all level changes + reason) | Pending | Immutable audit trail |
| **Wed 05/08** | Batch decay job (scheduled, MongoDB aggregation) | Admin approval queue (L8+ changes, complaints) | Pending | Cron job runs daily 02:00 UTC |
| | Performance opt (index on user_id + date) | Notification on decay/upgrade/downgrade | Pending | Email + in-app toast |
| **Thu 05/09** | Rollback mechanism (restore snapshot from date X) | DMO integration handoff (L8 approval gates) | Pending | Full audit trail, admins can revert |
| | Edge cases: simultaneous events, account deletion | Integration tests (all STL workflows end-to-end) | Pending | Orphan handling, cascade deletes |
| **Fri 05/10** | Final validation (all edge cases passed, stress test) | Code review + staging deployment prep | Pending | GitHub branch: feature/stl-lifecycle |
| | Backup sprint 4 work, hand-off docs | Live checklist (DNS, SSL, secrets, health checks) | Pending | Go-live 2026-05-12 morning |

### Deliverables
- [ ] Decay algorithm + scheduled job (`services/api/stl-replit/jobs/decayJob.js`)
- [ ] Refill calculator (weighted by order count, skill count, complaint-free days)
- [ ] Upgrade/downgrade state machine + thresholds
- [ ] `apps/web/app/stl/history/page.tsx` (timeline view)
- [ ] `apps/web/components/stl/UpgradeGuide.tsx` (visual roadmap)
- [ ] Admin tools: `/admin/stl/decay-simulator`, `/admin/stl/refill-test`, `/admin/stl/rollback`
- [ ] Scheduled job test suite (30/60/90 day scenarios, complaint penalties)
- [ ] Integration with DMO (L8+ approval gates)
- [ ] Performance benchmarks (1M users, batch ops <5s)
- [ ] Go-live checklist (secrets, monitoring, alerts)

**Testing:** Unit (decay, refill, upgrade), Integration (all STL workflows), Load (1M users)  
**PR Acceptance:** All edge cases pass, <5s batch decay, DMO gates work, go-live ready

---

## Status Tracking Format

### Weekly Standup Template
```markdown
## Week N Standup — (Date Range)

### Completions
- [x] Sprint N Task 1
- [x] Sprint N Task 2

### In Progress
- [ ] Sprint N Task 3 (60% done, blocker: X)
- [ ] Sprint N Task 4 (30% done)

### Blockers
- **Blocker 1:** Description → Owner → ETA
- **Blocker 2:** Description → Owner → ETA

### Next Week Goals
- Sprint N+1 Task A
- Sprint N+1 Task B

### Notes
- Team observation 1
- Team observation 2
```

### Task Status Codes
- `Pending` = Not started
- `In Progress` = Active work, <75% done
- `Testing` = Code written, in QA
- `Review` = Awaiting code review
- `Blocked` = Waiting on external (API, third-party, another task)
- `Done` = Merged, tested, documented
- `Deferred` = Moved to next sprint (with reason)

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| OpenAI Vision API rate limit | High | Cache results, batch jobs, fallback to manual review |
| MongoDB connection drops | High | Retry logic, health checks, MongoDB Atlas failover |
| STL gold-master test regression | Critical | Run 58/58 after every change, pre-commit hook |
| Liveness detection timeout | Medium | 30-second max, retry prompt, fallback to manual review |
| Face matching false positives | High | 85% threshold tuning, manual review queue, appeal process |
| Team member unavailable | Medium | Pair programming, runbooks in /docs/, backup assignments |

---

## Definition of Done (All Sprints)

A task is DONE when:
1. Code written + tests pass (unit + integration)
2. Code review approved by peer
3. Merged to `main` branch
4. Deployed to staging + smoke tests pass
5. No new TypeScript errors
6. Gold-master tests still 58/58 pass (STL tasks)
7. Documentation updated (`docs/`, inline comments)
8. Backup created before destructive changes
9. Git commit message follows format: `feat(module): short summary`
10. Performance benchmarks met (if applicable)

---

## Communication Plan

- **Daily:** Standup at 10:00 AM (15 min, async Slack updates)
- **Weekly:** Sprint review Friday 4:00 PM (30 min, demos + retro)
- **Blockers:** Escalate to CTO immediately (Slack @channel)
- **Docs:** Update SPRINT-PLAN.md + ehb-status.json after every sprint completion

---

*EHB Technologies (Pvt.) Ltd. — Sprint Plan v1 — 2026-04-14*
