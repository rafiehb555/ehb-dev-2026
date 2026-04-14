# EHB Performance Optimizer Skill

> **Version:** 1.0  
> **Last updated:** 2026-04-14  
> **Owner:** EHB Technologies (Pvt.) Ltd.  
> **Purpose:** Frontend, backend, database, and infrastructure performance optimization for the global super-app.

---

## §1 — Performance Budget (Web Vitals)

**Target metrics (Google Core Web Vitals):**

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✓ |
| **FID** (First Input Delay) | < 100ms | ✓ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✓ |
| **TTFB** (Time to First Byte) | < 600ms | ✓ |
| **FCP** (First Contentful Paint) | < 1.8s | ✓ |

**Monitoring:**
```bash
# Real User Monitoring (RUM)
npm run lighthouse:continuous

# Generate report
npm run lighthouse -- --output-path=./lighthouse-report.json
```

---

## §2 — Frontend Performance Optimization

### 2.1 Next.js Optimizations

#### Image Optimization

```tsx
import Image from 'next/image';

// Bad: Large unoptimized image
<img src="/product.jpg" width="1200" height="800" />

// Good: Next.js Image component
<Image
  src="/product.jpg"
  alt="Product"
  width={1200}
  height={800}
  priority={isAboveFold}  // Lazy load by default
  sizes="(max-width: 640px) 100vw, 640px"  // Responsive
  onLoadingComplete={(result) => {
    if (result.naturalWidth === 0) {
      // Image failed to load
    }
  }}
/>
```

**Rules:**
- Always specify `width` and `height` (prevents layout shift)
- Use `priority` for above-fold images only
- Use `sizes` prop for responsive images
- Serve WebP format (Next.js auto-detects)
- Lazy load by default (defer below-fold images)

#### Dynamic Imports (Code Splitting)

```typescript
import dynamic from 'next/dynamic';

// Load component only when needed
const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Don't render on server if not needed
});

// Usage
export default function Page() {
  return (
    <>
      <Header /> {/* Critical path */}
      <HeavyComponent /> {/* Deferred until needed */}
    </>
  );
}
```

#### Incremental Static Regeneration (ISR)

```typescript
// pages/products/[id].tsx
export async function getStaticProps({ params }) {
  const product = await db.products.findById(params.id);
  
  return {
    props: { product },
    revalidate: 3600, // Revalidate every hour
  };
}

// Generates at build time, then regenerates in background
```

#### Static Site Generation (SSG)

```typescript
export async function getStaticPaths() {
  const products = await db.products.find();
  
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking', // Generate on-demand
  };
}
```

### 2.2 Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Output: interactive visualization of all bundles
# Find large packages and potential duplication

# Check tree-shaking
npm run analyze -- --production
```

**Rules:**
- Avoid large libraries (moment → date-fns)
- Tree-shake unused code
- Split routes into chunks
- Monitor vendor bundle size

### 2.3 Font Loading

```css
/* Preload critical fonts */
@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/dm-sans-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap; /* Show fallback while loading */
}

/* In HTML <head> */
<link rel="preload" as="font" href="/fonts/dm-sans-regular.woff2" crossorigin />
```

**Strategy:**
- Preload DM Sans (critical font)
- Use `font-display: swap` (don't block rendering)
- Limit font variants (regular + bold only)
- Serve from CDN or self-hosted
- Use WOFF2 format (smaller, well-supported)

### 2.4 CSS Optimization

```bash
# Purge unused CSS (Tailwind already does this)
npm run build  # Tailwind auto-purges in production

# Check for large CSS files
npm run analyze -- --output=webpack-stats.json
# Look for CSS > 100KB (indicates dead code)
```

---

## §3 — Database Query Optimization

### 3.1 MongoDB Indexing

```javascript
// Models: Create indexes for frequent queries
const ProductSchema = new Schema({
  title: String,
  sellerId: ObjectId,
  category: String,
  createdAt: Date,
  stlLevel: Number,
});

// Add indexes
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ category: 1, stlLevel: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ title: 'text' }); // Text search

