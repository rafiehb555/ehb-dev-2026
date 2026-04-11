# EHB Global User Experience Flow

This document defines the **end‑to‑end journeys** for all primary roles in the EHB ecosystem.

Roles covered:

- Consumers (users)
- Providers (professionals, businesses)
- Franchise admins (country, corporate, sub)
- Super Admin / System Admin
- AI user journeys (AI marketplace)

Flows covered:

1. Global entry into EHB
2. User journey
3. Provider journey
4. Franchise journey
5. AI marketplace journey
6. Service booking & order lifecycle
7. Trust & verification journey (PSS, CRB, STL, DMO)
8. Wallet & payments journey
9. Notifications & support journey

---

## 1. Global Entry into EHB

High‑level entry paths for all users.

### Entry channels

- Web app (Next.js super app)
- Mobile apps (future)
- Franchise portals (country / corporate)
- Affiliate links and referrals

### Landing choices

- Explore industries
- Find a service (search)
- Sign up as a user
- Sign up as a provider
- Apply for franchise
- Explore AI marketplace

---

## 2. User Journey (Consumer)

### 2.1 Onboarding

1. User lands on EHB home / landing.
2. Selects **role: Consumer / User**.
3. Signs up with:
   - Email / phone + password, or
   - Social login (future)
4. Basic profile created in **Identity Layer** (`users`, `profiles`).

### 2.2 Verification (PSS)

1. User prompted to complete **PSS verification**:
   - Upload ID documents
   - Basic KYC information
2. `verification-service` processes and writes to `pss_verifications`.
3. Once approved, user gets **base STL trust level**.

### 2.3 JPS Profile (optional for professionals)

1. If user wants to be a professional later:
   - Creates **JPS profile** (skills, experience, certifications).
2. Links to `profiles` table + JPS metadata.

### 2.4 Discover & select services

1. User explores:
   - By **industry** (e.g. Legal, Medical, Education, Jobs).
   - By **search** (Global Search).
   - Via **AI assistant** (optional).
2. Service cards show:
   - Provider rating
   - STL trust level
   - Price / availability

### 2.5 Booking & order flow

1. User selects service → opens **Service Detail**.
2. Chooses:
   - Provider (or auto‑assigned)
   - Time slot (if booking)
   - Package / options
3. Booking is created in `bookings` (status = `pending`).
4. System redirects to **payment flow** (wallet / gateway).

### 2.6 After service

1. Booking marked as `completed` by provider or system.
2. User leaves:
   - Rating & review
   - Optional feedback for STL.
3. STL scoring engine updates **trust level** of provider.

---

## 3. Provider Journey

### 3.1 Signup as provider

1. Provider lands on EHB.
2. Chooses **“Sign up as Provider”**.
3. Creates user account (if not already).

### 3.2 PSS Identity Verification

1. Provider must complete **PSS**:
   - Government ID
   - Address / identity checks
2. Status stored in `pss_verifications`.

### 3.3 CRB Certification

1. For regulated professions (doctors, lawyers, teachers):
   - Uploads diplomas, licenses, certificates.
2. CRB verifies and writes to `crb_certifications`.
3. Only **CRB‑approved** providers can offer certain services.

### 3.4 STL Trust Level Assignment

1. System calculates initial **STL level**:
   - Based on PSS + CRB + history.
2. Stored in `stl_levels`:
   - Level: Free, Basic, Normal, High, VIP.
3. Higher STL unlocks:
   - More services
   - Higher ranking
   - Better payouts or features.

### 3.5 Service listing via DMO

1. Provider uses **DMO interface** (within dashboard):
   - Selects **industry** and **category**.
   - Creates **service listings** (price, description, availability).
2. Data stored in:
   - `services`
   - `service_providers`.

### 3.6 Orders & earnings

1. Provider receives bookings in dashboard.
2. Delivers service (online / offline).
3. Earnings go to **provider wallet** (`wallets`).
4. Provider can:
   - Withdraw (subject to franchise & compliance rules).
   - Track history and analytics.

---

## 4. Franchise Journey

### 4.1 Franchise types

- Country Franchise
- Corporate Franchise
- Sub Franchise

### 4.2 Apply as franchise

1. Prospect visits **Franchise** page.
2. Fills application:
   - Region / country
   - Industry focus
   - Business details
3. Application reviewed by Super Admin / Country franchise.

### 4.3 Onboarding & rights

1. Once approved, franchise is created in `franchises`.
2. Regions mapped in `franchise_regions`.
3. Rights assigned:
   - Which industries they can operate.
   - Commission / revenue split.

### 4.4 Local operations

Franchise responsibilities:

- Onboard local providers.
- Conduct offline verification / inspections.
- Support disputes and quality control.
- Run local marketing.

### 4.5 Revenue distribution

1. Each transaction generates **franchise share**:
   - Logged in `franchise_revenue`.
