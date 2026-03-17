# EHB AI System – Architecture (v1)

AI is not a single feature inside EHB – it is the coordination layer that watches what is happening across
all industries and turns raw activity into clear actions for the user.

---

## 1. High-level architecture

- **Data sources**
  - User profile: skills, languages, categories, industries, location, verification status.
  - Activity: page views, searches, clicks, favourites, time on page.
  - Transactions: jobs applied, orders completed, services created, cancellations, disputes.
  - Ratings & feedback: star ratings, reviews, internal quality scores.
- **Core AI modules**
  1. Recommendation Engine
  2. Matching Engine
  3. Fraud Detection
  4. Pricing Optimization
  5. Growth & Insights

Each module reads from the same events stream / data warehouse and writes suggested actions back into a
unified **AI Suggestions feed** that the UI can consume (dashboard, marketplace, industry pages).

---

## 2. Recommendation Engine

**Goal:** Suggest the most relevant jobs, services, and opportunities for each user.

### Inputs

- User profile: skills, industries, hourly/price preference, experience level.
- Activity: searches, clicked jobs, viewed services, saved items.
- Outcomes: which suggestions were accepted (applied, ordered, favourited).

### Logic (simplified)

```ts
// Pseudocode shape only – real impl will use ML models later
function getRecommendations(user: UserProfile, context: Context): Recommendations {
  const candidates = fetchCandidateJobsAndServices(context);

  const scored = candidates.map((c) => ({
    item: c,
    score:
      weight.skill * skillMatch(user.skills, c.requiredSkills) +
      weight.industry * industryMatch(user.industries, c.industry) +
      weight.location * locationMatch(user.location, c.location) +
      weight.price * priceFit(user.pricePreference, c.priceRange) +
      weight.behaviour * behaviourMatch(user.activity, c),
  }));

  return topN(scored, 10);
}
```

### Output types

- **Recommended jobs** – ranked list with explanation text, e.g. “Matched because you do web design.”
- **Best services to offer** – suggest service templates based on skills and demand.
- **Trending opportunities** – high-demand categories in the user’s country/region.

---

## 3. Matching Engine

**Goal:** Connect the right buyers and sellers in both directions.

- When a client posts a need:
  - Score all relevant providers by skill, rating, response time, and price.
  - Suggest a shortlist (“Best 5 providers”) and auto‑notify them.
- When a provider logs in:
  - Show a ranked list of matching jobs / requests.

### Matching score (example)

```text
MatchingScore = 
  0.35 * SkillMatch +
  0.20 * RatingScore +
  0.15 * LocationScore +
  0.15 * PriceFit +
  0.15 * Reliability (cancel rates, response time)
```

The score is not exposed directly to the user, but used internally for sorting and for “Best Match”
badges in the UI.

---

## 4. Fraud Detection AI

**Goal:** Keep the ecosystem safe and trusted.

### Signals

- Multiple accounts from same device with suspicious patterns.
- Sudden spike in orders, withdrawals, or refunds.
- Repeated low ratings, complaints, or dispute flags.
- Abnormal messaging patterns (spam, links, scams).

### Example rules

```text
IF new account + many high-value orders in first hour
  → flag for review

IF user gets repeated 1★ ratings with "scam" keyword
  → lower trust score, limit visibility, alert support

IF multiple failed payments or chargebacks
  → temporary lock + KYC / re-verification
```

Over time this logic can move from simple rules to ML anomaly detection.

---

## 5. Pricing Optimization

**Goal:** Help users choose a fair, competitive price and maximize platform conversion.

### Inputs

- Historical prices for similar services in same category and region.
- Conversion rate at different price points.
- User’s experience level and rating.

### Output examples

- “Users like you charge **$50–$100** for similar services.”
- “Your current price is **20% lower** than similar offers – you may be able to charge more.”
- “Raising price by 10% is unlikely to reduce demand based on current trends.”

---

## 6. Growth & Insights AI

**Goal:** Turn raw data into simple, motivating growth hints.

### Examples shown on dashboard

- “You can earn more by adding this skill: **Social Media Management** is high demand in your city.”
- “Your profile is **80% complete** – finish verification to unlock better jobs.”
- “You got **3 repeat clients** this month – consider offering a subscription package.”

These insights combine:

- Profile completeness
- Earning trends
- Repeat usage
- Comparison with similar successful users

---

## 7. UI integration points

The AI system surfaces its results in several places:

- **Dashboard**
  - Recommended jobs & services
  - Earning potential summary
  - Growth suggestions and next best actions
- **Marketplace**
  - “Recommended for you” rows
  - Smart sorting (Best Match, Trending, New)
- **Industry pages**
  - “Popular in your area” and “Good for beginners” banners
- **Franchise dashboard (future)**
  - City‑level insights: demand, supply gaps, and suggested campaigns.

All current UI components are wired with placeholder data, but shaped to consume the outputs specified
above once real models / APIs are connected.

