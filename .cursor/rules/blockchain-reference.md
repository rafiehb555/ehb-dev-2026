# EHB Blockchain Quick Reference

> Polkadot-Based Trust Registry

## What Goes On-Chain

| Record Type | Data |
|-------------|------|
| Certifications | Hash + metadata |
| STL Updates | Score + timestamp |
| Inspections | Hash + result |
| Licenses | Hash + validity |
| Audit Logs | Hash + action |

## What Stays Off-Chain

| Data | Storage |
|------|---------|
| Documents | Encrypted IPFS |
| PDFs | IPFS with hash |
| Photos | Secure cloud |

## Architecture

```
DMO → PSS/CRB/STL Hashes
         │
    Polkadot Relay
         │
    EHB Parachain
         │
  Certificate Registry
  License Registry
  Inspection Logs
```

## Smart Contracts

1. **Verification Contract** - recordVerification()
2. **Certificate Contract** - issueCertificate()
3. **License Contract** - issueLicense()
4. **STL Contract** - updateScore()
5. **Escrow Contract** - createEscrow()

## Tech Stack

```
Blockchain: Polkadot Substrate
Contracts:  Ink! (Rust)
Storage:    IPFS
Bridge:     Polkadot XCM
```

## Benefits
- Tamper-proof records
- Decentralized trust
- Transparent audit
- Cross-border verification

---

*Full details: docs/architecture/blockchain-polkadot.md*
