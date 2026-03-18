# JPS — Job Profile & Skill System

> Professional Identity & Skills Management Platform

---

# DEFINITION

**JPS (Job Profile & Skill)** is EHB's **professional identity system** where:
- Individuals
- Professionals
- Freelancers
- Employees

Register their **skills, experience, education, and services**.

Think of it as: **LinkedIn + Fiverr + Government Skill Registry** integrated with EHB's trust framework.

---

# PURPOSE

JPS objectives:
- Create verified professional profiles
- Build skill-based job marketplace
- Provide trusted service providers
- Enable transparent hiring

---

# JPS SYSTEM POSITION

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER                                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    JPS PROFILE CREATION                             │
│        (Skills, Experience, Education, Certifications)             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PSS VERIFICATION                                │
│              (Identity, KYC, AML Screening)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CRB CERTIFICATION                               │
│         (Skill Test, Interview, Inspection)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     STL TRUST LEVEL                                 │
│              (AI Trust Score Assignment)                           │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EHB SERVICES                                   │
│       (Marketplace, Jobs, Service Provider Access)                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

# JPS MAIN FEATURES

## 1. Professional Profiles

User creates professional identity:

| Field | Example |
|-------|---------|
| Name | Ali Khan |
| Profession | Electrician |
| Experience | 5 years |
| Skills | Wiring, Solar, Maintenance |
| Education | Technical Diploma |
| Certifications | CRB Certified Electrician |

---

## 2. Skill Registry

Users add skills by category:

| Category | Example Skills |
|----------|----------------|
| IT | Software Development, Web Design |
| Technical | Electrician, Plumber, Mechanic |
| Medical | Nursing, Physiotherapy |
| Legal | Lawyer, Legal Consultant |
| Education | Tutoring, Training |
| Creative | Graphic Design, Video Editing |

---

## 3. Job Marketplace

- Companies post jobs
- Users apply with JPS profiles
- AI matches skills to requirements
- Verified hiring process

---

## 4. Service Marketplace Integration

JPS profiles appear in **GoSellr service marketplace**:

```
Search: "Electrician near me"

Results (by STL ranking):
1. Ali Khan - VIP - ⭐4.9 - 2km
2. TechFix - HIGH - ⭐4.7 - 3km
3. ElectroPro - MEDIUM - ⭐4.5 - 5km
```

---

# JPS PROFILE TYPES

| Type | Description | Use Case |
|------|-------------|----------|
| Individual | Freelancer | Independent service provider |
| Professional | Certified expert | Licensed professional |
| Employee | Company worker | Employed staff |
| Company Staff | Registered employee | Business employee |

---

# JPS VERIFICATION PROCESS

## Step 1 — Basic Profile

User creates account.

**STL Level:** Free

---

## Step 2 — PSS Verification

Identity verification:
- ID card upload
- Face verification
- AML screening

**STL Level Upgrade:** Basic

---

## Step 3 — Skill Verification

User takes skill tests:
- Technical assessments
- Practical tests
- Interviews

---

## Step 4 — CRB Certification

CRB inspector verifies:
- Skill level
- Work quality
- Professional standards

**STL Level Upgrade:** High

---

# JPS REFILLING SYSTEM (6-Month Cycle)

Every 6 months, refilling required:
- Skill re-test
- Performance evaluation
- Updated certifications

**If failed:**
- STL downgrade
- Profile ranking reduced
- Services may be hidden

---

# JPS DATABASE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JPS DATABASE TABLES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  jps_profiles           - Main profile data                        │
│  jps_skills             - Skill entries                            │
│  jps_experience         - Work experience                          │
│  jps_education          - Educational background                   │
│  jps_certifications     - Professional certifications              │
│  jps_projects           - Portfolio projects                       │
│  jps_reviews            - Customer reviews                         │
│  jps_job_applications   - Job applications                         │
│  jps_skill_tests        - Skill test records                       │
│  jps_skill_results      - Test results                             │
│  jps_endorsements       - Skill endorsements                       │
│  jps_recommendations    - Professional recommendations             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# JPS SEARCH SYSTEM

Users search for professionals:

```
Search: "Plumber"
Location: "Lahore"
```

**Results Ranking (by STL):**
1. VIP providers
2. High STL
3. Medium STL
4. Basic STL
5. Free (unverified)

---

# JPS JOB SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                   COMPANY POSTS JOB                                 │
│        (Requirements, Skills, Location, Salary)                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CANDIDATES APPLY                                   │
│           (JPS profiles submitted)                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AI SKILL MATCHING                                 │
│       (Match skills, experience, STL to requirements)              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   HIRING DECISION                                   │
│         (Company selects, interview, hire)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# JPS + STL INTEGRATION

JPS profile's STL score updates automatically based on:

| Factor | Impact |
|--------|--------|
| Verified skills | +Score |
| Customer reviews | +/- Score |
| Completed jobs | +Score |
| Complaints | -Score |
| Refilling results | +/- Score |

---

# JPS ECOSYSTEM DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                          JPS                                        │
│              (Job Profile & Skill System)                          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│      PSS      │       │      CRB      │       │      STL      │
│  Verification │       │ Certification │       │  Trust Score  │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EHB SERVICES                                 │
│          (Marketplace, Jobs, Service Providers)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

# BENEFITS OF JPS

- **Trusted professionals** - All verified
- **Verified job marketplace** - Quality hiring
- **Service quality** - Certified providers
- **Transparent ranking** - STL-based visibility
- **Continuous improvement** - 6-month refilling

---

*JPS System v1.0 | March 2026*
