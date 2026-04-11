# EHB GLOBAL TRUST SCORE SYSTEM

> Turning STL into a global, cross-country reputation network

---

## 1. GLOBAL TRUST SCORE CONCEPT

STL is extended from a **local trust level** into a **global reputation score** that can compare:

- A Lahore electrician
- A Dubai technician
- A German engineer

On a single, normalized scale.

Example:

| Provider     | Country  | STL Score |
|-------------|----------|----------:|
| Ali Electric| Pakistan |        82 |
| SolarFix    | UAE      |        88 |
| PowerTech   | Germany  |        91 |

Customers (and enterprises) can choose **best providers globally**, not just locally.

---

## 2. TRUST SCORE COMPONENTS

Global STL uses a **weighted composite** of multiple factors.

| Factor                 | Weight |
|------------------------|:------:|
| PSS Verification       | 20%    |
| Industry Verification  | 20%    |
| CRB Certification      | 20%    |
| Customer Reviews       | 15%    |
| Complaint History      | 10%    |
| Refilling Results      | 10%    |
| Activity & Performance | 5%     |

Conceptual formula:

```text
STL Score =
PSS + Industry + CRB + Reviews – Complaints + Refilling + Performance
```

This aligns with the existing **STL AI Algorithm**, but explicitly emphasizes:

- Industry verifications (multi-industry model)
- Refilling cycles
- Global activity patterns

---

## 3. GLOBAL TRUST RANKING

From per-user score, the system builds **rankings**:

- Per **country**
- Per **city/region**
- **Global** (across all regions)
- Per **industry** (e.g. “Electricians worldwide”)

Example global ranking:

| Rank | Provider     | Country  | Global Score |
|------|--------------|----------|-------------:|
| #1   | PowerTech    | Germany  |           91 |
| #2   | SolarFix     | UAE      |           88 |
| #3   | Ali Electric | Pakistan |           82 |

Usage:

- AI search results (“Electrician near me”, “Best solar installer globally”).
- Enterprise procurement (“Top 50 providers by trust in EMEA”).

---

## 4. COUNTRY TRUST ADJUSTMENT

Different countries have different:

- Regulatory strength
- Data completeness
- Verification depth

To normalize scores, a **country adjustment factor** is applied.

Example:

| Country  | Factor |
|----------|:------:|
| Germany  |  1.00  |
| UAE      |  0.95  |
| Pakistan |  0.90  |

Formula:

```text
STL_Global_Score = STL_Base_Score × Country_Factor
```

Notes:

- Factors are **policy-driven**, managed by DMO and can evolve over time.
- Over time, as verification ecosystems in each country strengthen, factors can converge.

---

## 5. AI FRAUD DETECTION IMPACT

PSS AI Fraud Detection feeds directly into **dynamic trust adjustments**.

Negative events:

| Event               | Impact (example) |
|---------------------|-----------------:|
| Fake document       |             −30  |
| Multiple complaints |             −15  |
| Missed refilling    |             −20  |

Positive events:

| Event                   | Impact (example) |
|-------------------------|-----------------:|
| Excellent reviews       |             +10  |
| New industry certs      |             +15  |
| Zero unresolved complaints (period) | +5 |

Effect:

- AI engine continuously monitors **behavior + signals**.
- When anomalies are detected (sudden spikes, device risk, IP risk), STL is **downgraded in near real time**.

---

## 6. TRUST SCORE DISPLAY (ON CARD & DASHBOARD)

Suggested display on Trust Card:

```text
STL Trust Level: High
Global Score: 82
Country Rank: #12 in Pakistan
Global Rank: #230 in Electricians
```

Industry verifications:

```text
Industry Verification

✔ Electrical Industry
✔ Energy Industry
✔ Safety Industry
```

On the Trust Score Dashboard:

- Graphs for:
  - Global STL trend over time.
  - Country ranking and percentile.
  - Comparison with peers in same country/industry.

---

## 7. TRUST SCORE UPDATE FLOW

Real-time update pipeline:

```text
User Activity (jobs, sales, reviews, complaints)
      │
      ▼
 AI Monitoring (Fraud + Behavior + Performance)
      │
      ▼
 STL Score Update (Base + Adjustments)
      │
      ▼
 DMO Database (Global + Country scores)
      │
      ▼
 Marketplace Ranking (search, recommendations)
```

Integration points:

- **PSS AI** → risk signals.
- **CRB** → new/renewed certifications.
- **Industry Authorities** → domain-specific boosts or penalties.
- **Wallet** → suspicious financial patterns.

---

## 8. REFILLING & GLOBAL TRUST

Refilling helps **maintain** and **validate** trust over time.

Example impact:

| Status           | Impact |
|------------------|-------:|
| Passed Refilling |    +5  |
| Failed Refilling |   −10  |
| Missed Refilling |   −20  |

Global effects:

- Providers who **consistently pass refilling** gradually move up global rankings.
- Those who **miss or fail refilling** drop in both country and global positions.

---

## 9. GLOBAL TRUST FLOW

End-to-end view:

```text
Users / Companies
        │
        ▼
       PSS
        │
        ▼
Industry Verification
        │
        ▼
       CRB
        │
        ▼
       STL
        │
        ▼
  Country & Global Ranking
        │
        ▼
    Marketplace & AI Matching
```

Result:

- EHB becomes a **global reputation network**, not just a local marketplace.
- Trust is:
  - **Quantified** (scores & ranks),
  - **Monitored** (AI fraud detection),
  - **Continuously updated** (refilling, performance, reviews).

---

## 10. BENEFITS

EHB Global Trust Score System delivers:

- **Global reputation network** – cross-country comparison for any profession/service.
- **Trusted marketplace** – best providers surface naturally via trust-weighted ranking.
- **Fraud-resistant ecosystem** – real-time AI adjustments for risky behaviors.
- **AI-driven ranking** – continuous optimization of search, recommendations, and visibility.

---

*EHB Global Trust Score System v1.0 | March 2026*

