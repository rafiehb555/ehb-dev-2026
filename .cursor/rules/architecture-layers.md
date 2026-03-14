# EHB 4-Layer Architecture Reference

> Quick reference for development

## Architecture Overview

```
┌─────────────────────────────────┐
│   LAYER 1: AI DISCOVERY         │  User Entry
│   - Text/Voice/Image Search     │
│   - Service Discovery           │
│   - Auto-routing to platforms   │
├─────────────────────────────────┤
│   LAYER 2: INDUSTRY PLATFORMS   │  9 Platforms
│   - GoSellR, WMS, HPS, OBS      │
│   - OLS, AGTS, HMS, SOT, Tube   │
├─────────────────────────────────┤
│   LAYER 3: DMO GOVERNANCE       │  Central Control
│   - User/Verification Mgmt      │
│   - Financial/License Control   │
│   - Blockchain Records          │
├─────────────────────────────────┤
│   LAYER 4: VERIFICATION/TRUST   │  Security
│   - PSS (Identity/Docs)         │
│   - CRB (Certification)         │
│   - STL (Trust Levels)          │
└─────────────────────────────────┘
```

## Development Guidelines by Layer

### Layer 1 - AI Discovery
- OpenAI API integration
- Search indexing
- Platform routing logic

### Layer 2 - Industry Platforms
- Each platform = separate module
- Shared components via DMO
- Platform-specific business logic

### Layer 3 - DMO
- Central API gateway
- Cross-platform operations
- Admin dashboard

### Layer 4 - Verification
- Identity verification APIs
- Document processing (OCR)
- Trust level management

## Data Flow

```
User → AI Discovery → Platform → DMO → Verification → DB → Blockchain
```

---

*Full details: docs/EHB-GLOBAL-SERVICES-MAP.md*
