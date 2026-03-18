# EHB 700+ SERVICES MASTER TAXONOMY

> Industry → Category → Service (3-Level Structure)

---

## TAXONOMY OVERVIEW

| # | Industry | Platform | Est. Services |
|---|----------|----------|---------------|
| 1 | Commerce & Marketplace | GoSellR GSM | 80+ |
| 2 | Health | WMS | 60+ |
| 3 | Education | HPS + OBS | 70+ |
| 4 | Legal | OLS | 40+ |
| 5 | Travel & Tourism | AGTS | 50+ |
| 6 | Machinery & Engineering | HMS | 60+ |
| 7 | Technology | SOT | 60+ |
| 8 | Logistics & Delivery | Cross-platform | 40+ |
| 9 | Real Estate & Construction | Cross-platform | 50+ |
| 10 | Finance & Business | Cross-platform | 40+ |
| 11 | Media & Entertainment | EHB Tube | 40+ |
| 12 | Household & Local Services | Cross-platform | 40+ |
| 13 | Agriculture | Cross-platform | 40+ |
| 14 | Personal Development | Cross-platform | 30+ |
| 15 | Research & Innovation | Cross-platform | 30+ |
| | **TOTAL** | | **700+** |

---

# 1. COMMERCE & MARKETPLACE

**Platform:** GoSellR GSM

## Categories:
- Retail commerce
- Wholesale trade
- Digital products
- Local marketplace
- Vehicle marketplace
- Property marketplace
- Food marketplace
- Industrial equipment marketplace

## Services:
- Grocery stores
- Electronics shops
- Clothing stores
- Furniture stores
- Mobile phone shops
- Car dealerships
- Property listings
- Wholesale suppliers
- Industrial equipment sellers
- Local shops

---

# 2. HEALTH INDUSTRY

**Platform:** WMS – World Medical Services

## Categories:
- Medical care
- Diagnostics
- Pharmacy
- Mental health
- Specialized treatments
- Healthcare support

## Services:
- General doctors
- Specialist doctors
- Hospitals
- Clinics
- Telemedicine
- Laboratory tests
- Pharmacies
- Ambulance services
- Physiotherapy
- Mental health counseling

---

# 3. EDUCATION INDUSTRY

**Platform:** HPS + OBS

## Categories:
- Formal education
- Online education
- Skill training
- Academic resources

## Services:
- Schools
- Colleges
- Universities
- Tutors
- Coaching centers
- Online courses
- Exam preparation
- Certification training
- Digital books
- Academic research

---

# 4. LEGAL INDUSTRY

**Platform:** OLS

## Categories:
- Legal consulting
- Corporate law
- Civil law
- Documentation services

## Services:
- Lawyers
- Legal consultants
- Document drafting
- Corporate legal services
- Family law services
- Property legal services
- Contract drafting
- Arbitration services

---

# 5. TRAVEL & TOURISM

**Platform:** AGTS

## Categories:
- Travel booking
- Tourism services
- Transport services

## Services:
- Flight booking
- Hotel booking
- Tour guides
- Visa assistance
- Car rentals
- Cruise booking
- Travel insurance
- Tour operators

---

# 6. MACHINERY & ENGINEERING

**Platform:** HMS

## Categories:
- Industrial machinery
- Agricultural machinery
- Construction equipment

## Services:
- Machine repair
- Heavy equipment rental
- Industrial maintenance
- Mechanical services
- Agricultural equipment repair
- Factory automation

---

# 7. TECHNOLOGY INDUSTRY

**Platform:** SOT

## Categories:
- Software development
- IT services
- Digital infrastructure

## Services:
- Web development
- Mobile app development
- AI services
- Cybersecurity
- Cloud services
- Data analytics
- IT consulting

---

# 8. LOGISTICS & DELIVERY

**Platform:** Cross-platform (integrated with GoSellR)

## Categories:
- Transport services
- Courier services
- Freight logistics

## Services:
- Parcel delivery
- Cargo shipping
- Freight forwarding
- Warehouse services
- Supply chain management
- Fleet management

---

# 9. REAL ESTATE & CONSTRUCTION

**Platform:** Cross-platform

## Categories:
- Property services
- Construction services
- Maintenance services

## Services:
- Real estate agents
- Property listings
- Construction contractors
- Architecture
- Interior design
- Building maintenance

---

# 10. FINANCE & BUSINESS SERVICES

**Platform:** Cross-platform (linked with EHB Wallet)

## Categories:
- Financial consulting
- Business services
- Accounting

## Services:
- Accountants
- Tax consultants
- Financial advisors
- Business consultants
- Auditing services
- Company registration

---

# 11. MEDIA & ENTERTAINMENT

**Platform:** EHB Tube

## Categories:
- Digital media
- Content creation
- Advertising

## Services:
- Video hosting
- Podcast hosting
- Content creators
- Advertising agencies
- Photography services
- Music production

---

# 12. HOUSEHOLD & LOCAL SERVICES

**Platform:** Cross-platform (local marketplace)

## Categories:
- Home services
- Personal services

## Services:
- Electricians
- Plumbers
- Cleaning services
- Appliance repair
- Gardening
- Pest control

---

# 13. AGRICULTURE

**Platform:** Cross-platform

## Categories:
- Farming
- Livestock
- Agricultural supply

## Services:
- Crop farming
- Livestock services
- Agricultural consulting
- Irrigation systems
- Seed suppliers

---

# 14. PERSONAL DEVELOPMENT

**Platform:** Cross-platform (linked with HPS)

## Categories:
- Coaching
- Fitness
- Wellness

## Services:
- Fitness trainers
- Yoga instructors
- Life coaching
- Career coaching

---

# 15. RESEARCH & INNOVATION

**Platform:** Cross-platform (linked with SOT)

## Categories:
- Scientific research
- Product testing
- Innovation labs

## Services:
- Research institutions
- Product testing labs
- Startup incubation

---

# DATABASE STRUCTURE

## 3-Level Hierarchy

```
Industries (Level 1)
    └── Categories (Level 2)
            └── Services (Level 3)
```

## Example Structure:

```
Health (Industry)
 ├── Doctors (Category)
 │   ├── General Physician (Service)
 │   ├── Cardiologist (Service)
 │   └── Dentist (Service)
 │
 └── Diagnostics (Category)
     ├── Blood Tests (Service)
     ├── MRI (Service)
     └── X-ray (Service)
```

---

# DATABASE TABLES REFERENCE

```sql
-- Industries Table
industries (id, name, platform_code, description)

-- Categories Table  
categories (id, industry_id, name, description)

-- Services Table
services (id, category_id, name, description, stl_required)
```

---

*Total: 15 Industries × 40-80 Services = 700+ Services*
