---
name: ehb-canonical-checker
description: Pre-commit lint — scan diffs for legacy SQL/EDR/9-level/old-PSS-names and warn developer
type: developer-tool
tags: [lint, pre-commit, naming, migration]
---

# EHB Canonical Checker

## When to Use

- **English:** "Check my commit for legacy references before pushing"
- **Roman Urdu:** "Mera code check karo — kahi legacy naming to nahi?"
- **Trigger:** Developer about to commit, wants to catch SQL/EDR/old-level names, or CLI automation

---

## What This Skill Does

Scans your **git diff** or file changes for:

✅ **Legacy SQL references** → should be **STL**
- `sqlLevel`, `sql_level`, `SQL_LEVEL` → `stlLevel`, `stl_level`, `STL_LEVEL`
- `SQL` (when not database language) → `STL`
- `SQLLevelDashboard` → `STLLevelDashboard`

✅ **Legacy EDR references** → should be **CRB**
- `edr`, `EDR` → `crb`, `CRB`
- `EDRPanel` → `CRBPanel`

✅ **Legacy 9-level references** → should be **10-level (L1–L10)**
- `L0`, `L1`...`L8` (old) → `L1`...`L10` (new)
- "SUPREME" at L8 → should be L10
- Level names: FREE, BASIC, NORMAL, STANDARD, ADVANCED, HIGH, PRO, VIP, ELITE, SUPREME

✅ **Old PSS names** → should be **Personal Security System**
- "Proof & Security" → "Personal Security System"
- PSS naming consistent across codebase

✅ **Hardcoded level strings** → should match canonical
- `"level_8_supreme"` → check if L8 or L10 in new code

---

## Usage (4 Ways)

### 1. Run on Unstaged Changes (Recommended before commit)

```bash
# Show warnings for all uncommitted changes
node scripts/ehb-canonical-checker.mjs --staged

# Example output:
# ⚠️  Found 3 legacy references:
#   - /apps/web/app/stl/page.tsx:45 | sqlLevel → stlLevel
#   - /services/api/pss-backend/src/models/EDRPanel.js:12 | EDRPanel → CRBPanel
#   - /docs/OLD_README.md:1 | "SQL Level" → "STL Level"
#
# Fix and try again!
```

### 2. Run on Specific Commit

```bash
# Check what you're about to commit
node scripts/ehb-canonical-checker.mjs --commit HEAD

# Example:
# ✅ No legacy references in HEAD — safe to push!
```

### 3. Run on Diff Range

```bash
# Check all commits since main branch
node scripts/ehb-canonical-checker.mjs --diff origin/main...HEAD

# Example:
# ⚠️  ehb-canonical-checker found issues in your PR:
#   [CRITICAL] /src/schema.ts | Min max 8 should be 10 (STL levels)
#   [WARNING] /docs/guide.md | L9 "DIAMOND" should be "ELITE"
#   [INFO] /lib/util.ts | 2 commented-out SQL refs (OK, can ignore)
```

### 4. Run on Files (One-off)

```bash
# Check specific files
node scripts/ehb-canonical-checker.mjs --files apps/web/app/stl/page.tsx services/api/pss-backend/src/models/stlRequest.js

# Example output:
# File: apps/web/app/stl/page.tsx
# ✅ Clean (no legacy refs)
#
# File: services/api/pss-backend/src/models/stlRequest.js
# ⚠️  Line 26: stlLevel: { type: Number, min: 0, max: 8 }
#          → Should be max: 10 (for L1–L10 ladder)
```

---

## Integration: Pre-Commit Hook

Add this to `.git/hooks/pre-commit` (auto-created by setup):

```bash
#!/bin/sh
# Pre-commit: check for legacy naming

echo "🔍 Scanning for legacy references..."
node scripts/ehb-canonical-checker.mjs --staged

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ BLOCKED: Legacy references found."
  echo "   Fix the warnings above and try again."
  exit 1
fi

echo "✅ Canonical check passed!"
exit 0
```

**When you commit:**

```bash
$ git commit -m "feat(stl): update level ladder"

🔍 Scanning for legacy references...
⚠️  Found legacy naming in apps/web/app/stl/page.tsx:
  - stlLevel max should be 10, not 8

❌ BLOCKED: Fix and retry.
$ # Fix file
$ git add apps/web/app/stl/page.tsx
$ git commit -m "feat(stl): update level ladder"

🔍 Scanning for legacy references...
✅ Canonical check passed!
[feat/stl-ladder d2c5f8e] feat(stl): update level ladder
```

---

## Detection Rules

### SQL → STL Mapping

| Legacy | New | Context | Severity |
|--------|-----|---------|----------|
| `sqlLevel` | `stlLevel` | Variable/field name | CRITICAL |
| `sql_level` | `stl_level` | Database column | CRITICAL |
| `SQL_LEVELS` | `STL_LEVELS` | Constant/enum | CRITICAL |
| `SQLLevel` | `STLLevel` | Type/interface | CRITICAL |
| `SQL` (not database lang) | `STL` | Generic mention | WARNING |

