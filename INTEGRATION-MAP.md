# INTEGRATION MAP — EHB Core Systems

**Version:** 1.0  
**Updated:** 2026-04-14  
**Scope:** All 8 core systems and their data flows  

---

## System Relationship Diagram

```
                        ┌─────────────────┐
                        │   BLOCKCHAIN    │
                        │  (Polkadot)     │
                        │                 │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              Stores CRB   Wallet Locks   STL Snapshots
              Hashes        (BSC)         (Proof)
                    │            │            │
        ┌───────────┴────────────┴────────────┴───────────┐
        │                                                  │
    ┌───▼────┐   ┌────────┐   ┌──────┐   ┌──────┐   ┌───▼──┐
    │   PSS   │   │  CRB   │   │ STL  │   │ DMO  │   │ JPS  │
    │(Verify) │   │(Skills)│   │Level │   │(Mgmt)│   │(Jobs)│
    └────┬────┘   └────┬───┘   └──┬───┘   └───┬──┘   └──────┘
         │             │          │           │
         │     ┌───────┴──────────┴───────┐   │
         │     │                          │   │
         │   Feeds STL Points             │   │
         │     │                          │   │
         │   +40pts(ID)     +15pts(Skills)│   │
         │   +8(Liveness)   +10(Orders)   │   │
         │   +7(FaceMatch)               │   │
         │   +5(Address)                 │   │
         │   +5(AML)                     │   Approves L8+
         │   +5(Device)                  │   Controls Access
         │                               │   Gates Orders
         └───────────────┬───────────────┘   Limits Wallet
                         │
                    ┌────▼─────┐     ┌─────────────┐
                    │  WALLET   │────▶│   AI (Risk) │
                    │(Escrow)   │     └─────────────┘
                    └────┬──────┘
                         │
                    Depends on STL
                    for limits +
                    PSS for KYC
                         │
              ┌──────────┬┴──────────┐
              │          │           │
         ┌────▼───┐ ┌────▼───┐ ┌───▼────┐
         │  Wallet│ │  GoSellr│ │Franchise│
         │Payment │ │ Orders  │ │ Revenue │
         │Dispute │ │ Escrow  │ │  Split  │
         └────────┘ └────┬────┘ └────────┘
                         │
                    ┌────▼────────┐
                    │  Feeds STL   │
                    │  +2 per order│
                    │ (Complaint   │
                    │  -15pts)     │
                    └──────────────┘
```

---

## System Overview Table

| System | Role | Feeds Into | Depends On | Key Entity |
|--------|------|-----------|-----------|-----------|
| **PSS** | Identity verification (KYC, liveness, face match, address, AML, device) | STL (+40), DMO review | None | `pss_verifications` |
| **CRB** | Skill certification & registry, physical + legal verification | STL (+15), DMO inspection | PSS approved | `crb_certificates` |
| **STL** | Trust score (0-9), gates all access, controls wallet limits, marketplace visibility | All systems read | PSS, CRB, Orders, Complaints | `users.stl_level` |
| **DMO** | Decentralized governance, disputes, policy, L8+ approval | All systems (audit trail) | STL gates, PSS/CRB data | `dmo_decisions`, `dmo_complaints` |
| **JPS** | Job Profile & Skill matching, seller recommendations | Marketplace rankings | PSS identity, CRB skills, STL tier | `jps_profiles`, `jps_matches` |
| **Wallet** | Escrow, payments, earnings, lock ladder, EHBGC | Orders, Franchise payouts | STL limits, PSS KYC | `wallets`, `transactions`, `escrow` |
| **AI** | Recommendations, fraud detection, risk scoring, diagnosis | All systems (reads) | None (passive) | `ai_signals`, `fraud_alerts` |
| **Blockchain** | CRB hashes, wallet locks, STL snapshots, immutable proof | Verification, audits | All systems (data source) | BSC BEP-20, Polkadot |

---

## Data Flow 1: User Registration → Full Onboarding

