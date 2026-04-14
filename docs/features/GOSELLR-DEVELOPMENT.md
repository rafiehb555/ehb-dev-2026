# GOSELLR DEVELOPMENT GUIDE — E-Commerce Marketplace

**Version:** 1.0  
**Updated:** 2026-04-14  
**Status:** Phase 1 (Weeks 5-6, post-launch)  

---

## Overview: GoSellr Architecture

**GoSellr** is EHB's e-commerce system. Sellers list products, buyers search + purchase, orders flow through escrow + completion. All visible products are scored by seller STL + trust badges.

**Key Principle:** Every product card shows trust signals. Buyers make decisions based on seller reputation (STL level, verification badges, review count).

---

## 7 Industry Categories (Phase 1)

| # | Category | Features | Verification | Rules |
|---|----------|----------|--------------|-------|
| 1 | **E-commerce** | Products, inventory, categories | Basic PSS | Standard listing |
| 2 | **Legal Services** | Document services, consulting | CRB law license | Escrow required |
| 3 | **Medical** | Consultations, classes, products | CRB health license | Telemedicine consent |
| 4 | **Education** | Courses, tutoring, certifications | CRB education cert | Grading system |
| 5 | **Jobs** | Freelance, hiring, gigs | PSS + skills | Portfolio required |
| 6 | **Travel** | Tours, bookings, packages | Travel insurance | Cancellation policy |

**Phase 2 queue (14 more):** Finance, Consulting, Construction, Agriculture, Automotive, Hospitality, Real Estate, Entertainment, Media, Fashion, Beauty, Fitness, Logistics, Manufacturing.

---

## Product Management

### CRUD Operations

#### POST `/api/gosellr/products`
Create a product listing.

**Request:**
```json
{
  "name": "Red Shirt (Cotton, Size M)",
  "description": "100% organic cotton, comfortable for everyday wear",
  "category": "e-commerce",
  "price": 29.99,
  "currency": "USD",
  "sku": "SHIRT-RED-M-001",
  "images": ["s3://bucket/img1.jpg", "s3://bucket/img2.jpg"],
  "variants": [
    { "size": "S", "color": "red", "stock": 10 },
    { "size": "M", "color": "red", "stock": 15 },
    { "size": "L", "color": "red", "stock": 8 }
  ],
  "shipping": {
    "weight_kg": 0.3,
    "dimensions": "20x20x5 cm",
    "domestic_cost": 5.00,
    "international_cost": 15.00
  },
  "tags": ["clothing", "organic", "unisex"],
  "return_policy": "30-day returns",
  "warranty": "1 year manufacturer"
}
```

**Response (201):**
```json
{
  "success": true,
  "product_id": "prod_507f1f77bcf86cd799439011",
  "status": "draft",
  "message": "Product created. Add images or publish to go live."
}
```

#### GET `/api/gosellr/products/:id`
Get product details.

**Response:**
```json
{
  "product": {
    "id": "prod_507f1f77bcf86cd799439011",
    "name": "Red Shirt (Cotton, Size M)",
    "seller_id": "507f1f77bcf86cd799439001",
    "seller_stl": 5,
    "seller_trust_badges": ["verified", "certified", "fast_shipping"],
    "price": 29.99,
    "rating": 4.7,
    "review_count": 243,
    "stock_total": 33,
    "sold_count": 127,
    "images": [...],
    "created_at": "2026-04-14T10:30:00Z"
  }
}
```

#### PATCH `/api/gosellr/products/:id`
Update product.

#### DELETE `/api/gosellr/products/:id`
Soft delete (archive).

### Inventory Management

```javascript
// Each variant tracks stock + reserved (in escrow)
{
  _id: ObjectId,
  product_id: ObjectId,
  sku: String,
  variant_key: String, // "size:M,color:red"
  
  stock: {
    total: 15,
    available: 10, // total - reserved
    reserved: 5,   // In pending/confirmed orders
  },
  
  price: 29.99,
  created_at: Date,
}

// On order placement:
// Find variant, check available > 0, set reserved++, available--
// On order completion:
// Set total--, reserved--, (stock sold++)
// On order cancelled:
// Set available++, reserved--
```

---

## Shop System

Each seller has a shop profile.

```javascript
// shops
{
  _id: ObjectId,
  seller_id: ObjectId (unique),
  shop_name: String, // "John's Electronics"
  shop_avatar: String, // Logo URL
  shop_description: String,
  shop_url_slug: String, // john-electronics
  
  stl_level: Number,
  trust_badges: [String], // 'verified', 'certified', 'fast_shipping', 'responsive'
  
  stats: {
    products_listed: 142,
    orders_completed: 1247,
    customer_rating: 4.8,
    response_time_hours: 2,
    return_rate: 0.02,
  },
  
  policies: {
    shipping_domestic: 5.00,
    shipping_international: 15.00,
    return_days: 30,
    response_sla: 24,
  },
  
  verified: Boolean,
  verification_date: Date,
  created_at: Date,
}
```

