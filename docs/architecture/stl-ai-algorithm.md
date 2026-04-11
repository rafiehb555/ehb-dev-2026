# STL AI ALGORITHM DESIGN

> Complete AI-Based Trust Engine

---

# OVERVIEW

STL AI Engine is EHB's **machine learning-powered reputation system** that calculates trustworthiness scores for all platform participants.

---

# STL SYSTEM POSITION

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER ACTIVITY                                  │
│   (Registrations, Transactions, Reviews, Complaints)               │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PSS VERIFICATION                                 │
│              (Identity verification data)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CRB CERTIFICATION                                │
│            (Physical verification results)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STL AI ENGINE                                    │
│         (ML model processes all data signals)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SEARCH RANKING                                   │
│           (Results ordered by trust score)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# STL SCORING MODEL

## Main Data Inputs

| Category | Example Data Points |
|----------|---------------------|
| Verification | KYC status, document validity, face match |
| Certification | CRB inspection result, skill test score |
| Performance | Order completion rate, delivery time |
| Reviews | Customer ratings, review sentiment |
| Complaints | Dispute count, resolution rate |
| Refilling | 6-month evaluation scores |

---

# CORE SCORING FORMULA

## Weighted Scoring Model

```python
STL_Score = (
    (Verification_Score × 0.20) +
    (Certification_Score × 0.25) +
    (Performance_Score × 0.20) +
    (Customer_Review_Score × 0.15) +
    (Complaint_Score × 0.10) +
    (Refilling_Score × 0.10)
)

# Output Range: 0 - 100
```

---

# INDIVIDUAL COMPONENT SCORES

## 1. Verification Score (0-100)

| Status | Score |
|--------|-------|
| No verification | 0 |
| Email verified | 20 |
| Phone verified | 30 |
| ID verified | 60 |
| Full KYC (PSS complete) | 100 |

---

## 2. Certification Score (0-100)

| Status | Score |
|--------|-------|
| No certification | 0 |
| Application submitted | 20 |
| Basic certification | 50 |
| Full CRB certified | 80 |
| Premium certified | 100 |

---

## 3. Performance Score (0-100)

```python
Performance_Score = (
    (Completion_Rate × 0.40) +
    (On_Time_Delivery × 0.30) +
    (Response_Time × 0.30)
)
```

| Metric | Calculation |
|--------|-------------|
| Completion Rate | (Completed / Total) × 100 |
| On-Time Delivery | (On-Time / Total) × 100 |
| Response Time | Based on average response hours |

---

## 4. Customer Review Score (0-100)

```python
Review_Score = (Average_Rating / 5.0) × 100

# With sentiment adjustment
Final_Review_Score = Review_Score × Sentiment_Modifier
```

| Avg Rating | Base Score |
|------------|------------|
| 5.0 stars | 100 |
| 4.5 stars | 90 |
| 4.0 stars | 80 |
| 3.5 stars | 70 |
| 3.0 stars | 60 |
| < 3.0 | 0-50 |

---

## 5. Complaint Score (0-100)

```python
Complaint_Score = 100 - (Complaint_Penalty)

Complaint_Penalty = (
    (Unresolved_Complaints × 15) +
    (Resolved_Complaints × 5)
)
```

| Complaints (6 months) | Score |
|-----------------------|-------|
| 0 | 100 |
| 1-2 (resolved) | 80-90 |
| 3-5 | 50-70 |
| 5+ | 0-50 |

---

## 6. Refilling Score (0-100)

| Status | Score |
|--------|-------|
| First certification (no refilling yet) | 70 |
| Passed refilling | 100 |
| Pending refilling | 50 |
| Failed refilling | 0 |
| Missed refilling | 0 |

---

# STL LEVEL CLASSIFICATION

| Score Range | STL Level |
|-------------|-----------|
| 0-30 | Free |
| 31-50 | Basic |
| 51-70 | Medium |
| 71-85 | High |
| 86-100 | VIP |

---

# AI DATA INPUTS (CONTINUOUS)

AI engine continuously analyzes:

| Data Type | Impact |
|-----------|--------|
| User behavior patterns | Anomaly detection |
| Service delivery speed | Performance metric |
| Customer satisfaction signals | Review sentiment |
| Dispute resolution quality | Complaint handling |
| Platform engagement | Activity score |

---

# REAL-TIME UPDATE TRIGGERS

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EVENT TRIGGER                                   │
│ • New transaction complete                                         │
│ • Customer review submitted                                        │
│ • Complaint filed/resolved                                         │
│ • CRB inspection completed                                         │
│ • Refilling evaluation done                                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AI SCORE UPDATE                                   │
│            (Recalculate affected components)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DMO DATABASE                                     │
│              (Store updated score + history)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               RANKING REFRESH                                       │
│          (Update search result position)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PENALTY SYSTEM

| Issue | Score Impact | Duration |
|-------|--------------|----------|
| Fake document detected | -30 | Permanent until cleared |
| Multiple complaints (3+) | -15 | 30 days |
| Missed refilling | -20 | Until completed |
| Poor reviews (< 3 avg) | -10 | Until improved |
| Failed CRB inspection | -25 | Until passed |
| Fraud attempt | -50 | Account review |

---

# REWARD SYSTEM

| Action | Score Increase | Conditions |
|--------|----------------|------------|
| Excellent reviews (5 stars) | +10 | 10+ reviews |
| Successful projects | +15 | 50+ completed |
| CRB premium certification | +20 | One-time bonus |
| No complaints (6 months) | +5 | Per period |
| Customer referrals | +5 | Per verified referral |

---

# AI PROCESSING PIPELINE

```
┌─────────────────────────────────────────────────────────────────────┐
│                   DATA COLLECTION                                   │
│      (Gather all relevant signals from platform)                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                FEATURE ENGINEERING                                  │
│         (Transform raw data into ML features)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  ML MODEL INFERENCE                                 │
│           (Run trained model on features)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  TRUST PREDICTION                                   │
│              (Generate score 0-100)                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SCORE UPDATE                                      │
│         (Store in database, trigger ranking)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

# TECHNOLOGY STACK

| Component | Technology |
|-----------|------------|
| ML Framework | TensorFlow / PyTorch |
| Feature Store | Feast |
| Model Serving | TensorFlow Serving |
| Real-time Processing | Apache Kafka Streams |
| Database | PostgreSQL + Redis |
| MLOps | MLflow / Kubeflow |

---

# STL DATABASE TABLES

```sql
-- Core STL Tables
stl_profiles          -- User STL profile data
stl_scores            -- Current scores (cached)
stl_history           -- Score change log
stl_reviews           -- Review data for scoring
stl_complaints        -- Complaint records
stl_rewards           -- Reward transactions
stl_penalties         -- Penalty records
stl_refilling_scores  -- Refilling evaluation data
stl_rankings          -- Cached ranking positions
stl_ml_features       -- Preprocessed ML features
stl_model_versions    -- ML model version tracking
```

---

*STL AI Algorithm v1.0 | March 2026*
