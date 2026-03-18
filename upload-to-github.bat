@echo off
REM EHB - GitHub Upload (double-click se chalayein)
cd /d "D:\EHB DEVELOPMENT 2026"
powershell -ExecutionPolicy Bypass -File "%~dp0upload-to-github.ps1"
pause