**Shop URL:** `gosellr.ehb.app/shops/john-electronics`

---

## Cart + Checkout Flow

### Cart Management

```javascript
// carts
{
  _id: ObjectId,
  buyer_id: ObjectId,
  items: [
    {
      product_id: ObjectId,
      variant_key: String, // "size:M,color:red"
      quantity: 2,
      price_per_unit: 29.99,
      subtotal: 59.98,
    }
  ],
  
  totals: {
    items_subtotal: 59.98,
    shipping: 10.00,
    tax: 4.80,
    discount_applied: 5.00,
    grand_total: 69.78,
  },
  
  coupon_code: String, // optional
  notes_to_seller: String,
  
  created_at: Date,
  updated_at: Date,
  expires_at: Date, // 30 days
}
```

### Checkout Process

**Step 1: Review Cart**
```json
GET /api/gosellr/cart
{
  "items": [
    {
      "name": "Red Shirt M",
      "price": 29.99,
      "qty": 2,
      "subtotal": 59.98,
      "seller_stl": 5,
      "shipping": 5.00
    }
  ],
  "total": 69.78,
  "payment_methods": ["wallet", "card", "bank_transfer"]
}
```

**Step 2: Select Shipping**
```json
POST /api/gosellr/checkout/shipping
{
  "address_id": "addr_123",
  "shipping_method": "express", // standard, express, overnight
  "insurance": true
}
```

**Step 3: Apply Coupon (Optional)**
```json
POST /api/gosellr/checkout/coupon
{
  "code": "SAVE10"
}
→ Discounts $5.00, total becomes $64.78
```

**Step 4: Payment**
```json
POST /api/gosellr/checkout/pay
{
  "payment_method": "wallet",
  "amount": 69.78,
  "shipping_address_id": "addr_123",
  "notes_to_seller": "Please gift wrap"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "order_id": "order_507f1f77bcf86cd799439011",
  "status": "pending_seller_confirmation",
  "message": "Order placed. Waiting for seller to confirm..."
}
```

---

## Order Lifecycle

```
┌──────────────────────────────────────────────────┐
│ placed (T0)                                      │
│ Escrow locked, awaiting seller confirmation     │
├──────────────────────────────────────────────────┤
│ confirmed (T0+1h typical)                        │
│ Seller agreed to fulfill, preparing items       │
├──────────────────────────────────────────────────┤
│ preparing (T0+24h typical)                       │
│ Items packed, ready for shipment                │
├──────────────────────────────────────────────────┤
│ shipped (T0+48h typical)                         │
│ In transit, tracking provided                   │
├──────────────────────────────────────────────────┤
│ delivered (T0+7d typical)                        │
│ Package arrived, awaiting buyer confirmation    │
├──────────────────────────────────────────────────┤
│ completed (T0+8d typical)                        │
│ Escrow released to seller, order done           │
│ (Or disputed if buyer files complaint T0-7d)   │
└──────────────────────────────────────────────────┘
```

**Database Schema:**
```javascript
{
  _id: ObjectId,
  buyer_id: ObjectId,
  seller_id: ObjectId,
  
  items: [
    { product_id, variant_key, quantity, price_per_unit, subtotal }
  ],
  
  status: String, // 'placed', 'confirmed', 'preparing', 'shipped', 'delivered', 'completed'
  
  totals: {
    subtotal: 59.98,
    shipping: 5.00,
    tax: 4.80,
    discount: 5.00,
    grand_total: 64.78,
  },
  
  escrow: {
    amount: 64.78,
    status: 'locked',
    soft_release_at: Date, // T+24h
    full_release_at: Date, // T+7d
  },
  
  shipping: {
    address: Object,
    carrier: String, // "FedEx", "UPS", "DHL"
    tracking_number: String,
    estimated_delivery: Date,
    actual_delivery: Date,
  },
  
  review: {
    buyer_rating: Number, // 1-5
    buyer_comment: String,
    seller_response: String,
    created_at: Date,
  },
  
  created_at: Date,
  completed_at: Date,
}
```

---

## Product Card Spec (Exact Layout)

Every product card follows this design:

