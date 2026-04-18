/**
 * Rule Engine — priority-ordered routing. First match wins.
 *
 * Input:  rules[] sorted by priority asc, criteriaMet number
 * Output: { action, stlLevelAssigned?, ruleName, ruleId }
 *
 * Actions: auto_approve · route_franchise · route_crb · reject.
 */

const matchers = {
  gte: (m, t) => m >= t,
  lte: (m, t) => m <= t,
  eq: (m, t) => m === t,
  between: (m, t, tMax) => m >= t && m <= tMax,
};

export function evaluateRules(rules, criteriaMet) {
  const sorted = [...rules]
    .filter((r) => r.active !== false)
    .sort((a, b) => a.priority - b.priority);

  for (const r of sorted) {
    const fn = matchers[r.operator];
    if (!fn) continue;
    if (fn(criteriaMet, r.threshold, r.thresholdMax)) {
      return {
        matched: true,
        ruleId: r._id?.toString() ?? r.id,
        ruleName: r.ruleName ?? r.name,
        action: r.action,
        stlLevelAssigned: r.stlLevelAssigned ?? r.stlLevel,
      };
    }
  }
  return { matched: false, action: "reject", ruleName: "no_rule_match" };
}
