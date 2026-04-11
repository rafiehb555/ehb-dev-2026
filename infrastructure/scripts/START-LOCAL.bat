@echo off
title EHB Local Development Server
color 0A

REM =====================================================================
REM  EHB Technologies (PVT LTD) — Local Dev Launcher
REM  Post-restructure path layout (2026-04-11):
REM    - Frontend (Next.js):  apps\web\
REM    - AI backend:          services\ai\
REM    - API backend:         services\api\
REM
REM  This script now sits in  infrastructure\scripts\  so %~dp0 points
REM  there; we use ..\..\ to jump back to the repo root.
REM =====================================================================

set "REPO_ROOT=%~dp0..\.."

echo.
echo  ============================================
echo    EHB Development - Local Server Start
echo  ============================================
echo.

REM === AI BACKEND SETUP ===
echo [1/5] AI backend dependencies check...
cd /d "%REPO_ROOT%\services\ai"
if not exist ".env" (
    echo PORT=8080 > .env
    echo NODE_ENV=development >> .env
)
if not exist "node_modules\express" (
    echo Installing AI backend packages...
    call npm install
)

REM === FRONTEND SETUP ===
echo [2/5] Frontend dependencies check...
cd /d "%REPO_ROOT%\apps\web"
if not exist "node_modules\next" (
    echo Installing frontend packages...
    call npm install
)

REM === PRISMA GENERATE (new schema models) ===
echo [3/5] Generating Prisma client (new AI + Fraud models)...
call npx prisma generate
echo Prisma client ready.

REM === START AI BACKEND ===
echo [4/5] Starting AI Backend on port 8080...
start "EHB AI Backend - Port 8080" cmd /k "cd /d "%REPO_ROOT%\services\ai" && color 0B && echo. && echo  AI Backend running at http://localhost:8080 && echo. && npm run dev"

timeout /t 4 /nobreak >nul

REM === START FRONTEND ===
echo [5/5] Starting Frontend on port 3000...
start "EHB Frontend - Port 3000" cmd /k "cd /d "%REPO_ROOT%\apps\web" && color 0E && echo. && echo  Frontend running at http://localhost:3000 && echo. && npm run dev"

timeout /t 8 /nobreak >nul

echo.
echo  ============================================
echo    DONE! Opening browser...
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8080/health
echo    DMO:       http://localhost:3000/dmo
echo    Fraud Q:   http://localhost:3000/dmo/fraud
echo    Queue:     http://localhost:3000/dmo/queue
echo  ============================================
echo.
start http://localhost:3000/dmo

pause
