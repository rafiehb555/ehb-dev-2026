# DMO Admin UI Quick Reference

> Admin Dashboard Wireframe Specification

## Reference
- Wireframe: `assets/dmo-admin-wireframe.png`
- Full Spec: `docs/ui-ux/dmo-admin-system.md`

## Sidebar Menu (14 Items)

```
📊 Dashboard          /admin
👥 User Management    /admin/users
🔧 Service Providers  /admin/providers
🏢 Companies          /admin/companies
🏛️ Government Officers /admin/officers
🌐 Franchise Network  /admin/franchise
✅ Verification (PSS) /admin/pss
📋 Certification (CRB)/admin/crb
📜 Certificates       /admin/certificates
📝 Applications       /admin/applications
💰 Financial Mgmt     /admin/finance
🔔 Notifications      /admin/notifications
⛓️ Blockchain Records /admin/blockchain
⚙️ Settings           /admin/settings
```

## Dashboard Stats (4 Cards)

```
Total Users: 1,502 (+26↑)
Service Providers: 382 (+9↑)
Total Companies: 128 (+4↑)
Pending Applications: 63
```

## Dashboard Sections

1. **User & Provider Growth** - Line chart (1W/1M/6M/1Y)
2. **Pending Applications** - Mini table
3. **Recent User Registrations** - Table with STL
4. **Pending Applications Detail** - Full table
5. **Verification Overview** - PSS/CRB stats
6. **ITPIS Pending** - Progress metrics
7. **Notifications & Penalties** - Alert list

## Admin Theme (Light Mode)

```
Background:  #f8fafc
Sidebar:     #1e293b
Cards:       #ffffff
Primary:     #3b82f6
Success:     #10b981
Warning:     #f59e0b
Danger:      #ef4444
```

## Key Components

- StatCard (icon, label, value, change)
- DataTable (pagination, search, filters)
- StatusBadge (pending/approved/rejected)
- ActionButtons (approve/reject/view)

---

*Admin dashboard uses Light theme by default*