```
┌─────────────────────────────────┐
│                                 │
│   ┌─────────────────────────┐   │
│   │  [Image carousel]       │   │ 40% height
│   │  < Previous | Next >    │   │
│   └─────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Red Shirt (Cotton, Size M)│   │ Product name (1-line ellipsis)
│ ├───────────────────────────┤   │
│ │ $29.99 [Free shipping]    │   │ Price + shipping badge
│ ├───────────────────────────┤   │
│ │ ★★★★★ 4.7 (243 reviews)   │   │ Rating + count
│ ├───────────────────────────┤   │
│ │ 🔒 Verified 🚚 FastShip   │   │ Trust badges (up to 3)
│ │ 📍 Seller L5 (Trusted)    │   │
│ ├───────────────────────────┤   │
│ │ [Add to Cart] [Buy Now]   │   │
│ └───────────────────────────┘   │
│                                 │
│ Size: [S] [M] [L] [XL]         │ Variants (if available)
│ Color: [Red] [Blue] [Green]    │
│                                 │
│ Stock: 33 in stock             │ Inventory status
│ 📦 Standard: $5 | 🚀 Express: $12│ Shipping options
│                                 │
│ ┌───────────────────────────┐   │
│ │ [Add to Cart]             │   │ Primary action
│ └───────────────────────────┘   │
│ [❤ Wishlist] [Share]            │ Secondary actions
│                                 │
└─────────────────────────────────┘

Colors:
├─ Background: #13162A (dark card)
├─ Text: #FFFFFF (white)
├─ Price: #2BBFA0 (teal)
├─ Rating: #F0A030 (amber)
├─ Badge: #7B6EF6 (purple) with 15% opacity background
├─ Button: Glassmorphism with teal background
└─ Border: 1px solid rgba(255,255,255,0.08)

Responsive:
├─ Desktop: 4 columns (max 280px width)
├─ Tablet: 2 columns
└─ Mobile: 1 column, full width
```

---

## Search + Filtering

### Search Endpoint

```javascript
GET /api/gosellr/search?query=shirt&category=e-commerce&min_price=10&max_price=50&seller_stl=5&sort=rating&limit=20

{
  "results": [
    {
      "product_id": "prod_...",
      "name": "Red Shirt (Cotton, Size M)",
      "price": 29.99,
      "rating": 4.7,
      "seller_stl": 5,
      "seller_name": "John's Electronics",
      "image_url": "...",
      "badges": ["verified", "fast_shipping"]
    }
  ],
  "total": 1247,
  "page": 1,
  "facets": {
    "category": [{ "e-commerce": 1247 }],
    "price_ranges": [
      { "$0-$25": 450 },
      { "$25-$50": 320 },
      { "$50-$100": 200 }
    ],
    "seller_stl": [
      { "L5+": 892 },
      { "L4": 180 },
      { "L3": 175 }
    ],
    "rating": [
      { "4.5+": 640 },
      { "4.0+": 820 }
    ]
  }
}
```

### Filters
- **Price:** $0-1000 range slider
- **Category:** Multi-select (6 industries in Phase 1)
- **Seller STL:** L3+, L4+, L5+, L6+, L7+, L8+, L9
- **Rating:** 4.5+, 4.0+, 3.5+, All
- **Stock:** In stock, Low stock, Out of stock

### Sort Options
- Relevance (default, BM25 algorithm)
- Newest (recently listed)
- Most reviewed
- Highest rating
- Lowest price
- Highest price
- Trending (velocity-based)

---

## AI Recommendations

### Engine
Recommend products to logged-in users based on:
- Search history (what they looked at)
- Purchase history (what they bought)
- Similar users (collaborative filtering)
- Trending products (STL-weighted)

**Algorithm:**
```javascript
async function getRecommendations(userId, limit = 10) {
  const user = await User.findById(userId);
  
  // 1. Get user's search/purchase history
  const searches = await SearchLog.find({ user_id: userId }).limit(50);
  const purchases = await Order.find({ buyer_id: userId, status: 'completed' }).limit(20);
  
  // 2. Extract product keywords
  const keywords = [
    ...searches.map(s => s.query),
    ...purchases.map(p => p.items.map(i => i.product_name)).flat(),
  ];
  
  // 3. Find similar products (same category, similar keywords)
  const recommendations = await Product.find({
    keywords: { $in: keywords },
    _id: { $nin: purchases.map(p => p.product_id) }, // Exclude purchased
  })
    .sort({ rating: -1, review_count: -1 })
    .limit(limit);
  
  // 4. Rank by seller STL (preference for higher trust)
  const sellers = await User.find({
    _id: { $in: recommendations.map(p => p.seller_id) }
  });
  
  return recommendations.sort((a, b) => {
    const aStl = sellers.find(s => s._id === a.seller_id)?.stl_level || 0;
    const bStl = sellers.find(s => s._id === b.seller_id)?.stl_level || 0;
    return bStl - aStl; // Higher STL first
  });
}
```

---

## Review System

### Post-Order Review

After order completes, buyer can review (optional):

