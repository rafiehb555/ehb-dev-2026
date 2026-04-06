# EHB-Wallet + EHBGC Token — Complete System Plan
> Trusty Wallet + EHBGC Coin + EHBSC Stablecoin + Blockchain Payment Layer
> Version: 2.0 | April 2026 | Status: PLANNING

---

## PART 0: EHB WALLET SYSTEM OVERVIEW

### 5 Sub-Wallets Inside EHB Wallet:

| Wallet Type | Code | Purpose |
|-------------|------|---------|
| Main Wallet | MAIN | Normal spendable balance |
| EHBGC Wallet | COIN | EHBGC coin storage + transfers |
| Trusty Wallet | TRUSTY | Locked staking → STL + power |
| Earnings Wallet | EARN | Income from sales/jobs/affiliate |
| Settlement Wallet | SETTLE | Franchise area payouts |

### Sub-Wallet Flow:
```
User receives money / earns →
Auto-routed to correct sub-wallet →
  Seller income → Earnings Wallet
  Staking → Trusty Wallet
  Franchise payout → Settlement Wallet
  Normal spending → Main Wallet / EHBGC Wallet
```

### Where Wallets Display:
- Dashboard (Top card — combined balance)
- Wallet page (full breakdown per sub-wallet)
- Transaction history (per sub-wallet filter)
- Order page (EHBGC Wallet shown at checkout)

---

## PART 1: WHAT IS EHBGC + EHBSC

### EHBGC — EHB Global Coin (Main Coin):
- Native platform utility + investment + reward coin
- Used for: payments, staking, franchise fees, governance
- Tradeable on external exchanges
- Price grows with demand + supply lock + burn

### EHBSC — EHB Stable Coin (New):
- Pegged: 1 EHBSC = 1 USD (stable, no price fluctuation)
- Used for: salaries, daily payments, stable transactions
- Backed by: USDT reserves (or platform collateral)
- User chooses: pay in EHBGC (investment mode) OR EHBSC (stable mode)

### Two-Token Strategy:
```
EHBGC → Investment + Staking + Governance + Growth
EHBSC → Salary + Daily Payments + Stable Transactions
```

---

## PART 2: TRUSTY WALLET (MOST CRITICAL SYSTEM)

### What is Trusty Wallet?
Trusty Wallet = Locked EHBGC system that controls Trust, STL Level, Ranking, and Power on EHB.
> "More you lock → more you earn → more you grow → more you're trusted"

### Who MUST / CAN Lock EHBGC:

| User Type | Lock Requirement | Why |
|-----------|-----------------|-----|
| Sellers | Optional (but boosts ranking) | More orders + visibility |
| Riders | Optional | Priority delivery allocation |
| Franchise Operators | MANDATORY | Area control power |
| Inspectors | MANDATORY | CRB credibility + authority |
| JPS Employees (L4+) | Required | Job eligibility + promotion |
| Buyers | Optional | Better deals + cashback |

### Lock Periods + Monthly Rewards:

| Lock Period | Monthly Reward | Notes |
|------------|---------------|-------|
| 1 Year | 0.5% / month | Entry level |
| 2 Years | 1.0% / month | Standard |
| 3 Years | 1.1% / month | VIP level |

**Reward Conditions (ALL must be true):**
- ✔ Validator system must be active on chain
- ✔ User account must be active
- ✔ STL score must be maintained (no drop below L2)
- ✔ No active complaint lock on account

### Trusty Wallet Benefits:

| Benefit | How |
|---------|-----|
| STL Boost | More locked = higher trust = STL ↑ |
| Order Priority | Sellers/Riders get priority in AI matching |
| Income Boost | Higher commission share + bonus earnings |
| Fraud Protection | Low-risk account = better ranking |
| Validator Access | Min stake = eligible for validator node |

### Access Level by Lock Amount:

| Lock Amount | Access Level |
|-------------|-------------|
| 0 EHBGC | Basic |
| 100–999 EHBGC | Standard |
| 1,000–4,999 EHBGC | Premium |
| 5,000+ EHBGC | VIP |
| 10,000+ EHBGC | Validator eligible |

### Penalty Integration:
```
User violates rule / fraud confirmed →
Complaint raised →
Penalty issued →
Deducted from Trusty Wallet →
Lock freeze possible →
Reward stopped during freeze →
STL dropped
```

---

