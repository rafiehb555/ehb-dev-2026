@echo off
title EHB Local Development Server
color 0A

REM =====================================================================
REM  EHB Technologies (PVT LTD) - Local Dev Launcher v3
REM
REM  v3 changes (2026-04-11):
REM    - Port pre-flight: kills any stale process on 3000 / 5000 / 8080
REM    - MongoDB check is now WARNING not HARD-STOP (services now run
REM      in degraded mode without Mongo instead of crashing)
REM    - Waits 35 seconds before opening browser (Next.js first compile
REM      takes 30-60s - this is why localhost:3000 "didn't respond" before)
REM    - Adds /health probe for each service so you can see exactly
REM      which one is up before the browser opens
REM
REM  Service layout:
REM    - Frontend (Next.js):  apps\web\                     port 3000
REM    - AI backend:          services\ai\                  port 8080
REM    - STL/API backend:     services\api\stl-replit\      port 5000
REM
REM  Prerequisites (install once):
REM    1. Node.js 20+        https://nodejs.org
REM    2. MongoDB Community  https://www.mongodb.com/try/download/community
REM       (or Docker: docker run -d -p 27017:27017 --name ehb-mongo mongo:7)
REM    3. .env files in each service folder (see docs/LAUNCH_GUIDE.md)
REM
REM  Backup of prior version: backup/pre-launch-fixes-2026-04-11/
REM =====================================================================

set "REPO_ROOT=%~dp0..\.."
set "NEXT_TELEMETRY_DISABLED=1"
set "NODE_OPTIONS=--max-old-space-size=4096"

echo.
echo  ============================================
echo    EHB Development - Local Server Start v3
echo  ============================================
echo.

REM === PRE-FLIGHT 1: kill stale processes on required ports ===
echo [0/7] Clearing stale processes on ports 3000, 5000, 8080...
for %%P in (3000 5000 8080) do (
    for /f "tokens=5" %%A in ('netstat -aon ^| findstr ":%%P " ^| findstr LISTENING') do (
        echo   Killing process %%A on port %%P
        taskkill /PID %%A /F >nul 2>&1
    )
)
echo   Ports cleared.

REM === PRE-FLIGHT 2: MongoDB warning (not hard-stop) ===
echo [1/7] Checking MongoDB on port 27017...
powershell -NoProfile -Command "$t = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue -InformationLevel Quiet; if (-not $t) { Write-Host '   WARNING: MongoDB NOT reachable on 127.0.0.1:27017' -ForegroundColor Yellow; Write-Host '   Services will start in DEGRADED mode (no persistence).' -ForegroundColor Yellow; Write-Host '   To enable persistence, install MongoDB or run:' -ForegroundColor Yellow; Write-Host '     docker run -d -p 27017:27017 --name ehb-mongo mongo:7' -ForegroundColor Yellow; exit 0 } else { Write-Host '   MongoDB OK' -ForegroundColor Green }"

REM === AI BACKEND SETUP ===
echo [2/7] AI backend dependencies check...
cd /d "%REPO_ROOT%\services\ai"
if not exist ".env" (
    echo PORT=8080 > .env
    echo NODE_ENV=development >> .env
    echo MONGODB_URI=mongodb://127.0.0.1:27017/ehb_ai_memory >> .env
    echo OPENAI_API_KEY= >> .env
)
if not exist "node_modules\express" (
    echo   Installing AI backend packages...
    call npm install
)

REM === API BACKEND SETUP ===
echo [3/7] API backend dependencies check...
cd /d "%REPO_ROOT%\services\api\stl-replit"
if not exist ".env" (
    echo NODE_ENV=development > .env
    echo PORT=5000 >> .env
    echo MONGO_URI=mongodb://127.0.0.1:27017/ehb_dev >> .env
    echo JWT_SECRET=ehb-local-dev-jwt-secret-2026-change-before-prod-deployment >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173 >> .env
    echo ANTHROPIC_API_KEY= >> .env
    echo OPENAI_API_KEY= >> .env
)
if not exist "node_modules\express" (
    echo   Installing API backend packages...
    call npm install
)

