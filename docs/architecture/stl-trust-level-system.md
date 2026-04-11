# STL — Service Trust Level

> AI-Driven Reputation & Trust System

---

# DEFINITION

**STL (Service Trust Level)** is EHB's **AI-driven reputation system** that measures trustworthiness of:
- Users
- Professionals
- Companies
- Products
- Services

---

# PURPOSE

STL system ensures:
- Trustworthy service providers
- Transparent ranking
- Quality control
- Fraud prevention

---

# STL SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER ACTIVITY                                  │
│        (Registration, Transactions, Reviews)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PSS VERIFICATION                                 │
│              (Identity & Document Check)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CRB CERTIFICATION                                │
│            (Physical Verification & Testing)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STL SCORE CALCULATION                              │
│              (AI Engine Processes Data)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SEARCH RANKING                                   │
│           (Results Ordered by STL Level)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

# STL LEVELS

| Level | Score Range | Description | Features |
|-------|-------------|-------------|----------|
| **Free** | 0-30 | Unverified users | Basic access only |
| **Basic** | 31-50 | Basic verification | Limited visibility |
| **Medium** | 51-70 | Document verified | Standard visibility |
| **High** | 71-85 | CRB certified | Priority ranking |
| **VIP** | 86-100 | Premium verified | Top ranking, badges |

---

# STL SCORE FACTORS

| Factor | Weight | Description |
|--------|--------|-------------|
| PSS Verification | 20% | Identity verification status |
| CRB Certification | 25% | Physical certification results |
| Customer Reviews | 15% | Average rating from customers |
| Complaint History | 10% | Number & severity of complaints |
| Service Performance | 15% | Order completion, delivery time |
| Refilling Results | 15% | 6-month re-verification scores |

---

# STL AI SCORING FORMULA

```
STL Score = 
    (Verification × 0.20) +
    (Certification × 0.25) +
    (Performance × 0.15) +
    (Customer Reviews × 0.15) +
    (Complaint History × 0.10) +
    (Refilling Score × 0.15)

Total Score Range: 0 - 100
```

---

# STL LEVEL CLASSIFICATION

| Score | STL Level | Search Priority |
|-------|-----------|-----------------|
| 0-30 | Free | Lowest |
| 31-50 | Basic | Low |
| 51-70 | Medium | Standard |
| 71-85 | High | Priority |
| 86-100 | VIP | Top |

---

# STL IMPACT ON PLATFORM

## Search Ranking

```
Search: "Electrician near me"

Results Order:
1. VIP Electricians (86-100)
2. High STL (71-85)
3. Medium STL (51-70)
4. Basic STL (31-50)
5. Free STL (0-30)
```

## Service Visibility

| STL Level | Visibility |
|-----------|------------|
| VIP | Featured + Top results |
| High | Priority placement |
| Medium | Standard placement |
| Basic | Lower placement |
| Free | Minimal visibility |

---

# STL PENALTY SYSTEM

Score decreases for:

| Issue | Score Impact |
|-------|--------------|
| Fake document detected | -30 |
| Multiple complaints | -15 |
| Missed refilling | -20 |
| Poor reviews (< 3 stars) | -10 |
| Failed CRB inspection | -25 |
| Fraud attempt | -50 |

---

# STL REWARD SYSTEM

Score increases for:

| Action | Score Increase |
|--------|----------------|
| Excellent reviews (5 stars) | +10 |
| Successful project completion | +15 |
| CRB premium certification | +20 |
| No complaints (6 months) | +5 |
| Customer referrals | +5 |

---

# STL MONITORING (REAL-TIME)

STL is a **dynamic system** that updates automatically:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EVENT TRIGGER                                   │
│   (New review, complaint, transaction, inspection)                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AI SCORE UPDATE                                   │
│           (Recalculate based on new data)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DMO DATABASE                                     │
│              (Store updated score)                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               SEARCH RANKING REFRESH                                │
│           (New position in results)                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

# STL DATABASE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STL DATABASE TABLES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  stl_profiles         - User STL profiles                          │
│  stl_scores           - Current scores                             │
│  stl_history          - Score change history                       │
│  stl_reviews          - Customer review data                       │
│  stl_complaints       - Complaint records                          │
│  stl_rewards          - Reward transactions                        │
│  stl_penalties        - Penalty records                            │
│  stl_refilling_scores - Refilling evaluation scores                │
│  stl_rankings         - Search ranking data                        │
│  stl_level_changes    - Level upgrade/downgrade logs               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# STL LEVEL BENEFITS

| Level | Benefits |
|-------|----------|
| VIP | Featured badges, top ranking, priority support, higher limits |
| High | Verified badge, priority ranking, increased visibility |
| Medium | Standard badge, normal ranking |
| Basic | Limited visibility, basic features |
| Free | Minimal visibility, restricted features |

---

*STL Trust Level System v1.0 | March 2026*