## PART 2B: TRUSTY WALLET (ORIGINAL DISPLAY)

### Wallet Display Structure:
```
┌─────────────────────────────────────────┐
│          EHB TRUSTY WALLET              │
│                                         │
│  EHBGC Balance:    2,450.00  EHBGC     │
│                                         │
│  ≈ £1,225.00 GBP                       │
│  ≈ PKR 684,000                         │
│  ≈ $1,530 USD                          │
│                                         │
│  ┌──────────┐ ┌───────────┐ ┌────────┐ │
│  │ Deposit  │ │ Withdraw  │ │  Send  │ │
│  └──────────┘ └───────────┘ └────────┘ │
│                                         │
│  [History]  [Stake]  [Transfer]        │
└─────────────────────────────────────────┘
```

### Key Rules:
- **Top line:** Always EHBGC balance (primary)
- **Below:** Local currency equivalents (auto-calculated)
- Rate updates: Every 60 seconds (live market rate)
- All platform earnings (seller, rider, affiliate, franchise) → Trusty Wallet
- All platform payments (orders, fees, courses) → from Trusty Wallet

---

## PART 3: AUTO-CONVERSION FLOW

### Deposit Flow:
```
User Deposits £100 GBP
        ↓
Payment Gateway (Stripe) confirms
        ↓
EHB rate engine: £1 = X EHBGC (live rate)
        ↓
EHBGC credited to Trusty Wallet
        ↓
Transaction logged with: rate used, amount, timestamp
        ↓
Wallet balance updated (real-time)
```

### Withdrawal Flow:
```
User requests withdrawal (EHBGC → GBP)
        ↓
STL-based withdrawal limit check
        ↓
Conversion rate applied (live)
        ↓
EHB takes 0.5% conversion fee
        ↓
Net GBP sent to user's bank / payment method
        ↓
EHBGC deducted from wallet
```

### Internal Payment Flow (order, fee, etc.):
```
User places order
        ↓
EHBGC reserved (escrow hold)
        ↓
Order fulfilled
        ↓
EHBGC released to seller wallet
        ↓
Commission auto-split (EHB, franchise chain, affiliate)
        ↓
All splits credited in real-time
```

---

## PART 4: SUPPORTED DEPOSIT METHODS

| Method | Region | Type | Min Deposit |
|--------|--------|------|------------|
| Stripe | UK / EU | Card | £5 |
| PayPal | Global | Digital wallet | $5 |
| JazzCash | Pakistan | Mobile wallet | PKR 100 |
| EasyPaisa | Pakistan | Mobile wallet | PKR 100 |
| UBL Bank | Pakistan | Bank transfer | PKR 1,000 |
| Bank Alfalah | Pakistan | Bank transfer | PKR 1,000 |
| Binance Pay | Global | Crypto | $1 USDT |
| Mosaic Highway | Global | Payment rail | $5 |
| USDT (TRC20/ERC20) | Global | Stablecoin | $5 |
| Bank Wire Transfer | Global | Bank | $50 |

---

## PART 5: SUPPORTED CURRENCIES

| Currency | Code | Primary Region |
|----------|------|---------------|
| Pakistani Rupee | PKR | Pakistan |
| British Pound | GBP | UK |
| US Dollar | USD | Global |
| Euro | EUR | EU |
| UAE Dirham | AED | UAE (Phase 3) |
| Tether | USDT | Crypto users |
| EHBGC | EHBGC | Platform native |

---

## PART 6: WITHDRAWAL LIMITS (STL-BASED)

| STL Level | Daily Limit (PKR) | Daily Limit (GBP) | Daily Limit (USD) |
|-----------|-----------------|-----------------|-----------------|
| L1 (0–39) | ❌ Cannot withdraw | ❌ | ❌ |
| L2 (40–59) | PKR 10,000 | £50 | $65 |
| L3 (60–74) | PKR 50,000 | £250 | $315 |
| L4 (75–89) | PKR 200,000 | £1,000 | $1,260 |
| L5 (90–100) | Unlimited | Unlimited | Unlimited |

**Withdrawal Requirements:**
- PSS complete (minimum Layer 1+2+3)
- Active bank account / payment method verified
- No active complaint locks
- No STL freeze
- KYC/AML cleared

---

## PART 7: EHBGC TOKEN — TOKENOMICS (ADVANCED)

