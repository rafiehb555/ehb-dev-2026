# EHB SUPER-APP NAVIGATION ARCHITECTURE

> Complete Navigation Map for All Services

---

# USER APP NAVIGATION

## Main Navigation Structure

```
HOME (/)
 │
 ├── Profile (JPS) (/profile)
 │     ├─ My Profile
 │     ├─ Skills & Experience
 │     ├─ Education
 │     ├─ Certifications
 │     └─ Settings
 │
 ├── Marketplace (/marketplace)
 │     ├─ GoSellr Home
 │     ├─ Products
 │     │    ├─ Categories
 │     │    ├─ Search
 │     │    └─ Product Detail
 │     ├─ Services
 │     │    ├─ Categories
 │     │    ├─ Providers
 │     │    └─ Book Service
 │     ├─ My Orders
 │     └─ My Listings
 │
 ├── Jobs & Skills (/jobs)
 │     ├─ Job Listings
 │     ├─ JPS Profiles
 │     ├─ Skill Tests
 │     └─ Career Services
 │
 ├── Health (/health)
 │     ├─ WMS Home
 │     ├─ Find Doctors
 │     ├─ Hospitals
 │     ├─ Telemedicine
 │     ├─ Pharmacy
 │     └─ My Appointments
 │
 ├── Travel (/travel)
 │     ├─ AGTS Home
 │     ├─ Flights
 │     ├─ Hotels
 │     ├─ Tour Packages
 │     ├─ Visa Services
 │     └─ My Bookings
 │
 ├── Legal (/legal)
 │     ├─ OLS Home
 │     ├─ Find Lawyers
 │     ├─ Legal Consultation
 │     ├─ Document Services
 │     └─ My Cases
 │
 ├── Technology (/tech)
 │     ├─ SOT Home
 │     ├─ IT Services
 │     ├─ Software Dev
 │     ├─ AI Services
 │     └─ Tech Consulting
 │
 ├── Media (/media)
 │     ├─ EHB Tube Home
 │     ├─ Videos
 │     ├─ Podcasts
 │     ├─ Channels
 │     └─ My Content
 │
 ├── Education (/education)
 │     ├─ HPS Home
 │     ├─ Courses
 │     ├─ Tutors
 │     ├─ OBS Books
 │     └─ Certifications
 │
 ├── Applications (/applications)
 │     ├─ New Application
 │     ├─ My Applications
 │     ├─ Track Status
 │     └─ Documents
 │
 ├── Wallet (/wallet)
 │     ├─ Balance
 │     ├─ Transactions
 │     ├─ Transfer
 │     ├─ Top Up
 │     └─ Invoices
 │
 └── Trust & Verification (/trust)
       ├─ My STL Level
       ├─ PSS Verification
       │    ├─ Identity
       │    ├─ Documents
       │    └─ Status
       ├─ CRB Certification
       │    ├─ Apply
       │    ├─ Schedule
       │    └─ Certificates
       └─ Verification History
```

---

# ADMIN / DMO NAVIGATION

## Admin Dashboard Structure

```
DASHBOARD (/admin)
 │
 ├── User Management (/admin/users)
 │     ├─ All Users
 │     ├─ Service Providers
 │     ├─ Add User
 │     └─ User Details
 │
 ├── Service Providers (/admin/providers)
 │     ├─ All Providers
 │     ├─ Pending Approval
 │     ├─ Verified
 │     └─ Provider Details
 │
 ├── Companies (/admin/companies)
 │     ├─ All Companies
 │     ├─ Pending Verification
 │     ├─ Verified
 │     └─ Company Details
 │
 ├── Government Officers (/admin/officers)
 │     ├─ All Officers
 │     ├─ Departments
 │     ├─ Roles & Permissions
 │     └─ Performance
 │
 ├── Franchise Network (/admin/franchise)
 │     ├─ All Franchises
 │     ├─ Corporate
 │     ├─ Master
 │     ├─ Sub Franchises
 │     └─ Revenue Reports
 │
 ├── Verification - PSS (/admin/pss)
 │     ├─ Pending Queue
 │     ├─ In Progress
 │     ├─ Completed
 │     ├─ Rejected
 │     └─ Verification Details
 │
 ├── Certification - CRB (/admin/crb)
 │     ├─ Applications
 │     ├─ Schedule Inspection
 │     ├─ Inspections
 │     ├─ Certificates
 │     └─ Refilling Due
 │
 ├── STL Trust System (/admin/stl)
 │     ├─ User Rankings
 │     ├─ Score History
 │     ├─ Penalties
 │     └─ Rewards
 │
 ├── Certificates & Licenses (/admin/certificates)
 │     ├─ All Certificates
 │     ├─ Issue New
 │     ├─ Expiring Soon
 │     └─ Revoked
 │
 ├── Application Management (/admin/applications)
 │     ├─ All Applications
 │     ├─ Pending Review
 │     ├─ In Progress
 │     ├─ Approved
 │     ├─ Rejected
 │     └─ Application Details
 │
 ├── Financial Management (/admin/finance)
 │     ├─ Overview
 │     ├─ Transactions
 │     ├─ Revenue
 │     ├─ Fees
 │     ├─ Commissions
 │     └─ Reports
 │
 ├── Notifications & Penalties (/admin/notifications)
 │     ├─ All Notifications
 │     ├─ Send Notification
 │     ├─ Penalties
 │     └─ Templates
 │
 ├── Blockchain Records (/admin/blockchain)
 │     ├─ All Records
 │     ├─ Verify Hash
 │     ├─ Certificates
 │     └─ Audit Trail
 │
 └── System Settings (/admin/settings)
       ├─ General
       ├─ Modules
       ├─ API Keys
       ├─ Integrations
       └─ Backup
```

