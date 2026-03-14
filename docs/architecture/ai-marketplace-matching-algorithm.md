# EHB AI MARKETPLACE MATCHING ALGORITHM

> Intelligent Service Provider Matching

---

# OVERVIEW

EHB Marketplace uses **AI matching engine** to:
- Find best service provider matches
- Deliver fastest responses
- Maintain trust quality
- Optimize customer satisfaction

---

# MATCHING ALGORITHM

## Input Data

| Data Type | Description |
|-----------|-------------|
| Location | Customer GPS coordinates |
| Skill | Required service type |
| STL Score | Provider trust level |
| Availability | Provider schedule |
| Reviews | Historical ratings |
| Response Time | Average response speed |
| Price | Service pricing |

---

# MATCHING FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER REQUEST                                 │
│        ("AC technician near me, available today")                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SKILL MATCHING                                   │
│         (Filter providers with AC repair skills)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   LOCATION MATCHING                                 │
│        (Filter by distance from customer)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL RANKING                                      │
│       (Sort by trust score: VIP → High → Medium → Basic)           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  AVAILABILITY CHECK                                 │
│          (Filter providers available today)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 BEST PROVIDER SELECTED                              │
│          (Top matches presented to customer)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

# MATCHING SCORE FORMULA

```python
Match_Score = (
    (Location_Score × 0.30) +      # 30% weight
    (Skill_Match × 0.25) +         # 25% weight
    (STL_Score × 0.20) +           # 20% weight
    (Customer_Reviews × 0.15) +    # 15% weight
    (Response_Time × 0.10)         # 10% weight
)
```

## Component Calculations

### Location Score (0-100)

```python
if distance <= 5km:
    location_score = 100
elif distance <= 10km:
    location_score = 80
elif distance <= 20km:
    location_score = 60
elif distance <= 50km:
    location_score = 40
else:
    location_score = 20
```

### Skill Match (0-100)

```python
if exact_skill_match:
    skill_score = 100
elif related_skill:
    skill_score = 70
else:
    skill_score = 0  # Excluded
```

### STL Score (Already 0-100)

Direct mapping from STL trust level.

### Review Score (0-100)

```python
review_score = (average_rating / 5.0) × 100
```

### Response Time Score (0-100)

```python
if avg_response < 5 min:
    response_score = 100
elif avg_response < 15 min:
    response_score = 80
elif avg_response < 30 min:
    response_score = 60
elif avg_response < 1 hour:
    response_score = 40
else:
    response_score = 20
```

---

# SEARCH RESULT EXAMPLE

**Customer Search:** "AC technician near me"

**Results (ranked by Match Score):**

| # | Provider | STL | Distance | Rating | Score |
|---|----------|-----|----------|--------|-------|
| 1 | Ali Electric | VIP | 1 km | 4.9 ⭐ | 95 |
| 2 | TechFix | HIGH | 2 km | 4.8 ⭐ | 88 |
| 3 | CoolAir | HIGH | 3 km | 4.7 ⭐ | 82 |
| 4 | ProService | MEDIUM | 1.5 km | 4.6 ⭐ | 75 |
| 5 | QuickRepair | BASIC | 0.5 km | 4.5 ⭐ | 68 |

---

# AI RECOMMENDATION ENGINE

Beyond matching, AI also recommends:

## For Customers

| Recommendation | Logic |
|----------------|-------|
| Popular Services | Most booked in area |
| Trending Providers | Rising ratings |
| Similar Services | Based on history |
| Time-based | Available now |

## For Providers

| Recommendation | Logic |
|----------------|-------|
| Skill Suggestions | In-demand skills |
| Pricing Insights | Market rates |
| Availability Optimization | Peak demand times |

---

# REAL-TIME MATCHING

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER OPENS APP                               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   LOCATION DETECTED                                 │
│              (GPS coordinates captured)                            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 NEARBY PROVIDERS FETCHED                            │
│          (Pre-computed based on location)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                REAL-TIME AVAILABILITY CHECK                         │
│           (Check current provider status)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                RANKED RESULTS DISPLAYED                             │
│              (Sub-second response)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

# BOOST FACTORS

Certain conditions can boost ranking:

| Factor | Boost |
|--------|-------|
| Featured Provider (paid) | +15% |
| New Provider (< 30 days) | +5% |
| Perfect Rating (5.0) | +10% |
| Fast Response (< 5 min avg) | +5% |
| High Completion Rate (> 95%) | +5% |

---

# PENALTY FACTORS

Certain conditions reduce ranking:

| Factor | Penalty |
|--------|---------|
| Recent Complaint | -10% |
| Low Response Rate | -15% |
| Cancelled Jobs | -10% |
| Expired Certification | -50% |
| STL Downgrade | -20% |

---

# TECHNOLOGY STACK

| Component | Technology |
|-----------|------------|
| Search Engine | Elasticsearch |
| Geo-indexing | PostGIS / Redis Geo |
| ML Models | TensorFlow / PyTorch |
| Real-time | Apache Kafka |
| Caching | Redis |
| API | Node.js / Python |

---

# COMPLETE AI MARKETPLACE FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER SEARCH                                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  AI MATCHING ENGINE                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              SKILL + LOCATION FILTER                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STL TRUST RANKING                                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BEST PROVIDERS                                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SERVICE BOOKING                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

*AI Marketplace Matching v1.0 | March 2026*
