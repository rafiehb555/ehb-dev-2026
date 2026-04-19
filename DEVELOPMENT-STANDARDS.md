# DEVELOPMENT STANDARDS — EHB Technologies

**Version:** 1.0  
**Updated:** 2026-04-14  
**Scope:** All code, commits, branches, PRs, and reviews across the monorepo  

---

## 1. TypeScript Strict Mode (Non-Negotiable)

All TypeScript files **must** compile with `tsconfig.json` set to `strict: true`.

### Rules
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Violations
- ❌ `const x: any = data;` (use `unknown`, then narrow)
- ❌ `function fetch() { }` (missing return type)
- ❌ `const y = null;` (must declare `let y: string | null = null;`)
- ✅ `const x: unknown = data; if (typeof x === 'string') { use(x); }`
- ✅ `function fetch(): Promise<Data> { }`
- ✅ `let y: string | null = null;`

**Pre-commit hook:** Runs `tsc --noEmit` on staged files. If error, commit is blocked.

---

## 2. File Naming Conventions

### File Paths (Kebab-Case)
All file and folder names must be **lowercase kebab-case**, including components.

| Type | Pattern | Example |
|------|---------|---------|
| **React component** | `kebab-case.tsx` | `user-profile-card.tsx` |
| **API route** | `kebab-case.ts` | `get-user-routes.ts` |
| **Utility function** | `kebab-case.ts` | `format-currency.ts` |
| **Middleware** | `kebab-case.ts` | `auth-middleware.ts` |
| **Style file** | `kebab-case.module.css` | `user-profile-card.module.css` |
| **Test file** | `kebab-case.test.ts` | `format-currency.test.ts` |
| **Model/Schema** | `PascalCase.ts` | `User.ts`, `PSS_Verification.ts` |
| **Type definition** | `kebab-case.types.ts` | `user.types.ts` |

### Component File Names (Critical)
- ❌ `Card.tsx` (Windows case-insensitive, Linux case-sensitive → conflicts)
- ❌ `UserCard.tsx`, `STLCard.tsx`
- ✅ `card.tsx` (only for shared UI components in `@/components/ui/`)
- ✅ `user-profile-card.tsx` (feature-specific)
- ✅ `stl-badge.tsx`

**Rule:** Import shared components from `@/components/ui/card` (lowercase), never create a second `Card.tsx`.

### Exports (PascalCase)
```typescript
// user-profile-card.tsx
export function UserProfileCard() { }  // PascalCase export
export default UserProfileCard;        // PascalCase default

// usage
import { UserProfileCard } from '@/components/user-profile-card';
import UserProfileCard from '@/components/user-profile-card';
```

---

## 3. Import Order (Fixed)

All imports must follow this order, separated by blank lines:

```typescript
// 1. React & Next.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 2. Third-party libraries (alphabetical)
import axios from 'axios';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// 3. Internal components (alphabetical)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { SideBar } from '@/components/layout/sidebar';

// 4. Internal utilities & hooks (alphabetical)
import { formatCurrency } from '@/lib/format-currency';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/types/user.types';

// 5. Styles (last)
import styles from './page.module.css';
```

**ESLint Rule:** `@typescript-eslint/sort-imports` enforces this automatically.

---

## 4. Error Handling Patterns

### AppError Class (Shared)
All backend errors inherit from `AppError`. Create at `services/api/stl-replit/utils/AppError.ts`:

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// Usage
throw new AppError('User not found', 404, true);
throw new AppError('Database error', 500, false);
```

### Try-Catch in Controllers

```typescript
// ❌ Avoid
export async function registerUser(req, res) {
  const user = await User.create(req.body);
  res.json(user);
}

// ✅ Correct
export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      throw new AppError('Email and password required', 400, true);
    }
    
    // Create
    const user = await User.create({ email, password });
    
    // Respond
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);  // Pass to global error handler
  }
}

// Global error handler (Express middleware, runs last)
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
  
  // Log unknown errors
  console.error('[UNHANDLED ERROR]', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  });
});
```

### Validation with Zod

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// In controller
export async function registerUser(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body);
    // ... use validated
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        `Validation error: ${error.errors[0].message}`,
        400,
        true
      );
    }
    next(error);
  }
}
```

---

## 5. Git Commit Format

All commits follow **Conventional Commits** with module prefix:

```
<type>(<module>): <subject>

<optional body>

Co-Authored-By: Name <email@example.com>
```

### Type
- `feat` — New feature (user-facing)
- `fix` — Bug fix
- `refactor` — Code restructure (no feature change)
- `perf` — Performance improvement
- `test` — Add or update tests
- `docs` — Documentation only
- `chore` — Tooling, deps, config (no user impact)

### Module (From CLAUDE.md §8)
One of: `stl`, `dmo`, `pss`, `crb`, `jps`, `wallet`, `franchise`, `ai`, `web`, `api`, `infra`, `docs`

