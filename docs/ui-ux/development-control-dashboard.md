## EHB DEVELOPMENT CONTROL DASHBOARD (DEMO SPEC)

This page is the **EHB Project Command Center** for demos and internal planning. It shows platform structure, development status, and how core systems connect, so investors, developers, and AI agents can all understand the build.

Route (demo): `/development`

---

## 1️⃣ TOP-LEVEL PAGE LAYOUT

- **Header**
  - Title: `EHB Development Center`
  - Subtitle: `Track EHB Platform Development`
  - Global status summary (overall % complete, active modules, warnings).

- **Main Sections**

```text
1. Platform Structure
2. Development Progress
3. System Flow Monitor
4. Shared Tools Map
5. AI Integration Map
6. Affiliate Integration Map
7. Franchise System Map
8. Industries Development Map
```

Each section is a reusable dashboard card/section.

---

## 2️⃣ PLATFORM STRUCTURE SECTION

Tree view of the full platform architecture:

```text
EHB PLATFORM
│
├ Core Systems
│   ├ AI Department
│   ├ Blockchain Department
│   ├ Finance Department
│   ├ Affiliate System
│   ├ Franchise System
│   ├ JPS – Job Profile & Skill
│   ├ Verification Systems (PSS, CRB, STL)
│   └ DMO – Decentralized Management Office
│
└ Industries
    ├ E‑commerce
    ├ Legal
    ├ Medical
    ├ Education
    ├ Jobs
    ├ Travel
    └ … up to 32 industries
```

Each node is clickable and can open detail modals or sub‑dashboards.

---

## 3️⃣ DEVELOPMENT PROGRESS TRACKER

High-level progress for each major system:

- Progress cards (example):

```text
AI Department       40%
Blockchain          10%
Finance             35%
Affiliate System    20%
Franchise System    15%
Industries          5%
```

- Per‑industry breakdown (e.g. “Legal Industry”):

```text
UI Design      100%
Backend         20%
AI Tools        30%
Verification    10%
```

Progress data can be mocked in the demo and later wired to real project management data.

---

## 4️⃣ SYSTEM FLOW MONITOR

Visual monitor for critical platform flows, with health status:

**User / Provider flow example:**

```text
User signup
  ↓
PSS verification
  ↓
JPS profile creation
  ↓
CRB certification
  ↓
STL trust level assignment
  ↓
Service provider access
```

The dashboard should highlight broken/missing connections, e.g.:

- `⚠ STL system not connected with CRB`
- `⚠ Booking service not connected with wallet`

---

## 5️⃣ SHARED TOOLS MAP

Table + visual map of **shared tools** and where they are reused:

Example table:

| Tool             | Used In                         |
|------------------|---------------------------------|
| Booking system   | Medical, Legal, Education, Travel |
| Payment gateway  | All industries                  |
| Messaging system | All industries                  |
| Video calls      | Medical, Legal, Education       |

Goal: Show reuse and development cost savings.

---

## 6️⃣ AI INTEGRATION MAP

Where AI tools are plugged in:

Example table:

| AI Tool           | Industries      |
|-------------------|-----------------|
| AI Lawyer         | Legal           |
| AI Diagnosis      | Medical         |
| AI Resume Builder | Jobs            |
| AI Course Tutor   | Education       |

Summary cards:

- `Total AI Tools: 120 (demo number)`
- `Industries Using AI: 18`

---

## 7️⃣ AFFILIATE INTEGRATION MAP

Shows where the affiliate system is active:

- Product affiliate (GoSellr)
- Services affiliate (legal, medical, education, local services)
- AI tools affiliate (AI marketplace)
- Franchise recruitment affiliate

Affiliate cards:

- Active affiliates count
- Commission distribution by industry
- Top‑performing industries via affiliate growth

---

## 8️⃣ FRANCHISE SYSTEM MAP

Hierarchy and rollout state:

```text
Global Admin
  ↓
Country Franchise
  ↓
Corporate Franchise
  ↓
Sub Franchise
```

Example status card:

- Country: Pakistan
  - Corporate Franchise: `Pending`
  - Sub Franchises: `0`

This ties into the Franchise System architecture docs.

---

## 9️⃣ INDUSTRIES DEVELOPMENT MAP

Per‑industry readiness overview:

Example:

```text
E‑commerce       60%
Legal            30%
Medical          20%
Education        15%
Travel            5%
… others
```

Each industry card links to a more detailed status view.

---

## 🔟 GLOBAL USER & PROVIDER FLOWS (REFERENCE DIAGRAMS)

**User flow:**

```text
User signup
  ↓
PSS verification
  ↓
JPS profile creation
  ↓
Service access (consumer side)
```

**Provider flow:**

```text
Provider signup
  ↓
PSS identity verification
  ↓
CRB skill certification
  ↓
STL level assignment
  ↓
Service listing via DMO
  ↓
Orders and earnings
```

**Franchise flow:**

```text
Country franchise
  ↓
Corporate franchise
  ↓
Sub franchise
  ↓
Providers onboarding
  ↓
Local orders management
```

These flows should be visible as simple diagrams in the development dashboard.

---

## 1️⃣1️⃣ ERROR / GAP DETECTION (DEMO LOGIC)

The development page can show **simulated warnings** for missing connections:

- `⚠ AI recommendation not connected with marketplace`
- `⚠ PSS not enforcing verification on providers in X industry`
- `⚠ Franchise revenue not linked to Finance service`

In real implementation this can be wired to health checks and config validation.

---

## 1️⃣2️⃣ RELATION TO NEXT.JS IMPLEMENTATION

For the real build (after the demo phase):

- Route: `/development`
- Frontend framework: **Next.js** (always the standard for EHB).
- This page will consume:
  - Architecture metadata (from docs/config).
  - Progress data (from a project status service or static JSON for demos).
  - Flow definitions (from a central config that mirrors the architecture docs).

This spec is for the **demo version** and will be refined into components and API contracts when real development starts.

