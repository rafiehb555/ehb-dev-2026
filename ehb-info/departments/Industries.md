# EHB Industry System

**Status:** Canonical spec (v1.0) · Merged from `uploads/EHB_Industry_System.md` (Batch-2, 2026-04-11)
**Related:** `EHB-MASTER-INFO.md §5` (32-industry target) · `GoSellr.md` (flagship)

---

## 1. Core principle

Every EHB industry sits on the same **shared trust stack**:

```
PSS   — identity & trust
CRB   — verification & skill
DMO   — control & earnings
STL   — ranking & trust score
Wallet + Blockchain  — money & ledger
```

No industry is a silo. Every industry reuses the same plumbing.

## 2. Industry catalogue (Batch-2 explicit list)

> ⚠️ **Contradiction with legacy** — legacy docs target **32 industries**. Batch-2 `uploads/EHB_Industry_System.md` lists **16 industries** (10 "Main" + 6 "Support"). Interpretation: Batch-2 is the **Phase-1 launch set**; the remaining 16 industries are Phase-2/3. **Awaiting user confirmation** (`DMO.md §25`).

### 2.1 Main industries (10)

| Code  | Name                                       | What it does                       |
|-------|--------------------------------------------|-------------------------------------|
| GSM   | GoSellr Global Shopping Management System  | Marketplace, product buy/sell, store creation |
| WMS   | World Medical Services                     | Doctor booking, telemedicine, hospital integration |
| HPS   | Human Performance Solution                 | Courses, certifications, exams, skill tracking |
| OBS   | Online Book Store                          | Books + digital learning content   |
| OLS   | Online Law Services                        | Legal consultation, case handling  |
| AGTS  | Advanced Global Travel Services            | Tickets, hotels, travel packages   |
| HMS   | Human Machinery Solutions                  | Machinery services, repair, maintenance |
| ITS   | Industrial Technology Services             | Industrial solutions, automation   |
| SOT   | Services of Technology                     | Web + app dev, AI services         |
| EHB Tube | EHB Media Platform                      | Verified video sharing             |

### 2.2 Support industries (6)

| Code | Name                              | What it does                |
|------|-----------------------------------|-----------------------------|
| LDS  | Logistics & Delivery Services     | Delivery + rider management |
| ERS  | EHB Real Estate Services          | Property buy/sell           |
| EFS  | EHB Financial Services            | Payments, financial tools   |
| EPS  | EHB Professional Services         | Freelancers, consultants    |
| EAS  | EHB Agriculture Services          | Farming solutions           |
| ELS  | EHB Local Services                | Local services marketplace  |

## 3. Final flow

```
User → Industry → Service/Product → Verification → DMO → STL → Earnings
```

Every industry follows this exact pipeline — the industry just determines which CRB exams/refills apply and which categories show in the catalogue.

## 4. Open questions for next batch

1. Are the 16 Phase-2/3 industries from legacy still in scope, or is 16 the new total?
2. Which of the 10 Main industries ships in **Phase-1 production** (legacy §5 named only 6: GoSellr, WMS, OLS, HPS/OBS, JPS, AGTS)?
3. **JPS** — Job Profile & Skill — is it merged into HPS + EPS now, or still a separate industry?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/EHB_Industry_System.md`; 16-industry list flagged against legacy 32 |
