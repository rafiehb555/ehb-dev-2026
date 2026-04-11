# DMO UI/UX WIREFRAME - COMPLETE ADMIN SYSTEM

> Official Admin Dashboard Specification

## Reference Wireframe
- **Image:** `assets/dmo-admin-wireframe.png`
- **Theme:** Light mode admin interface
- **User:** Muhammad Rafi (Admin)

---

# LAYOUT STRUCTURE

```
┌──────────────────────────────────────────────────────────────────┐
│  EHB Logo │              DMO UI/UX WIREFRAME            │ 🔍 👤 │
│           │           COMPLETE ADMIN SYSTEM              │       │
├───────────┼──────────────────────────────────────────────────────┤
│           │                                                      │
│  SIDEBAR  │                  MAIN CONTENT                        │
│   240px   │                                                      │
│           │   [Stats Cards]                                      │
│ Dashboard │   [Charts & Tables]                                  │
│ Users     │   [Data Grids]                                       │
│ Providers │                                                      │
│ Companies │                                                      │
│ Officers  │                                                      │
│ Franchise │                                                      │
│ PSS       │                                                      │
│ CRB       │                                                      │
│ Certs     │                                                      │
│ Apps      │                                                      │
│ Finance   │                                                      │
│ Notifs    │                                                      │
│ Blockchain│                                                      │
│ Settings  │                                                      │
│           │                                                      │
│ [User]    │                                                      │
│ [Logout]  │                                                      │
└───────────┴──────────────────────────────────────────────────────┘
```

---

# SIDEBAR NAVIGATION

## Menu Structure (14 Items)

| Icon | Label | Route | Description |
|------|-------|-------|-------------|
| 📊 | Dashboard | `/admin` | Overview & stats |
| 👥 | User Management | `/admin/users` | All platform users |
| 🔧 | Service Providers | `/admin/providers` | Verified providers |
| 🏢 | Companies | `/admin/companies` | Registered companies |
| 🏛️ | Government Officers | `/admin/officers` | DMO officers |
| 🌐 | Franchise Network | `/admin/franchise` | Franchise management |
| ✅ | Verification (PSS) | `/admin/pss` | AI verifications |
| 📋 | Certification (CRB) | `/admin/crb` | Physical certifications |
| 📜 | Certificates & Licenses | `/admin/certificates` | Issued documents |
| 📝 | Application Management | `/admin/applications` | All applications |
| 💰 | Financial Management | `/admin/finance` | Transactions, fees |
| 🔔 | Notifications & Penalties | `/admin/notifications` | Alerts, penalties |
| ⛓️ | Blockchain Records | `/admin/blockchain` | Immutable records |
| ⚙️ | Settings | `/admin/settings` | System settings |

## Sidebar Footer
```
┌─────────────────────┐
│ 👤 Muhammad Rafi    │
│    Admin            │
├─────────────────────┤
│   [Logout →]        │
└─────────────────────┘
```

---

# DASHBOARD PAGE

## Stats Cards Row (4 Cards)

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total Users │ │ Service     │ │ Total       │ │ Pending     │
│   1,502     │ │ Providers   │ │ Companies   │ │ Applications│
│   +26↑      │ │   382 +9↑   │ │   128 +4↑   │ │     63      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Card Structure
```typescript
interface StatCard {
  icon: ReactNode;
  label: string;
  value: number;
  change: number;
  changeDirection: 'up' | 'down';
}
```

---

## Main Content Grid

### Row 1: Chart + Table

```
┌────────────────────────────────┐ ┌──────────────────────────┐
│   User & Provider Growth       │ │   Pending Applications   │
│                                │ │                          │
│   [Line Chart]                 │ │ Applicant │ Category     │
│   Mo Jan Feb Mar Apr May Jun   │ │ Davi Hun  │ Company      │
│                                │ │ John Smith│ Company      │
│   [1W] [1M] [6M] [1Y]         │ │ Jutler Lee│ Service Prov │
│                                │ │ Adrian Hun│ Service Prov │
└────────────────────────────────┘ └──────────────────────────┘
```

### Row 2: Two Tables

```
┌────────────────────────────────┐ ┌──────────────────────────┐
│   Recent User Registrations    │ │   Pending Applications   │
│                     View All > │ │                View All >│
├────────────────────────────────┤ ├──────────────────────────┤
│ Name       │ Email    │STL│Date│ │ Name     │Cat  │Type│Stat│
│ John Smith │ john@... │Bas│4/12│ │ Al Dewrien│Comp│Lic │Pend│
│ ASIF EMIL  │ asif@... │Med│4/11│ │ Animacies │Comp│Cert│Pend│
│ Peru Smith │ peru@... │Med│4/11│ │ Dew Jast  │Prov│Cert│Pend│
│ Adrian Sara│ adri@... │Med│4/11│ │ prithatn  │Comp│Lic │Pend│
│ Jury Lee   │ jury@... │Med│4/11│ │ Ruby Smith│Comp│Lic │Pend│
└────────────────────────────────┘ └──────────────────────────┘
```

### Row 3: Stats + Metrics

