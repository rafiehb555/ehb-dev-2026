# EHB-GoSellr — Complete System Plan
> Global Shopping Management (GSM)
> Version: 1.0 | April 2026 | Status: PLANNING

---

## PART 1: WHAT IS GoSellr

**GoSellr (GSM — Global Shopping Management)** is EHB's multi-industry marketplace.

> Simple line: "Amazon + OLX + Daraz + Alibaba + Uber Eats — all in one, trust-verified platform"

---

## PART 2: SELLER HIERARCHY (7 TYPES)

### Complete Supply Chain:
```
🏭 Manufacturer/Company
        ↓
🏢 Authorized Dealer
        ↓
📦 Distributor
        ↓
🏬 Wholesaler
        ↓
🛒 Trader
        ↓
🏪 Retailer/Storekeeper
        ↓
🌐 Online Seller (Virtual)
        ↓
👥 CUSTOMER
```

### Seller Type Details:

| Type | Role | Stock Required | Delivery |
|------|------|---------------|---------|
| Manufacturer | Produces goods, brand owner | Yes (bulk) | Dealer |
| Authorized Dealer | Direct from manufacturer | Yes | Sub dealers |
| Distributor | Bulk handler, multi-dealer supply | Yes (large) | Wholesalers |
| Wholesaler | Bulk retail, retailer supply | Yes | Retailers |
| Trader | Buy & sell, flexible sourcing | Optional | Flexible |
| Retailer/Storekeeper | Direct customer sales | Yes | Customer |
| Online Seller | Virtual store, dropshipping | Optional | Platform/Self |

---

## PART 3: SELLER ACCESS BY STL LEVEL

| STL Level | Seller Permissions |
|-----------|------------------|
| L1 (0-39) | ❌ Cannot list products |
| L2 (40-59) | ✅ List up to 5 products |
| L3 (60-74) | ✅ Unlimited products, standard visibility |
| L4 (75-89) | ✅ Featured listing eligible, priority |
| L5 (90-100) | ✅ Top placement, brand partner program |

---

## PART 4: STORE STRUCTURE

### Store Types:
1. **Single Store** — 1 location, 1 seller
2. **Multi-Branch Store** — Same seller, multiple locations
3. **Franchise Store** — Franchise-operated storefront
4. **Virtual Store** — No physical location, online only

### Store Profile Fields:
```
Store {
  name
  owner (userId)
  type: SINGLE | MULTI_BRANCH | FRANCHISE | VIRTUAL
  stlScore
  verificationStatus
  location(s)
  categories
  rating
  reviewCount
  totalSales
  activeProducts
  joinedDate
  badgeLevel: BRONZE | SILVER | GOLD | PLATINUM
  customBranding (VIP only)
}
```

---

## PART 5: PRODUCT SYSTEM

### Product Types:
- **Physical Product** — Tangible item with stock
- **Digital Product** — Software, e-books, licenses
- **Service-based** — Linked to a provider service

### Product Flow:
```
Upload Product
    ↓
AI Content Review (auto)
    ↓
Category Assignment
    ↓
Price + Stock Set
    ↓
CRB Verification (optional, boosts trust)
    ↓
LIVE on Platform
    ↓
Customer Orders
    ↓
Delivery
    ↓
Customer Review
    ↓
STL Update (product + seller)
```

### Product STL Score:
Every product has its own STL score (0–100):
```
Product STL =
  Seller PSS score (inherited)
  + CRB Certification (product-specific)
  + Performance (sales completion rate)
  + Reviews (customer ratings)
  + Behavior (returns/complaints)
  + Refilling (seller's re-verification status)
```

### Product Categories (All Industries):
**Tier 1 (Pakistan launch):**
- Electronics & IT
- Fashion & Clothing
- Health & Medical
- Food & Grocery
- Mobile Phones & Accessories

**Tier 2 (Phase 2):**
- Home & Living
- Automotive Parts
- Construction Materials
- Solar & Energy
- Books & Education

**Global (All Industries):**
- Legal Products/Services
- Travel Packages
- Industrial Machinery
- Beauty & Personal Care
- Sports & Fitness
- Toys & Baby Products
- Office Supplies
- Agricultural Products