```
1. Register (Email, Phone, Password)
   ↓ [User.create]
2. PSS Verification Queue
   ├─ ID Document Upload
   │  ├─ OpenAI Vision → OCR (name, DOB, expiry)
   │  ├─ Admin Review (approved/rejected/resubmit)
   │  └─ Result → pss_verifications collection (+40 STL if approved)
   ├─ Liveness Detection (video 30s)
   │  ├─ Twilio/Stripe → face detection + motion
   │  └─ Result → +8 STL if passed
   ├─ Face Matching (compare to ID photo)
   │  ├─ ML model (similarity > 85%)
   │  └─ Result → +7 STL if matched
   ├─ Address Verification (postal code + proof)
   │  ├─ GeoCoding API + AML check
   │  └─ Result → +5 STL if verified
   ├─ AML Check (sanctions, PEPs, risk lists)
   │  ├─ Third-party API (Refinitiv/Laurence Fink)
   │  └─ Result → +5 STL if clear
   └─ Device Fingerprinting (browser + OS + IP)
      ├─ TrustDevice SDK
      └─ Result → +5 STL if trusted
   ↓ [STL score = 0 + verified points]
3. STL Calculation Engine
   ├─ Input: PSS results (0-75 points)
   ├─ Input: CRB (0 for new users, pending)
   ├─ Input: Order history (0 for new users)
   ├─ Formula: PSS(40%) + CRB(15%) + Orders(35%) + Payments(10%)
   ├─ Output: STL Level (0-9) + score
   └─ Store: users.stl_level, users.stl_score, stl_history (snapshot)
   ↓ [DMO approval for L8+]
4. DMO Review (if STL >= L8)
   ├─ Decision Queue: Auto-approve L0-L7, require L8+ manual approval
   ├─ Admin Review (check for fraud signals)
   └─ Approve/Reject → Flag for manual review if L9
   ↓ [User can now access marketplace]
5. Wallet Creation
   ├─ Create: wallets collection (user_id, locked_balance, free_balance)
   ├─ Initial balance: 0 (no deposits yet)
   └─ Limits set by STL level:
      ├─ L0-L2: $0 (cannot transact)
      ├─ L3-L5: $100/day, $500/month
      ├─ L6-L7: $500/day, $5K/month
      └─ L8-L9: $5K/day, $50K/month
   ↓
6. JPS Profile Created (if selling)
   ├─ Extract skills from CRB (pending)
   ├─ Calculate match score for buyer/seller connections
   └─ Populate recommendations engine
   ↓
7. User Ready → Dashboard Access
   └─ Can browse marketplace, list services, receive orders
```

---

## Data Flow 2: Order Placement → Completion & STL Impact

```
1. Buyer Searches (GoSellr Marketplace)
   ├─ AI recommends sellers by STL + JPS match score
   └─ Product cards show seller's STL badge
   ↓
2. Buyer Adds to Cart + Checks Out
   ├─ Wallet check: buyer has sufficient balance?
   │  └─ STL limits enforced (e.g., L5 can spend max $500/month)
   └─ Order created: orders collection (status=pending)
   ↓
3. Seller Confirms Order
   ├─ Order status → confirmed
   ├─ Escrow lock initiated:
   │  └─ Buyer's wallet: free → locked (full amount)
   │     - Soft release after 24h (buyer confirms received)
   │     - Full release after 7d (dispute window closes)
   └─ Both parties notified (email + SMS)
   ↓
4. Seller Prepares + Ships
   ├─ Order status → preparing → shipped
   └─ Tracking info updated
   ↓
5. Buyer Receives → Confirms
   ├─ Buyer confirms delivery (unlock escrow after 24h)
   ├─ Order status → delivered
   ├─ STL points awarded:
   │  └─ Seller: +2 STL per order (capped at L9)
   │  └─ Buyer: +1 STL per 10 orders (trust via activity)
   └─ Wallet update: escrow released → seller's free balance
   ↓
6. Review + Dispute (Optional)
   ├─ If no dispute after 7d, escrow auto-released
   ├─ If dispute filed → DMO complaint system
   │  ├─ AI pre-screening (fraud signals)
   │  ├─ Admin review → decision
   │  └─ If seller at fault: -15 STL penalty
   └─ If buyer at fault: -5 STL penalty
   ↓
7. Completion → Payment
   ├─ Seller receives 70% of order value (EHB keeps 30%)
   ├─ Revenue split:
   │  ├─ EHB: 30%
   │  ├─ Franchise (country): 15%
   │  ├─ Affiliate: 10% (if referred)
   │  └─ Seller: 45%
   └─ Wallet transaction logged (type=escrow_release, seller_earned)
   ↓
8. STL Decay Starts
   ├─ No new activity → decay job runs nightly
   ├─ Decay formula:
   │  ├─ Days 0-30: -0 (grace period)
   │  ├─ Days 31-60: -1 to -2 per day (slow)
   │  ├─ Days 61-90: -3 to -5 per day (medium)
   │  └─ Days 91+: -5 to -10 per day (aggressive)
   └─ User notified when STL drops to next tier
```