### Blockchain Standard (Dual-Chain Strategy):
| Chain | Standard | Purpose |
|-------|----------|---------|
| Moonbeam (Polkadot) | ERC-20 compatible | Core system, validators, governance |
| BNB Chain | BEP-20 | Low-fee daily transactions |

**Why dual-chain:** Scalability + low cost. User wallet auto-selects best chain per transaction type.

### Token Distribution:
```
Total Supply: 1,000,000,000 EHBGC

Public Ecosystem:        40%  → Users, platform activity, adoption
Rewards & Staking:       20%  → Trusty Wallet, validator rewards
Company Reserve:         15%  → Operations, partnerships, legal
Franchise System:        10%  → Franchise fees, activation, rewards
Team & Development:      10%  → 3-year vesting (no early dump)
Emergency Fund:           5%  → Market stabilization, bugs
```

### EHBGC Price Growth Model (4 Drivers):
```
Driver 1 — DEMAND INCREASE
  More users → more transactions → more EHBGC needed → price ↑

Driver 2 — LOCKING (MOST POWERFUL)
  More Trusty Wallet locks → less circulating supply → price ↑

Driver 3 — UTILITY
  Franchise purchase + STL upgrades + Verification fees
  = Constant demand for EHBGC at platform level

Driver 4 — BURN MECHANISM
  Transactions burn small % → supply shrinks over time → price ↑
```

### Burn Mechanism:
| Trigger | Burn % |
|---------|--------|
| Product sale (GoSellr) | 0.1% of order value |
| Verification fee (PSS/CRB) | 5% of fee |
| Penalty charge | 100% burned |
| Course enrollment (JPS) | 2% of fee |
| Franchise renewal fee | 3% of fee |

```
Transaction happens →
Small % of EHBGC burned (permanently removed) →
Circulating supply decreases →
Scarcity increases →
Price pressure upward
```

### Anti-Inflation Control System:
| Rule | Effect |
|------|--------|
| Fixed maximum minting (hard cap at 1B) | No surprise supply increase |
| Controlled reward release (vesting schedule) | No dump |
| Active burn on every transaction | Supply steadily shrinks |
| AI monitoring of supply metrics | Early warning if inflation risk |
| DMO override: reduce rewards if supply grows too fast | Emergency brake |

### EHBSC Stable Coin Tokenomics:
```
Total Supply: Unlimited (algorithmic, demand-based)
Peg: 1 EHBSC = 1 USD
Collateral: USDT reserves held in treasury
Minting: Only when user deposits USDT/USD
Burning: When user withdraws / converts back
```

### Token Use Cases:
1. **Transaction Currency** — Buy/sell everything on EHB
2. **Affiliate Commissions** — All referral earnings in EHBGC
3. **STL Staking Boost** — Stake EHBGC → temporary STL +5 boost (max 90 days)
4. **Governance Voting** — Token holders vote on platform proposals
5. **Staking Rewards** — Hold + lock EHBGC → earn staking yield (APY defined by platform)
6. **Validator Earning** — Run validator node → earn EHBGC per validation
7. **Franchise Fees** — Franchise application/renewal paid in EHBGC
8. **Course Payments** — JPS courses purchased in EHBGC
9. **Inspection Fees** — CRB inspection charged in EHBGC
10. **Skill NFT Minting** — Minting skill certificates (small EHBGC fee)

---

## PART 8: STAKING SYSTEM

### How Staking Works:
```
User Stakes EHBGC
        ↓
Choose Lock Period:
  7 days   → 3% APY
  30 days  → 8% APY
  90 days  → 15% APY
  180 days → 20% APY
  365 days → 30% APY
        ↓
EHBGC locked (cannot spend)
        ↓
Rewards distributed daily
        ↓
After lock period → principal + rewards released
```

### STL Staking Boost:
| EHBGC Staked | STL Boost (temp) | Duration |
|-------------|-----------------|---------|
| 100 EHBGC | +2 STL | 30 days |
| 500 EHBGC | +5 STL | 60 days |
| 2,000 EHBGC | +10 STL | 90 days |
| 5,000 EHBGC | +15 STL | 120 days |

*Note: STL staking boost is temporary and shown separately from base STL*

### Unstaking Penalties:
- Before lock period ends: 5% penalty on principal
- Emergency unstake: Available after 24hrs (penalty applies)
- No penalty if lock period complete

---

## PART 9: VALIDATOR SYSTEM

