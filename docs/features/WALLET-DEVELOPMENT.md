# WALLET DEVELOPMENT GUIDE — Payment & Escrow System

**Version:** 1.0  
**Updated:** 2026-04-14  
**Status:** Phase 1 (Off-chain), Phase 2 (BSC BEP-20)  

---

## Overview: Wallet Architecture

**EHB Wallet** is a two-bucket system: **Locked** (escrow, holds) + **Free** (available balance). Phase 1 uses MongoDB; Phase 2 migrates to Binance Smart Chain (BSC) BEP-20 EHBGC token.

**Key Principle:** All transactions are immutable, reversible only via DMO complaint resolution.

---

## Two-Bucket System

### Bucket 1: Locked Balance
Reserved funds (escrow holds, pending payouts, frozen due to dispute).

**State Transitions:**
```
Free → Locked
  (Order placed, order confirmed, or dispute filed)

Locked → Soft Release (24h grace period)
  (Buyer confirms delivery OR default timer)

Locked → Full Release (7d window closes)
  (Dispute resolved in seller's favor OR timeout)

Locked → Returned to Free
  (Dispute resolved in buyer's favor OR order cancelled)
```

### Bucket 2: Free Balance
Available to spend, withdraw, or transfer.

**Uses:**
- Order purchases
- Wallet transfers (user-to-user)
- Withdrawals (to bank account, Phase 2: to BSC)
- Tip/bonus contributions

---

## Escrow Flow (Core Transaction)

```
Timeline:
  T0: Order placed (buyer -$amount locked, seller awaits)
  T0+24h: Soft release (buyer confirms, seller can partially access)
  T0+7d: Full release (dispute window closes, seller fully paid)

Example: $100 order
┌─────────────────────────────────────────────────────┐
│ T0: Buyer places order                              │
│ • Buyer wallet: free $500 → locked $100, free $400 │
│ • Seller wallet: no change yet (waiting)            │
├─────────────────────────────────────────────────────┤
│ T0+24h: Buyer confirms delivery                     │
│ • Buyer wallet: no change                           │
│ • Seller wallet: soft release $70 (45%), locked $30│
│   (EHB cut: $30, Franchise: $0, Seller keeps $70)  │
├─────────────────────────────────────────────────────┤
│ T0+7d: Dispute window closes                        │
│ • Seller wallet: locked $30 → free $30             │
│ • Final seller balance: free $100 (70% of order)   │
│ • Franchise/EHB paid, seller done                  │
└─────────────────────────────────────────────────────┘

If dispute filed (T0 to T0+7d):
├─ DMO investigates
├─ If seller liable: buyer refund, seller -$100 locked → free (refund issued)
├─ If buyer liable: order completes normally
└─ Both liability: 50/50 split
```

---

## Transaction Types

| Type | Flow | Points STL | Example |
|------|------|-----------|---------|
| **Deposit** | External bank → wallet free | 0 | User adds $100 |
| **Withdraw** | Wallet free → external bank | -2 | User cashes out |
| **Transfer** | User A free → User B free | 0 | Send money to friend |
| **Order** | Buyer free → locked (escrow) | 0 | Buy product ($50) |
| **Release** | Locked → seller free (escrow) | +2 | Order completes (seller earns) |
| **Refund** | Locked → buyer free (DMO) | 0 | Complaint resolved |
| **Lock** | Free → locked (EHBGC ladder) | 0 | User locks tokens for reward |
| **Unlock** | Locked → free (after period) | +1 | 30-day lock completed |
| **Earning** | DMO/franchise → free | +1 | Referral payout |
| **Fee** | Free → EHB | -5 | Monthly subscription |
| **Penalty** | Free → EHB (complaint) | -5 | User violation fine |

---

## Wallet Limits by STL Level

Constraints prevent fraud and manage risk.

