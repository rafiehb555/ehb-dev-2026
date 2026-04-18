---
name: ehb-complaint-helper
description: Guide non-technical user to file/track a complaint and explain how it impacts their STL
type: user-guide
tags: [complaints, dispute, stl-impact, resolution]
---

# EHB Complaint Helper

## When to Use

- **English:** "I had a bad experience. How do I file a complaint? Will this hurt my STL?"
- **Roman Urdu:** "Mujhe buraa experience hua. Complaint kaise file krun? Mera STL girega?"
- **Trigger:** User has issue with seller/service, wants to report, worried about STL impact

---

## Types of Complaints You Can File

### 1. Seller/Service Issue

```
"Seller ne mera order cancel kar dia"
"Doctor ne time par appointment nahi di"
"Lawyer ne call back nahi kiya"
```

**What to report:**
- Seller didn't deliver on time
- Product/service quality was bad
- Seller was rude or unprofessional
- Escrow funds not released

**Where:** Go to `/complaints/file` → Select "Seller/Service Issue"

---

### 2. Payment/Fraud Issue

```
"Mujhe double charge ho gaya"
"Escrow paise trap ho gaye"
"Fake product receive kiya"
```

**What to report:**
- Unauthorized transaction
- Duplicate charge
- Escrow stuck (seller won't release)
- Fraudulent product received

**Where:** Go to `/complaints/file` → Select "Payment/Fraud"

---

### 3. Platform Issue

```
"App crash ho gaya bilkul"
"Payment gateway kaam nahi kar raha"
"Mera account lock ho gaya"
```

**What to report:**
- App bugs, crashes
- Payment system down
- Account locked without reason
- Data missing

**Where:** Go to `/complaints/file` → Select "Platform Issue"

---

### 4. Safety/Harassment

```
"Seller ne mujhe threat kiya"
"Personal info leak ho gaya"
"Inappropriate behavior"
```

**What to report:**
- Threats, abuse, harassment
- Privacy breach
- Inappropriate messages
- Safety concerns (meeting/delivery)

**Where:** Go to `/complaints/file` → Select "Safety/Harassment" (URGENT PRIORITY)

---

## How to File a Complaint (Step-by-Step)

### Step 1: Go to Complaints Page

**Desktop:** Log in → Menu → "My Disputes" → "+ New Complaint"
**Mobile:** Menu → "Complaints" → "+ File Complaint"

Or direct URL: `/complaints/file`

### Step 2: Select Complaint Type

```
What happened?
 ☐ Seller/Service Issue
 ☐ Payment/Fraud
 ☐ Platform Bug
 ☐ Safety/Harassment
```

### Step 3: Fill Out Form (5 min)

**Required fields:**

| Field | What to Write |
|-------|--------------|
| **Date of incident** | When did it happen? (select from calendar) |
| **Accused party** | Seller/platform/person name |
| **Order/transaction ID** | Copy from your order history |
| **What happened?** | 2–3 sentences (describe clearly) |
| **Evidence** | Screenshots, messages, recordings (optional but helps) |
| **Resolution wanted** | Full refund? Replacement? Apology? |

**Example:**

```
Date: 2026-04-10
Seller: "John's Electronics"
Order ID: ORD-2026-04-0912
What happened:
"I ordered a phone on April 8. John said delivery in 24h.
It's been 3 days, no delivery. Tracking shows stuck in transit.
When I called, he said 'inshallah tomorrow' but never delivered."

Evidence: Uploaded 3 screenshots of chat

Resolution: Full refund + return label
```

### Step 4: Submit

Click **"File Complaint"** button.

**What you'll see:**

```
✓ Complaint filed successfully!
  Case ID: COMP-2026-04-123456
  
Status: OPENED
Next: EHB will contact within 24 hours.
Check status: /complaints/COMP-2026-04-123456
```

---

## After You File: What Happens

### Timeline

```
HOUR 0: You file complaint
         ↓
HOUR 1–4: EHB auto-assignment
         ↓
HOUR 24: EHB contacts accused party (seller/service)
         ↓
DAY 3: Seller responds or deadline passes
         ↓
DAY 5: DMO operator reviews case
         ↓
DAY 7: Decision made (refund/replacement/dismissed)
         ↓
DAY 8: Payment processed (if approved)
```

### Complaint Status Stages

| Status | Meaning | Action |
|--------|---------|--------|
| **OPENED** | Just filed, not yet reviewed | Wait for EHB contact |
| **UNDER_REVIEW** | EHB is investigating | May ask you questions |
| **WAITING_SELLER** | Seller has 48h to respond | Check email updates |
| **EVIDENCE_GATHERING** | DMO is collecting proof | Provide evidence if asked |
| **DECISION_PENDING** | Decision being made | 2–3 days |
| **RESOLVED_APPROVED** | You won! Refund coming | Check payout (24–48h) |
| **RESOLVED_REJECTED** | Complaint dismissed | Can appeal once |
| **APPEALED** | You appealed rejection | Higher review (3–5 days) |

---

## Will This Hurt My STL?

**SHORT ANSWER:** Depends on **who's at fault**.

### If YOU Did Nothing Wrong (Seller at fault)

```
Scenario: Seller was late/bad quality/rude

Your STL: 🟢 GOES UP +1–2 points
          (Shows you hold sellers accountable)

Seller STL: 🔴 GOES DOWN -5–10 points
            (Complaint filed against them)
```

**Your STL IMPROVES** because you are a responsible buyer/user.

---

### If SELLER Has Valid Defense (No One at Fault)

```
Scenario: Delivery late due to weather,
          You misunderstood product description

Your STL: 🟡 STAYS SAME
          (Complaint dismissed, no penalty)

Seller STL: 🟢 STAYS SAME or +1
            (Defended successfully)
```

**No impact** on either party.

---

### If YOU Filed False Complaint (You at Fault)

```
Scenario: You falsely accused seller,
          Made-up story, DMO found no evidence

Your STL: 🔴 GOES DOWN -5–15 points
          (False accusations = serious)

Seller STL: 🟢 GOES UP +2–3 points
            (Exonerated)

Your complaint: 🚫 MARKED AS FRIVOLOUS
                 Too many = account warning/suspension
```

**This is SERIOUS.** Don't file false complaints!

---

## STL Impact Table

| Scenario | Your STL Change | Seller STL Change | Notes |
|----------|-----------------|-------------------|-------|
| **Valid complaint (seller at fault)** | +1 to +2 | -5 to -15 | You win, seller penalized |
| **Invalid complaint (seller innocent)** | 0 | 0 | Dismissed, no impact |
| **False complaint** | -5 to -15 | +2 to +3 | Serious — avoid! |
| **Complaint resolved by refund** | +1 | -3 to -8 | Minor penalty to seller |
| **Multiple complaints (same seller)** | +0 (repeated) | -20 to -50 | Seller gets heavily penalized |
| **Complaint with fraud evidence** | +2 | -25 to -100 | Fraud = major STL hit |

---

## How to Check Your Complaint Status

### Online Portal

**URL:** `/complaints/[case-id]`

Example: `/complaints/COMP-2026-04-123456`

**Shows:**
- Current status
- Timeline of events
- Messages from EHB/seller
- Evidence uploaded
- Decision (if made)
- Appeal option (if rejected)

### Email Updates

EHB sends email updates:
- ✉️ Complaint received (within 1h)
- ✉️ Seller contacted (within 24h)
- ✉️ Case assigned to operator (day 3)
- ✉️ Decision made (day 7)

---

## Tips to Win Your Complaint

### ✅ DO This

1. **Be specific** — dates, amounts, what happened
2. **Add evidence** — screenshots, order #, tracking #
3. **Stay professional** — don't curse at seller
4. **Respond fast** — EHB asks questions → reply in 24h
5. **Keep chat receipts** — save all messages with seller
6. **Ask for realistic** — refund/replacement, not $1000+ penalty

### ❌ DON'T Do This

1. ❌ **Lie** — DMO will find out, you lose + STL hits
2. ❌ **Vague complaint** — "bad service" without details
3. ❌ **Abuse seller** — "you're scammer!" without proof
4. ❌ **Wait too long** — complaints expire after 30 days
5. ❌ **File multiple** — one per issue, don't spam
6. ❌ **Ask impossible** — don't demand seller's home address

---

## Common Complaint Scenarios

### Scenario 1: Seller Doesn't Deliver

```
Filed: Day 1
Evidence: Order #, tracking screenshot showing stuck
Seller response: "Logistics partner delayed, sending tomorrow"
DMO finds: Tracking shows delivery deadline breached
Decision: APPROVED
Resolution: Full refund + return label sent
Your STL: +1 (responsible buyer)
Seller STL: -8 (failure to deliver)
```

### Scenario 2: Quality Issue

```
Filed: Day 1
Evidence: Photos of damaged product + packaging
Seller response: "Not our fault, logistics broke it"
DMO finds: Packaging insufficient for shipping
Decision: APPROVED (shared responsibility)
Resolution: Seller refunds 50%, you keep product
Your STL: 0 (not seller's main fault)
Seller STL: -3 (poor packaging)
```

### Scenario 3: False Accusation

```
Filed: Day 1
Evidence: "Seller is a scammer" (no proof)
Seller response: Provides all chat history, proof of delivery
DMO finds: Seller delivered, buyer just changed mind
Decision: REJECTED
Resolution: Complaint dismissed, no refund
Your STL: -10 (false accusation)
Seller STL: +2 (exonerated)
Warning: "Another false complaint = account freeze"
```

---

## Appeal a Rejected Complaint

If DMO rejects your complaint, you **get one appeal**.

### How to Appeal

1. Go to complaint page `/complaints/[case-id]`
2. Click **"File Appeal"**
3. Add **new evidence** (required)
   - Can't say "I'm sure I'm right"
   - Must add new screenshot, witness, proof
4. Write appeal letter (500 words max)
5. Submit

**Appeal timeline:** 3–5 days decision

**Note:** If appeal also rejected, **case is closed forever**.

---

## Complaint Won't Hurt You If...

✅ You file a **valid complaint** (seller at fault)
✅ You provide **clear evidence**
✅ You respond to **EHB questions**
✅ Your complaint is about **seller conduct**, not personal dispute

**Your STL goes UP because you hold sellers accountable.**

---

## Roman Urdu Quick Ref

- **"Complaint file kaise krun?"** = How do I file complaint?
- **"Mera STL girega?"** = Will my STL drop?
- **"Refund milega?"** = Will I get refund?
- **"Case ID kya hai?"** = What's my case ID?
- **"Kitne din lagenge?"** = How many days?
- **"Agar DMO reject kare?"** = If EHB rejects it?
- **"Appeal kar sakta hun?"** = Can I appeal?

---

## Get Help

- **Filing help?** → Go to `/complaints/help` or chat support
- **Track complaint?** → `/complaints/[case-id]`
- **Urgent safety issue?** → Call DMO hotline (24/7)
- **Appeal question?** → Email: appeals@ehb.com

---

*EHB Complaint Helper — v1.0 · 2026-04-15*