### What is a Validator?
- EHBGC blockchain runs proof-of-stake (or nominated PoS)
- Validators process and confirm transactions on the EHBGC blockchain
- Must stake minimum EHBGC to become validator
- Earn EHBGC per transaction processed

### Validator Requirements:
| Requirement | Minimum |
|-------------|---------|
| EHBGC staked | 10,000 EHBGC |
| STL Level | L4 (75+) |
| PSS | Complete (all layers) |
| CRB | Advanced or higher |
| Uptime commitment | 95%+ |
| Hardware | Standard server (documented specs) |

### Validator Earnings:
```
Per Block Validated: X EHBGC (defined at chain launch)
Transaction Fees:    % of each transaction in block
Monthly Bonus:       Based on uptime + accuracy
```

### Slashing Rules (Validator Penalties):
| Violation | Penalty |
|-----------|---------|
| Double signing | 20% stake slashed |
| Extended downtime (>24hr) | 5% stake slashed |
| Malicious transaction | 100% slashed + ban |
| STL drops below L4 | Validator paused |

---

## PART 10: GOVERNANCE SYSTEM

### Token-Weighted Voting:
- Platform proposals submitted by HO, Country Franchise, or community
- Token holders vote (1 EHBGC = 1 vote)
- Minimum 1,000 EHBGC to submit a proposal
- Quorum required: 10% of circulating supply
- Voting period: 7 days

### Proposal Categories:
1. Platform fee changes
2. Token emission rate changes
3. New feature proposals
4. Franchise policy changes
5. STL formula adjustments

---

## PART 11: ESCROW SYSTEM

### How Escrow Works for Transactions:
```
Order Placed
        ↓
Payment → Escrow Hold (DMO-controlled)
        ↓
Order Fulfilled (delivery confirmed)
        ↓
Escrow Released:
  → Seller (70%)
  → Franchise chain (8%)
  → Platform (10%)
  → Rider (5%)
  → Affiliate (7%)
        ↓
All splits in EHBGC (real-time)
```

### Escrow Dispute:
- Customer claims non-delivery → Escrow held
- DMO reviews evidence (GPS, photos, tracking)
- Decision within 24hrs:
  - Delivery confirmed → Seller paid
  - Not delivered → Refund to buyer

---

## PART 12: ANTI-MONEY LAUNDERING (AML) SYSTEM

### AML Checks Triggered For:
- Deposits > PKR 50,000 / £250 / $315 (single transaction)
- Cumulative deposits > PKR 200,000 / £1,000 in 30 days
- Withdrawal > 80% of total balance
- Multiple accounts detected on same device
- High-frequency micro-transactions (structuring pattern)

### AML Response Flow:
```
AML Flag Triggered
        ↓
Account: deposits/withdrawals PAUSED (not frozen)
        ↓
User notified: verify source of funds
        ↓
DMO AML team reviews (24hr SLA)
        ↓
User submits: bank statements / proof of funds
        ↓
Cleared → Operations resume
Flagged → PSS Authority investigation
Confirmed laundering → Account banned + reported
```

---

## PART 13: TRANSACTION HISTORY + REPORTING

### Every Transaction Records:
```
Transaction Log {
  id
  userId
  type: DEPOSIT / WITHDRAWAL / PURCHASE / EARNING / STAKING / FEE
  amount (EHBGC)
  localEquivalent (currency + amount)
  rateUsed
  method (payment gateway)
  status: PENDING / COMPLETED / FAILED / REVERSED
  referenceId (order/inspection/course ID)
  timestamp
  ipAddress
  deviceId
}
```

### Reports Available to Users:
- Monthly statement (PDF downloadable)
- Tax report (annual, income + gains)
- Staking rewards log
- Affiliate earning breakdown
- Transaction-by-transaction history

---

## PART 14: BLOCKCHAIN INTEGRATION

### What Goes On EHBGC Blockchain:
| Data | Why Blockchain |
|------|---------------|
| Wallet balances | Immutable, decentralized |
| Transaction hashes | Tamper-proof record |
| Staking records | Transparent |
| Validator actions | Accountability |
| Skill NFTs | Permanent ownership |
| STL score snapshots | Public trust record |
| CRB certificate hashes | Verifiable globally |

