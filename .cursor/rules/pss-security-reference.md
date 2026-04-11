# PSS Security & Compliance Reference

> Identity, KYC/KYB, AML, Risk Monitoring

## PSS = Proof & Security System

**Role:** EHB's identity verification and compliance engine

## 10 Core Modules

| # | Module | Purpose |
|---|--------|---------|
| 1 | Identity Verification | Verify ID documents |
| 2 | Liveness Detection | Prevent spoofing/deepfakes |
| 3 | AML Screening | Sanctions, PEP, watchlists |
| 4 | Address Verification | Confirm physical address |
| 5 | Ongoing Monitoring | Continuous risk check |
| 6 | EDD Questionnaires | High-risk user data |
| 7 | Transaction Monitoring | Suspicious patterns |
| 8 | Crypto Monitoring | Blockchain risk analysis |
| 9 | KYB (Business) | Company verification |
| 10 | Behavior Monitoring | Anomaly detection |

## Security Modules

- Face Authentication (2FA)
- Device Intelligence
- Email Risk Scoring
- Phone Risk Scoring
- IP Risk Scoring

## Risk Score Levels

| Score | Level | Action |
|-------|-------|--------|
| 0-30 | Low | Auto-approve |
| 31-60 | Medium | Enhanced review |
| 61-80 | High | Manual review |
| 81-100 | Critical | Reject |

## STL Impact

| Result | Impact |
|--------|:------:|
| ID Verified | +10 |
| Liveness Passed | +5 |
| AML Clear | +10 |
| Address Verified | +5 |
| High Risk | -20 |
| Sanctions Hit | -50 |

## PSS Flow

```
User → ID Verify → Liveness → AML Check
  → Address → Risk Score → DMO → STL
```

## Database: ~40+ Tables

```
pss_verifications, identity_documents,
aml_screenings, risk_scores, device_fingerprints,
crypto_wallets, kyb_verifications, etc.
```

---

*Full details: docs/architecture/pss-security-compliance.md*
