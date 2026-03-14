# AI Marketplace Matching Quick Reference

> Intelligent Service Provider Matching

## Matching Flow

```
Customer Search → Skill Filter → Location Filter → 
STL Ranking → Availability → Best Providers
```

## Matching Score Formula

```
Score = Location(30%) + Skill(25%) + STL(20%) + 
        Reviews(15%) + Response(10%)
```

## Location Scoring

| Distance | Score |
|----------|-------|
| < 5km | 100 |
| 5-10km | 80 |
| 10-20km | 60 |
| 20-50km | 40 |
| > 50km | 20 |

## Boost Factors

| Factor | Boost |
|--------|-------|
| Featured | +15% |
| New Provider | +5% |
| Perfect Rating | +10% |
| Fast Response | +5% |

## Penalty Factors

| Factor | Penalty |
|--------|---------|
| Complaints | -10% |
| Low Response | -15% |
| Expired Cert | -50% |

## Tech Stack

- Elasticsearch (search)
- PostGIS (geo)
- TensorFlow (ML)
- Redis (cache)

## Full Details

See: `docs/architecture/ai-marketplace-matching-algorithm.md`
