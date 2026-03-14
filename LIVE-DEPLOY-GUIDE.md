# EHB App – Live / Deploy Guide

App ko **internet par live** karne ke liye ye steps follow karein.  
**Free:** Vercel par deploy (recommended).

---

## Option 1: Vercel se (browser – sabse aasan)

### Step 1: Vercel par jao
- Browser mein open karein: **https://vercel.com**
- **Sign up** / **Log in** karein (GitHub se login kar sakte hain – "Continue with GitHub").

### Step 2: Naya project import karo
- **Add New…** → **Project** pe click karein.
- **Import Git Repository** mein apna repo dikhega: **rafiehb555/ehb-dev-2026**
- Uske saamne **Import** pe click karein.

### Step 3: Root Directory set karo (zaroori)
- **Root Directory** ke saamne **Edit** pe click karein.
- Type karein: **ehb-landing-demo**
- **Continue** karein (framework Next.js auto detect ho jayega).

### Step 4: Deploy
- **Deploy** pe click karein.
- 1–2 minute wait karein. Jab **Congratulations** aaye, app **live** ho chuki hogi.
- **Visit** ya jo link mile (jaise `ehb-landing-demo-xxx.vercel.app`) – wahi aapki **live URL** hai.

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
7. Jo **live URL** terminal mein aaye (jaise `https://ehb-landing-demo-xxx.vercel.app`) – wahi aapki app **live** hai.

### Baad mein (update live karna)
- Code change karke GitHub par push karein (upload-to-github.bat).
- Vercel khud naya deploy kar lega (agar repo Vercel se connect hai).
- Ya phir dobara chalao: `cd "D:\EHB DEVELOPMENT 2026\ehb-landing-demo"` phir `npx vercel --prod`

---

## Live URL kahan milegi

- **Vercel Dashboard:** https://vercel.com/dashboard → apne project pe click → **Domains** ya **Visit**.
- **Terminal:** Deploy khatam hone ke baad jo link print hota hai (e.g. `https://ehb-landing-demo-xxxx.vercel.app`).

---

## Summary

| Step | Kya karna hai |
|------|----------------|
| 1 | https://vercel.com → GitHub se login |
| 2 | Add New → Project → **rafiehb555/ehb-dev-2026** Import |
| 3 | Root Directory = **ehb-landing-demo** set karein |
| 4 | Deploy click karein → jo link mile wahi **live app** hai |

Isi link ko share karke aap app ko **live** use kar sakte hain.