### EDR → CRB Mapping

| Legacy | New | Severity |
|--------|-----|----------|
| `EDR`, `edr` | `CRB`, `crb` | CRITICAL |
| `EDRPanel` | `CRBPanel` | CRITICAL |
| `edrs` | `crbs` | CRITICAL |
| "Exam Decision Registry" | "Certification & Registry Board" | WARNING |

### 9-Level → 10-Level Mapping

| Legacy | Issue | Fix |
|--------|-------|-----|
| `max: 8` | Assumes L0–L8 | Change to `max: 10` |
| `L0` | Old FREE level | Remove (now starts L1) |
| `L9 SUPREME` | SUPREME is now L10 | Change level label |
| `"L8 SUPREME"` | Mixed old system | `"L10 SUPREME"` |
| Score band `0-20` = L0 | Old mapping | `0-20` = L1 (new) |

### PSS Name Consistency

| Legacy | New | Context |
|--------|-----|---------|
| "Proof & Security System" | "Personal Security System" | Comments, docs, UI |
| `pss_proof_*` | `pss_identity_*` or `pss_security_*` | Database fields |

---

## Example: Real Scan Output

```
$ node scripts/ehb-canonical-checker.mjs --staged

🔍 EHB Canonical Checker v1.0

Scanning staged files...

File: apps/web/components/stl/LevelBadge.tsx
  Line 12: const LEVEL_NAMES = ["FREE", "BASIC", ... "SUPREME"]
  ⚠️  [WARNING] Comment on line 8 says "L0-L8" should be "L1-L10"
  
File: services/api/pss-backend/src/models/stlRequest.js
  Line 26: stlLevel: { type: Number, min: 0, max: 8 }
  🔴 [CRITICAL] max: 8 should be max: 10 (STL now L1-L10)

File: ehb-info/EHB-PSS-MASTER-PLAN.md
  Line 45: "Proof & Security System (legacy PSS)..."
  ⚠️  [WARNING] Should be "Personal Security System" in 2026

---

Summary:
  ✅ Files clean: 18
  ⚠️  Warnings: 2
  🔴 Critical: 1

Fix the 1 critical issue before committing!

Example fix:
  sed -i 's/max: 8/max: 10/g' services/api/pss-backend/src/models/stlRequest.js
```

---

## Quick Fix Commands

If checker finds issues, use these to fix:

### Fix all SQL → STL

```bash
# Bash/zsh
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs sed -i.bak \
  -e 's/sqlLevel/stlLevel/g' \
  -e 's/sql_level/stl_level/g' \
  -e 's/SQL_LEVEL/STL_LEVEL/g'

# Then verify
node scripts/ehb-canonical-checker.mjs --files apps/web services/api
```

### Fix all EDR → CRB

```bash
find . -name "*.ts" -o -name "*.js" | xargs sed -i.bak \
  -e 's/\bEDR\b/CRB/g' \
  -e 's/\bedr\b/crb/g' \
  -e 's/EDRPanel/CRBPanel/g'
```

### Fix max: 8 → max: 10

```bash
grep -r "max: 8" --include="*.js" --include="*.ts" . | grep -i "stl\|level"
# Manually verify each, then fix

sed -i 's/max: 8/max: 10/g' services/api/pss-backend/src/models/stlRequest.js
```

---

## Ignored Patterns

Checker **ignores** these (safe to keep):

✅ Database language references:
- "PostgreSQL", "MySQL", "SQLite"
- Raw SQL in comments/doc strings
- `PL/SQL`, `T-SQL`

✅ Third-party library names:
- `react-redux` (contains "sql" substring)
- Package names you can't control

✅ Commented-out old code (optional warning):
- `// const sqlLevel = ...` (commented, not live code)

✅ Test/demo files:
- Files in `__tests__`, `test/`, `.spec.` directories
- Legacy backup folder `backup/sql-to-stl-*`

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | ✅ All clean — no legacy refs |
| 1 | ⚠️ Warnings found (non-blocking) |
| 2 | 🔴 Critical errors found (blocking) |
| 3 | ❌ Script error (file not found, etc.) |

---

## In Your PR

Add this to your PR template or GitHub Actions:

```yaml
# .github/workflows/canonical-check.yml
name: Canonical Check

on: [pull_request, push]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: node scripts/ehb-canonical-checker.mjs --diff origin/main...HEAD
```

**PR shows:**

```
✅ Canonical Check Passed
All files clean of legacy SQL/EDR references.
```

or

```
❌ Canonical Check Failed
3 critical issues found in your PR.
See logs above.
```

---

## Roman Urdu Script

- **"Canonical checker chala"** = Run the checker
- **"Legacy references check karo"** = Check for old naming
- **"STL migration done?"** = Is STL migration complete?
- **"L9 se L10 update ho gaya?"** = Updated to L10?

---

*EHB Canonical Checker — v1.0 · 2026-04-15*
