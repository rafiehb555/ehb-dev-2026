# EHB Industry Landing Page System — Ultra UI Design

**3 example blueprints: Education · Health · IT**

Yeh doc **Education**, **Health**, aur **IT** landing pages ka full UI design define karta hai. Same layout sab industries ke liye; sirf content (copy, accent, services) change hota hai. Cursor is spec se koi bhi industry landing generate kar sakta hai.

---

## Shared Structure (All Industry Landings)

**Route:** `/landing/[industry]` (e.g. `/landing/education`, `/landing/health`, `/landing/it`).

**Section order:**

1. **Hero** — Badge, heroTitle, heroSubtitle (or overview), heroPrimaryButton, heroSecondaryButton, trust line  
2. **Industry Overview** — Short overview paragraph  
3. **Key Services** — Categories + services (from industryServices or industry.services)  
4. **Popular Services** — 4 cards (industry.popularServices or derived)  
5. **Why This Industry on EHB** — 4 benefit cards  
6. **AI Insights** — Industry-specific AI copy  
7. **Marketplace Preview** — 4 example services; link to industry home  
8. **Franchise** — Industry franchise CTA  
9. **Join CTA** — Open Industry Home + Back to EHB  
10. **Footer** — EHB Home, All Industries, Marketplace

**Layout rules:**

- `container-ultra` (1400px), `section-pad-ultra` (120px vertical)  
- Industry **accentColor** = border, glow, button gradient, icon color  
- **Industry icon** (Lucide) in hero and section headers where relevant  
- Same glass cards, hover lift, transitions as EHB main  

---

## 1. Education Landing (`/landing/education`)

**Accent:** `#E53935` (red)  
**Icon:** GraduationCap  

### Hero

