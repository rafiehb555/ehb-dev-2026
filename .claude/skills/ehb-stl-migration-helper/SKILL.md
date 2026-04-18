---
name: ehb-stl-migration-helper
description: Ensures STL V1 (legacy 9-level) and V2 (canonical 10-level) stay synchronized during development
type: developer-tool
tags: [stl, migration, testing, regression]
---

# EHB STL Migration Helper

## When to Use

- **English:** "I'm touching STL code, help me keep V1 and V2 in sync"
- **Roman Urdu:** "STL code update kar raha hoon, V1 aur V2 sync rakhna"
- **Trigger:** Before committing any changes to `services/api/stl-replit/` (legacy V1) or `services/api/pss-backend/` (canonical V2)

---

## Purpose

Validates that legacy STL V1 (9 levels, L0–L8) and canonical V2 (10 levels, L1–L10) remain in sync.
Prevents regressions, verifies source caps, and ensures mapping table consistency.

---

## Workflow

### Step 1: Detect Which Engine(s) Modified

```bash
# Check git diff for changes
git diff --name-only | grep -E "(stl-replit|pss-backend)"

# If stl-replit → legacy V1 engine
# If pss-backend → canonical V2 engine
```

### Step 2: If Modifying Legacy (V1) — Run Gold-Master Tests

```bash
# CRITICAL: STL formula is protected by 58 regression tests
npm run test:stl

# Expected output:
# ✓ 58 passing

# If ANY fail → ABORT. Do not commit.
# Roll back the change and diagnose.
```

### Step 3: If Modifying Canonical (V2) — Run PSS Tests

```bash
# Run pss-backend unit tests
cd services/api/pss-backend
npm test

# Smoke test MIN-chain formula
node -e "
const { finalEhbStl } = require('./src/services/stlService.js');
console.log(finalEhbStl(10, 20, 15, 12)); // Should return 10 (MIN)
"
```

### Step 4: Verify V1↔V2 Mapping Table

Ensure legacy and canonical levels align. This is the **immutable mapping contract**:

| V1 Legacy | V2 Canonical | Level Name | Notes |
|-----------|--------------|-----------|-------|
| L0 (0-20 pts) | L1 (0-20 pts) | FREE | V1 starts at L0; V2 starts at L1 |
| L1 (20-40 pts) | L2 (20-40 pts) | BASIC | Legacy L1 = New L2 |
| L2 (40-60 pts) | L3 (40-60 pts) | NORMAL | — |
| L3 (60-80 pts) | L6 (60-80 pts) | HIGH | JUMP: V1's "HIGH" at L3 → V2's L6 |
| L4 (80-100 pts) | L8 (80-100 pts) | VIP | Franchise max is L8 VIP |
| L5 (100-120 pts) | L8 (100-120 pts) | ULTRA/VIP | PSS max capped here → L8 |
| L6 (120-140 pts) | L9 (120-140 pts) | DIAMOND/ELITE | CRB starts here |
| L7 (140-160 pts) | L9 (140-160 pts) | PLATINUM/ELITE | — |
| L8 (160-180 pts) | L10 (160-180 pts) | SUPREME | Final level, DMO authority |
| — | L10 (180+ pts) | SUPREME | V2 only: L9 repeats for overflow |

**Verification command:**

```javascript
// File: services/api/pss-backend/src/lib/stlMappingTable.js
const V1_V2_MAPPING = {
  0: 1, 1: 2, 2: 3, 3: 6, 4: 8, 5: 8, 6: 9, 7: 9, 8: 10
};

function mapLegacyToCanonical(legacyLevel) {
  return V1_V2_MAPPING[legacyLevel] || 10;
}

// Test:
console.assert(mapLegacyToCanonical(3) === 6, "L3→L6 mapping failed");
console.assert(mapLegacyToCanonical(8) === 10, "L8→L10 mapping failed");
```

### Step 5: Verify Source Caps Applied

Confirm the **source cap limits** are enforced in both engines:

```
PSS → max L5 (20 points)
Franchise → max L8 (32 points)
CRB → max L9 (36 points)
DMO → max L10 (40 points, unrestricted)

MIN-chain rule (immutable):
FINAL_EHB_STL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)
```

**Verification command:**

```bash
# V1: Check stl-replit/services/stlService.js for source caps
grep -n "maxPointsFromPSS\|SOURCE_CAP" services/api/stl-replit/services/stlService.js

# V2: Check pss-backend/src/services/stlService.js for MIN-chain
grep -n "finalEhbStl\|SOURCE_CAPS" services/api/pss-backend/src/services/stlService.js

# Both must show:
# - PSS capped at 20
# - Franchise at 32
# - CRB at 36
# - DMO at 40
```

### Step 6: Update Docs If Behavior Changes

If you've modified how levels are calculated or mapped:

1. Update **`ehb-info/departments/STL.md`** with new version
2. Update **`CLAUDE.md` § AUTO:CANONICAL-COUNTS**
3. Run `node scripts/ehb-canonical-sync.mjs` to propagate

Then commit with:

```bash
git commit -m "fix(stl): clarify V1↔V2 mapping in STL.md

- Updated mapping table (L3→L6 jump, not L3)
- Confirmed source caps (PSS=20, Franchise=32, CRB=36, DMO=40)
- 58/58 gold-master tests still passing
- V2 MIN-chain validated

Co-Authored-By: Claude Agent <noreply@anthropic.com>"
```

---

## Validation Checklist

Before submitting PR:

- [ ] `npm run test:stl` → 58/58 passing (if V1 modified)
- [ ] `npm test` in pss-backend → all passing (if V2 modified)
- [ ] V1↔V2 mapping table verified in code or docs
- [ ] Source caps enforced: PSS≤L5, Franchise≤L8, CRB≤L9, DMO≤L10
- [ ] MIN-chain formula unchanged (or justified if changed)
- [ ] No changes to `finalEhbStl()` function signature
- [ ] Docs updated if level behavior changed

---

## References

- **Legacy V1 formula:** `services/api/stl-replit/services/stlService.js`
- **Canonical V2 formula:** `services/api/pss-backend/src/services/stlService.js`
- **Gold-master tests:** `services/api/stl-replit/__tests__/stlService.test.js` (58 tests)
- **Mapping table:** `services/api/pss-backend/src/lib/stlMappingTable.js`
- **Department spec:** `ehb-info/departments/STL.md`
- **Master plan:** `ehb-info/EHB-MASTER-DEVELOPMENT-PLAN.md`

---

## Roman Urdu Script

- **"STL test karo"** = Run gold-master tests
- **"Mapping check karo"** = Verify V1↔V2 table
- **"Source caps dekho"** = Check if source limits apply

---

*EHB STL Migration Helper — v1.0 · 2026-04-15*