### Blockchain Choice: Polkadot (Planned)
- EHBGC as parachain native token
- Cross-chain compatibility (connect to ETH, BNB, etc.)
- Low transaction fees (essential for micro-transactions)
- EHBGC can exist both as platform coin and tradeable asset

### Public Verification Portal:
- Anyone can verify: CRB certs, STL score history, skill NFTs
- No personal data shown — only hashes + status
- Business trust verifiable by third parties (banks, employers, partners)

---

## PART 15: SECURITY FEATURES

### Wallet Security Layers:
1. **PIN** — 6-digit PIN for all transactions
2. **Biometric** — Face/fingerprint on mobile app
3. **2FA** — Required for withdrawals
4. **Device Whitelist** — New device = email confirmation required
5. **Withdrawal Delay** — First-time withdrawal: 24hr hold
6. **Transaction Limit Overrides** — If request > daily limit → DMO review

### Suspicious Activity Alerts:
- Login from new device → SMS + email alert
- Large withdrawal → Confirmation required
- Multiple failed PIN attempts → Account temporary lock
- IP change mid-session → Re-authentication required

---

## PART 16: DATABASE MODELS

```prisma
model Wallet {
  id
  userId
  ehbgcBalance (Decimal)
  stakedAmount (Decimal)
  lockedAmount (Decimal)  -- escrow holds
  amlStatus (CLEAR/FLAGGED/REVIEW)
  withdrawalEnabled (Boolean)
  createdAt
}

model Transaction {
  id
  walletId
  userId
  type (DEPOSIT/WITHDRAWAL/PURCHASE/EARNING/STAKING/FEE/ESCROW)
  amount (Decimal)
  currency
  localAmount
  localCurrency
  rateUsed
  paymentMethod
  status (PENDING/COMPLETED/FAILED/REVERSED)
  referenceId
  metadata: Json
  createdAt
}

model StakingRecord {
  id
  userId
  amount (Decimal)
  lockPeriodDays
  apy
  startDate
  endDate
  rewardsEarned (Decimal)
  status (ACTIVE/COMPLETED/EARLY_UNSTAKED)
  penaltyApplied (Decimal)
}

model EscrowHold {
  id
  transactionId
  fromUserId
  toUserId
  amount (Decimal)
  reason
  status (HELD/RELEASED/DISPUTED/REFUNDED)
  heldAt
  releasedAt
  disputeReason
}

model AMLRecord {
  id
  userId
  flagType
  triggerAmount
  triggerReason
  status (PENDING/CLEARED/FLAGGED/BANNED)
  reviewedBy
  reviewedAt
  evidence: Json
}

model ValidatorNode {
  id
  userId
  stakedAmount (Decimal)
  uptime (Decimal)
  blocksValidated (Int)
  rewardsEarned (Decimal)
  status (ACTIVE/PAUSED/SLASHED/BANNED)
  joinedAt
}
```

---

## PART 17: API ROUTES PLAN

```
# Wallet
GET    /api/wallet                     → Wallet balance + breakdown
GET    /api/wallet/history             → Transaction history
POST   /api/wallet/deposit             → Initiate deposit
POST   /api/wallet/withdraw            → Request withdrawal
POST   /api/wallet/send                → Send EHBGC to another user
GET    /api/wallet/statement           → Monthly statement (PDF)

# Staking
GET    /api/wallet/staking             → My staking positions
POST   /api/wallet/staking/stake       → New staking position
POST   /api/wallet/staking/unstake     → Unstake (with penalty check)
GET    /api/wallet/staking/rewards     → Staking rewards history

# Escrow
GET    /api/wallet/escrow              → Active escrow holds
POST   /api/wallet/escrow/hold         → Create escrow hold
POST   /api/wallet/escrow/release      → Release escrow
POST   /api/wallet/escrow/dispute      → Raise dispute

# Validator
POST   /api/validator/register         → Register as validator
GET    /api/validator/status           → My validator status
GET    /api/validator/earnings         → Validator earning history

# Rate
GET    /api/wallet/rate/[currency]     → Live EHBGC rate for currency

# DMO
GET    /api/dmo/wallet/aml/queue       → AML flagged accounts
PATCH  /api/dmo/wallet/aml/[id]        → AML decision
GET    /api/dmo/wallet/transactions    → All transactions (admin)
GET    /api/dmo/wallet/escrow          → All active escrow holds
```

---

*Wallet + Token Plan v1.0 | April 2026 | Planning Phase*
