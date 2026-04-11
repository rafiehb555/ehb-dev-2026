# EHB Blockchain Integration Architecture

**Hybrid Web2 + Web3 · Moonbeam + BSC · Token, validators, loyalty, on-chain payments**

Yeh doc **EHB token system**, **validator model**, **loyalty rewards**, aur **on-chain payments** ko define karta hai — platform **Web2 (Next.js + Node.js)** se start karega, blockchain layer **incrementally** add hogi.

---

## 1. Overview

**Goal:** EHB ko future me **token economy** aur **on-chain trust** se extend karna without replacing existing backend.

**Approach:**
- **Hybrid:** User/order/profile = existing DB (Web2); wallet balance can mirror **EHB token** (on-chain or custodial first).
- **Chains (as you prefer):** Moonbeam (EVM, Polkadot), BSC (Binance Smart Chain) — dono EVM-compatible, so same tooling (Solidity, ethers.js).
- **Phased:** Phase 1 = off-chain/custodial points (DB); Phase 2 = real token on testnet; Phase 3 = mainnet + validator/loyalty.

---

## 2. EHB Token System

**Token name (example):** EHBGC (EHB Global Credit) or EHB.

**Use cases:**
- **Rewards:** Affiliate, franchise commission, provider earnings (option to receive in EHB).
- **Payments:** Service payments, product purchases (optional EHB payment).
- **Loyalty:** Staking / holding for discounts, premium features.
- **Governance (future):** Voting on platform params.

**Initial design:**

| Item | Description |
|------|-------------|
| Standard | ERC-20 (EVM) |
| Chain (Phase 2) | Moonbeam or BSC testnet |
| Chain (Phase 3) | Moonbeam / BSC mainnet |
| Supply | Fixed or capped (e.g. 1B); vesting for team/ecosystem |
| Decimals | 18 |
| Custodial option | Backend holds user “EHB balance” in DB, later sync with on-chain or user wallet |

**Backend (Phase 1):** `wallets` table already has `balance` — treat as “EHB credits” (off-chain). When blockchain layer is on, add `wallet_address` (optional) and `on_chain_balance_snapshot` or link to contract.

---

## 3. Validator Model

**Purpose:** Network trust, dispute resolution, or reward distribution.

**Options:**

| Model | Description |
|-------|-------------|
| **Franchise validators** | Franchise owners run nodes; verify local transactions / orders; earn EHB. |
| **Staking validators** | Users stake EHB; validators get rewards; slashing if misbehave (needs chain design). |
| **Off-chain “validators”** | Trusted roles in existing DB (e.g. admin, franchise) — no chain yet; later map to on-chain. |

**Implementation order:**
1. Define “validator” in **DB + API** (e.g. `validators` table: user_id, franchise_id, role, status).
2. Later: smart contract for staking + validator set (Moonbeam/BSC).
3. Docs: “EHB Validator Onboarding” + reward rules (e.g. X EHB per verified batch).

---

## 4. Loyalty & Rewards (On-Chain Ready)

**Current (Web2):** Affiliate income, service income, franchise commission stored in `wallets` + `transactions`.

**Blockchain-ready design:**

| Reward type | Web2 (now) | Web3 (later) |
|-------------|------------|--------------|
| Affiliate | DB balance + transaction | Option to withdraw as EHB to wallet or on-chain claim |
| Service earnings | DB | Same |
| Franchise commission | DB | Same |
| Loyalty points | DB (e.g. points table) | Convertible to EHB or NFT badges |
| Staking rewards | — | Smart contract: stake EHB → yield (e.g. from revenue share) |

**Loyalty program (example):**
- Hold EHB → tier (Bronze/Silver/Gold) → discount on fees or premium features.
- Store tier in `profiles` or `wallets`; later derive from on-chain balance or NFT.

---

## 5. On-Chain Payments

**Flow (later phase):**

