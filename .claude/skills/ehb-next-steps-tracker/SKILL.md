---
name: ehb-next-steps-tracker
description: >
  EHB Next Steps Tracker & Phase Auto-Manager. ALWAYS use this skill at the END of every
  conversation response to show the user what to do next. Also use when asked "next kya karna hai",
  "priority kya hai", "kahan se start karein", "phase status", "what's pending", or any question
  about project progress, next priorities, or task ordering. This skill ensures the founder
  (who is non-technical) always knows exactly what the next 3-5 critical tasks are, what phase
  the project is in, and what suggestions the AI has for improvement. Trigger this skill
  proactively — don't wait for the user to ask. Every response should end with a clear
  "NEXT STEPS" section. Also use when planning sprints, reviewing progress, or deciding
  what to build next.
---

# EHB Next Steps Tracker & Phase Auto-Manager

> **Version:** 1.0
> **Last updated:** 2026-04-14
> **Owner:** EHB Technologies (Pvt.) Ltd.
> **Purpose:** Ensure the founder ALWAYS knows what's next, what's pending, and what phase
> the project is in. Every conversation response should end with clear next steps.

---

## §1 — Why This Skill Exists

The EHB founder is non-technical ("man technical nai hou or na he programer hou"). They rely
entirely on AI agents and 2-3 junior developers to build the platform. Without a clear
"what's next" at the end of every interaction, progress stalls because:

- The founder doesn't know which task to prioritize
- Junior devs don't know what to work on
- AI agents repeat work or miss critical dependencies
- Phase transitions get delayed

This skill solves that by making "NEXT STEPS" a mandatory closing section of every response.

---

## §2 — The EHB Project Phases

Always determine which phase the project is currently in before suggesting next steps.

### Phase Map (40-Week Plan)

```
PHASE 1: Core Trust Engine (Weeks 1-8)
  → PSS (Identity L1-L10)
  → STL (3-Dimensional HYBRID Engine)
  → DMO (7 Governance Engines)
  → Wallet (Escrow + Lock + Split)
  STATUS: Planning 100% complete. Development NOT started yet.
  CURRENT: ← WE ARE HERE (as of 2026-04-14)

PHASE 2: Marketplace & Services (Weeks 9-16)
  → GoSellr (E-commerce marketplace)
  → OLS (Legal services)
  → WMS (Medical services)
  → HPS/OBS (Education)
  STATUS: Planning complete. Development NOT started.

PHASE 3: Franchise & Mobile (Weeks 17-24)
  → Franchise Dashboard (4 levels)
  → Mobile Apps (React Native: Buyer, Seller, Rider)
  → CRB Inspector App
  STATUS: Planning complete. Development NOT started.

PHASE 4: AI Layer & Expansion (Weeks 25-32)
  → AI Helpline (Urdu + English chatbot)
  → Fraud Detection AI
  → Recommendation Engine
  → Delivery Optimization AI
  STATUS: Architecture planned. Development NOT started.

PHASE 5: Blockchain & Global Scale (Weeks 33-40)
  → EHBGC Token (BSC → Polkadot)
  → On-chain STL proofs
  → Multi-country deployment
  → 26 remaining industries
  STATUS: Architecture planned. Development NOT started.
```

### How to Determine Current Phase

Read these files to determine current status:
1. `ehb-status.json` (if exists) — real-time build health
2. `ehb-info/EHB-MASTER-INFO.md` — version + section count
3. `apps/web/app/development/page.tsx` — module progress
4. Recent git log — what was last worked on

---

## §3 — The "NEXT STEPS" Block Format

