@echo off
REM Start EHB auto GitHub sync watcher
cd /d "%~dp0"
start "EHB Auto GitHub Sync" powershell -NoLogo -ExecutionPolicy Bypass -WindowStyle Minimized -File "%~dp0auto-github-sync.ps1" -PollSeconds 5 -QuietSeconds 20
