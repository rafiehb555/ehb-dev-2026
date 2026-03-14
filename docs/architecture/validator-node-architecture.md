 # EHB VALIDATOR NODE ARCHITECTURE

*(Mosaic Galaxy + EHB Blockchain Network Nodes)*

This document details the **validator node architecture** for the EHB blockchain when deployed in the **Mosaic Galaxy ecosystem**. It explains the roles and flows for:

- Relay Validators (Mosaic Chain)
- EHB Collator Nodes (Parachain Nodes)
- Full Nodes / API Nodes

---

## 1️⃣ NODE TYPES OVERVIEW

EHB network uses three primary node types:

1. **Relay Validators** – secure the Mosaic Chain (core network).
2. **EHB Collator Nodes** – produce EHB parachain blocks.
3. **Full Nodes / API Nodes** – provide read access and APIs to apps and wallets.

---

## 2️⃣ RELAY VALIDATORS (MOSAIC CHAIN)

Relay Validators are **core security nodes** for the Mosaic Chain.

Responsibilities:

- Verify **parachain blocks and proofs**.
- Participate in **consensus** (finality, block production on the relay).
- Approve **cross-chain transactions** routed via Mosaic Highway.
- Maintain overall **network security and integrity**.

Flow:

```text
Parachain Block
      │
      ▼
Relay Validator
      │
      ▼
Consensus Verification
      │
      ▼
Block Finalization
```

Relay Validators ensure **all connected parachains, including EHB, are secure**.

---

## 3️⃣ EHB COLLATOR NODES (PARACHAIN NODES)

Collators are **EHB-specific nodes** responsible for building parachain blocks.

Responsibilities:

- Collect **EHB chain transactions** from users and services.
- Build **candidate blocks** for the EHB parachain.
- Generate **state proofs** and submit to Relay Validators.

Example EHB transactions:

- Identity verification events.
- Service or product certification events.
- STL trust score updates.
- Franchise inspection records.

Flow:

```text
User Transaction
      │
      ▼
EHB Collator Node
      │
      ▼
Parachain Block Created
      │
      ▼
Relay Validator Submission
```

Collators do **not finalize consensus**, but they are crucial for **block construction**.

---

## 4️⃣ FULL NODES / API NODES

Full/API nodes provide **data access and connectivity** for applications.

Responsibilities:

- Maintain a **full copy** of EHB chain state (or relevant subset).
- Serve **RPC / API endpoints** for:
  - EHB platform (web/mobile)
  - Wallets
  - Analytics systems
- Enable **indexers and explorers** to read chain data.

These nodes:

- Do not participate directly in consensus.
- Are essential for **scalability and read performance**.

---

## 5️⃣ VALIDATOR HARDWARE REQUIREMENTS

Sample requirements for robust validators/collators:

- **CPU:** 16–32 cores.
- **RAM:** 64–128 GB.
- **Storage:** NVMe SSD (2 TB+).
- **Network:** ≥ 1 Gbps symmetric bandwidth.
- **Uptime:** Target ≥ 99.9%.

Production deployments should also consider:

- Redundant power and connectivity.
- Monitoring, alerting, and secure key management.

---

## 6️⃣ STAKING SYSTEM

Validators must **stake tokens** to participate in securing the network.

Simplified flow:

```text
Token Stake
     │
     ▼
Validator Registration
     │
     ▼
Block Validation
     │
     ▼
Rewards Distribution
```

Staking ensures:

- Validators have **economic skin in the game**.
- Misbehavior can be penalized financially (slashing).

---

## 7️⃣ SLASHING SYSTEM

To protect the network:

- If a validator:
  - Goes offline frequently.
  - Attempts to create invalid blocks.
  - Double-signs or exhibits malicious behavior.
- Then a portion of their **staked tokens can be slashed**.

Example:

- Minor fault → small penalty (warning, limited slash).
- Major fault → larger slashing and potential validator removal.

This system discourages:

- Downtime.
- Malicious or careless operation.

---

## 8️⃣ REWARD SYSTEM

Validating nodes and their supporters are **rewarded**.

Reward sources:

- Transaction fees.
- Network inflation (block rewards).
- Portion of **on-chain certification and verification fees**.

Example split:

- **Validator:** 60%
- **Nominators / Stake Delegators:** 40%

This incentivizes:

- Reliable operation.
- Community participation via delegation.

---

## 9️⃣ COMPLETE VALIDATOR NETWORK FLOW

```text
User / Platform Transaction
        │
        ▼
EHB Collator Node
        │
        ▼
Parachain Block Creation
        │
        ▼
Mosaic Relay Validators
        │
        ▼
Consensus Verification
        │
        ▼
Block Finalization
        │
        ▼
Blockchain Record Stored
```

Network node structure:

```text
EHB BLOCKCHAIN NETWORK
│
├ Relay Validators (Mosaic Chain)
├ EHB Collators (Parachain Nodes)
├ Full Nodes
├ API Nodes
└ Light Clients (Wallets / Apps)
```

---

## 🔟 REAL-WORLD USE CASE – DOCTOR CERTIFICATION

1. Doctor passes verification and certification via EHB platform.
2. Certification transaction is created on EHB chain.
3. **Collator node** includes this transaction in a parachain block.
4. **Relay Validators** verify and finalize the block.
5. Certification record is **permanently stored** in the EHB + Mosaic ecosystem.

---

## RESULT

The validator node architecture ensures:

- ✔ **Decentralized trust infrastructure**.
- ✔ A secure, validator-staked **certification registry**.
- ✔ A scalable, Mosaic Galaxy–integrated **blockchain ecosystem** for EHB.

