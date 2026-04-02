# EHB App – Live / Deploy Guide

App ko **internet par live** karne ke liye ye steps follow karein.  
**Free:** Vercel par deploy (recommended).

---

## Fixed production URL

Canonical live app URL:

- `https://ehb-dev-rafi.vercel.app`

Important:

- Hamesha isi existing Vercel project ko update karein.
- Naya production project ya random naya `*.vercel.app` URL create na karein.
- Agar GitHub-connected Vercel project sahi linked hai, to new production deploy isi URL par reflect hoga.

## Option 1: Vercel se (browser – sabse aasan)

### Step 1: Vercel par jao
- Browser mein open karein: **https://vercel.com**
- **Sign up** / **Log in** karein (GitHub se login kar sakte hain – "Continue with GitHub").

### Step 2: Naya project import karo
- **Add New…** → **Project** pe click karein.
- **Import Git Repository** mein apna repo dikhega: **rafiehb555/ehb-dev-2026**
- Uske saamne **Import** pe click karein.
- Agar project pehle se bana hua hai aur uska live domain `https://ehb-dev-rafi.vercel.app` hai, to **new project create na karein**. Usi existing project ko open karein.

### Step 3: Root Directory set karo (zaroori)
- **Root Directory** ke saamne **Edit** pe click karein.
- Type karein: **ehb-landing-demo**
- **Continue** karein (framework Next.js auto detect ho jayega).

### Step 4: Deploy
- **Deploy** pe click karein.
- 1–2 minute wait karein. Jab **Congratulations** aaye, app **live** ho chuki hogi.
- Production verification ke liye final live URL `https://ehb-dev-rafi.vercel.app` hi use karein.

---

## Option 2: Terminal se (Vercel CLI)

### Pehli dafa (one-time)
1. **https://vercel.com** par jao, GitHub se **log in** karein.
2. Terminal / PowerShell kholen.
3. Chalao:
   ```bash
   cd "D:\EHB DEVELOPMENT 2026\ehb-landing-demo"
   npx vercel
   ```
4. Jab puche **Set up and deploy?** → **Y** (Yes).
5. Agar **Log in** maange to browser khulega – wahan Vercel par login karein.
6. Phir **link to existing project?** → **N** (No) agar pehli baar deploy ho raha ho.
7. Agar project pehle se `ehb-dev-rafi` se linked hai, to deploy ke baad production app isi URL par update honi chahiye: `https://ehb-dev-rafi.vercel.app`

### Baad mein (update live karna)
- Code change karke GitHub par push karein (upload-to-github.bat).
- Vercel khud naya deploy kar lega (agar repo isi existing Vercel project se connect hai).
- Ya phir dobara chalao: `cd "D:\EHB DEVELOPMENT 2026\ehb-landing-demo"` phir `npx vercel --prod`
- Har release ke baad confirm karein ke update `https://ehb-dev-rafi.vercel.app` par aa gaya hai.

---

## Live URL kahan milegi

- **Vercel Dashboard:** https://vercel.com/dashboard → apne project pe click → **Domains** ya **Visit**.
- **Expected production URL:** `https://ehb-dev-rafi.vercel.app`

---

## Summary

| Step | Kya karna hai |
|------|----------------|
| 1 | https://vercel.com → GitHub se login |
| 2 | Existing `ehb-dev-rafi` Vercel project open karein, ya sirf pehli dafa import karein |
| 3 | Root Directory = **ehb-landing-demo** set karein |
| 4 | Deploy/update karein → final production check `https://ehb-dev-rafi.vercel.app` par karein |

Isi link ko share karke aap app ko **live** use kar sakte hain.

Last synced from Mac: 2026-03-18.
