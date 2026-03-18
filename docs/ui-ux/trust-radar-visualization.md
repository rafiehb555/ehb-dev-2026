# EHB DYNAMIC TRUST RADAR

> 360° Verification Visualization

---

# OVERVIEW

The **Trust Radar** is a visual radar chart that displays a provider's verification status across all EHB trust dimensions. It provides an instant **360-degree view** of trustworthiness.

---

# RADAR DIMENSIONS

| Dimension | Source | Max Score |
|-----------|--------|-----------|
| PSS Score | Identity Verification | 100 |
| CRB Score | Certification Status | 100 |
| STL Score | Trust Level | 100 |
| Industry Score | Industry Verifications | 100 |
| Refilling Score | Refilling History | 100 |
| Complaints Score | Complaint Record | 100 |

---

# RADAR VISUALIZATION

```
                         PSS (95)
                            ▲
                           /|\
                          / | \
                         /  |  \
                        /   |   \
         Complaints   /    |    \   CRB
            (90)     /     |     \  (85)
                    /      |      \
                   /       |       \
                  /        |        \
                 /         |         \
                ───────────●───────────
                 \         |         /
                  \        |        /
                   \       |       /
                    \      |      /
           Refilling \     |     / Industry
             (80)     \    |    /   (60)
                       \   |   /
                        \  |  /
                         \ | /
                          \|/
                           ▼
                        STL (82)
```

---

# SCORE CALCULATION

## PSS Score (0-100)

| Verification | Points |
|--------------|--------|
| ID Verified | +25 |
| Face Verified | +25 |
| Address Verified | +20 |
| AML Cleared | +15 |
| Device Verified | +10 |
| Phone Verified | +5 |

---

## CRB Score (0-100)

| Status | Points |
|--------|--------|
| Application Submitted | +10 |
| Skill Test Passed | +30 |
| Interview Passed | +20 |
| Inspection Passed | +30 |
| Certificate Active | +10 |

---

## STL Score (0-100)

Direct mapping from STL Trust Level calculation.

---

## Industry Score (0-100)

| Verified Industries | Points |
|---------------------|--------|
| 0 | 0 |
| 1 | 20 |
| 2 | 40 |
| 3 | 60 |
| 4 | 80 |
| 5+ | 100 |

---

## Refilling Score (0-100)

| Status | Points |
|--------|--------|
| First certification (no refilling) | 70 |
| 1 successful refilling | 80 |
| 2 successful refillings | 90 |
| 3+ successful refillings | 100 |
| Missed refilling | 0 |
| Pending refilling | 50 |

---

## Complaints Score (0-100)

```python
Complaints_Score = 100 - (Pending × 20) - (Unresolved × 10) - (Total × 2)

# Minimum score: 0
```

| Status | Score |
|--------|-------|
| No complaints | 100 |
| 1-2 resolved | 90 |
| 3-5 resolved | 80 |
| Any pending | -20 per pending |

---

# OVERALL TRUST SCORE

```python
Overall_Trust = (
    PSS_Score × 0.20 +
    CRB_Score × 0.20 +
    STL_Score × 0.25 +
    Industry_Score × 0.15 +
    Refilling_Score × 0.10 +
    Complaints_Score × 0.10
)
```

---

# TRUST RADAR UI COMPONENT

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TRUST RADAR                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         PSS: 95                                     │
│                            ▲                                        │
│                           /█\                                       │
│                          /███\                                      │
│                         /█████\                                     │
│     Complaints: 90    /███████\    CRB: 85                         │
│                      /█████████\                                    │
│                     /███████████\                                   │
│                    ─────────●─────                                  │
│                     \███████████/                                   │
│                      \█████████/                                    │
│       Refilling: 80   \███████/   Industry: 60                     │
│                        \█████/                                      │
│                         \███/                                       │
│                          \█/                                        │
│                           ▼                                         │
│                        STL: 82                                      │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  OVERALL TRUST SCORE: 84/100 - HIGH                                │
│                                                                     │
│  ████████████████░░░░                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# RADAR COLORS

| Score Range | Color | Meaning |
|-------------|-------|---------|
| 0-30 | 🔴 Red | Poor |
| 31-50 | 🟠 Orange | Needs Improvement |
| 51-70 | 🟡 Yellow | Average |
| 71-85 | 🟢 Green | Good |
| 86-100 | 🔵 Blue | Excellent |

---

# RADAR COMPARISON VIEW

Compare multiple providers:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUST COMPARISON                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Ali Electric          TechFix            QuickRepair              │
│                                                                     │
│       ▲                    ▲                    ▲                   │
│      /█\                  /██\                 /░\                  │
│     /███\                /████\               /░░░\                 │
│    /█████\              /██████\             /░░░░░\                │
│    ───●───              ────●────            ───●───                │
│     \███/                \████/               \░░░/                 │
│      \█/                  \██/                 \░/                  │
│       ▼                    ▼                    ▼                   │
│                                                                     │
│  Score: 84              Score: 91            Score: 52              │
│  HIGH                   VIP                  MEDIUM                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# IMPROVEMENT SUGGESTIONS

Based on radar analysis, AI suggests improvements:

```
┌─────────────────────────────────────────────────────────────────────┐
│  IMPROVE YOUR TRUST SCORE                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Your weakest areas:                                               │
│                                                                     │
│  1. Industry Verification (60/100)                                 │
│     → Get verified by 1 more industry franchise                    │
│     → Potential boost: +10 points                                  │
│     [APPLY NOW]                                                     │
│                                                                     │
│  2. Refilling Score (80/100)                                       │
│     → Complete next refilling on time                              │
│     → Potential boost: +10 points                                  │
│                                                                     │
│  3. CRB Score (85/100)                                             │
│     → Get premium certification                                    │
│     → Potential boost: +5 points                                   │
│     [UPGRADE]                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# RADAR DATA STRUCTURE

```typescript
interface TrustRadar {
  pss_score: number;       // 0-100
  crb_score: number;       // 0-100
  stl_score: number;       // 0-100
  industry_score: number;  // 0-100
  refilling_score: number; // 0-100
  complaints_score: number;// 0-100
  overall_score: number;   // Calculated
  trust_level: string;     // FREE/BASIC/MEDIUM/HIGH/VIP
}
```

---

# INVESTOR VIEW

For investor presentations, show aggregated radar:

```
┌─────────────────────────────────────────────────────────────────────┐
│  EHB PLATFORM TRUST METRICS                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Total Verified Providers: 125,000                                 │
│  Average Trust Score: 78/100                                       │
│                                                                     │
│  DISTRIBUTION:                                                      │
│  VIP (86-100):    ████████░░ 15,000 (12%)                         │
│  HIGH (71-85):    ████████████████ 45,000 (36%)                   │
│  MEDIUM (51-70):  ██████████████ 40,000 (32%)                     │
│  BASIC (31-50):   ██████████ 20,000 (16%)                         │
│  FREE (0-30):     ████ 5,000 (4%)                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Trust Radar Visualization v1.0 | March 2026*
