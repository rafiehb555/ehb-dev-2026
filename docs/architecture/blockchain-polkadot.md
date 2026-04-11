# DMO GLOBAL BLOCKCHAIN ARCHITECTURE

> Polkadot-Based Trust Registry System

---

# OVERVIEW

EHB uses blockchain as a **trust registry system** - not for all data, but for **critical verification records**.

---

# ARCHITECTURE CONCEPT

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EHB DMO                                     │
│              (Decentralized Management Office)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │  PSS HASH   │     │  CRB HASH   │     │  STL HASH   │
       │ Verification│     │ Certificate │     │ Trust Score │
       │   Proofs    │     │   Proofs    │     │   Updates   │
       └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    POLKADOT RELAY CHAIN                             │
│                  (Cross-chain communication)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EHB PARACHAIN                                 │
│               (Custom blockchain for EHB)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  CERTIFICATE    │    │    LICENSE      │    │  INSPECTION     │
│    REGISTRY     │    │    REGISTRY     │    │     LOGS        │
│                 │    │                 │    │                 │
│ - CRB Certs     │    │ - Business Lic  │    │ - PSS Results   │
│ - Prof Certs    │    │ - Trade Lic     │    │ - CRB Reports   │
│ - Degree Verify │    │ - Permits       │    │ - Audit Trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

# WHAT GOES ON BLOCKCHAIN

## On-Chain (Blockchain)
Only **critical trust records** with hashes:

| Record Type | Data Stored | Purpose |
|-------------|-------------|---------|
| Certifications | Hash + metadata | Proof of certification |
| STL Score Updates | Score + timestamp | Trust history |
| Inspection Reports | Hash + result | Verification proof |
| Licenses | Hash + validity | License verification |
| Audit Logs | Hash + action | Immutable audit trail |

## Off-Chain (IPFS / Secure Storage)
Actual documents stored securely:

| Document Type | Storage |
|---------------|---------|
| ID Documents | Encrypted IPFS |
| Certificates (PDF) | IPFS with hash on-chain |
| Inspection Photos | Secure cloud storage |
| Legal Documents | Encrypted storage |

---

# POLKADOT INTEGRATION

## Why Polkadot?

| Feature | Benefit |
|---------|---------|
| Parachains | Custom blockchain for EHB |
| Scalability | High transaction throughput |
| Interoperability | Connect with other chains |
| Governance | On-chain governance |
| Security | Shared security model |

## EHB Parachain

```
┌─────────────────────────────────────────────────────────────────────┐
│                       EHB PARACHAIN                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    RUNTIME MODULES                           │   │
│  ├─────────────┬─────────────┬─────────────┬──────────────────┤   │
│  │ Certificate │   License   │    Trust    │     Audit        │   │
│  │   Module    │   Module    │   Module    │    Module        │   │
│  └─────────────┴─────────────┴─────────────┴──────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SMART CONTRACTS                           │   │
│  ├─────────────┬─────────────┬─────────────────────────────────┤   │
│  │ Verification│   Escrow    │    Governance                   │   │
│  │  Contract   │  Contract   │    Contract                     │   │
│  └─────────────┴─────────────┴─────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# SMART CONTRACTS

## 1. Verification Contract

```
Functions:
- recordVerification(userId, verificationType, hash, result)
- getVerificationHistory(userId)
- verifyHash(hash)
```

## 2. Certificate Contract

```
Functions:
- issueCertificate(userId, certType, hash, expiry)
- revokeCertificate(certId, reason)
- verifyCertificate(certId)
- getCertificateHistory(userId)
```

## 3. License Contract

```
Functions:
- issueLicense(entityId, licenseType, hash, validity)
- renewLicense(licenseId, newExpiry)
- suspendLicense(licenseId, reason)
- verifyLicense(licenseId)
```

## 4. STL Contract

```
Functions:
- updateScore(userId, newScore, reason)
- getScoreHistory(userId)
- calculateTrustLevel(userId)
```

## 5. Escrow Contract

```
Functions:
- createEscrow(orderId, amount, parties)
- releaseEscrow(escrowId, recipient)
- disputeEscrow(escrowId, reason)
- refundEscrow(escrowId)
```

---

# DATA FLOW

## Verification Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. USER SUBMITS VERIFICATION                                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. PSS AI PROCESSES VERIFICATION                                   │
│     - Document OCR                                                  │
│     - Fraud Detection                                               │
│     - Result: PASS/FAIL                                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. STORE DOCUMENTS (OFF-CHAIN)                                     │
│     - Encrypt documents                                             │
│     - Upload to IPFS                                                │
│     - Get content hash                                              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. RECORD ON BLOCKCHAIN                                            │
│     - Call recordVerification()                                     │
│     - Store: userId, type, hash, result, timestamp                 │
│     - Get: Transaction hash                                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. UPDATE DMO DATABASE                                             │
│     - Store tx_hash                                                 │
│     - Link to user record                                           │
│     - Update verification status                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

# VERIFICATION API

## Endpoints

```
POST /blockchain/record
     - Record verification/certificate on-chain

GET  /blockchain/verify/{hash}
     - Verify a record by hash

GET  /blockchain/history/{userId}
     - Get user's blockchain history

GET  /blockchain/certificate/{certId}
     - Verify certificate authenticity

POST /blockchain/escrow/create
     - Create escrow transaction

POST /blockchain/escrow/release
     - Release escrow funds
```

---

# BENEFITS

| Benefit | Description |
|---------|-------------|
| Tamper-Proof | Records cannot be altered |
| Decentralized Trust | No single point of failure |
| Transparent Audit | Public verification possible |
| Cross-Border | Global trust verification |
| Immutable History | Complete audit trail |

---

# QR CODE VERIFICATION

Each certificate gets a QR code:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Certificate ID: EHB-CERT-2026-12345                               │
│                                                                     │
│  ┌─────────────┐                                                   │
│  │             │  Scan to verify at:                               │
│  │   QR CODE   │  verify.ehb.com/cert/12345                       │
│  │             │                                                   │
│  └─────────────┘  Blockchain TX: 0x7f83b165...                    │
│                                                                     │
│  ✅ VERIFIED ON BLOCKCHAIN                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# TECHNOLOGY STACK

| Component | Technology |
|-----------|------------|
| Blockchain | Polkadot Substrate |
| Parachain | Custom EHB chain |
| Smart Contracts | Ink! (Rust) |
| Off-chain Storage | IPFS |
| Bridge | Polkadot XCM |
| Wallet | Polkadot.js |

---

*Blockchain Architecture v1.0 | March 2026*