---

# ROUTE MAPPING

## User App Routes

| Route | Component | Auth |
|-------|-----------|------|
| `/` | Home | Public |
| `/login` | Login | Guest |
| `/register` | Register | Guest |
| `/profile` | Profile | Auth |
| `/profile/edit` | EditProfile | Auth |
| `/marketplace` | Marketplace | Public |
| `/marketplace/products` | Products | Public |
| `/marketplace/products/[id]` | ProductDetail | Public |
| `/marketplace/services` | Services | Public |
| `/marketplace/services/[id]` | ServiceDetail | Public |
| `/marketplace/book/[id]` | BookService | Auth |
| `/health` | WMS Home | Public |
| `/health/doctors` | FindDoctors | Public |
| `/health/book/[id]` | BookDoctor | Auth |
| `/travel` | AGTS Home | Public |
| `/travel/flights` | Flights | Public |
| `/travel/hotels` | Hotels | Public |
| `/legal` | OLS Home | Public |
| `/legal/lawyers` | FindLawyers | Public |
| `/tech` | SOT Home | Public |
| `/media` | EHB Tube | Public |
| `/education` | HPS/OBS | Public |
| `/applications` | Applications | Auth |
| `/applications/new` | NewApplication | Auth |
| `/applications/[id]` | ApplicationDetail | Auth |
| `/wallet` | Wallet | Auth |
| `/wallet/transactions` | Transactions | Auth |
| `/trust` | TrustCenter | Auth |
| `/trust/pss` | PSSVerification | Auth |
| `/trust/crb` | CRBCertification | Auth |

## Admin Routes

| Route | Component | Role |
|-------|-----------|------|
| `/admin` | Dashboard | Admin |
| `/admin/users` | UserManagement | Admin |
| `/admin/users/[id]` | UserDetail | Admin |
| `/admin/providers` | Providers | Admin |
| `/admin/companies` | Companies | Admin |
| `/admin/officers` | Officers | SuperAdmin |
| `/admin/franchise` | Franchise | Admin |
| `/admin/pss` | PSSManagement | Admin |
| `/admin/crb` | CRBManagement | Admin |
| `/admin/stl` | STLManagement | Admin |
| `/admin/certificates` | Certificates | Admin |
| `/admin/applications` | Applications | Officer |
| `/admin/finance` | Finance | Finance |
| `/admin/notifications` | Notifications | Admin |
| `/admin/blockchain` | Blockchain | Admin |
| `/admin/settings` | Settings | SuperAdmin |

---

# NAVIGATION COMPONENTS

## User App Header

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] │ [Search...] │ [Notifications] [Wallet: 850] [User] │
└──────────────────────────────────────────────────────────────┘
```

## User App Sidebar (Mobile: Bottom Nav)

```
┌────────────────┐
│ 🏠 Home        │
│ 👤 Profile     │
│ 🛒 Marketplace │
│ 💼 Jobs        │
│ 🏥 Health      │
│ ✈️ Travel      │
│ ⚖️ Legal       │
│ 💻 Tech        │
│ 🎥 Media       │
│ 📚 Education   │
│ 📝 Applications│
│ 💰 Wallet      │
│ ✅ Trust       │
└────────────────┘
```

## Admin Sidebar

```
┌────────────────────┐
│ 📊 Dashboard       │
│ 👥 Users           │
│ 🔧 Providers       │
│ 🏢 Companies       │
│ 🏛️ Officers        │
│ 🌐 Franchise       │
│ ✅ PSS Verification│
│ 📋 CRB Certification│
│ ⭐ STL Trust       │
│ 📜 Certificates    │
│ 📝 Applications    │
│ 💰 Finance         │
│ 🔔 Notifications   │
│ ⛓️ Blockchain      │
│ ⚙️ Settings        │
└────────────────────┘
```

---

# BREADCRUMB PATTERNS

```
Home > Marketplace > Products > Electronics > Product Name
Home > Health > Find Doctors > Dr. Ahmed Khan
Home > Applications > My Applications > APP-12345
Admin > Users > User Details > John Smith
Admin > Applications > Pending > APP-54321
```

---

*Navigation Architecture v1.0 | March 2026*
