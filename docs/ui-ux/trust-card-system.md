# EHB TRUST CARD SYSTEM

> Complete Marketplace Trust Visualization

---

# OVERVIEW

EHB Trust Card is a **visual trust summary** that displays verification status from all EHB systems on marketplace listings. It enables customers to instantly assess provider credibility.

---

# TRUST CARD DATA SOURCES

| System | Card Display |
|--------|--------------|
| **DMO** | Registry ID |
| **JPS** | Profession / Skills |
| **PSS** | KYC Verification Status |
| **CRB** | Certification Status |
| **STL** | Trust Level & Score |
| **Franchise** | Inspection Authority |
| **Refilling** | Refilling Count & History |
| **Complaints** | Complaints Record |
| **Industry** | Industry Verification |

---

# CARD TYPES

## 1. Service Provider Trust Card

**Basic Info:**
- Profile Photo
- Name
- Profession
- Location

**Verification Data:**
- DMO Registry ID
- JPS Skills & Experience
- PSS Verification Status
- CRB Certification
- STL Level & Score
- Franchise Inspector
- Refilling History
- Complaints Record

**Marketplace Data:**
- Rating
- Jobs Completed

### Example:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [PHOTO]   Ali Electric                                             │
│            Electrician – Lahore                                     │
│                                                                     │
│  ⭐ STL Level: HIGH (82/100)                                        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  🛡️ PSS VERIFIED                                                    │
│     ✔ ID Verified                                                   │
│     ✔ Face Verified                                                 │
│     ✔ Address Verified                                              │
│                                                                     │
│  🏛️ CRB CERTIFIED                                                   │
│     Certified Electrician                                           │
│     Last Inspection: Feb 2026                                       │
│                                                                     │
│  🌐 DMO REGISTERED                                                  │
│     Registry ID: EHB-45982                                          │
│                                                                     │
│  🏢 FRANCHISE VERIFIED                                              │
│     Lahore Sub-Franchise                                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  💼 JPS PROFILE                                                     │
│     Skills: Wiring, Solar Installation                              │
│     Experience: 5 Years                                             │
│                                                                     │
│  🔁 REFILLING HISTORY                                               │
│     Completed: 3 times                                              │
│     Last: Jan 2026                                                  │
│     Next: Jul 2026                                                  │
│                                                                     │
│  ⚠️ COMPLAINTS                                                      │
│     Total: 2 | Resolved: 2 | Pending: 0                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ⭐ Rating: 4.8 (156 reviews)                                       │
│  ✔ Jobs Completed: 320                                              │
│                                                                     │
│  [BOOK NOW]                    [VIEW FULL PROFILE]                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Company Trust Card

**Basic Info:**
- Company Logo
- Company Name
- Industry
- Location

**Verification Data:**
- DMO Registry ID
- JPS Registered Staff
- PSS KYB Verification
- CRB Company Certification
- STL Trust Level
- Franchise Inspector
- Refilling History
- Complaints Record

**Marketplace Data:**
- Services Count
- Rating

### Example:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO]    TechFix Solutions                                        │
│            Electronics Repair – Dubai                               │
│                                                                     │
│  ⭐ STL Level: VIP (91/100)                                         │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  🛡️ PSS: Business Verified                                          │
│  🏛️ CRB: Certified Company                                          │
│  🌐 DMO: Registry ID EHB-C-10592                                    │
│  🏢 Franchise: Dubai Master Franchise                               │
│                                                                     │
│  💼 Staff: 18 Registered Employees                                  │
│                                                                     │
│  🔁 Refilling: 2 Times | Last: Feb 2026                            │
│  ⚠️ Complaints: 1 (Resolved)                                        │
│                                                                     │
│  ⭐ Rating: 4.9                                                      │
│  🧰 Services: 25                                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Product Trust Card

**Basic Info:**
- Product Image
- Product Name
- Brand

**Verification Data:**
- DMO Product Registry ID
- PSS Manufacturer Verified
- CRB Safety Inspection
- STL Seller Trust Level
- Franchise Warehouse Inspection
- Product Audit Count
- Product Complaints

**Marketplace Data:**
- Rating
- Orders

