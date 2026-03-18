# JPS System Quick Reference

> Job Profile & Skill - Professional Identity

## Purpose

JPS manages professional identity:
- Skills registration
- Experience tracking
- Education records
- Certifications
- Job marketplace

## JPS Position in Ecosystem

```
User → JPS Profile → PSS Verification → 
CRB Certification → STL Trust → Services
```

## Profile Components

| Component | Description |
|-----------|-------------|
| Skills | Technical abilities |
| Experience | Work history |
| Education | Degrees, courses |
| Certifications | Professional certs |
| Portfolio | Past projects |
| Reviews | Customer feedback |

## Profile Types

- Individual (freelancer)
- Professional (certified)
- Employee (company worker)
- Company Staff (registered)

## Verification Levels

| Level | Requirements | STL |
|-------|--------------|-----|
| Free | Account only | 0-30 |
| Basic | PSS verified | 31-50 |
| Medium | Documents | 51-70 |
| High | CRB certified | 71-85 |
| VIP | Premium | 86-100 |

## Database Tables

```
jps_profiles, jps_skills, jps_experience,
jps_education, jps_certifications, jps_projects,
jps_reviews, jps_job_applications, jps_skill_tests
```

## Full Details

See: `docs/architecture/jps-job-profile-skill.md`
