# EHB COMPLETE SUPER-APP UI/UX NAVIGATION MAP

> Every Screen & Flow Documented

---

# MAIN APP STRUCTURE

## Complete Navigation Tree

```
HOME (/)
 │
 ├── Search (/search)
 │   ├── AI Search Hub
 │   ├── Voice Search
 │   ├── Image Search
 │   ├── Category Browse
 │   └── Recent Searches
 │
 ├── Profile (/profile)
 │   ├── JPS Professional Profile
 │   │   ├── Basic Info
 │   │   ├── About Me
 │   │   └── Profile Photo
 │   ├── Skills & Experience
 │   │   ├── Skills List
 │   │   ├── Add Skill
 │   │   ├── Skill Tests
 │   │   └── Certifications
 │   ├── Education
 │   │   ├── Degrees
 │   │   └── Courses
 │   ├── Work Experience
 │   │   ├── Employment History
 │   │   └── Projects
 │   ├── STL Trust Level
 │   │   ├── Current Level
 │   │   ├── Score History
 │   │   └── Upgrade Options
 │   ├── Certificates & Licenses
 │   │   ├── My Certificates
 │   │   ├── Verification Status
 │   │   └── Download/Share
 │   └── Settings
 │       ├── Account Settings
 │       ├── Privacy
 │       ├── Notifications
 │       └── Theme Selection
 │
 ├── Marketplace (/marketplace)
 │   ├── GoSellr Home
 │   │   ├── Featured Products
 │   │   ├── Categories
 │   │   └── Deals
 │   ├── Products (/marketplace/products)
 │   │   ├── Product Listing
 │   │   ├── Product Detail
 │   │   ├── Reviews
 │   │   └── Add to Cart
 │   ├── Services (/marketplace/services)
 │   │   ├── Service Categories
 │   │   ├── Service Providers
 │   │   ├── Provider Profile
 │   │   └── Book Service
 │   ├── Cart (/marketplace/cart)
 │   │   ├── Cart Items
 │   │   ├── Apply Coupon
 │   │   └── Checkout
 │   ├── Orders (/marketplace/orders)
 │   │   ├── Active Orders
 │   │   ├── Order History
 │   │   ├── Order Detail
 │   │   └── Track Order
 │   ├── Reviews (/marketplace/reviews)
 │   │   ├── My Reviews
 │   │   └── Write Review
 │   └── Seller Portal (/marketplace/seller)
 │       ├── Dashboard
 │       ├── My Products
 │       ├── Add Product
 │       ├── Orders Received
 │       └── Analytics
 │
 ├── Jobs & Skills (/jobs)
 │   ├── Job Listings
 │   │   ├── Browse Jobs
 │   │   ├── Search Jobs
 │   │   ├── Job Detail
 │   │   └── Apply
 │   ├── Professional Profiles
 │   │   ├── Browse Professionals
 │   │   ├── Profile View
 │   │   └── Connect
 │   ├── Skill Tests
 │   │   ├── Available Tests
 │   │   ├── Take Test
 │   │   ├── Results
 │   │   └── Badges
 │   ├── Hiring System
 │   │   ├── Post Job
 │   │   ├── Applications Received
 │   │   ├── Candidate Review
 │   │   └── Hire
 │   └── Freelance
 │       ├── Gig Listings
 │       ├── Post Gig
 │       └── My Gigs
 │
 ├── Health (/health)
 │   ├── WMS Home
 │   ├── Find Doctors
 │   │   ├── Specialties
 │   │   ├── Doctor List
 │   │   ├── Doctor Profile
 │   │   └── Book Appointment
 │   ├── Hospitals
 │   │   ├── Hospital List
 │   │   └── Hospital Detail
 │   ├── Appointments
 │   │   ├── Upcoming
 │   │   ├── Past
 │   │   └── Reschedule
 │   ├── Telemedicine
 │   │   ├── Video Consultation
 │   │   └── Chat with Doctor
 │   ├── Pharmacy
 │   │   ├── Order Medicines
 │   │   └── Prescriptions
 │   └── Medical Records
 │       ├── Health History
 │       └── Reports
 │
 ├── Travel (/travel)
 │   ├── AGTS Home
 │   ├── Flights
 │   │   ├── Search Flights
 │   │   ├── Flight Results
 │   │   ├── Book Flight
 │   │   └── My Flights
 │   ├── Hotels
 │   │   ├── Search Hotels
 │   │   ├── Hotel List
 │   │   ├── Hotel Detail
 │   │   └── Book Room
 │   ├── Visa Services
 │   │   ├── Countries
 │   │   ├── Visa Application
 │   │   └── Track Status
 │   ├── Travel Packages
 │   │   ├── Tour List
 │   │   ├── Package Detail
 │   │   └── Book Package
 │   └── My Trips
 │       ├── Upcoming
 │       └── Past
 │
 ├── Legal (/legal)
 │   ├── OLS Home
 │   ├── Find Lawyers
 │   │   ├── Practice Areas
 │   │   ├── Lawyer List
 │   │   ├── Lawyer Profile
 │   │   └── Book Consultation
 │   ├── Case Management
 │   │   ├── My Cases
 │   │   ├── Case Detail
 │   │   └── Documents
 │   ├── Legal Consultation
 │   │   ├── Schedule
 │   │   └── History
 │   └── Document Services
 │       ├── Contract Drafting
 │       └── Legal Templates
 │
 ├── Technology (/tech)
 │   ├── SOT Home
 │   ├── IT Services
 │   │   ├── Service Categories
 │   │   ├── Find Provider
 │   │   └── Request Service
 │   ├── Equipment Trading
 │   │   ├── Browse Equipment
 │   │   ├── Sell Equipment
 │   │   └── Rentals
 │   └── Repairs
 │       ├── Repair Services
 │       └── Book Repair
 │
 ├── Media (/media)
 │   ├── EHB Tube Home
 │   ├── Videos
 │   │   ├── Browse
 │   │   ├── Watch
 │   │   └── Upload
 │   ├── Educational Videos
 │   │   ├── Courses
 │   │   └── Tutorials
 │   ├── Content Library
 │   │   ├── Categories
 │   │   └── My Library
 │   └── Channels
 │       ├── Browse Channels
 │       ├── My Channel
 │       └── Subscriptions
 │
 ├── Education (/education)
 │   ├── HPS Home
 │   ├── Courses
 │   │   ├── Browse Courses
 │   │   ├── Course Detail
 │   │   └── Enroll
 │   ├── Tutors
 │   │   ├── Find Tutors
 │   │   └── Book Session
 │   ├── Books (OBS)
 │   │   ├── Browse Books
 │   │   ├── E-Books
 │   │   └── Purchase
 │   └── Certifications
 │       ├── Programs
 │       └── My Certifications
 │
 ├── Applications (/applications)
 │   ├── New Application
 │   │   ├── Select Type
 │   │   ├── Fill Form
 │   │   ├── Upload Documents
 │   │   ├── Pay Fees
 │   │   └── Submit
 │   ├── My Applications
 │   │   ├── Pending
 │   │   ├── In Progress
 │   │   ├── Approved
 │   │   └── Rejected
 │   ├── Track Status
 │   │   ├── Timeline
 │   │   └── Officer Info
 │   ├── Certificates
 │   │   ├── Issued Certificates
 │   │   └── Download
 │   └── Licenses
 │       ├── My Licenses
 │       └── Renewal
 │
 ├── Wallet (/wallet)
 │   ├── Dashboard
 │   │   ├── Balance
 │   │   └── Quick Actions
 │   ├── Transactions
 │   │   ├── All Transactions
 │   │   ├── Filter
 │   │   └── Export
 │   ├── Top Up
 │   │   ├── Payment Methods
 │   │   └── Add Money
 │   ├── Send Money
 │   │   ├── To User
 │   │   └── To Bank
 │   ├── Payments
 │   │   ├── Pay Bills
 │   │   └── Pay Services
 │   ├── Withdrawals
 │   │   ├── To Bank
 │   │   └── History
 │   └── Invoices
 │       ├── Received
 │       └── Sent
 │
 └── Trust & Verification (/trust)
     ├── Overview
     │   ├── My Trust Score
     │   └── Verification Status
     ├── PSS Verification
     │   ├── Identity Verification
     │   │   ├── Upload ID
     │   │   ├── Selfie
     │   │   └── Status
     │   ├── Document Verification
     │   │   ├── Upload Docs
     │   │   └── Status
     │   └── Verification History
     ├── CRB Certification
     │   ├── Apply for Certification
     │   │   ├── Select Type
     │   │   ├── Fill Details
     │   │   └── Schedule Inspection
     │   ├── My Certifications
     │   └── Refilling Due
     └── STL Score
         ├── Current Level
         ├── Score Breakdown
         ├── History
         └── Upgrade
```