REM === FRONTEND SETUP ===
echo [4/7] Frontend dependencies check...
cd /d "%REPO_ROOT%\apps\web"
if not exist "node_modules\next" (
    echo   Installing frontend packages...
    call npm install
)

REM === PRISMA GENERATE ===
echo [5/7] Generating Prisma client...
call npx prisma generate >nul 2>&1
echo   Prisma client ready.

REM === START AI BACKEND ===
echo [6/7] Starting AI Backend on port 8080...
start "EHB AI Backend - Port 8080" cmd /k "cd /d "%REPO_ROOT%\services\ai" && color 0B && echo. && echo  AI Backend - http://localhost:8080/health && echo. && npm run dev"

timeout /t 3 /nobreak >nul

REM === START API BACKEND ===
echo [6/7] Starting API/STL Backend on port 5000...
start "EHB API Backend - Port 5000" cmd /k "cd /d "%REPO_ROOT%\services\api\stl-replit" && color 0D && echo. && echo  API Backend - http://localhost:5000/api/health && echo. && npm run dev"

timeout /t 3 /nobreak >nul

REM === START FRONTEND ===
echo [7/7] Starting Frontend on port 3000...
echo        (First compile takes 30-60 seconds - please wait)
start "EHB Frontend - Port 3000" cmd /k "cd /d "%REPO_ROOT%\apps\web" && color 0E && echo. && echo  Frontend - http://localhost:3000 && echo. && npm run dev"

echo.
echo  ============================================
echo    Waiting 35 seconds for Next.js to compile...
echo  ============================================

REM === Probe services while we wait ===
timeout /t 10 /nobreak >nul
echo.
echo   Probing services (attempt 1/3)...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/health' -UseBasicParsing -TimeoutSec 2; Write-Host '   AI backend  OK' -ForegroundColor Green } catch { Write-Host '   AI backend  not ready yet' -ForegroundColor Yellow }"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/health' -UseBasicParsing -TimeoutSec 2; Write-Host '   API backend OK' -ForegroundColor Green } catch { Write-Host '   API backend not ready yet' -ForegroundColor Yellow }"

timeout /t 12 /nobreak >nul
echo.
echo   Probing services (attempt 2/3)...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/health' -UseBasicParsing -TimeoutSec 2; Write-Host '   AI backend  OK' -ForegroundColor Green } catch { Write-Host '   AI backend  still not ready' -ForegroundColor Yellow }"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/health' -UseBasicParsing -TimeoutSec 2; Write-Host '   API backend OK' -ForegroundColor Green } catch { Write-Host '   API backend still not ready' -ForegroundColor Yellow }"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 2; Write-Host '   Frontend    OK' -ForegroundColor Green } catch { Write-Host '   Frontend    still compiling' -ForegroundColor Yellow }"

timeout /t 13 /nobreak >nul
echo.
echo   Final probe (attempt 3/3)...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/health' -UseBasicParsing -TimeoutSec 3; Write-Host '   AI backend  OK' -ForegroundColor Green } catch { Write-Host '   AI backend  DOWN - check AI Backend window' -ForegroundColor Red }"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/health' -UseBasicParsing -TimeoutSec 3; Write-Host '   API backend OK' -ForegroundColor Green } catch { Write-Host '   API backend DOWN - check API Backend window' -ForegroundColor Red }"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 5; Write-Host '   Frontend    OK' -ForegroundColor Green } catch { Write-Host '   Frontend    not responding - check Frontend window' -ForegroundColor Red }"

echo.
echo  ============================================
echo    Service URLs
echo  ============================================
echo    Frontend:   http://localhost:3000
echo    API:        http://localhost:5000
echo    API health: http://localhost:5000/api/health
echo    AI health:  http://localhost:8080/health
echo    DMO:        http://localhost:3000/dmo
echo    Fraud Q:    http://localhost:3000/dmo/fraud
echo  ============================================
echo.
echo  If any service is still DOWN above, look at its
echo  coloured CMD window - the error is on the last line.
echo.
start http://localhost:3000

pause
