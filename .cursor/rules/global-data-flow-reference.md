# DMO Global Data Flow Quick Reference

> Country → Region → Global Architecture

## Data Flow Layers

```
User Device → CDN → Local Server → 
Regional Hub → Global DMO → Blockchain
```

## Data Classification

| Type | Location | Example |
|------|----------|---------|
| Local | Country | KYC, PII |
| Regional | Hub | Listings, reviews |
| Global | DMO Core | STL, certs |

## Regional Hubs

- **Asia:** Singapore (PK, UAE, IN)
- **Europe:** Frankfurt (DE, UK, FR)
- **Americas:** Virginia (US, CA, BR)

## Data Sovereignty Rule

```
USER DATA STAYS IN ORIGINATING COUNTRY
```

## Sync Patterns

| Data | Strategy | Latency |
|------|----------|---------|
| PII | No sync | N/A |
| STL | Real-time | < 1s |
| Blockchain | Immediate | < 5s |
| Listings | Hourly | 1h |
| Analytics | Daily | 24h |

## Infrastructure

- CDN: Cloudflare
- Container: Kubernetes
- Database: PostgreSQL (per region)
- Message: Kafka
- Blockchain: Polkadot

## Full Details

See: `docs/architecture/dmo-global-data-flow.md`