---

## Data Flow 3: STL Recalculation (Batch Job)

```
Daily at 02:00 UTC
├─ Pull all users with flag: stl_dirty = true
├─ For each user:
│  ├─ PSS points = sum of all verified PSS components
│  ├─ CRB points = sum of certified skills
│  ├─ Order points = (order_count * 2) capped at 20
│  ├─ Payment points = (completed_orders / 10) capped at 10
│  ├─ STL score = (PSS * 0.40) + (CRB * 0.15) + (Orders * 0.35) + (Payments * 0.10)
│  ├─ STL level = Bucket into L0-L9 based on score
│  ├─ Decay check:
│  │  └─ Last activity > 30d? Apply decay penalty
│  ├─ Complaint penalty: Active complaint? -15 STL
│  ├─ Update users.stl_level + users.stl_score
│  ├─ Insert stl_history snapshot (date, level, reason, admin_override)
│  └─ If level changed → Audit log + notification
├─ Blockchain snapshot (Polkadot)
│  └─ Hash (user_id, stl_level, timestamp) → immutable proof
└─ DMO trigger (if L8+ and no approval, escalate)
```

---

## Data Flow 4: Complaint Resolution (DMO)

```
1. Complaint Filed (by buyer or AI fraud signal)
   ├─ Category: wrong_item, no_delivery, damaged, scam, etc. (9 types)
   ├─ Evidence: photos, messages, transaction ID
   ├─ Create: dmo_complaints collection
   └─ Status: open
   ↓
2. AI Pre-Screening
   ├─ Risk score (0-100)
   ├─ Fraud signals (seller history, IP, device, payment)
   ├─ Recommendation: auto-resolve or escalate to admin
   └─ AI_signals collection updated
   ↓
3. Admin Review
   ├─ Manual investigation (30-min SLA for P1, 24-h for P2)
   ├─ Decision:
   │  ├─ Dismiss → Complaint closed
   │  ├─ Partial refund → Wallet transaction created (seller -$X, buyer +$Y)
   │  └─ Full refund + seller penalty → STL deduction
   └─ Appeal available (5-day window)
   ↓
4. Resolution & STL Impact
   ├─ If seller liable:
   │  ├─ STL penalty: -15 (major), -5 (minor)
   │  ├─ Wallet: refund released to buyer
   │  └─ Escrow: reverted to buyer's free balance
   ├─ If buyer liable:
   │  ├─ STL penalty: -5 (filing false complaint)
   │  └─ Case closed, no refund
   └─ Both parties notified + reason logged
   ↓
5. Escalation to L8/L9 (if needed)
   ├─ Pattern detected (seller has 3+ complaints)
   └─ DMO L8 approval queue → Manual review → Account restriction (L2 downgrade) or suspension
```

---

## Data Flow 5: Franchise Revenue Split