At the END of every response, include this block. Use Roman Urdu + English mix
(matching founder's communication style).

### Template

```
═══════════════════════════════════════════════════
📋 NEXT STEPS — [Current Phase Name]
═══════════════════════════════════════════════════

🔴 URGENT (Abhi karna zaroori hai):
1. [Task] — [Why it's urgent] — [Estimated time]

🟡 IMPORTANT (Jaldi karna chahiye):
2. [Task] — [Why it matters] — [Estimated time]
3. [Task] — [Why it matters] — [Estimated time]

🟢 SUGGESTED (Improvement ka mauka):
4. [Task] — [What it improves] — [Estimated time]
5. [Task] — [What it improves] — [Estimated time]

💡 AI SUGGESTION:
[One proactive suggestion that would improve the project — could be
a new feature idea, architecture improvement, or automation opportunity]

📊 PHASE PROGRESS: [Phase X] — [X]% complete
═══════════════════════════════════════════════════
```

### Rules for Next Steps

1. **Maximum 5 items** — founder gets overwhelmed by long lists
2. **Always in priority order** — most critical first
3. **Include time estimates** — "~2 hours", "~1 day", "~1 week"
4. **Include WHY** — not just what, but why this matters
5. **Use Roman Urdu** for explanations (founder's preferred language)
6. **Be specific** — not "build PSS" but "PSS-L1 to L4 verification API endpoints banayein"
7. **Consider dependencies** — don't suggest task B if task A isn't done yet
8. **One AI suggestion** — always include one proactive improvement idea

---

## §4 — Current Priority Matrix (As of 2026-04-14)

This is the CURRENT state. Update this section as the project progresses.

### Documentation Status (100% COMPLETE)
```
✅ EHB-MASTER-INFO.md — v4.1, 91 sections
✅ EHB-MASTER-DEVELOPMENT-PLAN.md — Updated with 3D trust architecture
✅ 12 AI development skills — All created
✅ 8 auto-working .md files — All created
✅ USER-FLOWS-COMPLETE.md — 883 lines, all 7 user types
✅ EHB-TRUST-FLOW-DIAGRAM.html — Interactive visualization
✅ Multi-Layer Trust Architecture — §84-§91 saved
✅ HYBRID Formula — Confirmed and documented
✅ Role-Based Formulas — All 7 roles defined
```

### Development Status (~30% Built)
```
✅ STL Formula — Protected by 58 gold-master tests
✅ Basic Auth — JWT implemented
✅ Partial PSS Interface — Started
✅ Partial GoSellr UI — Started
✅ MongoDB Connection — Configured
✅ Next.js 14 Setup — Running on port 3000
✅ Express API — Running on port 5000
✅ AI Backend — Running on port 8080

❌ PSS 10-Level System — NOT built
❌ CRB Inspection System — NOT built
❌ DMO 7 Engines — NOT built
❌ HYBRID STL Engine — NOT built (old flat formula exists)
❌ Wallet Escrow — NOT built
❌ GoSellr Full Marketplace — NOT built
❌ Franchise Dashboard — NOT built
❌ Admin Panel — NOT built
❌ Mobile Apps — NOT started
❌ AI Modules — NOT started
❌ Blockchain — NOT started
```

### What Should Be Built FIRST (Phase 1 Priority Order)

```
WEEK 1-2: PSS System
  → PSS verification API (27 features)
  → PSS internal L1-L10 level calculation
  → PSS dashboard page
  → PSS admin panel
  WHY FIRST: Everything depends on identity verification.
  No user can do anything without PSS.

WEEK 3-4: STL HYBRID Engine
  → Upgrade from flat formula to 3-dimensional
  → Implement HYBRID calculation (threshold + weighted + cap)
  → Role-based formula routing
  → STL dashboard with 3D breakdown
  → STL simulator page
  WHY SECOND: STL gates every feature. Without proper STL,
  no selling, no buying, no franchise.

WEEK 5-6: DMO Governance
  → 7 engine framework
  → Decision Engine (approve/reject)
  → Risk Engine (fraud detection)
  → Trust Engine (DMO L1-L10 scoring)
  → DMO dashboard
  WHY THIRD: DMO monitors everything. Orders, complaints,
  compliance — all need DMO running.

WEEK 7-8: Wallet System
  → Escrow (2-phase: soft 24h + full 7d)
  → EHBGC lock mechanism
  → Revenue split (50/30/15/3/2)
  → Wallet dashboard
  → Refill cycle management
  WHY FOURTH: No money movement without wallet.
  Sellers can't get paid, franchises can't earn.
```

---

## §5 — Suggestion Engine

When making AI suggestions, consider these categories:

### Category 1: Architecture Improvements
- Database indexing optimizations
- Caching strategies (Redis for STL lookups)
- API rate limiting
- WebSocket for real-time updates

### Category 2: Automation Opportunities
- Auto-backup before destructive changes
- Auto-test on every API change
- Auto-documentation generation
- CI/CD pipeline setup

### Category 3: Feature Enhancements
- Dark/light theme toggle early (4-theme system)
- Mobile-responsive from day 1
- Accessibility (WCAG 2.1 AA)
- Internationalization framework

### Category 4: Risk Mitigation
- STL formula backup before any modification
- Database migration scripts
- Rollback procedures
- Health check endpoints

---

## §6 — Phase Transition Checklist

Before moving from one phase to the next, verify:

```
□ All APIs from current phase tested (unit + integration)
□ All frontend pages from current phase functional
□ Database collections created with proper indexes
□ 80%+ test coverage on critical paths
□ STL formula tests still passing (58/58)
□ No breaking changes to existing functionality
□ Documentation updated (Master Info + relevant .md files)
□ ehb-status.json refreshed
□ Backup created in backup/ folder
□ Founder demo completed and approved
```

---

## §7 — How to Use This Skill

This skill should be triggered in TWO ways:

### Automatic (Every Response)
At the end of every response about EHB work, append the NEXT STEPS block.
Even if the user didn't ask for it — ALWAYS show what's next.

### On Request
When the user asks:
- "next kya hai?" → Full next steps with all 5 items
- "priority?" → Just the top 3 urgent items
- "phase status?" → Phase progress + what's left
- "suggestion?" → AI improvement suggestions
- "kahan se start karein?" → Dependency-ordered task list

---

## §8 — Keeping This Skill Updated

After every major milestone:
1. Update §4 (Current Priority Matrix) with new status
2. Move completed items to ✅
3. Add new items discovered during development
4. Update phase progress percentage
5. Refresh time estimates based on actual velocity

This skill is a LIVING DOCUMENT — it should always reflect the CURRENT state of the project.

---

*EHB Technologies (Pvt.) Ltd. — Next Steps Tracker v1.0 · 2026-04-14*