```javascript
POST /api/gosellr/reviews
{
  "order_id": "order_xyz",
  "rating": 5,
  "comment": "Exactly as described, arrived quickly!",
  "photos": ["s3://bucket/photo1.jpg"],
  "helpful_tags": ["accurate_description", "fast_shipping", "good_packaging"]
}
```

**Database:**
```javascript
{
  _id: ObjectId,
  order_id: ObjectId,
  product_id: ObjectId,
  buyer_id: ObjectId,
  seller_id: ObjectId,
  
  rating: Number, // 1-5 stars
  comment: String,
  photos: [String], // S3 URLs
  helpful_tags: [String],
  
  seller_response: String, // Seller can reply
  seller_response_date: Date,
  
  helpful_count: Number, // Upvotes from other buyers
  unhelpful_count: Number,
  
  created_at: Date,
}
```

### Review Display
- Shows on product page
- Sorted by: Most helpful, Most recent, Highest rating, Lowest rating
- Filters by star rating

---

## Seller Dashboard (`/seller/dashboard`)

```
┌────────────────────────────────────────────┐
│ Your Shop: John's Electronics (L5 Trusted) │
├────────────────────────────────────────────┤
│                                            │
│ Quick Stats:                               │
│ • Products Listed: 142 | In Stock: 1,247   │
│ • Orders This Month: 87 (↑ 15%)            │
│ • Revenue This Month: $2,340 (↑ 22%)       │
│ • Customer Rating: 4.8 / 5.0               │
│ • Response Time: 2 hours                   │
│ • Return Rate: 2.1%                        │
│                                            │
│ ┌──────────────────────────────────────┐   │
│ │ Recent Orders (7)                    │   │
│ ├──────────────────────────────────────┤   │
│ │ Order #123 - 2 items - $89.99        │   │
│ │   Status: preparing [Ship Now] [View]│   │
│ │ Order #122 - 1 item - $29.99         │   │
│ │   Status: delivered [Leave Review]   │   │
│ └──────────────────────────────────────┘   │
│                                            │
│ ┌──────────────────────────────────────┐   │
│ │ Actions:                             │   │
│ │ [Add Product] [Manage Inventory]     │   │
│ │ [View Orders] [View Reviews]         │   │
│ │ [Settings] [Analytics]               │   │
│ └──────────────────────────────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

---

## Trust Badges (UI Integration)

Badges appear on product cards + shop pages.

| Badge | Requirement | Points | Duration |
|-------|-------------|--------|----------|
| **Verified** | PSS approved | Auto | Lifetime (while L2+) |
| **Certified** | CRB license (industry-specific) | Auto | Lifetime (while certified) |
| **Fast Shipping** | Avg delivery < 48h in past 30 days | Auto | 30 days |
| **Responsive** | Replies to messages < 2h avg | Auto | 30 days |
| **Trusted** | STL L5+ | Auto | Lifetime (while L5+) |
| **Pro** | STL L6+ | Auto | Lifetime (while L6+) |
| **Expert** | STL L7+ | Auto | Lifetime (while L7+) |
| **Master** | STL L8+ | Auto | Lifetime (while L8+) |
| **Supreme** | STL L9 | Auto | Lifetime (while L9) |

---

## Testing Requirements

### Unit Tests
- Product CRUD (create, read, update, delete)
- Cart add/remove/update
- Coupon validation
- Stock deduction logic
- Order state transitions

### Integration Tests
- Full checkout flow (add to cart → pay → order created)
- Inventory sync (concurrent orders)
- Search + filtering
- Review submission + seller response

### E2E Tests (Playwright)
- Browse products → search → filter → add to cart → checkout
- Seller: list product → receive order → mark shipped → complete
- Buyer: leave review → seller responds

---

## Performance Requirements

| Metric | Target | Implementation |
|--------|--------|-----------------|
| Product list page | <2s LCP | Image optimization, pagination |
| Product detail | <1s LCP | Server-side rendering, lazy loading |
| Search + filter | <500ms | Elasticsearch, cached facets |
| Checkout | <3s | Form optimizations, wallet call |
| Order creation | <1s | Async, webhook notifications |

---

## Key Rules (Non-Negotiable)

1. **Every product shows seller STL.** Trust is the primary signal.
2. **Escrow is mandatory.** No shortcuts, no exceptions.
3. **Reviews are immutable.** Can't delete (though seller can respond).
4. **Trust badges are earned.** No manual assignment.
5. **Inventory is real.** Stock count accurate to second (with reserved hold).
6. **Images are verified.** AI checks for misleading/fake images.
7. **Refund logic follows DMO.** Complaint resolution drives refunds, not seller whim.

---

*EHB Technologies (Pvt.) Ltd. — GoSellr Development Guide v1 — 2026-04-14*