| Level | Daily Limit | Monthly Limit | Transfer Limit | Can Withdraw? | Can Receive |
|-------|-------------|--------------|----------------|---------------|-----------|
| **L0** | $0 | $0 | $0 | No | Yes (pending) |
| **L1** | $0 | $0 | $0 | No | Yes (pending) |
| **L2** | $50 | $200 | $10 | Yes | Yes |
| **L3** | $200 | $500 | $25 | Yes | Yes |
| **L4** | $500 | $2K | $100 | Yes | Yes |
| **L5** | $1K | $5K | $500 | Yes | Yes |
| **L6** | $2K | $10K | $1K | Yes | Yes |
| **L7** | $5K | $20K | $5K | Yes | Yes |
| **L8** | $20K | $50K | $20K | Yes | Yes |
| **L9** | Unlimited | Unlimited | Unlimited | Yes | Yes |

**Implementation:**
```javascript
async function checkWalletLimit(userId, transactionType, amount) {
  const user = await User.findById(userId);
  const wallet = await Wallet.findOne({ user_id: userId });
  
  const limits = getWalletLimits(user.stl_level);
  
  // Check daily
  const dailyUsed = await Transaction.aggregate([
    { $match: {
        user_id: userId,
        type: transactionType,
        created_at: { $gte: startOfDay(now) },
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  
  if (dailyUsed[0]?.total + amount > limits.daily) {
    throw new AppError(
      `Daily limit exceeded ($${limits.daily})`,
      429,
      true
    );
  }
  
  // Check monthly
  const monthlyUsed = await Transaction.aggregate([
    { $match: {
        user_id: userId,
        type: transactionType,
        created_at: { $gte: startOfMonth(now) },
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  
  if (monthlyUsed[0]?.total + amount > limits.monthly) {
    throw new AppError(
      `Monthly limit exceeded ($${limits.monthly})`,
      429,
      true
    );
  }
  
  return true;
}
```

---

## EHBGC Lock Ladder (Phase 2)

Users can lock EHBGC tokens for additional rewards.

| Lock Period | Daily APY | Monthly APY | Unlock Fee | Example |
|------------|-----------|------------|-----------|---------|
| **7 days** | 0.1% | 3% | 0.5% | Lock $1K → earn $3/month → $29.50 after unlock |
| **30 days** | 0.15% | 4.5% | 0.3% | Lock $1K → earn $45/month |
| **90 days** | 0.2% | 6% | 0.2% | Lock $1K → earn $180/quarter |
| **180 days** | 0.25% | 7.5% | 0.1% | Lock $1K → earn $1,500 over 6 months |
| **365 days** | 0.3% | 9% | 0% | Lock $1K → earn $9K/year (no unlock fee) |

**Early Unlock:** Forfeits interest + pays fee (%) + -5 STL penalty.

**Implementation (Phase 2):**
```javascript
async function lockEHBGC(userId, amount, period) {
  // Transfer to locked contract
  await ehbgcContract.lock(userId, amount, period);
  
  // Calculate expected reward
  const apy = getLockAPY(period);
  const reward = (amount * apy / 100) * (period / 365);
  
  // Create lock record
  await EHBGCLock.create({
    user_id: userId,
    amount,
    lock_date: now,
    unlock_date: addDays(now, period),
    expected_reward: reward,
    status: 'locked',
  });
  
  // Add STL bonus (1 pt per lock)
  user.stl_manual_adjustment += 1;
}
```

---

## Franchise Revenue Split (Automatic)

Every order triggers 5-way split.

**Example: $100 order**

```
Order Total: $100 (buyer pays)
  ↓
EHB takes 30%: $30
  ├─ Operations/tech: 30%
  ├─ Compliance/legal: 30%
  └─ Future growth: 40%
  ↓
Remaining for seller: $70
  ├─ Franchise (Country L1): 15% of $100 = $15
  │  └─ Sub-franchise (State L2): 3% of $100 = $3
  │     └─ Sub-sub (City L3): 2% of $100 = $2
  │
  ├─ Affiliate (if referrer): 10% of $100 = $10
  │
  └─ Seller (net): 45% of $100 = $45 (final)

Distribution:
EHB: $30
Franchise L1 (country): $15/month payout
Franchise L2 (state): $3/month payout
Franchise L3 (city): $2/month payout
Affiliate: $10 (on next commission payout cycle)
Seller: $45 free balance immediately
```

