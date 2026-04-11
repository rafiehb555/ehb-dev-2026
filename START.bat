@echo off
REM =====================================================================
REM  EHB Technologies (PVT LTD) - One-Click Launcher
REM
REM  Double-click karo -- pura project local per live ho jayega.
REM  Internally yeh infrastructure\scripts\START-LOCAL.bat ko call karta hai.
REM =====================================================================

title EHB 2026 - Launching...
color 0A

echo.
echo  ============================================
echo    EHB Technologies (PVT LTD)
echo    EHB 2026 - One-Click Local Launcher
echo  ============================================
echo.
echo   This will start:
echo     - Frontend   http://localhost:3000
echo     - API        http://localhost:5000
echo     - AI Backend http://localhost:8080
echo.
echo   First boot takes 30-60 seconds for Next.js to compile.
echo   Please wait for the browser to open automatically.
echo.
pause

REM Jump to the actual launcher
call "%~dp0infrastructure\scripts\START-LOCAL.bat"
