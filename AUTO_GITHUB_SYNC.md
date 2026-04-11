# Auto GitHub Sync

Yeh setup local Cursor development changes ko automatically GitHub par commit aur push karne ke liye banaya gaya hai.

## Included files

- `upload-to-github.ps1`
  - Single-run uploader jo stage, commit, fetch, auto-rebase, aur push karta hai
- `auto-github-sync.ps1`
  - Watcher jo near-real-time changes detect karke quiet period ke baad auto upload chalata hai
- `start-auto-github-sync.bat`
  - Double-click se watcher abhi start karta hai
- `register-auto-github-sync-task.ps1`
  - Windows logon par watcher auto start karne ke liye Scheduled Task banata hai
- `unregister-auto-github-sync-task.ps1`
  - Scheduled Task remove karta hai

## Default behavior

- Poll interval: `5` seconds
- Quiet period: `20` seconds
- Commit message format: `auto-sync: YYYY-MM-DD HH:mm:ss`
- Push target: current checked-out git branch
- Single instance lock: haan
- Remote sync: fetch + auto-rebase before push

## How it works

1. File changes detect hote hi quiet timer start hota hai.
2. Agar `20` seconds tak koi naya change na aaye to watcher uploader run karta hai.
3. Uploader:
   - `git add -A`
   - auto commit
   - `fetch origin`
   - zaroorat ho to `pull --rebase`
   - `push origin <current-branch>`
4. Agar rebase conflict aaye to script stop ho jati hai aur manual resolve zaroori hota hai.

## Start now

Double-click:

- `start-auto-github-sync.bat`

Ya PowerShell se:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\EHB DEVELOPMENT 2026\auto-github-sync.ps1" -PollSeconds 5 -QuietSeconds 20
```

## Auto start with Windows

PowerShell open karke run karein:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\EHB DEVELOPMENT 2026\register-auto-github-sync-task.ps1"
```

Is se Windows logon par watcher khud start ho jayega.

## Stop auto start

```powershell
powershell -ExecutionPolicy Bypass -File "D:\EHB DEVELOPMENT 2026\unregister-auto-github-sync-task.ps1"
```

## Logs

- Watcher log: `D:\EHB DEVELOPMENT 2026\logs\auto-github-sync.log`
- Watcher lock: `D:\EHB DEVELOPMENT 2026\logs\auto-github-sync.lock`

## Important notes

- `.env` files aur `logs/` already gitignore mein ignored hain.
- Yeh system incomplete ya experimental changes bhi auto commit kar sakta hai.
- Agar aap repo mein bohat risky/manual work kar rahe hain to watcher temporary stop kar dena better hai.
- Agar remote aur local changes same file par clash karen to auto rebase ruk sakta hai.
