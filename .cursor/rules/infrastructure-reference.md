# EHB Infrastructure Quick Reference

> Multi-Country Data Architecture

## Global Structure

```
Global DMO Core
      │
  ┌───┼───┐
  │   │   │
Asia  EU  America
```

## Data Classification

| Type | Location | Examples |
|------|----------|----------|
| Local | Country | User PII, KYC, Medical |
| Regional | Region | Marketplace, Reviews |
| Global | Master DMO | STL, Blockchain, Analytics |

## Data Sovereignty Rule

```
User data stays in the country where it is created
```

## Country Nodes

### Asia Cluster
- Pakistan (Karachi/Lahore)
- UAE (Dubai)
- India (Mumbai)
- Saudi Arabia (Riyadh)

### Europe Cluster
- Germany (Frankfurt)
- UK (London)
- France (Paris)

### America Cluster
- USA (Virginia/Oregon)
- Canada (Toronto)
- Brazil (São Paulo)

## Tech Stack

```
Cloud:      AWS / GCP / Azure
Database:   PostgreSQL
Cache:      Redis
Search:     Elasticsearch
Queue:      Kafka
CDN:        CloudFlare
Blockchain: Polkadot
```

## Security Layers

```
1. Identity (OAuth/JWT/MFA)
2. Encryption (TLS 1.3, AES-256)
3. Access Control (RBAC/ABAC)
4. Audit (Complete logs)
5. Blockchain (Verification proofs)
```

## Compliance

| Region | Regulation |
|--------|------------|
| EU | GDPR |
| UAE | Data Protection Law |
| USA | CCPA, HIPAA |
| Pakistan | PECA |

---

*Full details: docs/architecture/multi-country-infrastructure.md*