```
┌──────────────────────┐ ┌────────────────┐ ┌──────────────────┐
│ Verification Overview│ │  ITPIS Pending │ │ Notifications    │
│                  ... │ │                │ │ & Penalties      │
├──────────────────────┤ │ ✓ li225 Bmlin  │ ├──────────────────┤
│ ⚫ PSS Verification  │ │ ✓ l238 TPending│ │ 📧 EHB Wadallte  │
│   57 (30h)           │ │ ✓ 1331 Tpw     │ │ 📧 EHB Rebinds   │
│ ⚪ CRB Certification │ │                │ │ 📧 EHB Vallter   │
│   21 (21h)           │ │ █████ 37%      │ │ 📧 EHB Redcas    │
│ ⚫ Online Verif      │ │ Monthly: 335   │ │                  │
│   1235               │ │ Service: 37,266│ │        View All >│
│ ⚫ Physical Inspect  │ │ Penalties: 350 │ │                  │
│   331                │ │                │ │                  │
└──────────────────────┘ └────────────────┘ └──────────────────┘
```

---

# PAGE SPECIFICATIONS

## 1. User Management Page

### Features
- User list with filters
- Search by name, email, phone
- Filter by STL level
- Filter by verification status
- User detail view
- Edit user profile
- Suspend/activate user

### Table Columns
| Column | Type |
|--------|------|
| Avatar | Image |
| Name | Text |
| Email | Text |
| Phone | Text |
| STL Level | Badge |
| Status | Badge |
| Registered | Date |
| Actions | Buttons |

---

## 2. Service Providers Page

### Features
- Provider list with services
- Filter by industry
- Filter by STL level
- Verification status
- Approve/reject providers

### Table Columns
| Column | Type |
|--------|------|
| Provider | Text + Avatar |
| Services | Tags |
| Industry | Badge |
| STL Level | Badge |
| Verified | Boolean |
| Rating | Stars |
| Actions | Buttons |

---

## 3. Companies Page

### Features
- Company list
- Filter by industry
- Filter by size
- Verification status
- Company details

### Table Columns
| Column | Type |
|--------|------|
| Company Name | Text + Logo |
| Industry | Badge |
| Size | Text |
| Owner | Text |
| STL Level | Badge |
| Status | Badge |
| Actions | Buttons |

---

## 4. Verification (PSS) Page

### Features
- Pending verifications queue
- Verification history
- AI verification results
- Manual review option
- Approve/reject actions

### Sections
- Pending Queue (tab)
- In Progress (tab)
- Completed (tab)
- Rejected (tab)

### Verification Details
```
┌─────────────────────────────────────┐
│ Verification Request #12345         │
├─────────────────────────────────────┤
│ User: John Smith                    │
│ Type: Identity Verification         │
│ Documents: [ID Card] [Selfie]       │
│ AI Score: 85%                       │
│ Status: Pending Review              │
├─────────────────────────────────────┤
│ [Approve] [Reject] [Request More]   │
└─────────────────────────────────────┘
```

---

## 5. Certification (CRB) Page

### Features
- Certification applications
- Schedule inspections
- Inspector assignment
- Certification issuance
- Refilling management

### Tabs
- Applications
- Scheduled Inspections
- Completed
- Refilling Due

---

## 6. Application Management Page

### Features
- All application types
- Workflow tracking
- Officer assignment
- Approval chain
- Status updates

### Application Types
- License applications
- Certificate requests
- Approval requests
- Registration requests

### Workflow View
```
┌─────────────────────────────────────────────────────────┐
│ Application #54321 - License Request                    │
├─────────────────────────────────────────────────────────┤
│ [Submitted] → [Junior Review] → [Senior Review] → [Done]│
│     ✓            ●               ○               ○      │
├─────────────────────────────────────────────────────────┤
│ Current: Junior Officer Review                          │
│ Assigned to: Officer Ahmad                              │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Financial Management Page

### Features
- Transaction history
- Revenue reports
- Fee management
- Penalty collection
- Franchise commissions

### Dashboard Cards
- Total Revenue
- Pending Payments
- Collected Fees
- Pending Penalties

---

## 8. Blockchain Records Page

### Features
- All blockchain transactions
- Certificate hashes
- Verification proofs
- Audit trail

### Table Columns
| Column | Type |
|--------|------|
| TX Hash | Text (truncated) |
| Type | Badge |
| Reference | Link |
| Timestamp | DateTime |
| Status | Badge |
| Actions | View |

---

# COMPONENTS LIBRARY

## Stat Card
```jsx
<StatCard
  icon={<Users />}
  label="Total Users"
  value={1502}
  change={26}
  trend="up"
/>
```

## Data Table
```jsx
<DataTable
  columns={columns}
  data={users}
  pagination={true}
  search={true}
  filters={['stl', 'status']}
/>
```

## Status Badge
```jsx
<Badge variant="pending">Pending</Badge>
<Badge variant="approved">Approved</Badge>
<Badge variant="rejected">Rejected</Badge>
```

## Action Buttons
```jsx
<ActionButtons>
  <Button variant="approve">Approve</Button>
  <Button variant="reject">Reject</Button>
  <Button variant="view">View</Button>
</ActionButtons>
```

---

# COLOR SCHEME (Admin Theme)

## Light Mode (Default for Admin)

| Element | Color |
|---------|-------|
| Background | `#f8fafc` |
| Sidebar | `#1e293b` |
| Cards | `#ffffff` |
| Primary | `#3b82f6` |
| Success | `#10b981` |
| Warning | `#f59e0b` |
| Danger | `#ef4444` |
| Text Primary | `#1e293b` |
| Text Secondary | `#64748b` |

---

# RESPONSIVE BEHAVIOR

| Breakpoint | Sidebar | Layout |
|------------|---------|--------|
| Desktop (>1280px) | Expanded (240px) | Full grid |
| Tablet (768-1280px) | Collapsed (64px) | 2 columns |
| Mobile (<768px) | Hidden (drawer) | 1 column |

---

*DMO Admin UI Specification v1.0 | March 2026*
