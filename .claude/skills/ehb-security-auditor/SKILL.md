# EHB Security Auditor Skill

> **Version:** 1.0  
> **Last updated:** 2026-04-14  
> **Owner:** EHB Technologies (Pvt.) Ltd.  
> **Purpose:** Comprehensive security audit checklist covering OWASP Top 10, authentication, authorization, wallet security, PSS anti-fraud, and compliance.

---

## §1 — OWASP Top 10 + EHB-Specific Checks

### 1.1 A01: Broken Access Control

**EHB-specific risks:**

| Check | Status | Details |
|-------|--------|---------|
| RBAC implemented correctly | [ ] | 7 roles: Buyer, Seller, Rider, Inspector, Franchise, Admin, Affiliate |
| STL-level gating | [ ] | Seller can't list without L3+, franchise can't without L5+ |
| Ownership verification | [ ] | Users can only access own orders, own shop, own wallet |
| Admin override audit trail | [ ] | All manual STL adjustments logged with reason + timestamp |
| Feature flag isolation | [ ] | STL_V2_ENABLED, DMO_ENABLED don't leak across users |

**Test:**
```bash
npm run test:security:rbac

# Tests:
# ✓ Buyer can't access seller dashboard
# ✓ Seller L2 can't create products (need L3)
# ✓ Franchise owner can't see other franchise territories
# ✓ Admin can only view logs for their assigned region
```

### 1.2 A02: Cryptographic Failures

**EHB-specific risks:**

| Check | Status | Details |
|-------|--------|---------|
| JWT secrets strong | [ ] | `JWT_SECRET` > 32 chars, random, not hardcoded |
| Access token expiry | [ ] | 1 hour max, then refresh token required |
| Refresh token rotation | [ ] | Old refresh tokens invalidated on use |
| TLS 1.3 enforced | [ ] | All traffic HTTPS only, no fallback to HTTP |
| Passwords hashed | [ ] | bcrypt with cost ≥ 12 (not plaintext or MD5) |
| Sensitive data encrypted | [ ] | Bank account, ID numbers use AES-256 at rest |
| PII encryption | [ ] | Names, phone numbers encrypted in database |
| API keys encrypted | [ ] | Third-party API keys (Stripe, SMS) encrypted in .env |

**Test:**
```bash
npm run test:security:crypto

# Tests:
# ✓ JWT secret is > 32 chars
# ✓ Access tokens expire (can't use after 1h)
# ✓ Refresh tokens rotate (old token rejected)
# ✓ Passwords hashed (compare with bcrypt)
# ✓ No plaintext secrets in code
```

**Key files:**
- `services/api/stl-replit/.env` — Should have `JWT_SECRET`, `MONGODB_URI`, API keys
- `services/api/stl-replit/middleware/auth.js` — JWT validation
- `services/api/stl-replit/utils/encryption.js` — AES-256 encryption for PII

### 1.3 A03: Injection

**EHB-specific risks:**

| Check | Status | Details |
|-------|--------|---------|
| NoSQL injection prevented | [ ] | MongoDB queries use parameterized queries, Mongoose models |
| XSS prevention | [ ] | User input sanitized, React auto-escapes by default |
| Command injection | [ ] | No `exec()`, no string interpolation in shell commands |
| Zod validation | [ ] | Every API endpoint has Zod schema validation |
| Input length limits | [ ] | Product title max 200 chars, descriptions max 5000 |

**Example Zod validation:**
```typescript
const CreateProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  category: z.enum(['gosellr', 'ols', 'wms']),
});
```

**Test:**
```bash
npm run test:security:injection

# Tests:
# ✓ SQL-like injection blocked (MongoDB doesn't use SQL)
# ✓ XSS payload sanitized (e.g., <script> becomes text)
# ✓ Zod validates all POST/PUT bodies
# ✓ Input too long is rejected before processing
```

### 1.4 A04: Insecure Design

**EHB-specific design security:**

| Check | Status | Details |
|-------|--------|---------|
| STL formula reviewed | [ ] | 58 gold-master tests pass, formula locked |
| Wallet escrow is atomic | [ ] | Money locked → delivery → release (no partial states) |
| Complaint resolution has SLA | [ ] | 30-day max resolution time |
| PSS expired users gated | [ ] | Can't sell if PSS >60 days expired |
| Rate limiting designed | [ ] | 100 req/min public, 300 req/min authenticated |
| DMO approval required for risky users | [ ] | Red-flag users don't auto-approve |