// Compound index for common query
ProductSchema.index({ sellerId: 1, createdAt: -1 });
```

**Check index usage:**
```bash
# SSH into MongoDB Atlas
db.collection.aggregate([{ $indexStats: {} }]
# Look for indexes with high accesses
```

### 3.2 Query Optimization

#### Using `lean()` (No Mongoose wrapper)

```javascript
// Bad: Returns full Mongoose documents (slow)
const products = await Product.find({ sellerId });

// Good: Returns plain objects (30% faster)
const products = await Product.find({ sellerId }).lean();
```

#### Field Selection with `select()`

```javascript
// Bad: Fetch all fields
const orders = await Order.find();

// Good: Fetch only needed fields
const orders = await Order.find()
  .select('id totalAmount createdAt status');
```

#### Pagination

```javascript
// Bad: Skip large numbers is slow
const page = req.query.page || 1;
const orders = await Order.find()
  .skip((page - 1) * 50)
  .limit(50);

// Good: Use range queries
const lastId = req.query.lastId;
const orders = await Order.find({
  _id: { $gt: ObjectId(lastId) },
})
  .limit(50);
```

#### Aggregation Pipeline

```javascript
// Efficiently compute stats
const stats = await Order.aggregate([
  { $match: { sellerId: ObjectId(sellerId) } },
  { $group: {
    _id: null,
    totalOrders: { $sum: 1 },
    totalRevenue: { $sum: '$amount' },
    avgOrderValue: { $avg: '$amount' },
  } },
]);
```

### 3.3 Explain Plan Analysis

```bash
# Check query performance
db.products.find({ sellerId: ObjectId(...) }).explain('executionStats')

# Look for:
# - executionStages.stage === 'COLLSCAN' (BAD — full table scan)
# - executionStages.stage === 'IXSCAN' (GOOD — using index)
# - executionStats.executionStages.nReturned (results found)
# - executionStats.totalDocsExamined (docs scanned)
#
# Ratio: nReturned / totalDocsExamined should be ~1.0
# If 100 docs scanned to find 5, need better index
```

---

## §4 — Caching Strategy

### 4.1 Redis for Hot Data

```javascript
// Cache seller profile (expires 5 min)
const getSellerProfile = async (sellerId) => {
  const cached = await redis.get(`seller:${sellerId}`);
  if (cached) return JSON.parse(cached);
  
  const seller = await db.sellers.findById(sellerId);
  await redis.setex(`seller:${sellerId}`, 300, JSON.stringify(seller));
  
  return seller;
};

// Invalidate on update
const updateSellerProfile = async (sellerId, data) => {
  await db.sellers.updateOne({ _id: sellerId }, data);
  await redis.del(`seller:${sellerId}`); // Invalidate cache
};
```

**Cache strategy:**
```
Hot data (cache 5-15 min):
- Seller profile
- Product details
- STL levels
- Wallet balance

Warm data (cache 1-4 hours):
- Category listings
- Top sellers
- Trending products

Cold data (cache 24h or don't cache):
- User order history
- Admin reports
- Analytics
```

### 4.2 Browser Caching

```javascript
// Set cache headers
app.use((req, res, next) => {
  // Static assets: Cache 1 year
  if (req.path.startsWith('/static/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML: Don't cache (always fresh)
  else if (req.path.endsWith('.html')) {
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  // API: Don't cache by default
  else if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
});
```

### 4.3 In-Memory Cache (Config)

```javascript
// Cache config/feature flags in memory
const configCache = new Map();

const getConfig = async (key) => {
  if (configCache.has(key)) {
    return configCache.get(key);
  }
  
  const config = await db.config.findOne({ key });
  configCache.set(key, config.value);
  
  // Refresh every 10 min
  setTimeout(() => configCache.delete(key), 10 * 60 * 1000);
  
  return config.value;
};
```

---

## §5 — API Response Optimization

### 5.1 Pagination

```javascript
// Endpoint
GET /api/v1/products?cursor=abc123&limit=20

// Response
{
  data: [...],
  cursor: {
    nextId: "xyz789",
    hasMore: true
  }
}
```

### 5.2 Field Selection (GraphQL-like)

```javascript
// Client can request specific fields
GET /api/v1/products?fields=id,title,price

// Response only includes requested fields
{
  "data": [
    { "id": "...", "title": "...", "price": 10000 }
  ]
}
```

### 5.3 Compression (Gzip)

```javascript
const compression = require('compression');

app.use(compression({
  level: 6, // 1-9, higher = slower but smaller
  threshold: 1000, // Only compress responses > 1KB
}));
```

**Typical compression:** 30-50% size reduction

### 5.4 Response Caching Headers

```javascript
// For cacheable GET endpoints
app.get('/api/v1/categories', (req, res) => {
  const data = getCategoriesFromCache();
  
  res.set('Cache-Control', 'public, max-age=3600'); // 1h
  res.set('ETag', hash(JSON.stringify(data))); // For conditional requests
  
  res.json(data);
});

// Client: Can use ETag to avoid re-downloading unchanged data
GET /api/v1/categories
If-None-Match: "abc123"
Response: 304 Not Modified (no body sent)
```

---

## §6 — CDN Configuration (Cloudflare)

### 6.1 Rules

```
# Cache static assets aggressively
Path matches: /static/*
Cache: 1 year
Compress: Yes

# API responses: Don't cache by default
Path matches: /api/*
Cache: No
Compress: Yes (gzip)

# HTML pages: Fresh always
Path matches: *.html
Cache: No
Compress: Yes

# Cache product images
Path matches: /uploads/images/*
Cache: 1 day
Image optimization: WebP, resize
```

### 6.2 Worker Script (Transform Responses)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  
  // Add security headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  
  return newResponse;
}
```

---

## §7 — Load Testing

### 7.1 k6 Test Script

**File:** `infrastructure/load-test/browse.js`

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of reqs < 500ms
    'http_req_failed': ['<5%'],         // <5% fail
  },
};

export default function() {
  const res = http.get('https://ehb.tech');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'load time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### 7.2 Running Load Test

```bash
k6 run infrastructure/load-test/browse.js

# Output:
# ✓ status is 200: 95% pass rate
# ✓ load time < 500ms: 92% pass rate
# ✓ avg response: 312ms
# ✓ p95 response: 450ms
```

---

## §8 — MongoDB Atlas Search Optimization

### 8.1 Full-Text Search Index

```javascript
// In MongoDB Atlas (UI):
// 1. Go to Collections → Indexes
// 2. Create Search Index
// 3. Configure:

{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "description": {
        "type": "string"
      },
      "seller.rating": {
        "type": "number"
      }
    }
  }
}
```

### 8.2 Query

```javascript
const results = await Product.aggregate([
  {
    $search: {
      text: {
        query: "iPhone",
        path: ["title", "description"]
      }
    }
  },
  {
    $project: {
      score: { $meta: "searchScore" },
      title: 1,
      price: 1
    }
  }
]);
```

---

## §9 — Background Job Optimization (BullMQ)

### 9.1 Heavy Operations → Queue

```javascript
// Bad: Blocks request if slow
app.post('/api/send-email', async (req, res) => {
  // 2-5 seconds...
  await sendEmail(user.email);
  res.json({ ok: true });
});

// Good: Queue job, return immediately
app.post('/api/send-email', async (req, res) => {
  await emailQueue.add('send', { userId, type: 'welcome' });
  res.json({ queued: true });
});

// Worker process handles it
emailQueue.process(async (job) => {
  const user = await db.users.findById(job.data.userId);
  await sendEmail(user.email);
});
```

**What to queue:**
- Email sending (2-5s)
- SMS sending (1-3s)
- Image processing (5-60s)
- Report generation (10-120s)
- Data imports (minutes)
- Bulk operations (hours)

### 9.2 Job Configuration

```javascript
emailQueue.add('send', data, {
  attempts: 3,           // Retry 3 times
  backoff: {
    type: 'exponential',
    delay: 2000          // Start 2s, double each time
  },
  removeOnComplete: true, // Clean up completed jobs
  timeout: 30000,        // 30s timeout
});
```

---

## §10 — Real-Time Performance Monitoring

### 10.1 Datadog Setup

```javascript
// Track custom metrics
const StatsD = require('node-dogstatsd').StatsD;
const dogstatsd = new StatsD();

// Timing
const start = Date.now();
// ... do work ...
dogstatsd.timing('product.query_time', Date.now() - start);

// Count
dogstatsd.increment('orders.created');

// Gauge
dogstatsd.gauge('cache.items', cacheSize);
```

### 10.2 Alerts

```yaml
# Create alert in Datadog
name: High API response time
metric: "avg:api.response_time{*}"
threshold: 500ms
duration: 2 minutes
notify: @pagerduty
```

---

## §11 — Performance Checklist

Before every release:

- [ ] LCP < 2.5s (Lighthouse)
- [ ] FID < 100ms (Web Vitals)
- [ ] CLS < 0.1
- [ ] Bundle size analyzed (no bloat)
- [ ] Critical fonts preloaded
- [ ] Images optimized (WebP, lazy loading)
- [ ] MongoDB indexes checked
- [ ] Queries use `.lean()` when appropriate
- [ ] Redis caching configured
- [ ] Heavy operations queued
- [ ] API responses paginated/compressed
- [ ] Load test passes (k6)
- [ ] No console errors/warnings
- [ ] Performance budget not exceeded

---

## §12 — Quick Optimization Wins (Order of Impact)

1. **Lazy load images** → 10-30% LCP improvement
2. **Add database indexes** → 50-100% query speed
3. **Split code bundles** → 20-40% initial load
4. **Cache with Redis** → 100-1000x for hot data
5. **Queue heavy jobs** → 200-500ms request time reduction
6. **Compress responses** → 30-50% bandwidth savings
7. **Preload critical fonts** → 100-300ms FCP improvement
8. **Use CDN** → 50-200ms latency reduction

---

**Maintainer:** Performance Team  
**Last Review:** 2026-04-14  
**Target Budget:** LCP < 2.5s, FID < 100ms, CLS < 0.1