**Database schema:**
```javascript
{
  _id: ObjectId,
  order_id: ObjectId,
  seller_id: ObjectId,
  buyer_id: ObjectId,
  gross_amount: 100,
  
  breakdown: {
    ehb_cut: 30,
    seller_amount: 45,
    franchise_l1: 15,
    franchise_l2: 3,
    franchise_l3: 2,
    affiliate: 10,
  },
  
  payouts: [
    { recipient_type: 'seller', amount: 45, status: 'released', released_at: now },
    { recipient_type: 'franchise_l1', amount: 15, status: 'pending_monthly_payout' },
    { recipient_type: 'affiliate', amount: 10, status: 'pending_cycle_payout' },
  ],
  
  created_at: now,
}
```

---

## Database Schema

### Collections

```javascript
// wallets
{
  _id: ObjectId,
  user_id: ObjectId (unique),
  locked_balance: Number, // Escrow, holds, frozen funds
  free_balance: Number,   // Available to spend
  total_deposited: Number, // Lifetime
  total_withdrawn: Number,
  total_earned: Number,
  last_transaction_at: Date,
  created_at: Date,
}

// transactions
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String, // 'deposit', 'withdraw', 'order', 'release', 'transfer', 'fee', 'penalty', 'earning', 'lock', 'unlock'
  amount: Number,
  from_wallet: String, // 'free' or 'locked'
  to_wallet: String,
  status: String, // 'pending', 'completed', 'failed', 'reversed'
  
  // For transfers
  recipient_id: ObjectId,
  
  // For orders
  order_id: ObjectId,
  order_phase: String, // 'escrow_hold', 'soft_release', 'full_release'
  
  // For external
  bank_account_id: ObjectId,
  reference_id: String, // ACH, wire, BSC txn hash
  
  // Metadata
  notes: String,
  ip_address: String,
  user_agent: String,
  
  created_at: Date,
  completed_at: Date,
  error: String, // If failed
  reversible_until: Date, // 7d window for some transactions
}

// escrow_holds
{
  _id: ObjectId,
  order_id: ObjectId,
  buyer_id: ObjectId,
  seller_id: ObjectId,
  amount: Number,
  status: String, // 'locked', 'soft_released', 'full_released', 'returned'
  
  // Timeline
  locked_at: Date,
  soft_release_at: Date, // T+24h
  full_release_at: Date, // T+7d
  
  // If dispute
  dispute_id: ObjectId,
  dispute_resolution: Object,
  
  created_at: Date,
}
```

---

## API Endpoints

### GET `/api/wallet/balance`
Get user's wallet balance.

**Response:**
```json
{
  "success": true,
  "wallet": {
    "free_balance": 450.75,
    "locked_balance": 100.00,
    "total_balance": 550.75,
    "limits": {
      "daily": 1000,
      "monthly": 5000,
      "daily_used": 200,
      "monthly_used": 1200
    }
  }
}
```

### POST `/api/wallet/deposit`
Deposit from bank account.

**Request:**
```json
{
  "bank_account_id": "bank_123",
  "amount": 500
}
```

### POST `/api/wallet/withdraw`
Withdraw to bank account.

**Request:**
```json
{
  "amount": 250,
  "bank_account_id": "bank_123"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "transaction_id": "txn_xyz",
  "status": "pending",
  "message": "Withdrawal initiated. Processing 1-3 business days."
}
```

### POST `/api/wallet/transfer`
Send money to another user.

**Request:**
```json
{
  "recipient_id": "507f1f77bcf86cd799439011",
  "amount": 50
}
```