1. **User has wallet:** MetaMask / any EVM wallet; address stored in `users.wallet_address`.
2. **Pay with EHB:** Frontend calls token contract `transfer(merchant, amount)`; backend listens for event or checks balance; on confirmation, update order status.
3. **Pay with stablecoin (optional):** Same flow with USDT/USDC on same chain.
4. **Backend:** Order creation → “pay on-chain” → wait for tx hash → verify on chain → complete order.

**Smart contract (minimal):**
- **EHB token:** ERC-20 mint/burn or fixed supply.
- **Payment escrow (optional):** User sends EHB to contract; contract releases to seller on “order confirmed” from backend (oracle or backend-signed message).

**Security:** Backend never holds private keys; user signs in wallet. Custodial option = backend wallet for users who don’t connect wallet (balance in DB only until withdraw).

---

## 6. Moonbeam + BSC Choice

| Chain | Pros | Use case |
|-------|------|----------|
| **Moonbeam** | Polkadot ecosystem, EVM, cross-chain potential | Main chain if Polkadot integration planned |
| **BSC** | Low fees, large ecosystem, Binance support | Main chain if fee and adoption priority |

**Recommendation:** Start on **one** EVM chain (e.g. BSC or Moonbeam testnet); same Solidity + ethers.js code. Add second chain later if needed (multi-chain bridge or separate deployment).

---

## 7. Backend Integration (API)

**Phase 1 (no chain):**
- No change; `wallets.balance` = “EHB credits” in DB.

**Phase 2 (testnet):**
- `GET /api/wallet/on-chain` — return user’s EHB balance from chain (read-only RPC).
- `POST /api/wallet/connect` — save `wallet_address` for user (sign-in with wallet or link address).
- Optional: `POST /api/wallet/withdraw` — request EHB withdrawal (backend sends from treasury wallet; or user withdraws from contract).

**Phase 3 (mainnet):**
- Same APIs; production RPC and contract addresses.
- Webhook or job: sync on-chain balance to DB for display; or always read from chain.

---

## 8. Frontend (Next.js)

**Phase 2+:**
- “Connect wallet” (e.g. MetaMask): use ethers.js or wagmi; get address; send to `POST /api/wallet/connect`.
- Show “EHB balance” from API (DB or chain).
- “Pay with EHB” on checkout: trigger `contract.transfer()` from frontend; send tx hash to backend; backend verifies and completes order.

**Libraries:** ethers.js, wagmi, viem (EVM); keep existing auth (JWT) for API.

---

## 9. Data Model (DB Additions)

**Optional tables / columns:**

| Table / column | Purpose |
|-----------------|---------|
| `users.wallet_address` | EVM address (optional) |
| `validators` | user_id, franchise_id, chain_role, status, staked_amount (if staking) |
| `loyalty_tiers` or `profiles.tier` | Bronze / Silver / Gold (from EHB hold or points) |
| `transactions.tx_hash` | On-chain tx hash for payment/withdraw |

---

## 10. Implementation Order

1. **Now:** Document + keep current wallet (DB) as “EHB credits”; no chain.
2. **Phase 2:** Deploy EHB ERC-20 on testnet; add “Connect wallet” + read balance; optional withdraw.
3. **Phase 3:** Mainnet; on-chain payment flow; validator/staking contract if needed.
4. **Later:** Loyalty tiers, NFT badges, second chain or bridge.

---

## 11. Security & Compliance

- **Private keys:** Never in backend; user signs in wallet.
- **Custodial:** If backend holds user EHB, use HSM or secure vault; compliance (KYC/AML) per jurisdiction.
- **Audit:** Smart contracts audited before mainnet.
- **Docs:** Tokenomics doc (supply, vesting, use of funds) for community/partners.

---

*Rafi bhai — Jab backend + frontend ready hon, pehle testnet par EHB token deploy karke “Connect wallet” + balance show implement karo; phir payment flow. Moonbeam + BSC dono EVM hain, so ek chain pe start karna kaafi hai.*
