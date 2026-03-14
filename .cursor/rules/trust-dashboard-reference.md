# TRUST SCORE DASHBOARD REFERENCE

> Quick reference: AI-powered trust analytics system

## DASHBOARD SECTIONS

1. **Overall Trust Score** - Main score + level + percentile
2. **STL Breakdown** - Component scores (PSS, CRB, Performance, etc.)
3. **Industry Verification Strength** - Radar chart + verified list
4. **Refilling History Timeline** - Visual timeline + stats
5. **Complaint Impact Analysis** - Summary + STL impact calculation
6. **AI Trust Analysis** - Strengths, improvements, trend graph
7. **Improvement Recommendations** - Actions to boost STL
8. **Peer Comparison** - Category ranking + percentile

## SCORE BREAKDOWN WEIGHTS

| Component | Weight |
|-----------|--------|
| PSS Verification | 20% |
| CRB Certification | 20% |
| Performance | 15% |
| Reviews | 15% |
| Complaints | 10% |
| Refilling | 10% |
| Industry Boosts | +bonus |

## AI INSIGHTS

- Strengths identification
- Areas for improvement
- 6-month trend analysis
- Path to next level recommendations

## DATA STRUCTURE

```typescript
TrustDashboard {
  overall_score, level, percentile,
  breakdown, industry_boosts,
  refilling, complaints,
  ai_insights, recommendations,
  peer_comparison
}
```

## FILES

- Full doc: `docs/ui-ux/trust-score-dashboard.md`
- Related: `docs/ui-ux/trust-radar-visualization.md`

---
*Rule v1.0*