### Examples
```
feat(pss): add ID document verification endpoint

- Integrates OpenAI Vision API for OCR
- Validates document expiry and format
- Stores result in pss_verifications collection

Co-Authored-By: Alice <alice@ehb.com>
```

```
fix(stl): correct L7+ decay calculation

Decay was applying 1.5x multiplier incorrectly. Now follows 30/60/90 tier correctly.

Closes #142

Co-Authored-By: Bob <bob@ehb.com>
```

```
docs(pss): update PSS-DEVELOPMENT.md with Liveness API endpoint

Co-Authored-By: Charlie <charlie@ehb.com>
```

---

## 6. Branch Naming

All branches follow this pattern:

```
<type>/<module>-<description>
```

### Examples
- `feature/pss-id-verification`
- `fix/stl-decay-multiplier`
- `refactor/auth-middleware`
- `docs/stl-development-guide`
- `chore/update-dependencies`

**Rules:**
- Lowercase, kebab-case
- Start from `main`, never from `develop` or other branches
- Delete after merge (GitHub auto-cleanup)
- One logical change per branch

---

## 7. Code Review Checklist

Every PR must pass this checklist before merge:

### Automated Checks
- [ ] CI pipeline passes (lint, type check, unit tests)
- [ ] No new `any` types or `@ts-ignore` comments
- [ ] Test coverage ≥80% (new code)
- [ ] Gold-master STL tests still 58/58 pass (if STL changes)

### Manual Review (Peer)
- [ ] Logic is clear and follows EHB patterns
- [ ] No hardcoded secrets, API keys, or production URLs
- [ ] File names follow kebab-case convention
- [ ] Imports follow Section 3 order
- [ ] Error handling uses AppError + try-catch pattern
- [ ] Zod validation on all user inputs
- [ ] No `console.log()` left behind (use `winston` logger)
- [ ] Comments explain *why*, not *what*
- [ ] Edge cases handled (null, empty array, race conditions)
- [ ] Database queries are indexed and efficient

### Design System (UI Changes)
- [ ] Read `design-system/EHB-UIUX-SYSTEM.md` before coding
- [ ] Used shared components (`@/components/ui/*`)
- [ ] Glassmorphism dark theme applied
- [ ] Responsive breakpoints tested (mobile, tablet, desktop)
- [ ] Accessibility: color contrast ≥4.5:1, focus states, labels
- [ ] No new `Card.tsx` (lowercase import from shared)

### Backend (API Changes)
- [ ] Endpoint documented (route, method, input, output, errors)
- [ ] Mongoose schema indexes added for query fields
- [ ] No `process.exit(1)` on optional dependencies
- [ ] `/health` endpoint reflects new service status
- [ ] Rate limiting or auth gate if needed

### Documentation
- [ ] Inline code comments for complex logic
- [ ] `docs/*.md` files updated if public API changed
- [ ] `.env.example` updated if new secret needed
- [ ] Git commit message follows Section 5 format

### Deployment
- [ ] `.env.example` has placeholder for all new secrets
- [ ] No migrations needed (or migration is in PR)
- [ ] Backward compatible (feature flags for breaking changes)
- [ ] Backup created before destructive changes (`backup/`)

### Final
- [ ] Run full test suite: `npm run test`
- [ ] Run STL gold-master: `npm run test:stl` (must be 58/58)
- [ ] Resolve all conversations in PR

---

## 8. SQL → STL & EDR → CRB Auto-Rename Rules (Mandatory)

EHB migrated legacy names. **All agents auto-apply these renames without being asked:**

| Legacy | Current | Context |
|--------|---------|---------|
| `SQL` | `STL` | Service Trust Level (NOT MySQL/PostgreSQL) |
| `SQLLevel` | `STLLevel` | Type name |
| `sql_level` | `stl_level` | Mongoose column/identifier |
| `SQL_LEVELS` | `STL_LEVELS` | Constant |
| `EDR` | `CRB` | Central Record Blockchain (NOT "Electronic Data Records") |

### Hard Rules
1. Never introduce new `SQL` or `EDR` refs in EHB code/docs (excluding database query language names).
2. If legacy content uploaded, silently rewrite to `STL`/`CRB` before persisting.
3. Rename files: `SQLLevelDashboard.tsx` → `stl-level-dashboard.tsx` + update all imports.
4. Run before every PR: `grep -rn '\bSQL\b\|\bEDR\b' --exclude-dir=node_modules . | grep -v 'MySQL\|PostgreSQL\|SQLite\|NoSQL\|PL/SQL\|T-SQL'` (must return 0 matches in EHB code).

---

## 9. Optional Dependencies — No Hard Fail-Fast

Never call `process.exit(1)` if MongoDB, Redis, or optional APIs are unavailable at startup.