**Test:**
```bash
npm run test:security:design

# Tests:
# ✓ STL formula protected (tests can't be modified)
# ✓ Escrow locked atomically
# ✓ Expired PSS blocks seller actions
# ✓ Rate limits enforced
```

### 1.5 A05: Broken Authentication

**EHB-specific authentication:**

| Check | Status | Details |
|-------|--------|---------|
| Password reset token expiry | [ ] | 1h max, single-use |
| Session fixation prevented | [ ] | New session ID on login |
| Brute force protected | [ ] | 5 failed logins = 15 min lockout |
| 2FA for admins | [ ] | OTP or security key required |
| Passwordless auth option | [ ] | Magic link login available |
| Logout clears tokens | [ ] | Token blacklist on logout |

**Test:**
```bash
npm run test:security:auth

# Tests:
# ✓ Weak passwords rejected
# ✓ Password reset token expires after 1h
# ✓ Failed logins trigger lockout after 5 attempts
# ✓ 2FA works for admins
# ✓ Logout invalidates session
```

### 1.6 A06: Sensitive Data Exposure

**EHB-specific sensitive data:**

| Check | Status | Details |
|-------|--------|---------|
| Bank account numbers | [ ] | Encrypted AES-256, only last 4 digits shown |
| National IDs | [ ] | Encrypted, not logged, not exported |
| Transaction history | [ ] | Not exposed in client-side code |
| API responses don't leak | [ ] | No `.password`, `.bankAccount` in JSON responses |
| Database backups encrypted | [ ] | MongoDB Atlas encryption enabled |
| Logs don't contain PII | [ ] | No phone numbers, emails in error logs |
| Email addresses masked | [ ] | Shown as `user****@example.com` in some contexts |

**Test:**
```bash
grep -r "bankAccount\|ssn\|password" apps/web/
# Should return ZERO hits in frontend code (sensitive data server-side only)

grep -r "SELECT \*" services/api/
# Should use explicit column selection, not wildcards
```

### 1.7 A07: Authentication & Session Management

(Already covered in §1.5, but specific checks:)

| Check | Status | Details |
|-------|--------|---------|
| CSRF tokens | [ ] | POST/PUT/DELETE require `X-CSRF-Token` header |
| Cookie flags | [ ] | `HttpOnly`, `Secure`, `SameSite=Strict` set |
| Session timeout | [ ] | 30 min idle timeout, max 24h session |
| Token refresh logic | [ ] | Old refresh tokens invalidated |
| No session fixation | [ ] | New session ID generated on privilege escalation |

### 1.8 A08: Software & Data Integrity Failures

| Check | Status | Details |
|-------|--------|---------|
| Dependencies audited | [ ] | `npm audit` shows 0 vulnerabilities |
| Packages pinned | [ ] | No `^` ranges in package.json (exact versions) |
| CDN integrity | [ ] | Tailwind CSS + other imports use SRI hashes |
| Build reproducibility | [ ] | Same commit → same build artifact |
| Git signing | [ ] | Commits signed with GPG (future: require for main) |

**Test:**
```bash
npm audit  # Should show 0 vulnerabilities
npm ci --only=prod  # Install exact versions
```

### 1.9 A09: Logging & Monitoring Failures

**EHB-specific logging:**

| Check | Status | Details |
|-------|--------|---------|
| Failed logins logged | [ ] | Timestamp, IP, user (if known) |
| Admin actions logged | [ ] | STL adjustments, bans, refunds |
| Payment transactions logged | [ ] | Amount, timestamp, both parties |
| Errors logged | [ ] | Stack trace, request ID, user context (no PII) |
| Logs archived | [ ] | CloudWatch 90-day retention |
| Alerting configured | [ ] | PagerDuty alerts on critical errors |

### 1.10 A10: SSRF, XXE, Deserialization

| Check | Status | Details |
|-------|--------|---------|
| File uploads validated | [ ] | MIME type + magic bytes checked |
| No XML parsing | [ ] | If XML used, XXE prevention enabled |
| No deserialization of untrusted data | [ ] | JSON only, not `pickle` or unsafe serialization |
| External URL validation | [ ] | Can't post `http://localhost:5000/...` links |

---

## §2 — JWT Implementation Validation

### 2.1 JWT Structure

```
HEADER.PAYLOAD.SIGNATURE

Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (access token):
{
  "sub": "user_abc123",
  "role": "seller",
  "stlLevel": 5,
  "iat": 1681234567,
  "exp": 1681238167,  // 1h from iat
  "iss": "ehb.tech"
}

Signature:
HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
```

