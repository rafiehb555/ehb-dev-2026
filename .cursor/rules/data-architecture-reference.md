# Data Architecture Quick Reference

> Complete EHB Data Architecture

## Architecture Layers

```
User Devices → Application Layer → API Gateway → 
Microservices → DMO Core → Data Storage → Blockchain
```

## Storage Types

| Type | Technology | Purpose |
|------|------------|---------|
| Operational | PostgreSQL | Transactional data |
| Cache | Redis | Fast access, sessions |
| Search | Elasticsearch | Full-text search |
| Documents | IPFS / S3 | Files, certificates |
| Analytics | BigQuery | AI, reporting |
| Events | Kafka | Event streaming |

## Data Flow

```
User Action → Frontend → API Gateway → Microservice → 
DMO Processing → Database → Blockchain Hash
```

## Global Distribution

```
Global DMO Core
├── Asia Region (Pakistan, UAE, India nodes)
├── Europe Region (Germany, UK, France nodes)
└── Americas Region (USA, Canada nodes)
```

## Data Sync Patterns

| Data Type | Strategy |
|-----------|----------|
| User PII | No sync (local only) |
| STL Scores | Real-time sync |
| Blockchain | Immediate |
| Service Listings | Hourly |
| Analytics | Daily batch |

## Full Details

See: `docs/architecture/complete-data-architecture.md`
