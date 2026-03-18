# Trust Radar Quick Reference

> 360° Verification Visualization

## Radar Dimensions

| Dimension | Weight | Max |
|-----------|--------|-----|
| PSS | 20% | 100 |
| CRB | 20% | 100 |
| STL | 25% | 100 |
| Industry | 15% | 100 |
| Refilling | 10% | 100 |
| Complaints | 10% | 100 |

## Overall Trust Formula

```
Trust = PSS(20%) + CRB(20%) + STL(25%) + 
        Industry(15%) + Refilling(10%) + Complaints(10%)
```

## Color Coding

| Score | Color | Level |
|-------|-------|-------|
| 0-30 | Red | Poor |
| 31-50 | Orange | Needs Work |
| 51-70 | Yellow | Average |
| 71-85 | Green | Good |
| 86-100 | Blue | Excellent |

## Complaints Score

```
Score = 100 - (Pending × 20) - (Unresolved × 10) - (Total × 2)
```

## Features

- Individual radar view
- Comparison view (multiple providers)
- Improvement suggestions
- Investor aggregated view

## Full Details

See: `docs/ui-ux/trust-radar-visualization.md`