### 2.2 Access Token (1h expiry)

```typescript
function generateAccessToken(user: User): string {
  const payload = {
    sub: user._id.toString(),
    role: user.role, // buyer, seller, etc
    stlLevel: user.stlLevel,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1h
    iss: 'ehb.tech',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });
}
```

### 2.3 Refresh Token (30d expiry, rotated)

```typescript
function generateRefreshToken(user: User): string {
  const tokenId = crypto.randomBytes(16).toString('hex'); // Unique ID
  const payload = {
    sub: user._id.toString(),
    jti: tokenId, // Token ID for revocation
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 3600, // 30d
    iss: 'ehb.tech',
  };
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
  
  // Store in Redis for revocation tracking
  await redis.set(`refresh:${tokenId}`, user._id, 'EX', 30*24*3600);
  
  return token;
}

// On refresh:
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const stored = await redis.get(`refresh:${decoded.jti}`);
  
  if (!stored) {
    throw new Error('Token revoked or expired');
  }
  
  // Invalidate old refresh token
  await redis.del(`refresh:${decoded.jti}`);
  
  // Issue new refresh token
  const newRefreshToken = generateRefreshToken(...);
  const newAccessToken = generateAccessToken(...);
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
```

### 2.4 Validation Checklist

```javascript
// File: services/api/stl-replit/middleware/auth.js

function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check claims
    assert(decoded.sub, 'Missing sub (user ID)');
    assert(decoded.role, 'Missing role');
    assert(decoded.exp > Math.floor(Date.now() / 1000), 'Token expired');
    assert(decoded.iss === 'ehb.tech', 'Invalid issuer');
    
    // Verify user still exists
    const user = await User.findById(decoded.sub);
    assert(user, 'User not found');
    
    // Verify user not banned
    assert(!user.isBanned, 'User banned');
    
    return decoded;
  } catch (err) {
    throw new UnauthorizedError(`JWT validation failed: ${err.message}`);
  }
}
```

---

## §3 — Input Validation Checklist

### 3.1 Zod Schema for Every Endpoint

```typescript
// File: services/api/stl-replit/validation/productSchemas.js

export const CreateProductSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 chars')
    .max(200, 'Title max 200 chars'),
  description: z.string()
    .max(5000, 'Description max 5000 chars')
    .optional(),
  price: z.number()
    .positive('Price must be > 0')
    .max(10_000_000, 'Price max 10M PKR'),
  category: z.enum(['gosellr', 'ols', 'wms', 'hps', 'jps', 'agts'])
    .describe('Industry category'),
  images: z.array(z.string().url())
    .max(10, 'Max 10 images')
    .optional(),
  stock: z.number()
    .int('Stock must be whole number')
    .nonnegative()
    .optional(),
});

// In route handler:
router.post('/products', async (req, res) => {
  const validated = CreateProductSchema.parse(req.body); // Throws if invalid
  // Use validated data
});
```

### 3.2 XSS Prevention

**React auto-escapes by default:**
```tsx
// Safe — content is escaped
<div>{user.name}</div>  // ✓ If name = "<script>", renders as text

// Dangerous — DO NOT USE
<div dangerouslySetInnerHTML={{ __html: user.bio }} />  // ✗ XSS risk
```

**Server-side escaping:**
```javascript
const sanitizeHtml = require('sanitize-html');

const safeContent = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
  allowedAttributes: {},
});
```

---

## §4 — Rate Limiting Validation

### 4.1 Rate Limit Tiers

| Endpoint | Public | Authenticated | Admin |
|----------|--------|---------------|-------|
| Login | 10/min per IP | - | - |
| Register | 5/min per IP | - | - |
| Verify OTP | 5/min per IP | - | - |
| Browse products | - | 300/min | - |
| Create product | - | 100/min | - |
| Place order | - | 50/min | - |
| Payment | - | 10/min | - |
| Wallet top-up | - | 5/min | - |
| Complaint file | - | 10/min | - |

### 4.2 Implementation (Express Rate Limiter)

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:', // Redis key prefix
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Max requests per window
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise IP
    return req.user?.id || req.ip;
  },
  skip: (req) => req.user?.role === 'admin', // Admins exempt
  message: 'Too many requests, please retry later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
});