### Example:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [IMAGE]   Solar Inverter                                           │
│            Brand: GreenTech                                         │
│                                                                     │
│  ⭐ Seller STL Level: HIGH                                          │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  🛡️ PSS: Manufacturer Verified                                      │
│  🏛️ CRB: Product Safety Checked                                     │
│  🌐 DMO: Registry ID EHB-P-8491                                     │
│  🏢 Franchise: Karachi Sub-Franchise                                │
│                                                                     │
│  🔁 Product Audit: 2 Times                                         │
│  ⚠️ Complaints: 3 (Resolved)                                        │
│                                                                     │
│  ⭐ Rating: 4.7                                                      │
│  📦 Orders: 1,200                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# TRUST BADGE SYSTEM

| Badge | Meaning | Color |
|-------|---------|-------|
| 🛡️ | PSS Verified | Green |
| 🏛️ | CRB Certified | Blue |
| ⭐ | STL Level | Gold |
| 🌐 | DMO Registered | Purple |
| 🏢 | Franchise Verified | Orange |
| 🔁 | Refilling Count | Gray |
| ⚠️ | Complaints | Red/Green |

---

# CARD SIZE VARIANTS

## Small Card (Search Results Grid)

```
┌─────────────────────┐
│ [Photo]             │
│ Ali Electric        │
│ ⭐ HIGH (82)        │
│ ⭐⭐⭐⭐⭐ 4.8       │
│ 🛡️ 🏛️ 🌐            │
└─────────────────────┘
```

**Shows:**
- Photo
- Name
- STL Level
- Rating
- Badge icons

---

## Medium Card (Marketplace List)

```
┌─────────────────────────────────────────────┐
│ [Photo]  Ali Electric                       │
│          Electrician – Lahore               │
│          ⭐ HIGH (82) | ⭐⭐⭐⭐⭐ 4.8        │
│          🛡️ PSS | 🏛️ CRB | 🔁 3 | ⚠️ 2     │
│          320 Jobs | [BOOK]                  │
└─────────────────────────────────────────────┘
```

**Shows:**
- Photo, Name, Location
- STL Level, Rating
- PSS, CRB badges
- Refilling count, Complaints
- Jobs count, Action button

---

## Full Card (Profile Page)

Complete verification data including:
- All PSS verification steps
- CRB certification details
- STL score breakdown
- Franchise inspection info
- Complete refilling history
- All complaints with status
- Services list
- All reviews

---

# REFILLING DATA DISPLAY

| Field | Description |
|-------|-------------|
| Completed | Total refilling count |
| Last | Last refilling date |
| Next | Next refilling due date |
| Status | Current refilling status |

### Example:

```
🔁 REFILLING HISTORY
   Completed: 3 times
   Last: Jan 2026
   Next: Jul 2026
   Status: ✅ Up to date
```

---

# COMPLAINTS DATA DISPLAY

| Field | Description |
|-------|-------------|
| Total | Total complaints received |
| Resolved | Successfully resolved |
| Pending | Still under review |

### Example:

```
⚠️ COMPLAINTS RECORD
   Total: 4
   Resolved: 3 ✅
   Pending: 1 ⏳
```

**Impact on STL:**
- Resolved complaints = Minor impact
- Pending complaints = Score reduction
- Multiple pending = Significant penalty

---

# TRUST CARD SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER / COMPANY                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         JPS PROFILE                                 │
│              (Skills, Experience, Education)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PSS VERIFICATION                               │
│                (ID, Face, Address, AML)                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CRB CERTIFICATION                               │
│             (Skill Test, Inspection, Interview)                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       STL TRUST LEVEL                               │
│                  (AI Calculates Score)                              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DMO REGISTRY                                 │
│                 (Official Record Created)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  MARKETPLACE TRUST CARD                             │
│           (All Data Displayed to Customers)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# TRUST COMPARISON

Customers can compare providers instantly:

| Provider | STL | Refilling | Complaints |
|----------|-----|-----------|------------|
| Ali Electric | HIGH (82) | 3 ✅ | 2 (resolved) |
| TechFix | VIP (91) | 4 ✅ | 0 |
| QuickRepair | MEDIUM (65) | 1 ⚠️ | 5 (2 pending) |

---

*Trust Card System v1.0 | March 2026*
