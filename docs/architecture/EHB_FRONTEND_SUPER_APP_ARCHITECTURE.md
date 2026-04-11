# EHB Frontend Super App Architecture

The EHB frontend is designed as a modular super-app built with Next.js.

**Goals:**

- scalable UI architecture
- reusable components
- shared layouts
- industry templates
- demo → production conversion

---

## 1. Frontend Technology Stack

- Next.js  
- React  
- TypeScript  
- Tailwind CSS  
- Component Library  
- API Gateway integration  

**Optional:** React Query, Zustand / Redux, Framer Motion

---

## 2. Project Folder Structure

Next.js project should follow this structure.

```
/app
/components
/modules
/layouts
/services
/hooks
/context
/types
/utils
/config
```

**Example:**

```
ehb-platform
├── app
├── components
├── modules
├── layouts
├── services
├── hooks
├── context
├── types
├── utils
├── config
├── public
└── docs
```

---

## 3. App Folder Structure

Next.js app router structure.

```
/app
   /landing
   /home
   /industries
   /services
   /ai-marketplace
   /franchise
   /development
   /dashboard
   /admin
```

**Example routes:**

- `/app/landing`
- `/app/home`
- `/app/industries/legal`
- `/app/industries/medical`
- `/app/industries/jobs`
- `/app/industries/travel`

---

## 4. Layout System

Shared layouts allow **consistent UI across industries**.

```
/layouts
   MainLayout
   DashboardLayout
   AdminLayout
   IndustryLayout
```

**Example:** MainLayout → Header, Footer, Global Search

---

## 5. Component System

All UI components live in `/components`.

**Example components:**

- Header, Footer, SearchBar  
- ServiceCard, ProviderCard, IndustryCard  
- ProgressCard, AnalyticsCard  

Shared components are reused across industries.

---

## 6. Module-Based Architecture

Each major feature has its own module under `/modules`.

**Example modules:**

- auth, profile, booking, wallet  
- affiliate, franchise, ai  
- industries, services  
- notifications, analytics  

**Each module contains:** components, hooks, services, types

**Example:** `modules/booking` → BookingCard, useBooking, bookingAPI

---

## 7. Industry Page Architecture

All industries follow the same template.

**Route:** `/industries/[industry]`

**Example pages:** `/industries/legal`, `/industries/medical`, `/industries/jobs`, `/industries/education`

**Industry page structure:**

- Hero Banner  
- Search Bar  
- Trending Services  
- Top Providers  
- AI Tools  
- Categories  
- Reviews  

Only **data changes**, not UI.

---

## 8. Service Page Architecture

Service pages show detailed service information.

**Route:** `/services/[service-id]`

**Sections:**

- Service Overview  
- Provider List  
- Pricing  
- Reviews  
- Booking Button  
- Related Services  

---

## 9. Dashboard Architecture

**Path:** `/dashboard`

**Pages:** profile, bookings, wallet, affiliate, notifications, settings

**Example routes:** `/dashboard/profile`, `/dashboard/bookings`, `/dashboard/wallet`

---

## 10. Admin Panel Structure

**Path:** `/admin`

**Sections:**

- dashboard, industries, franchise, ai-tools  
- finance, blockchain, affiliate  
- development, platform-health  

**Example:** `/admin/industries`, `/admin/franchise`, `/admin/ai-tools`, `/admin/development`

---

## 11. Development Dashboard

**Path:** `/development`

**Sections:**

- Platform Structure  
- Development Progress  
- System Flow Monitor  
- Shared Tools Map  
- AI Integration  
- Franchise System  
- Industry Development  

Tracks **platform development progress**.

---

## 12. AI Marketplace UI

**Path:** `/ai-marketplace`

**Sections:**

- AI Tool Categories  
- Featured AI Tools  
- Tool Marketplace  
- Usage Analytics  
- Subscription Plans  

**Example tools:** AI Lawyer, AI Doctor, AI Resume Builder, AI Marketing Assistant, AI Coding Assistant

---

## 13. Franchise UI

**Path:** `/franchise`

**Sections:**

- Franchise Overview  
- Country Franchise  
- Corporate Franchise  
- Sub Franchise  
- Apply Form  
- Revenue Model  

---

## 14. Global Search System

**Component:** GlobalSearchBar

**Search targets:** industries, services, providers, AI tools, jobs, products

AI recommendation can enhance results.

---

## 15. State Management Strategy

**Global states:** user, wallet, notifications, AI recommendations, industry filters

**Options:** Zustand, Redux Toolkit, React Query

---

## 16. API Integration

Frontend communicates through API gateway.

**Example endpoints:**

- `/api/auth`, `/api/services`, `/api/bookings`  
- `/api/wallet`, `/api/franchise`, `/api/ai-tools`  

**API layer lives in:** `/services`

**Example:** `services/authAPI.ts`, `services/bookingAPI.ts`, `services/walletAPI.ts`

---

## 17. Demo → Production Conversion

**Demo phase:** static JSON data, mock APIs, UI-only logic

**Production phase:** connect API gateway, microservices, database, blockchain

No UI rebuild required.

---

## 18. UI Design System

All pages share the same design system.

- Card Components  
- Button System  
- Typography  
- Color Tokens  
- Spacing Rules  
- Grid Layout  

Keeps **UI consistent across 32 industries**.

---

## 19. Performance Strategy

Use: Server Components, Dynamic Imports, Caching, Lazy Loading

**Benefits:** fast load times, scalable UI, better SEO

---

## 20. Final Frontend Architecture Diagram

```
Next.js Super App
        │
Layouts
        │
Modules
        │
Shared Components
        │
Industry Pages
        │
API Gateway
```

---

## Next Phase

The next architecture file should be **EHB_GLOBAL_USER_EXPERIENCE_FLOW.md**, defining:

- complete user journey  
- provider journey  
- franchise journey  
- AI marketplace journey  
- service booking flow  

---

## Related

- [EHB_SUPER_ADMIN_CONTROL_PANEL.md](EHB_SUPER_ADMIN_CONTROL_PANEL.md)
- [EHB_MICROSERVICES_ARCHITECTURE.md](EHB_MICROSERVICES_ARCHITECTURE.md)
- [EHB_DATABASE_MASTER_SCHEMA.md](EHB_DATABASE_MASTER_SCHEMA.md)