```
Order Completes: Total Revenue = $100

┌─────────────────────────────┐
│  Seller receives: $100      │
│  EHB deducts:     -$30 (30%)│
└───────────────┬─────────────┘
                │
        ┌───────┴────────┐
        │                │
   Split among:          │
        │                │
   $70 remaining         │
        │                │
   ┌────┴─────┬──────────┴──────┬──────────┬──────────┐
   │           │                 │          │          │
$35 (50%)   $21 (30%)         $10.5 (15%)  $2.1 (3%)  $1.4 (2%)
Seller      Franchise         Affiliate    Support   Reserve
(Final)     (Country L1)       (Referrer)   (L2 ops)  (L3 ops)
            (gets paid          (if any)
             monthly)
   │
   └─→ Wallet transaction: type = order_completion, seller_earned, +$35

DB Updates:
├─ wallets: seller.free_balance += 35
├─ transactions: Create 5 entries (split trail)
├─ franchise_payouts: Queue monthly payout to country franchise
├─ affiliate_earnings: Queue payout if applicable
└─ stl_history: Seller +2 STL (order completed)
```

---

## Data Flow 6: STL Upgrade/Downgrade Triggers

```
UPGRADE (User meets threshold):
├─ Candidate for L8 (score ≥ 280)
│  ├─ Require: PSS=75, CRB≥5, Orders≥20, no_active_complaints
│  ├─ DMO approval → manual review required
│  └─ If approved: stl_level = 8, notify user
├─ Candidate for L9 (score ≥ 350)
│  ├─ Require: L8 for 60+ days, Orders≥50, zero_disputes
│  ├─ DMO L9 approval → strict review
│  └─ If approved: stl_level = 9, gold badge, notify user
└─ All L0-L7: Auto-upgrade on threshold hit

DOWNGRADE (User fails threshold):
├─ No activity 90+ days → decay to L0
├─ Complaint resolved against user → -5 to -15 STL
├─ Fails fraud checks (AI signals) → -10 STL
├─ Business issues (unpaid fees) → -20 STL
└─ DMO forces downgrade (policy violation) → -50 STL

REFILL (User manually earns points back):
├─ Complete order → +2 STL (max 1/day)
├─ Complete CRB skill exam → +3 STL (max 1/week)
├─ 30+ days perfect (no complaints, all deliveries on-time) → +5 STL
├─ Recommended actions shown in dashboard
└─ Batches run nightly (same as decay job)
```

---

## Blockchain Integration Points

| Data | Chain | Record | Use Case | Frequency |
|------|-------|--------|----------|-----------|
| **CRB Certificate Hash** | Polkadot | `crb_id + hash(cert_pdf)` | Legal proof of certification | On certificate issue |
| **STL Snapshot** | Polkadot | `user_id + timestamp + stl_level + score_hash` | Immutable trust record | Daily batch |
| **Wallet Lock** | BSC (BEP-20) | `user_id + amount + unlock_date + lock_type` | EHBGC token lock | On lock event |
| **Order Proof** | Polkadot | `order_id + hash(metadata)` | Dispute arbitration | On order complete |

---

## API Integration Checklist

For each new system integration, verify:

- [ ] Data schema defined (Mongoose model)
- [ ] Input validation (Zod schema)
- [ ] Output serialization (no secrets leaked)
- [ ] Error handling (AppError class)
- [ ] Logging (Winston, audit trail)
- [ ] Rate limiting (if public API)
- [ ] Auth/permissions (role-based)
- [ ] Tests (unit, integration, E2E)
- [ ] Documentation (README, endpoint list)
- [ ] Backward compatibility (feature flags for breaking changes)
- [ ] Monitoring (health checks, alerts)
- [ ] Blockchain record (if required)

---

## Key Rules (Non-Negotiable)

1. **STL is the gatekeeper.** All wallet limits, marketplace visibility, and system access depend on STL level.
2. **DMO approves L8+.** No one bypasses DMO for high-trust operations.
3. **Complaints drive STL decay.** One unresolved complaint = -15 STL (major impact).
4. **Blockchain is immutable proof.** CRB and STL snapshots are hashed to Polkadot daily.
5. **Escrow is mandatory.** All orders are locked → soft release 24h → full release 7d.
6. **Franchise gets paid monthly.** Revenue split is automatic, no manual intervention.
7. **PSS is first gate.** No one reaches L3+ without PSS approval.
8. **AI watches all systems.** Fraud signals trigger DMO escalation automatically.

---

*EHB Technologies (Pvt.) Ltd. — Integration Map v1 — 2026-04-14*
