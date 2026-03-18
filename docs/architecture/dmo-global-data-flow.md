# DMO GLOBAL DATA FLOW DIAGRAM

> Country → Region → Global Architecture

---

# OVERVIEW

EHB global system requires **multi-region infrastructure** for:
- Data sovereignty compliance
- Low latency access
- Disaster recovery
- Regulatory compliance

---

# GLOBAL DATA FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                       USER DEVICE                                   │
│              (Mobile App / Web Browser)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CDN / EDGE                                     │
│          (Cloudflare / AWS CloudFront)                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LOCAL SERVER                                     │
│                  (Country Node)                                    │
│        Pakistan / UAE / Germany / USA / etc.                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   REGIONAL SERVER                                   │
│        (Asia Hub / Europe Hub / Americas Hub)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GLOBAL DMO CORE                                  │
│             (Central Coordination System)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN REGISTRY                                │
│              (Immutable Trust Records)                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

# DATA LAYERS

## 1. Local Data (Country Level)

**Stored in country servers:**
- KYC documents
- Personal data (PII)
- Financial records
- Local compliance data

**Rule:** Data stays in originating country

---

## 2. Regional Data (Hub Level)

**Stored in regional hubs:**
- Marketplace listings
- Service provider profiles
- Reviews and ratings
- Regional analytics

**Hubs:**
- Asia Hub (Singapore)
- Europe Hub (Frankfurt)
- Americas Hub (Virginia)

---

## 3. Global Data (DMO Core)

**Stored in global DMO:**
- STL trust scores
- Certifications
- Blockchain hashes
- Cross-region data

---

# GLOBAL SERVER STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                       GLOBAL DMO CORE                               │
│                    (Central Coordination)                           │
│                                                                     │
│   • Global metadata sync                                            │
│   • Cross-region orchestration                                      │
│   • Blockchain anchoring                                            │
│   • Analytics aggregation                                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ASIA REGION   │    │  EUROPE REGION  │    │ AMERICAS REGION │
│   (Singapore)   │    │   (Frankfurt)   │    │   (Virginia)    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Pakistan   │ │    │ │   Germany   │ │    │ │     USA     │ │
│ │    Node     │ │    │ │    Node     │ │    │ │    Node     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │     UAE     │ │    │ │     UK      │ │    │ │   Canada    │ │
│ │    Node     │ │    │ │    Node     │ │    │ │    Node     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │    India    │ │    │ │   France    │ │    │ │   Brazil    │ │
│ │    Node     │ │    │ │    Node     │ │    │ │    Node     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Indonesia  │ │    │ │   Spain     │ │    │ │  Australia  │ │
│ │    Node     │ │    │ │    Node     │ │    │ │    Node     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

# DATA SOVEREIGNTY MODEL

## Core Rule

```
USER DATA STAYS IN ITS ORIGINATING COUNTRY
```

## Example

| User Country | Data Location | Compliance |
|--------------|---------------|------------|
| Pakistan | Pakistan Server | PECA |
| UAE | UAE Server | DIFC |
| Germany | EU Server | GDPR |
| USA | US Server | CCPA |

---

# DATA SYNC PATTERNS

| Data Type | Sync Strategy | Latency |
|-----------|---------------|---------|
| User PII | No sync (stays local) | N/A |
| STL Scores | Real-time sync | < 1 sec |
| Blockchain Hashes | Immediate | < 5 sec |
| Service Listings | Periodic (hourly) | 1 hour |
| Analytics | Batch (daily) | 24 hours |
| Certifications | Real-time | < 1 sec |

---

# INFRASTRUCTURE STACK

| Layer | Technology |
|-------|------------|
| CDN | Cloudflare / AWS CloudFront |
| Load Balancer | AWS ALB / Nginx |
| Container | Kubernetes (EKS/GKE) |
| Database | PostgreSQL (per region) |
| Cache | Redis Cluster |
| Message Queue | Apache Kafka |
| Search | Elasticsearch |
| Storage | S3 / IPFS |
| Blockchain | Polkadot |

---

# DATA FLOW BY OPERATION

## User Registration

```
User (Pakistan) → Pakistan Node → 
  Store locally → Sync metadata to Asia Hub → 
    Update Global DMO
```

## Service Booking (Cross-region)

```
Customer (UAE) searches for Provider (Pakistan) →
  UAE Node fetches from Pakistan Node →
    Transaction in UAE, service record in Pakistan →
      Both sync to Asia Hub
```

## Verification Complete

```
PSS (Pakistan) completes verification →
  Update local record →
    Sync STL to Global →
      Blockchain hash created
```

---

# DISASTER RECOVERY

## Regional Failover

```
Primary: Asia Hub (Singapore)
Secondary: Asia DR (Tokyo)
Tertiary: Europe Hub (Frankfurt)
```

## Data Replication

- Real-time replication within region
- Cross-region async replication
- Daily backups to cold storage

---

# COMPLIANCE FRAMEWORK

| Region | Regulations |
|--------|-------------|
| Pakistan | PECA, SBP regulations |
| UAE | DIFC, ADGM data laws |
| EU | GDPR, ePrivacy |
| USA | CCPA, state laws |
| India | DPDP Act |

---

*DMO Global Data Flow v1.0 | March 2026*