2. Franchise dashboards show:
   - Total revenue
   - Active providers & users
   - Top industries.

---

## 5. AI Marketplace Journey

### 5.1 Discover AI tools

1. User or provider navigates to **AI Marketplace**.
2. Views:
   - AI categories (Legal, Medical, Jobs, Education, Business).
   - Featured tools (AI Lawyer, AI Doctor, AI Resume Builder, etc.).

### 5.2 Try / subscribe

1. User selects an AI tool.
2. Sees:
   - Description & capabilities.
   - Pricing (per use / subscription).
   - STL / compliance notes (for regulated use).

3. User can:
   - Run a one‑off request.
   - Subscribe for ongoing use.

### 5.3 Request lifecycle

1. Frontend sends request to `ai-service`.
2. `ai_requests` log:
   - tool_id
   - user_id
   - request_payload
   - response_time.
3. Usage aggregated in `ai_usage`.

### 5.4 Integration with services

Examples:

- Legal: AI Lawyer helps draft documents / triage cases.
- Medical: AI Diagnosis assists with symptom analysis (doctor‑in‑loop).
- Jobs: AI Resume Builder creates CVs used in JPS profiles.
- Education: AI Tutor supports learning journeys.

---

## 6. Service Booking & Order Lifecycle

### 6.1 Booking creation

1. User selects service.
2. Fills booking form:
   - Date / time
   - Location (if offline)
   - Additional notes.
3. `booking-service` writes to `bookings` (status = `pending`).

### 6.2 Payment & escrow

1. `payment-service`:
   - Creates `transactions` row (type `payment`).
   - If escrow needed:
     - Creates `escrow_transactions` with `release_status = pending`.
2. Wallet balance updated:
   - User wallet debited.
   - Provider / franchise share held in escrow.

### 6.3 Service delivery

1. Provider performs service:
   - Online (video, chat, AI‑assisted).
   - Offline (clinic, office, on‑site).
2. Booking status moves:
   - `pending` → `confirmed` → `completed` (or `cancelled`).

### 6.4 Escrow release & payouts

1. On successful completion:
   - Escrow released (`release_status = released`).
   - Provider wallet credited.
   - Franchise & affiliate commissions posted.
2. In disputes:
   - DMO / Franchise resolves.
   - Funds may be refunded or split.

---

## 7. Trust & Verification Journey

End‑to‑end view of trust systems.

### 7.1 Sequence

1. **PSS** – Identity & risk:
   - KYC / KYB (users, providers, franchises).
2. **CRB** – Certification:
   - Professional documents verified.
3. **STL** – Service Trust Level:
   - Combines PSS + CRB + history + ratings.
4. **DMO** – Governance & enforcement:
   - Policies, inspections, escalations.

### 7.2 How it impacts UX

- Search ranking (higher STL = higher visibility).
- Eligibility to offer certain services.
- Booking limits / pricing tiers.
- Franchise oversight and alerts.

---

## 8. Wallet & Payments Journey

### 8.1 Wallet creation

- Each user / provider / franchise gets a wallet row in `wallets`.
- System wallet holds platform fees, reserves and incentives.

### 8.2 Funding the wallet

1. User adds funds:
   - Card / bank transfer / other methods.
2. `transactions` record: `wallet_topup`.

### 8.3 Paying for services

1. At checkout:
   - Wallet used directly, or
   - External gateway used then wallet updated.
2. Escrow optional per service / industry.

### 8.4 Commissions & revenue

- Affiliate commissions: `affiliate_commissions`.
- Franchise revenue: `franchise_revenue`.
- Provider payouts: wallet → off‑platform payout methods (future).

---

## 9. Notifications & Support Journey

### 9.1 Notification types

- Booking updates (created, confirmed, rescheduled, completed).
- Payment and wallet updates.
- Verification updates (PSS, CRB, STL).
- Franchise and admin actions.

### 9.2 Channels

- In‑app notifications
- Email
- SMS (where required)
- Push (mobile, future)

### 9.3 Support & escalation

1. User or provider opens a ticket.
2. DMO / Franchise sees case in their dashboard.
3. Outcome may:
   - Adjust STL
   - Trigger refunds
   - Lead to sanctions or bans.

---

## 10. How Frontend & Backend Connect to These Flows

- **Frontend:**  
  - `EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md` → defines pages and layouts used in each step of these journeys.
  - Landing, Industries, Services, Dashboard, Admin, AI Marketplace all map to specific parts of this flow.

- **Backend:**  
  - `EHB_MICROSERVICES_ARCHITECTURE.md` → defines services (identity, verification, industry, booking, payment, affiliate, franchise, AI, blockchain, notification, analytics).
  - `EHB_DATABASE_MASTER_SCHEMA.md` → defines tables that store state during these journeys.

Together, these files ensure the **real EHB platform** can be built step‑by‑step without redesigning flows later.

