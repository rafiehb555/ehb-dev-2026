# Affiliate — EHB Referral Program

**Status:** Canonical spec (v1.0) · Merged from `uploads/ehb_affiliate.md` (Batch-2, 2026-04-11)
**Related:** `Wallet.md` · `Finance.md`

---

## 1. Purpose

The Affiliate system turns users into growth engines. Anyone can refer new users to EHB and earn commissions on the new user's activity — both a one-time joining bonus and a recurring percentage of their earnings.

## 2. Functions

1. **Referral tracking** — every user gets a unique referral code/link
2. **Commission system** — automatic calculation + credit to the referrer's wallet

## 3. Earning types

1. **Direct bonus** — one-time reward when a referred user completes KYC (PSS tier ≥ Basic Verified)
2. **Level bonus** — recurring percentage of the referred user's platform fees (multi-level, exact depth TBD)

## 4. Integration points

- **PSS** — only verified referrals count (blocks fake-account farming)
- **DMO Up-Guard** — detects affiliate rings (circular referrals, self-referral loops, burst signups from single IP)
- **Wallet** — commissions land directly in the referrer's Free balance after DMO approval

## 5. Open questions for next batch

1. **Direct bonus amount** per verified referral
2. **Level depth** — 2 levels? 5 levels? Unlimited?
3. **Recurring percentage** at each level
4. **STL gate** — does the referrer need a minimum STL to earn level bonuses?
5. **Abuse caps** — max referrals per day? per month?

## Changelog

| Date       | Ver | Change |
|------------|-----|--------|
| 2026-04-11 | 1.0 | Created from Batch-2 `uploads/ehb_affiliate.md` (short file — most detail TBD) |