### GET `/api/wallet/transactions?limit=50&offset=0`
Transaction history.

**Response:**
```json
{
  "data": [
    {
      "id": "txn_123",
      "type": "order",
      "amount": 50,
      "status": "completed",
      "created_at": "2026-04-14T10:30:00Z",
      "description": "Purchase - Product ABC"
    }
  ],
  "total": 256
}
```

### POST `/api/wallet/lock-ehbgc` (Phase 2)
Lock tokens for reward.

**Request:**
```json
{
  "amount": 1000,
  "period": 90
}
```

---

## Fraud Protection (Up-Guard Signals)

AI monitors transactions for fraud.

**Signals:**
- Velocity: $10K in 1 hour → ALERT
- Destination: Known scam wallet → BLOCK
- Device change: New device, $500+ → VERIFY (2FA)
- Withdrawal: L3 user cashing out $1K (limit: $500/month) → DENY
- Refund loop: Same buyer 5+ refunds → SUSPEND
- Chargebacks: Bank disputes >3 → FREEZE wallet

**Implementation:**
```javascript
async function assessTransactionFraud(transaction) {
  const signals = [];
  
  // Velocity
  const lastHour = await Transaction.countDocuments({
    user_id: transaction.user_id,
    created_at: { $gte: Date.now() - 60*60*1000 },
  });
  if (lastHour > 10) signals.push({ type: 'velocity', score: 70 });
  
  // Known scam
  if (isKnownScamAddress(transaction.destination)) {
    signals.push({ type: 'scam_destination', score: 95 });
  }
  
  // Device change
  const user = await User.findById(transaction.user_id);
  if (transaction.user_agent !== user.last_user_agent && transaction.amount > 500) {
    signals.push({ type: 'device_change', score: 60 });
  }
  
  const riskScore = Math.min(100, signals.reduce((s, x) => s + x.score, 0));
  
  if (riskScore > 80) {
    throw new AppError('Transaction blocked due to fraud risk', 403, true);
  }
  
  if (riskScore > 60) {
    // Require 2FA verification
    await sendOTP(transaction.user_id);
    transaction.requires_2fa = true;
  }
  
  return transaction;
}
```

---

## Phase 1: Off-Chain (MongoDB)

**Current state:** All wallets stored in MongoDB. Fast, centralized.

**Advantages:**
- Instant transactions
- Easy reversals (DMO complaints)
- Instant STL balance updates

**Disadvantages:**
- Centralized custody (EHB holds funds)
- No on-chain proof
- Single point of failure

---

## Phase 2: BSC BEP-20 (Binance Smart Chain)

**Migration target:** Users opt-in to hold EHBGC tokens on BSC.

**Flow:**
1. User deposits $1K → EHB mints 1K EHBGC tokens (1:1) → Transfer to user's BSC wallet
2. User spends EHBGC on marketplace (token transfer)
3. User withdraws $1K → Burn 1K EHBGC tokens → Send $1K to bank

**Advantages:**
- User custody (non-custodial)
- Immutable transaction history (blockchain proof)
- Interoperability (trade EHBGC on DEX)
- Escape hatch (transfer to self-hosted wallet)

**Timeline:** Q3 2026

---

## Key Rules (Non-Negotiable)

1. **Locked balance is sacred.** Never access without owner permission (except DMO court order).
2. **Escrow windows are fixed.** Soft release 24h, full release 7d. No shortcuts.
3. **All transactions logged.** Immutable audit trail. 7-year retention.
4. **Limits enforced by STL.** No bypass. If you drop L4 → L3, max daily = $200 (hard block).
5. **Withdrawals are final.** Can't reverse once sent to bank (except DMO override).
6. **Fraud is unforgiving.** Up-Guard score >80 = instant block, manual review required.
7. **Revenue split is automatic.** No manual payouts. Scheduled batch jobs handle franchises.

---

*EHB Technologies (Pvt.) Ltd. — Wallet Development Guide v1 — 2026-04-14*
