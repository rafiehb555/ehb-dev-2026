## EHB LAW SERVICES OVERVIEW

*(Extracted from `EHB OLS LAW SERVICES` app data)*  

This document summarizes the core **legal service categories** and **service types** defined in the EHB Law Services prototype (`services.ts`). It is a reference for how legal offerings can be structured inside the EHB marketplace and JPS system.

---

## 1️⃣ LAW SERVICE CATEGORIES

Current high-level law categories:

- **Civil Law**
- **Criminal Law**
- **Family Law**
- **Business Law**
- **Property Law**
- **Immigration Law**
- **Tax Law**
- **Technology Law**
- **Intellectual Property**
- **International Law**
- **Human Rights Law**
- **Environmental Law**
- **Banking & Finance**

These categories map directly to how services can be grouped in the marketplace and how JPS profiles can tag their specialization.

---

## 2️⃣ CIVIL LAW SERVICES

Example civil law services:

- **Contract Disputes** – Resolve disputes arising from contracts.
- **Debt Recovery** – Legal recovery of unpaid debts.
- **Consumer Protection Cases** – Protect consumers against fraud and unfair practices.
- **Defamation Cases** – Legal help for reputation and defamation issues.
- **Personal Injury Claims** – Compensation claims for accidents and injuries.
- **Insurance Claims** – Legal support for disputes against insurance companies.

---

## 3️⃣ CRIMINAL LAW SERVICES

Example criminal law services:

- **Criminal Defense Lawyer** – Professional defense for accused persons.
- **Bail Application** – Filing and handling bail applications.
- **FIR Legal Assistance** – Help with police complaints and FIR-related issues.
- **Fraud Defense** – Defense in financial and white‑collar crime cases.
- **Cyber Crime Defense** – Legal support for online and cyber‑crime matters.

---

## 4️⃣ FAMILY LAW SERVICES

Family law in the prototype is modeled with **detailed fields** (required documents, process steps, time, cost). These services can be used as a template for other industries.

- **Marriage Registration**
  - **Description**: Legal registration of marriage with government authorities.
  - **Required Documents** (example):
    - Nikah Nama (Original)
    - CNIC of bride and groom
    - CNIC of witnesses
    - Photos
  - **Process** (example steps):
    - Document verification
    - Application filing
    - NADRA / authority registration
    - Certificate issuance
  - **Estimated Time**: ~1–2 weeks  
  - **Cost**: From ~$100 (configurable per country)

- **Court Marriage**
  - **Description**: Legal marriage performed in court before a magistrate.
  - **Required Documents** (example):
    - CNIC / Passport
    - Affidavit of free will
    - Witnesses
    - Photos
  - **Process**:
    - Legal consultation
    - Affidavit preparation
    - Court appearance
    - Nikah performance
    - Registration
  - **Estimated Time**: ~1–2 days  
  - **Cost**: From ~$200

- **Divorce (Talaq) Case**
  - **Description**: Dissolution of marriage by the husband following legal procedure.
  - **Required Documents**:
    - Nikah Nama
    - CNIC of husband
    - Divorce notice
    - Children birth certificates (if any)
  - **Process**:
    - Notice to Arbitration Council
    - Reconciliation attempts
    - 90‑day waiting period
    - Divorce certificate issuance
  - **Estimated Time**: ~3–4 months  
  - **Cost**: From ~$500

- **Khula Case**
  - **Description**: Dissolution of marriage initiated by the wife through court.
  - **Required Documents**:
    - Nikah Nama
    - CNIC of wife
    - Grounds for Khula
    - Evidence (if any)
  - **Process**:
    - Filing suit in Family Court
    - Summoning husband
    - Reconciliation attempt
    - Decree by court
  - **Estimated Time**: ~2–4 months  
  - **Cost**: From ~$400

- **Child Custody Case**
  - **Description**: Legal proceedings to determine guardianship of the child.
  - **Required Documents**:
    - Birth certificates
    - Parental CNICs
    - Evidence of welfare
    - School records
  - **Process**:
    - Filing guardian petition
    - Interim custody hearing
    - Evidence recording
    - Final judgment
  - **Estimated Time**: ~6–12 months  
  - **Cost**: From ~$800

- **Child Maintenance Case**
  - **Description**: Legal action to secure financial support for children.
  - **Required Documents**:
    - Birth certificates
    - Father’s income proof
    - Expense list
    - School fee slips
  - **Process**:
    - Filing maintenance suit
    - Interim maintenance order
    - Final decree
  - **Estimated Time**: ~2–4 months  
  - **Cost**: From ~$300

These data fields (description, requiredDocs, process, estimatedTime, cost) should be reused as a **generic template** for other complex legal services.

---

## 5️⃣ PROPERTY LAW SERVICES

Example property services:

- **Property Verification** – Verify property ownership and title.
- **Land Dispute Cases** – Handle land and boundary disputes.
- **Property Transfer** – Legal support for ownership transfer.
- **Lease Agreement** – Drafting rental and lease contracts.
- **Construction Disputes** – Legal help for construction‑related conflicts.

---

## 6️⃣ BUSINESS & IMMIGRATION LAW SERVICES

**Business Law:**

- Company registration  
- Corporate compliance  
- Business contract drafting  
- Shareholder agreements  
- Business dispute resolution  

**Immigration Law:**

- Visa application assistance  
- Immigration appeals  
- Work permit applications  
- Citizenship applications  
- Refugee cases  

---

## 7️⃣ TAX & OTHER SPECIALIZED AREAS

**Tax Law:**

- Tax consultation  
- Tax dispute resolution  
- Tax planning and optimization  
- Corporate tax compliance  
- VAT / GST advisory  

**Additional categories (from the app data):**

- Technology Law  
- Intellectual Property  
- International Law  
- Human Rights Law  
- Environmental Law  
- Banking & Finance  

These categories can be expanded later with the same pattern used for Family Law (documents, process, time, cost) to support deeper industry‑level legal services in EHB.

---

## 8️⃣ HOW THIS MAPS INTO EHB

- **JPS System**: Lawyers select their main category (e.g. Family Law, Civil Law) and link specific services from this list to their profile.
- **Marketplace**: Each entry here can become a **standardized service template** that lawyers can enable/disable and price per region.
- **Industry System**: All legal services fall under the `Legal / Law Services` industry, which can use these categories as its internal structure.
- **AI & STL**: Required documents, process steps, and typical timelines help AI explain services to users and help STL evaluate case handling quality.

This document is a **reference layer** so that future law‑service designs in EHB stay consistent with the initial EHB OLS Law Services app.

