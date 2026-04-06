@echo off
title EHB Local Development Server
color 0A

echo.
echo  ============================================
echo    EHB Development - Local Server Start
echo  ============================================
echo.

REM === BACKEND SETUP ===
echo [1/5] Backend dependencies check...
cd /d "%~dp0ai-system-backend"
if not exist ".env" (
    echo PORT=8080 > .env
    echo NODE_ENV=development >> .env
)
if not exist "node_modules\express" (
    echo Installing backend packages...
    call npm install
)

REM === FRONTEND SETUP ===
echo [2/5] Frontend dependencies check...
cd /d "%~dp0EHB landing-2026"
if not exist "node_modules\next" (
    echo Installing frontend packages...
    call npm install
)

REM === PRISMA GENERATE (new schema models) ===
echo [3/5] Generating Prisma client (new AI + Fraud models)...
call npx prisma generate
echo Prisma client ready.

REM === START BACKEND ===
echo [4/5] Starting Backend on port 8080...
start "EHB Backend - Port 8080" cmd /k "cd /d "%~dp0ai-system-backend" && color 0B && echo. && echo  Backend running at http://localhost:8080 && echo. && npm run dev"

timeout /t 4 /nobreak >nul

REM === START FRONTEND ===
echo [5/5] Starting Frontend on port 3000...
start "EHB Frontend - Port 3000" cmd /k "cd /d "%~dp0EHB landing-2026" && color 0E && echo. && echo  Frontend running at http://localhost:3000 && echo. && npm run dev"

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