### Correct Pattern
```typescript
// ❌ Wrong
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI not set');
  process.exit(1);  // Hard failure
}

// ✅ Right
let isDbConnected = false;

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    isDbConnected = true;
    console.log('[DB] Connected');
  } catch (error) {
    console.warn('[DB] Connection failed, retrying...');
    setTimeout(connectDb, 5000);  // Retry
  }
}

// Start HTTP server first
app.listen(5000, () => {
  console.log('[HTTP] Server running on 5000');
  connectDb();  // Background retry
});

// Health endpoint reflects state
app.get('/health', (req, res) => {
  res.status(isDbConnected ? 200 : 503).json({
    http: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});
```

**Required deps** (like `JWT_SECRET`) still validate at startup:
```typescript
const requiredEnvs = ['JWT_SECRET', 'NODE_ENV'];
const missing = requiredEnvs.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`[CONFIG] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);  // OK to exit for required keys
}
```

---

## 10. Component File Imports (Critical for Windows/Linux Compatibility)

**Windows is case-insensitive; Linux is case-sensitive.**

### Rules
- ✅ `import { Card } from '@/components/ui/card';` (lowercase filename, any import name)
- ✅ `import UserCard from '@/components/user-profile-card';` (kebab-case filename)
- ❌ `import { Card } from '@/components/ui/Card';` (uppercase filename → breaks on Linux)
- ❌ Create `components/Card.tsx` AND `components/card.tsx` in same folder

### Audit
Before every PR, run:
```bash
find apps/web -name '[A-Z]*.tsx' -o -name '[A-Z]*.ts' | grep -E 'components|app' | head -20
```
Should return only data models & types. If it returns components, rename to kebab-case.

---

## 11. Logging & Debugging

Use **Winston** for all logging (not `console.log`):

```typescript
import logger from '@/lib/logger';  // or services/api/stl-replit/config/logger.js

logger.info('User registered', { userId: '123', email: 'user@example.com' });
logger.warn('API rate limit approaching', { limit: 100, used: 90 });
logger.error('Database connection failed', { error: err.message });
```

**Rules:**
- Never log sensitive data (passwords, tokens, SSNs)
- Structured logging (JSON format for parsing)
- Log levels: `debug`, `info`, `warn`, `error`
- Store logs in `logs/` (gitignored) or cloud (DataDog, CloudWatch)

---

## 12. Testing Standards

### Unit Tests (Jest)
- Filename: `feature.test.ts`
- Minimum coverage: 80% of new code
- Test structure: Arrange → Act → Assert

```typescript
describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    // Arrange
    const amount = 1234.56;
    
    // Act
    const result = formatCurrency(amount, 'USD');
    
    // Assert
    expect(result).toBe('$1,234.56');
  });
});
```

### Integration Tests
- Test API endpoints with real MongoDB (or mock)
- Test cross-module flows (e.g., PSS → STL scoring)

### E2E Tests (Playwright/Cypress)
- Test full user journeys (register → verify → access dashboard)
- Run against staging environment
- Focus on critical paths

### Gold-Master Tests (STL)
Run `npm run test:stl` before every merge. Must pass 58/58:
```bash
npm run test:stl
# Expected: [PASS] 58/58
```

---

## 13. Performance Benchmarks

All code should meet these targets:

| Metric | Target | Example |
|--------|--------|---------|
| API response | <500ms (P95) | GET /api/user/:id |
| Database query | <100ms (avg) | User.findById() |
| STL score calculation | <100ms (1M users) | Batch recalc job |
| Frontend page load | <3s (LCP) | Dashboard |
| Image load | <2s | Product card |

**Measure with:**
```bash
npm run lighthouse -- apps/web/app/stl/dashboard/page.tsx
npm run load-test -- services/api/stl-replit  # 1000 req/s
```

---

## 14. Environment Variables

### `.env` (Gitignored)
Local development only. Template: `.env.example`

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ehb
JWT_SECRET=dev-secret-only
OPENAI_API_KEY=sk-...
```

### `.env.example` (Checked In)
```
NODE_ENV=
PORT=
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=
```

### Production (Vault/Vercel)
- Never commit real secrets
- Use CI environment variables
- Rotate keys monthly

---

## 15. Documentation Standards

Every feature must have:
1. **Inline comments** in code (explain *why*, not *what*)
2. **JSDoc** for public functions
3. **README.md** in feature folder (if new system)
4. **API endpoint docs** (route, method, auth, params, response, errors)
5. **Updated SPRINT-PLAN.md** or feature guide

### JSDoc Example
```typescript
/**
 * Calculate user's STL score based on PSS + CRB + order history.
 * @param userId - User's MongoDB ID
 * @returns Promise resolving to STL level (0-9)
 * @throws AppError if user not found
 * 
 * Formula: PSS (40%) + CRB (15%) + Orders (35%) + Payments (10%)
 */
export async function calculateSTL(userId: string): Promise<number> {
  // implementation
}
```

---

*EHB Technologies (Pvt.) Ltd. — Development Standards v1 — 2026-04-14*
