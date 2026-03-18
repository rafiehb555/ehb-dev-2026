# STL System Quick Reference

> Service Trust Level - AI Reputation Engine

## STL Levels

| Level | Score | Description |
|-------|-------|-------------|
| Free | 0-30 | Unverified |
| Basic | 31-50 | Basic verified |
| Medium | 51-70 | Documents verified |
| High | 71-85 | CRB certified |
| VIP | 86-100 | Premium verified |

## Scoring Formula

```
STL = Verification(20%) + Certification(25%) + 
      Performance(15%) + Reviews(15%) + 
      Complaints(10%) + Refilling(15%)
```

## Impact

- Search ranking
- Service visibility
- Customer trust
- Feature access

## Penalties

| Issue | Impact |
|-------|--------|
| Fake document | -30 |
| Complaints | -15 |
| Missed refilling | -20 |
| Failed inspection | -25 |

## Rewards

| Action | Increase |
|--------|----------|
| 5-star reviews | +10 |
| Successful projects | +15 |
| Premium certification | +20 |

## Full Details

See: `docs/architecture/stl-trust-level-system.md`
See: `docs/architecture/stl-ai-algorithm.md`