---

## PART 6: PRICING SYSTEM

### Multi-Level Pricing:
| Seller Level | Markup | Example (Base PKR 1000) |
|-------------|--------|------------------------|
| Manufacturer | Base | PKR 1,000 |
| Dealer | +10% | PKR 1,100 |
| Distributor | +15% | PKR 1,150 |
| Wholesaler | +20% | PKR 1,200 |
| Retailer | +30% | PKR 1,300 |

### Dynamic Commission (STL-based):
| STL Level | Platform Commission |
|-----------|-------------------|
| L1 | 15% |
| L2 | 15% |
| L3 | 12% |
| L4 | 10% |
| L5 | 7% |

---

## PART 7: ORDER FLOW (COMPLETE)

```
Customer Browses
    ↓
AI Recommends (STL + Location + Reviews)
    ↓
Add to Cart
    ↓
Checkout (EHBGC or local currency)
    ↓
Payment Confirmed
    ↓
Seller Notified
    ↓
Order Confirmed + Escrow Hold (DMO)
    ↓
AI Selects Best Delivery Option
    ↓
Rider Assigned (nearest available)
    ↓
Real-time Tracking
    ↓
Delivered ✅
    ↓
Escrow Released to Seller (after delivery confirm)
    ↓
Auto Commission Split:
    Company (EHB) %
    Sub Franchise %
    Master Franchise %
    Corporate Franchise %
    Seller %
    Rider %
    Affiliate % (if referred)
    ↓
Customer Review
    ↓
STL Recalculated (Seller + Product + Rider)
```

---

## PART 8: COMMISSION SPLIT STRUCTURE

### Standard Order Split:
| Entity | Percentage |
|--------|-----------|
| EHB Company | 10% |
| Sub Franchise | 3% |
| Master Franchise | 2% |
| Corporate Franchise | 2% |
| Country Franchise | 1% |
| Seller | 70% |
| Rider/Delivery | 5% |
| Affiliate (if any) | 7% |

*Percentages adjustable by admin. Affiliate gets cut from EHB's share, not seller's.*

---

## PART 9: DELIVERY SYSTEM

### Delivery Types Available:
1. **EHB Platform Riders** — Franchise-managed delivery workforce
2. **Third-party Services** — Rider app, Bykea, TCS, Leopard (Pakistan)
3. **Seller Self-Delivery** — Seller uses own logistics
4. **Digital Delivery** — Instant (for digital products)

### Delivery Assignment Flow (AI):
```
Order Placed
    ↓
AI checks:
    Seller location
    Customer location
    Available riders nearby (by GPS)
    Rider STL score
    Rider availability
    ↓
Best rider assigned (auto)
    ↓
Rider accepts (30 sec timeout)
    ↓
If rejected → Next rider
    ↓
Rider picks up
    ↓
Real-time GPS tracking shared with customer
    ↓
Delivered + Confirmed
    ↓
Rider STL + Performance updated
```

### Rider STL Rules:
```
On-time delivery:     +2 performance points
Late delivery:        -5 STL penalty
Order damaged:        -15 STL + complaint
3+ complaints:        STL freeze + review
```

---

## PART 10: AI SYSTEM IN GoSellr

| AI Feature | What It Does |
|-----------|-------------|
| Search Ranking | Ranks by STL + Reviews + Location + Price |
| Smart Recommendations | Personalized product suggestions per user |
| Price Optimization | Suggests optimal pricing for sellers |
| Demand Prediction | Forecasts which products will be in demand |
| Fraud Detection | Detects fake listings, fake reviews, order fraud |
| Auto-translation | Product listings in multiple languages |
| Review Authenticity | Detects fake/bot reviews |
| Inventory Alerts | Warns seller when stock is low |

---

## PART 11: SELLER DASHBOARD SECTIONS

| Section | Content |
|---------|---------|
| 📊 Overview | Sales, revenue, orders today |
| 📦 Products | All products, stock, status |
| 📋 Orders | Pending, processing, delivered |
| 💰 Earnings | EHBGC wallet, commission history |
| ⭐ Reviews | Customer reviews, rating breakdown |
| 🛡 STL Score | Live score, breakdown, improvement tips |
| 📈 Growth | Monthly trends, AI insights |
| 🏢 Store Settings | Profile, branding, categories |
| 🚚 Delivery | Rider management, delivery zones |
| 🔔 Notifications | All alerts |

