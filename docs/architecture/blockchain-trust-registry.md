# EHB BLOCKCHAIN TRUST REGISTRY

> Certificates, Verification & Trust Ledger (Tamper-Proof Records)

---

## 1. ROLE OF BLOCKCHAIN IN EHB

Traditional platforms store verification data only in **central databases**, which can be:

- Modified
- Deleted
- Hard to audit globally

EHB’s solution:

- Use blockchain as a **digital notary + trust ledger** for critical verification events.

Benefits:

- **Tamper-proof records**
- **Global verifiability**
- **Transparent history**
- **Higher trust for users, companies, regulators**

---

## 2. WHAT IS STORED ON BLOCKCHAIN

Blockchain stores **proofs**, not full documents.

### 2.1 On-Chain (Blockchain)

Only hashes + minimal metadata:

| Record Type           | Stored On-Chain                          |
|-----------------------|-------------------------------------------|
| Identity verification | Hash of PSS decision + timestamp         |
| Inspection reports    | Hash of report + inspector + timestamp   |
| Industry certifications| Cert ID + hash + issuer + expiry        |
| CRB certificates      | Cert ID + hash + issuance date + status  |
| STL score snapshots   | Score + level + timestamp                |
| Refilling events      | Re-verification result + date            |

### 2.2 Off-Chain (Secure Storage)

Actual documents & media:

- ID documents
- PDF certificates
- Inspection photos
- Legal docs
- Detailed reports

Stored in:

- Encrypted storage (cloud)
- IPFS (for some public / semi-public artifacts)

On-chain hash ensures:

- Any tampering of off-chain docs is **detectable**.

---

## 3. EXAMPLE: DOCTOR VERIFICATION RECORD

Doctor onboarding flow:

1. **PSS** – Identity & KYC
2. **Franchise** – Clinic / practice inspection
3. **Health Industry Authority** – Standards review
4. **CRB** – Professional certificate issuance

System issues:

```text
Certificate ID: CERT-HEALTH-458921
```

On blockchain:

- `cert_id = CERT-HEALTH-458921`
- `hash = SHA256(certificate_payload)`
- `issuer = Health Authority / CRB`
- `issued_at = timestamp`
- `expires_at = timestamp`
- `status = active / revoked / expired`

Anyone with the ID can verify:

- That a certificate **exists**.
- That it was actually issued and not forged.

---

## 4. BLOCKCHAIN + STL INTEGRATION

STL engine takes blockchain-backed events as **strong signals**.

Example impact:

- Blockchain-verified certificate → **+10 STL** bonus.
- Revoked / expired on-chain status → **automatic STL downgrade**.

Use cases:

- Differentiating providers with:
  - Only local DB records vs.
  - Fully blockchain-anchored certifications.

---

## 5. GLOBAL VERIFICATION PORTAL

EHB exposes a **public or semi-public verification portal**:

Input:

- Certificate ID
- License ID
- Provider ID (hashed)

Flow:

```text
User enters Cert ID
       │
       ▼
Query Blockchain Trust Registry
       │
       ▼
Return: VERIFIED / REVOKED / EXPIRED / NOT FOUND
```

Benefits:

- Regulators, partners, and users can **independently verify** records.

---

## 6. BLOCKCHAIN TECHNOLOGY OPTIONS

Aligned with `blockchain-polkadot.md`, EHB can use:

### Option 1 – Polkadot / Substrate (Recommended)

- EHB Parachain for:
  - Certificates
  - Licenses
  - Inspection logs
  - STL history anchors

### Option 2 – Ethereum L2

- E.g. Polygon, Arbitrum:
  - For lower-cost trust anchors.

### Option 3 – Private Consortium Chain

- Hyperledger, etc., for:
  - Restricted environments
  - Regulatory requirements

---

## 7. SMART CONTRACT LOGIC (HIGH LEVEL)

Smart contracts manage:

- Certificate issuance
- Certificate revocation
- Refilling/renewal status
- STL trust anchors

Example flows:

1. **Issue Certificate**
   - CRB / Authority calls contract to store hash + metadata.
2. **Revoke Certificate**
   - Revocation reason + timestamp stored.
3. **Record STL Snapshot**
   - Periodic or event-driven trust score anchoring.

---

## 8. BLOCKCHAIN ARCHITECTURE IN ECOSYSTEM

Simplified flow:

```text
EHB PLATFORM
     │
     ▼
Verification Systems
 (PSS + Franchise + Industry + CRB + STL)
     │
     ▼
 Hash Generation (Critical Events)
     │
     ▼
Blockchain Trust Registry
     │
     ▼
Public / Partner Verification Portal
```

Relationship to other docs:

- `blockchain-polkadot.md` – Technical chain design.
- `crb-certification-system.md` – What gets certified.
- `stl-ai-algorithm.md` – How scores are computed.
- This doc – **How trust events are permanently recorded**.

---

## 9. RESULT

Blockchain Trust Registry turns EHB into:

- A **global certification system**
- With **immutable trust records**
- And **transparent verification** for:
  - Users
  - Companies
  - Franchises
  - Regulators

This makes EHB not just a marketplace, but a **Global Digital Trust Infrastructure**.

---

*EHB Blockchain Trust Registry v1.0 | March 2026*

