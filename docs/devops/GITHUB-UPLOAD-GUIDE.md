# EHB – GitHub Upload (Step by Step)

## Pehli dafa (one-time) – Login

1. **Git already configured hai** – aapka naam (Muhammad Rafi) aur email (ehb.rafi@gmail.com) set hain.
2. **Credentials** – Windows Credential Manager use ho raha hai. Agar pehle kabhi GitHub par login kiya hai (browser ya Git se), to push already kaam karega.
3. **Agar push karte waqt login maange:**
   - Browser khulega, GitHub par **Sign in** karein (rafiehb555 account).
   - Login ke baad wapas terminal/script dobara chalayein.

---

## Har baar upload ka tareeqa (2 options)

### Option 1: Double-click (sabse aasan)

1. Folder kholen: `D:\EHB DEVELOPMENT 2026`
2. **`upload-to-github.bat`** par double-click karein.
3. Script khud:
   - saari changes add karegi  
   - commit karegi  
   - GitHub par push karegi  
4. Agar koi change nahi hai to "Koi naya change nahi hai" dikhega.
5. Pehli dafa agar login maanga to browser se login karein, phir script dobara chalayein.

### Option 2: Terminal se

```powershell
cd "D:\EHB DEVELOPMENT 2026"
git add .
git commit -m "Update"
git push origin main
```

---

## Repo link

**https://github.com/rafiehb555/ehb-dev-2026**

---

## Agar "push" fail ho

1. **Login maanga** → Browser open karke GitHub par sign in karein (rafiehb555).
2. **Permission / access denied** → GitHub par repo check karein ke aap owner hain (rafiehb555/ehb-dev-2026).
3. **Script run nahi ho rahi** → Right-click `upload-to-github.ps1` → "Run with PowerShell". Agar policy error aaye to:  
   `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`  
   (PowerShell as Administrator mein ek baar chalayein.)

---

Sab setting project ke andar hai; bas **upload-to-github.bat** chalana hai jab bhi upload karna ho.