- **Badge:** `Education · Verified by EHB` (border/glow #E53935)  
- **Title:** Global Education Services Marketplace  
- **Subtitle:** Schools, colleges, online courses, tutors, and training across the world. One platform for learners and providers.  
- **Primary button:** Explore Education (gradient #E53935 → #C62828 or keep #00AEEF → #22C55E for consistency)  
- **Secondary:** Join as Provider (glass)  
- **Trust:** 6+ service categories · Verified tutors & institutes · AI matched learning  

### Key Services (categories)

Use `getIndustryServices("education")` → categories:

- Schools (Primary, Secondary, Admissions)  
- Colleges (Undergraduate, Admissions)  
- Universities (Graduate, Research)  
- Online Courses (Programming, Certifications)  
- Training Institutes (Computer, Professional)  
- Tutors (Math, English, IELTS, Science)  

Display: category name + list of 2–3 services under each. Card per category with accent border #E53935.

### Why Education on EHB

- **Trust:** Verified institutes and tutors (PSS, STL).  
- **Discover:** Find courses and tutors by location, subject, level.  
- **Pay & Book:** One wallet, secure payments, scheduling.  
- **Grow:** Institutes get visibility; tutors get students.  

### AI Insights (Education)

Copy: AI recommends courses and tutors based on learning goals, location, and reviews. Demand insights for institutes.

### Marketplace Preview (Education)

Example cards: Math Tutoring, IELTS Preparation, Programming Courses, School Admissions.

### Franchise

Copy: Run Education franchise in your city — connect schools, tutors, and learners with EHB trust and payments.

### CTA

- Open Education Home  
- Back to EHB Home  

---

## 2. Health Landing (`/landing/health`)

**Accent:** `#00AEEF` (blue)  
**Icon:** HeartPulse  

### Hero

- **Badge:** Health · Verified by EHB  
- **Title:** Global Health Services Marketplace  
- **Subtitle:** Doctors, hospitals, pharmacies, labs, and telemedicine on one platform. Book, pay, and get care with trust.  
- **Primary:** Explore Health  
- **Secondary:** Join as Provider  
- **Trust:** Doctor booking · Labs & pharmacies · Telemedicine · AI health insights  

### Key Services (categories)

- Doctors (Consultation, Online Appointment, General Physician, Specialist)  
- Hospitals (Inpatient, Outpatient, Emergency)  
- Clinics (Visit, Day Care)  
- Pharmacies (Medicine Delivery, Prescription)  
- Diagnostic Labs (Blood Test, X-Ray, MRI/CT, Lab Reports)  
- Ambulance (Emergency, Patient Transfer)  

### Why Health on EHB

- **Verified:** Doctors and facilities verified (PSS, CRB).  
- **Book & Pay:** Appointments, prescriptions, lab bookings, one wallet.  
- **Telemedicine:** Online consultations where available.  
- **Insights:** AI demand and availability hints.  

### AI Insights (Health)

Copy: AI helps match patients with doctors by specialty, location, and availability. Demand trends for clinics and labs.

### Marketplace Preview (Health)

Example cards: Doctor Consultation, Blood Test, Online Doctor Appointment, Pharmacy Delivery.

### Franchise

Copy: Health franchise — connect clinics, labs, and pharmacies in your city with EHB.

### CTA

- Open Health Home  
- Back to EHB Home  

---

## 3. IT Landing (`/landing/it`)

**Accent:** `#3B82F6` (blue)  
**Icon:** Code2  

### Hero

- **Badge:** IT & Software · Verified by EHB  
- **Title:** IT & Software Services Marketplace  
- **Subtitle:** Development, cloud, and cybersecurity from verified providers. Hire devs, get projects done, one platform.  
- **Primary:** Explore IT  
- **Secondary:** Join as Provider  
- **Trust:** Web · Mobile · AI · Cloud · Verified developers  

### Key Services (categories)

- Web Development (Website, E-Commerce, CMS)  
- Mobile Development (App Development, iOS & Android)  
- AI Development (AI Model, Integration)  
- Cybersecurity (Security Audit, Penetration Testing)  
- Cloud Services (Server Management, Cloud Migration, DevOps)  
- Design (UI/UX, Branding)  

### Why IT on EHB

- **Verified:** Developers and agencies verified (PSS, STL).  
- **Scope:** From websites to AI and cloud — one marketplace.  
- **Pay & Track:** Milestones, one wallet, secure payments.  
- **Scale:** Agencies grow; clients find the right talent.  

### AI Insights (IT)

Copy: AI matches projects with developers by skills, location, and ratings. Demand trends for web, mobile, and AI services.

### Marketplace Preview (IT)

Example cards: Website Development, Mobile App Development, UI/UX Design, Cybersecurity Audit.

### Franchise

Copy: IT franchise — connect agencies and freelancers in your city with global clients via EHB.

### CTA

- Open IT Home  
- Back to EHB Home  

---

## Component Checklist (Cursor)

- [ ] Hero: industry badge (accent border), heroTitle, overview, 2 buttons, trust line; optional industry icon.  
- [ ] Key Services: from `getIndustryServices(industry.slug)` → categories + services; cards with accent border.  
- [ ] Why [Industry] on EHB: 4 benefit cards (same layout), industry-specific copy.  
- [ ] AI Insights: one card, industry-specific paragraph.  
- [ ] Marketplace Preview: 4 example service cards (industry-specific labels).  
- [ ] Franchise: one card, industry CTA, link to /franchise.  
- [ ] Join CTA: title, short copy, Open [Industry] Home + Back to EHB Home.  
- [ ] Footer: Back to EHB, link to #industries or /, Marketplace.  
- [ ] All: container-ultra, section-pad-ultra, industry.accentColor for accents, IndustryIcon where needed.  

---

## Data Sources

- **Industry meta:** `getIndustryBySlug(slug)` → name, shortName, heroTitle, overview, services[], accentColor, icon.  
- **Categories + services:** `getIndustryServices(slug)` → categories[].name, categories[].services[].name.  
- **Example marketplace labels:** Derive from categories/services or hardcode per industry (as in examples above).  

---

*Rafi bhai — Education, Health, IT ka ultra UI design complete. Ab `app/landing/[industry]/page.tsx` isi structure + industry accent/icons se upgrade kiya ja sakta hai; baaki 29 industries same template, sirf data change.*