---

# ADMIN / DMO NAVIGATION

## Complete Admin Panel Structure

```
DMO DASHBOARD (/admin)
 │
 ├── Overview
 │   ├── Stats Cards
 │   ├── Charts
 │   └── Recent Activity
 │
 ├── User Management (/admin/users)
 │   ├── All Users
 │   ├── User Detail
 │   ├── Add User
 │   ├── Edit User
 │   ├── Suspend/Activate
 │   └── User Analytics
 │
 ├── Professional Profiles (JPS) (/admin/jps)
 │   ├── All Profiles
 │   ├── Profile Review
 │   ├── Skill Verification
 │   └── Certificate Issuance
 │
 ├── Companies (/admin/companies)
 │   ├── All Companies
 │   ├── Company Detail
 │   ├── Verify Company
 │   └── Company Analytics
 │
 ├── Marketplace (GoSellr) (/admin/marketplace)
 │   ├── Products
 │   │   ├── All Products
 │   │   ├── Pending Approval
 │   │   └── Product Review
 │   ├── Orders
 │   │   ├── All Orders
 │   │   └── Disputes
 │   ├── Sellers
 │   │   ├── All Sellers
 │   │   └── Seller Review
 │   └── Categories
 │
 ├── Service Providers (/admin/providers)
 │   ├── All Providers
 │   ├── Pending Approval
 │   ├── Provider Detail
 │   └── Performance
 │
 ├── Verification (PSS) (/admin/pss)
 │   ├── Pending Queue
 │   ├── In Progress
 │   ├── Completed
 │   ├── Rejected
 │   ├── Verification Detail
 │   └── AI Performance
 │
 ├── Certification (CRB) (/admin/crb)
 │   ├── Applications
 │   ├── Schedule Inspection
 │   ├── Inspections
 │   │   ├── Pending
 │   │   ├── Scheduled
 │   │   └── Completed
 │   ├── Certificates
 │   │   ├── Issued
 │   │   ├── Expiring Soon
 │   │   └── Revoked
 │   ├── Refilling
 │   │   ├── Due
 │   │   └── Overdue
 │   └── Inspectors
 │
 ├── STL Trust System (/admin/stl)
 │   ├── User Rankings
 │   ├── Score Management
 │   ├── Penalties
 │   ├── Rewards
 │   └── AI Settings
 │
 ├── Applications & Licensing (/admin/applications)
 │   ├── All Applications
 │   ├── Pending Review
 │   ├── In Progress
 │   ├── Approved
 │   ├── Rejected
 │   ├── Application Detail
 │   ├── Assign Officer
 │   └── Workflow Settings
 │
 ├── Wallet & Finance (/admin/finance)
 │   ├── Overview
 │   ├── Transactions
 │   ├── Revenue
 │   ├── Fees Collection
 │   ├── Commissions
 │   ├── Payouts
 │   └── Reports
 │
 ├── Franchise Network (/admin/franchise)
 │   ├── All Franchises
 │   ├── Corporate
 │   ├── Master
 │   ├── Sub Franchises
 │   ├── Add Franchise
 │   ├── Performance
 │   └── Revenue Sharing
 │
 ├── Notifications & Penalties (/admin/notifications)
 │   ├── Send Notification
 │   ├── Notification History
 │   ├── Templates
 │   ├── Penalties
 │   │   ├── Issue Penalty
 │   │   ├── Pending
 │   │   └── Collected
 │   └── Alerts
 │
 ├── Blockchain Records (/admin/blockchain)
 │   ├── All Records
 │   ├── Certificates
 │   ├── Verifications
 │   ├── Licenses
 │   ├── Verify Hash
 │   └── Audit Trail
 │
 └── System Settings (/admin/settings)
     ├── General
     ├── Modules
     ├── Roles & Permissions
     ├── API Keys
     ├── Integrations
     ├── Email Templates
     ├── Backup
     └── Logs
```

---

# SCREEN COUNT SUMMARY

| Section | Screens |
|---------|:-------:|
| Home & Search | 6 |
| Profile (JPS) | 15 |
| Marketplace | 25 |
| Jobs & Skills | 18 |
| Health (WMS) | 15 |
| Travel (AGTS) | 14 |
| Legal (OLS) | 10 |
| Technology (SOT) | 8 |
| Media (Tube) | 12 |
| Education (HPS) | 10 |
| Applications | 12 |
| Wallet | 14 |
| Trust & Verification | 15 |
| **User App Total** | **~175** |
| Admin DMO | **~80** |
| **Grand Total** | **~255 Screens** |

---

*Complete Navigation Map v1.0 | March 2026*
