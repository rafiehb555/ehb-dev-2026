# EHB module dependency (design)

> High-level order for **design + flow** work. Downstream modules assume upstream trust and identity concepts are stable.  
> Source: [EHB_MASTER_SYSTEM_PLAN.md](../development/EHB_MASTER_SYSTEM_PLAN.md), ecosystem references.

```mermaid
flowchart TB
  subgraph foundation [Foundation]
    Master[EHB_MASTER_SYSTEM_PLAN]
    Names[EHB_MASTER_NAMES_PLAN]
    Color[EHB_COLOR_SCHEME_PLAN]
    UIUX[EHB_UIUX_DESIGN_PLAN]
    Color --> UIUX
  end

  subgraph trust [TrustStack]
    PSSCRB[EHB_PSS_CRB_PLAN]
    STL[EHB_STL_FULL_PLAN]
    STLUI[EHB_STL_UI_DESIGN_PLAN]
    PSSCRB --> STL
    STL --> STLUI
  end

  subgraph governance [Governance]
    DMO[EHB_DMO_PLAN]
  end

  subgraph ops [CoreOps]
    JPS[EHB_JPS_PLAN]
    Gos[EHB_GOSELLR_PLAN]
  end

  subgraph money [Money]
    Wallet[EHB_WALLET_TOKEN_PLAN]
  end

  subgraph network [Network]
    Fran[EHB_FRANCHISE_PLAN]
  end

  subgraph growth [Growth]
    Aff[EHB_AFFILIATE_PLAN]
    Comp[EHB_COMPLAINT_PENALTY_PLAN]
  end

  subgraph chain [Chain]
    BC[EHB_BLOCKCHAIN_PLAN]
  end

  subgraph scale [Scale]
    Ind[EHB_INDUSTRIES_UI_PLAN]
  end

  subgraph existing [Existing_flow_docs]
    UF[USER_FLOW]
    PF[PROVIDER_FLOW]
  end

  Master --> Names
  UIUX --> Ind
  trust --> DMO
  DMO --> JPS
  DMO --> Gos
  PSSCRB --> BC
  JPS --> Gos
  Fran --> Comp
  Wallet --> Aff
  trust --> UF
  trust --> PF
```

## Reading order (recommended)

1. Master + names + color + UI/UX (foundation)
2. PSS/CRB → STL → STL UI (trust)
3. DMO (oversight)
4. JPS → GoSellr (people + commerce)
5. Wallet → Franchise → Affiliate + Complaint
6. Blockchain (trust anchoring design)
7. Industries UI (scale)

---

*P0 artifact — revise when a plan file changes materially.*