---

## PART 12: SELLER SCALING SYSTEM (GROWTH PATH)

```
Online Seller (L2)
    ↓ (performance + STL)
Retailer (L3)
    ↓
Wholesaler (L4)
    ↓
Distributor (L4-L5)
    ↓
Authorized Dealer (L5)
    ↓
Manufacturer Partner (L5 + special CRB)
```

### Multi-Store Expansion:
- L3+ sellers can open additional store locations
- L4+ sellers can apply for franchise-operated stores
- L5 sellers can create "Brand Partner" account with custom branding

### Cross-Industry Selling:
- Sellers can list in multiple industry categories
- Each additional verified industry = STL boost (0-20 points total)

---

## PART 13: VERIFICATION LEVELS (SELLER-SPECIFIC)

| Level | Requirements | Badge |
|-------|-------------|-------|
| Basic | PSS complete, email verified | ✅ Basic |
| Standard | Business docs uploaded, DMO review | 🏅 Standard |
| Advanced | CRB physical inspection | 🥇 CRB Verified |
| Premium | Physical + sector-specific audit | 💎 Premium |

---

## PART 14: FRAUD CONTROL (GoSellr)

### Automated Detection:
- Fake product listings (AI image check)
- Price manipulation (sudden extreme changes flagged)
- Fake reviews (bot pattern detection)
- Phantom orders (no delivery evidence)
- Refund abuse patterns

### Penalties:
| Issue | Penalty |
|-------|---------|
| Fake product | -30 STL + listing removed |
| Fake reviews | -20 STL + review removed |
| Order cancellation (seller) | -5 STL |
| Not delivering | -30 STL + ban risk |
| Fraud complaint | -50 STL + investigation |

---

## PART 15: GoSellr WALLET INTEGRATION

- All payments auto-convert to EHBGC
- Seller earnings shown in EHBGC (+ local currency equivalent)
- Withdrawal limits by STL level:

| STL | Daily Withdrawal |
|-----|-----------------|
| L2 | PKR 10,000 / £50 |
| L3 | PKR 50,000 / £250 |
| L4 | PKR 200,000 / £1,000 |
| L5 | Unlimited |

---

## PART 16: DATABASE MODELS NEEDED

```prisma
model Store
model Product
model ProductCategory
model Order
model OrderItem
model DeliveryRider
model DeliveryAssignment
model SellerProfile
model Review (product reviews)
model Commission
model EscrowHold
model CartItem
model Wishlist
```

---

## PART 17: API ROUTES PLAN

```
GET    /api/gosellr/products          → Browse products
POST   /api/gosellr/products          → Create product
GET    /api/gosellr/products/[id]     → Product detail
PATCH  /api/gosellr/products/[id]     → Update product
DELETE /api/gosellr/products/[id]     → Remove product

GET    /api/gosellr/stores            → Browse stores
POST   /api/gosellr/stores            → Create store
GET    /api/gosellr/stores/[id]       → Store profile

POST   /api/gosellr/orders            → Place order
GET    /api/gosellr/orders            → User's orders
PATCH  /api/gosellr/orders/[id]       → Update order status

GET    /api/gosellr/search            → Smart search
GET    /api/gosellr/recommendations   → AI recommendations
GET    /api/gosellr/trending          → Trending products

POST   /api/gosellr/reviews           → Submit review
GET    /api/gosellr/reviews/[id]      → Product reviews

GET    /api/gosellr/trust             → Trust score (product/seller)
POST   /api/gosellr/complaint         → Submit complaint
POST   /api/gosellr/escrow/hold       → Hold payment
POST   /api/gosellr/escrow/release    → Release to seller

GET    /api/gosellr/delivery/riders   → Available riders
POST   /api/gosellr/delivery/assign   → Assign rider
```

---

*GoSellr Plan v1.0 | April 2026 | Planning Phase*
