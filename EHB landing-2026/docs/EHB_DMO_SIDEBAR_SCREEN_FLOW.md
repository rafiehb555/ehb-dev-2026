# EHB DMO Sidebar + Screen Flow (UI/UX Backbone)

## Sidebar Design Standard

- Dark glass style, fixed-left navigation rail.
- Collapsible (icon-only compact mode).
- Section-level + sub-item navigation.
- Active highlight with glow border.
- Badge support for alerts and queue pressure.

## Sidebar Module Map

- Dashboard
  - Overview
- Applications
  - All Applications
  - My Queue
  - High Risk
  - SLA Breach
- Approvals
  - Pending Decisions
  - Approved
  - Rejected
  - History
- JPS
  - Profiles
  - Skills
  - Services
  - Jobs
- PSS
  - Cases
  - Verification Steps
  - Risk Analysis
  - Fraud Detection
  - Refilling
- CRB
  - Applications
  - Document Review
  - Inspection
  - Certificates
  - Expiry
- Franchise
  - Tasks
  - In Progress
  - Reports
  - Escalations
- EHB-STL
  - Scores
  - Breakdown
  - History
  - Ranking
- Industry
  - Industry List
  - Verification
  - Mapping
  - Scores
- Refilling
  - Active
  - Expiring Soon
  - Expired
  - Completed
- Affiliate
  - Dashboard
  - Referrals
  - Earnings
  - Network
- Notifications
  - All
  - Critical
  - Warnings
  - System Alerts
- Penalty
  - All Penalties
  - Active
  - Appeals
  - History
- Settings
  - Users
  - Roles
  - Permissions
  - System Config

## Module Screen Flow

- Dashboard: `Dashboard -> View KPIs -> Click Alert -> Redirect to Module`
- Applications: `Applications -> Filter -> Select -> Drawer -> Review -> Assign/Approve`
- Approvals: `Approvals -> Select -> Review -> Notes -> Approve/Reject -> Audit`
- PSS: `PSS -> Cases -> Stepper -> Verify Steps -> Final Decision -> DMO`
- CRB: `CRB -> Application -> Review -> Assign Inspection -> Report -> Certificate`
- Franchise: `Franchise -> Tasks -> Inspect -> Submit Report -> Escalate`
- EHB-STL: `STL -> Scores -> Breakdown -> History -> Ranking Impact`
- Industry: `Industry -> Select Sector -> Verify -> Score Update -> STL Boost`
- Refilling: `Refilling -> Expiry Alert -> Refill -> Verify -> STL Maintain`
- Affiliate: `Affiliate -> Invite -> Join -> Activity -> Earnings`
- Notifications: `Notification -> Alert -> Click -> Redirect -> Action`
- Penalty: `Violation -> Detection -> Penalty -> Notify -> STL Drop -> Resolve`
- Settings: `Settings -> Users -> Roles -> Permissions -> Config`

## UX Principles

- One-click action paths for frequent workflows.
- No deep nested routing for primary operator tasks.
- Clear purpose per page with explicit CTA and status visibility.
- AI assistance as contextual hints (risk, SLA, refill, decision support).