router.post('/products', limiter, async (req, res) => { ... });
```

---

## §5 — CORS Configuration

### 5.1 Allowed Origins

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://ehb.tech',
    'https://admin.ehb.tech',
    'http://localhost:3000', // Dev only
  ],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 86400, // Preflight cache 24h
}));
```

### 5.2 Validation Checklist

- [ ] Only specific origins allowed (not `*`)
- [ ] Credentials require explicit `credentials: true`
- [ ] Preflight requests cached (maxAge set)
- [ ] No trailing slashes in origins (causes bugs)

---

## §6 — File Upload Security

### 6.1 Validation

```typescript
const validateFileUpload = (file: Express.Multer.File) => {
  // 1. Check MIME type
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedMimes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  
  // 2. Check magic bytes (file signature)
  const magic = file.buffer.slice(0, 4).toString('hex');
  const validMagics = {
    'ffd8ffe0': 'jpeg',
    '89504e47': 'png',
    '25504446': 'pdf',
  };
  if (!validMagics[magic]) {
    throw new Error('File signature mismatch (possible malicious upload)');
  }
  
  // 3. Check size
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  // 4. Scan for malware (if using antivirus)
  const scanResult = await scanForMalware(file.buffer);
  if (scanResult.infected) {
    throw new Error('File contains malware');
  }
};
```

### 6.2 Storage

```javascript
// Store in S3 with signed URLs
const uploadToS3 = async (file) => {
  const key = `uploads/${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  
  await s3.putObject({
    Bucket: 'ehb-uploads',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256',
    Metadata: {
      'uploaded-by': user._id,
      'uploaded-at': new Date().toISOString(),
    },
  }).promise();
  
  // Return signed URL (expires 1h for download)
  const url = s3.getSignedUrl('getObject', {
    Bucket: 'ehb-uploads',
    Key: key,
    Expires: 3600,
  });
  
  return url;
};
```

---

## §7 — Authentication Flow Audit

### 7.1 Sign Up

```
1. POST /auth/register { email, password }
   ├─ Validate: email format, password strength (>12 chars, uppercase, number)
   ├─ Check: Email not already registered
   ├─ Hash: bcrypt(password, cost=12)
   └─ Send: Email verification link (token expires 24h)

2. GET /auth/verify?token=...
   ├─ Validate: Token not expired
   ├─ Mark: Email verified
   └─ Redirect: Login page
```

### 7.2 Sign In

```
1. POST /auth/login { email, password }
   ├─ Check: Account exists
   ├─ Compare: bcrypt(input, stored_hash)
   ├─ Log: Login attempt (success or failure)
   ├─ Rate limit: 5 failures = 15 min lockout
   ├─ Issue: Access token (1h) + Refresh token (30d)
   └─ Set: HttpOnly cookie for refresh token

2. If 2FA enabled:
   ├─ Send: OTP via SMS/email
   └─ Require: POST /auth/verify-2fa { otp }
```

### 7.3 Password Reset

```
1. POST /auth/forgot-password { email }
   ├─ Check: Email exists
   ├─ Generate: Reset token (crypto.randomBytes(32))
   ├─ Store: Token hashed in DB, expires 1h
   └─ Send: Email with reset link

2. POST /auth/reset-password { token, newPassword }
   ├─ Validate: Token not expired, not used
   ├─ Hash: newPassword
   ├─ Update: User password
   ├─ Invalidate: All refresh tokens (logout everywhere)
   └─ Return: Login page
```

---

## §8 — Authorization (RBAC) Audit

### 8.1 Role-Based Access Control

```typescript
enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
  RIDER = 'rider',
  INSPECTOR = 'inspector',
  FRANCHISE_OWNER = 'franchise',
  ADMIN = 'admin',
  AFFILIATE = 'affiliate',
}

// Middleware to check role
const requireRole = (...roles: Role[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
router.post('/products', requireRole(Role.SELLER), createProduct);
router.get('/admin/users', requireRole(Role.ADMIN), getUsers);
```

### 8.2 STL-Level Gating

```typescript
const requireSTL = (minLevel: number) => {
  return (req, res, next) => {
    if (req.user.stlLevel < minLevel) {
      return res.status(403).json({
        error: `STL L${minLevel}+ required`,
        yourLevel: req.user.stlLevel,
      });
    }
    next();
  };
};

// Usage
router.post('/products', requireSTL(3), createProduct); // L3+ can sell
router.post('/franchise/apply', requireSTL(5), applyFranchise); // L5+ can franchise
```

### 8.3 Ownership Verification

```typescript
const verifyOwnership = async (req, res, next) => {
  const resource = await getResource(req.params.id);
  
  if (resource.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not your resource' });
  }
  
  req.resource = resource;
  next();
};

// Usage
router.get('/orders/:id', verifyOwnership, getOrder);
router.put('/shop/:id', verifyOwnership, updateShop);
```

---

## §9 — Wallet & Financial Security

### 9.1 Double-Entry Verification

Every transaction must have:

```javascript
{
  transactionId: "txn_abc123",
  timestamp: 1681234567,
  from: { userId: "user_123", type: "buyer" },
  to: { userId: "user_456", type: "seller" },
  amount: 10000,
  currency: "PKR",
  status: "COMPLETED", // PENDING, COMPLETED, FAILED, REVERSED
  reference: "order_xyz789",
  
  // Verify from's balance decreased
  fromBalanceBefore: 15000,
  fromBalanceAfter: 5000,
  
  // Verify to's balance increased
  toBalanceBefore: 50000,
  toBalanceAfter: 60000,
  
  // Hash for integrity
  hash: sha256(JSON.stringify({...})), // Prevents tampering
}
```

### 9.2 Fraud Signal Detection

```typescript
const detectFraudSignals = (transaction) => {
  const signals = [];
  
  // 1. Velocity check
  const last24h = await Transaction.countDocuments({
    userId: transaction.userId,
    timestamp: { $gt: now - 24*HOUR },
  });
  if (last24h > 50) {
    signals.push('HIGH_VELOCITY'); // 50+ txns in 24h
  }
  
  // 2. Amount spike
  const avgAmount = await Transaction.aggregate([
    { $match: { userId: transaction.userId } },
    { $group: { _id: null, avg: { $avg: '$amount' } } },
  ]);
  if (transaction.amount > avgAmount * 3) {
    signals.push('AMOUNT_SPIKE'); // 3x above average
  }
  
  // 3. Geographic inconsistency
  const lastLocation = await Transaction.findOne(
    { userId: transaction.userId },
    { location: 1 },
    { sort: { timestamp: -1 } }
  );
  if (distance(lastLocation, transaction.location) > 1000) {
    signals.push('LOCATION_JUMP'); // 1000+ km in short time
  }
  
  // 4. Device change
  const lastDevice = await Transaction.findOne(
    { userId: transaction.userId },
    { deviceId: 1 },
    { sort: { timestamp: -1 } }
  );
  if (lastDevice.deviceId !== transaction.deviceId) {
    signals.push('DEVICE_CHANGE');
  }
  
  if (signals.length >= 2) {
    await lockTransaction(transaction.id);
    await notifyFraudTeam(transaction, signals);
  }
};
```

### 9.3 Rate Limits (Wallet-Specific)

```
Wallet top-up: 5/min per user
Withdrawal: 3/min per user
Transfer: 10/min per user
Payment: 10/min per user (global across all payment endpoints)
```

---

## §10 — PSS Anti-Fraud Checks

### 10.1 Liveness Detection

```javascript
// Detect: Spoofing, deepfakes, replay attacks
const validateLiveness = async (video: Buffer) => {
  const checks = {
    faceDetected: await detectFace(video),
    eyesMoving: await detectEyeMovement(video),
    headMovement: await detectHeadMovement(video),
    livenessScore: await runLivenessModel(video), // ML model
  };
  
  const passed = (
    checks.faceDetected &&
    checks.eyesMoving &&
    checks.headMovement &&
    checks.livenessScore > 0.95
  );
  
  if (!passed) {
    throw new Error('Liveness check failed');
  }
};
```

### 10.2 Identity Matching

```javascript
const validateIdentity = async (idPhoto: Buffer, selfiePhoto: Buffer) => {
  const idFace = await extractFace(idPhoto);
  const selfieFace = await extractFace(selfiePhoto);
  
  const similarityScore = await compareFaces(idFace, selfieFace);
  
  if (similarityScore < 0.90) {
    throw new Error('Face mismatch with ID');
  }
};
```

### 10.3 AML Check (Anti-Money Laundering)

```javascript
const checkAML = async (user) => {
  const response = await amlService.check({
    name: user.name,
    dob: user.dob,
    nationality: user.nationality,
  });
  
  if (response.riskLevel === 'HIGH') {
    throw new Error('AML check failed');
  }
  
  // Store result for audit
  await AMLCheck.create({
    userId: user._id,
    timestamp: new Date(),
    riskLevel: response.riskLevel,
    flags: response.flags,
  });
};
```

---

## §11 — DMO Up-Guard Pattern Detection

**DMO = Decentralized Management Office**

Detect suspicious escalation patterns:

```javascript
const detectUpGuardPattern = async (user) => {
  const recent30Days = await ComplaintLog.find({
    userId: user._id,
    timestamp: { $gt: now - 30*DAY },
  });
  
  const flags = [];
  
  // Pattern 1: Appeal after appeal
  if (recent30Days.length >= 3 && recent30Days.every(c => c.status === 'APPEALED')) {
    flags.push('REPEATED_APPEALS');
  }
  
  // Pattern 2: Admin escalation cycling
  const escalations = recent30Days.filter(c => c.escalatedToAdmin === true);
  if (escalations.length > 2) {
    flags.push('ESCALATION_CYCLING');
  }
  
  // Pattern 3: Last-minute dispute reversals
  const reversals = recent30Days.filter(c => 
    c.status === 'CLOSED_REVERSED' && 
    c.daysSinceDispute < 5
  );
  if (reversals.length >= 2) {
    flags.push('PREMATURE_REVERSALS');
  }
  
  if (flags.length >= 2) {
    await flagForManualReview(user, flags);
  }
};
```

---

## §12 — Security Headers Checklist

```javascript
// Express middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CSP — Control what resources can load
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  
  // HSTS — Force HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});
```

**Checklist:**
- [ ] X-Frame-Options = DENY (no clickjacking)
- [ ] X-Content-Type-Options = nosniff (no MIME sniffing)
- [ ] X-XSS-Protection = 1; mode=block
- [ ] Content-Security-Policy configured
- [ ] Strict-Transport-Security enabled (HSTS)
- [ ] Referrer-Policy set

---

## §13 — Dependency Vulnerability Scanning

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically (if patches available)
npm audit fix

# Audit production dependencies only
npm audit --production

# Export report
npm audit --json > audit-report.json

# Regular scanning (in CI/CD)
npm audit --audit-level=high
# Fails if any high/critical vulnerabilities
```

**Output should be:**
```
added X packages, and audited Y packages in Zs
found 0 vulnerabilities
```

---

## §14 — Security Report Template

**File:** `SECURITY_AUDIT_2026-04-14.md`

```markdown
# EHB Security Audit Report
**Date:** 2026-04-14  
**Auditor:** Security Team  
**Status:** PASSED ✓

## Summary
- **Total Checks:** 120
- **Passed:** 118
- **Failed:** 0
- **Warnings:** 2

## Critical (0)
(None)

## High (0)
(None)

## Medium (2)
- [ ] Password reset tokens stored plaintext (should be hashed)
  - **Status:** Design issue, low risk
  - **Fix:** Hash tokens with bcrypt
  - **ETA:** 2026-04-21

## Low (0)
(None)

## Passed Checks
- [x] RBAC implemented (7 roles)
- [x] STL gating enforced
- [x] JWT validation correct
- [x] Refresh token rotation working
- [x] Input validation with Zod
- [x] Rate limiting enabled
- [x] CORS configured correctly
- [x] File uploads validated
- [x] XSS prevention (React escaping)
- [x] CSRF tokens on forms
- [x] PSS liveness detection
- [x] AML checks enabled
- [x] Wallet escrow atomic
- [x] Transaction logging complete
- [x] Sensitive data encrypted (AES-256)
- [x] Logs don't leak PII
- [x] Dependencies audited (0 vulns)
- [x] Security headers configured

## Recommendations
1. Hash password reset tokens
2. Add device fingerprint to fraud detection
3. Implement rate limiting on admin endpoints

## Signature
Auditor: Alice (@alice-security)  
Date: 2026-04-14
```

---

## §15 — Summary Checklist

Before every release:

- [ ] `npm audit` shows 0 vulnerabilities
- [ ] JWT implementation tested (1h expiry, refresh rotation)
- [ ] All endpoints have Zod validation
- [ ] Rate limiting configured
- [ ] RBAC + STL gating working
- [ ] File uploads validated
- [ ] Security headers set
- [ ] CORS configured (no `*`)
- [ ] Password hashing using bcrypt
- [ ] Sensitive data encrypted
- [ ] Wallet transactions double-verified
- [ ] Fraud signals detected
- [ ] PSS/AML checks passing
- [ ] Logs configured (no PII)
- [ ] Backup & recovery tested

---

**Maintainer:** Security Team  
**Last Review:** 2026-04-14  
**Next Review:** 2026-05-14
