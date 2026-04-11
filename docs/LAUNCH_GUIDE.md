# EHB 2026 — Local Launch Guide

**Company:** EHB Technologies (PVT LTD)
**Last updated:** 2026-04-11 (v3)
**Target OS:** Windows 10 / 11 (PowerShell + CMD)
**Audience:** Any EHB developer running the stack on a local machine for the first time

> **v3 fixes applied today:**
> - AI service no longer crashes when MongoDB is down — `http://localhost:8080/health` responds in degraded mode
> - API backend no longer calls `process.exit(1)` on Mongo failure — stays up and retries every 15s
> - New `/api/health` route on the API backend (`http://localhost:5000/api/health`)
> - `START-LOCAL.bat` v3 kills stale processes on ports 3000/5000/8080 first, waits 35s for Next.js first compile, and probes each service's /health before opening the browser
> - All of these fixes are reversible from `backup/pre-launch-fixes-2026-04-11/`

---

## 1. What you will be running

Three services + one database, all on `localhost`:

| Service      | Path                          | Port  | Tech               | Started by        |
|--------------|-------------------------------|-------|--------------------|-------------------|
| Frontend     | `apps/web`                    | 3000  | Next.js 14 (ESM)   | `npm run dev`     |
| API backend  | `services/api/stl-replit`     | 5000  | Express + Mongoose | `npm run dev`     |
| AI backend   | `services/ai`                 | 8080  | Express + OpenAI   | `npm run dev`     |
| MongoDB      | (external)                    | 27017 | MongoDB 7          | Service / Docker  |

One database, two logical DBs inside it: `ehb_dev` (API) and `ehb_ai_memory` (AI).

---

## 2. One-time prerequisites

### 2.1 Node.js 20 LTS

Install from https://nodejs.org. Verify:

```
node -v   => v20.x.x (or v18.x.x minimum)
npm -v    => 10.x.x
```

### 2.2 MongoDB on port 27017

Pick ONE of the two options below. Either works — the app does not care.

**Option A — MongoDB Community Server (recommended for daily dev)**

1. Download: https://www.mongodb.com/try/download/community
2. Install with the default "Run as Windows Service" option.
3. Confirm it is running:
   ```
   powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 27017"
   ```
   Expect `TcpTestSucceeded : True`.

**Option B — Docker (fastest, disposable)**

```
docker run -d -p 27017:27017 --name ehb-mongo mongo:7
```

To stop: `docker stop ehb-mongo`. To restart: `docker start ehb-mongo`.

### 2.3 Optional API keys

The stack boots without these, but features that depend on them will run in a degraded / stub mode:

- `OPENAI_API_KEY` — enables real AI responses in `services/ai`. Get one at https://platform.openai.com/api-keys.
- `ANTHROPIC_API_KEY` — enables the STL AI adjustment layer in `services/api/stl-replit/services/ai.service.js`. Without it, STL falls back to the deterministic formula (which is the tested path — 58 gold-master tests cover it).

Paste them into the corresponding `.env` files described in section 4.

---

## 3. The one-command launch

From a fresh terminal, with MongoDB already running:

```
D:\EHB DEVELOPMENT 2026\infrastructure\scripts\START-LOCAL.bat
```

Or just double-click the `.bat` file in Explorer.

The launcher will:

1. Check that MongoDB is reachable on port 27017. If not, it aborts with a clear message — no half-started services.
2. Check and install dependencies for AI, API, and Frontend (only on first run).
3. Ensure each backend service has a working `.env` file, auto-creating a default one if missing.
4. Run `npx prisma generate` against the frontend (Next.js uses Prisma).
5. Open three separate colored CMD windows, one per service, each running its own `npm run dev` in watch mode.
6. Wait ~8 seconds, then open `http://localhost:3000` in your default browser.

Close any of the three CMD windows to stop that individual service. Close all three to stop the whole stack. The MongoDB instance keeps running independently.

---

## 4. Environment files

Every backend service keeps its local secrets in a `.env` file at its own root. These files are gitignored. Production secrets belong in Vercel / Vault, never in this file.

### 4.1 `services/api/stl-replit/.env`

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ehb_dev
JWT_SECRET=ehb-local-dev-jwt-secret-2026-change-before-prod-deployment
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

- `JWT_SECRET` is required. The server will refuse to start without it (hard fail-fast at `server.js` line 28).
- `ALLOWED_ORIGINS` is a comma-separated CORS allow-list. Add any extra dev frontends here.
- `ANTHROPIC_API_KEY` is optional — without it, STL recalc uses the deterministic formula only.

### 4.2 `services/ai/.env`

```
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ehb_ai_memory
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
RATE_LIMIT_MAX=120
CONTEXT_LIMIT=12
```

- `MONGODB_URI` is required — the AI service connects to Mongo **before** calling `app.listen()`. Without Mongo, it will hang on startup.
- Leave `OPENAI_API_KEY` empty to boot in stub mode. Fill it in when you want real AI responses.

### 4.3 `apps/web/.env`

```
DATABASE_URL=mongodb://127.0.0.1:27017/ehb_dev
EHB_AUTH_SECRET=ehb-dev-secret-key-local-2026-unsafe
NEXT_PUBLIC_APP_ENV=development
```

- Used by Next.js + Prisma. Same Mongo DB as the API backend.

---

## 5. Manual startup (alternative to the batch script)

If you prefer to run each service in your own terminal of choice (Windows Terminal, VS Code, WSL, etc.), open three terminals and run:

**Terminal 1 — API backend**

```
cd "D:\EHB DEVELOPMENT 2026\services\api\stl-replit"
npm install        (first time only)
npm run dev
```

**Terminal 2 — AI backend**

```
cd "D:\EHB DEVELOPMENT 2026\services\ai"
npm install        (first time only)
npm run dev
```

**Terminal 3 — Frontend**

```
cd "D:\EHB DEVELOPMENT 2026\apps\web"
npm install        (first time only)
npx prisma generate
npm run dev
```

Order does not matter — they find each other via localhost.

---

## 6. Health checks — proving everything is live

Once the stack is up, visit each of these URLs in order:

| URL                                       | What you expect to see                          |
|-------------------------------------------|--------------------------------------------------|
| http://localhost:3000                     | Next.js homepage — no CORS errors in console    |
| http://localhost:5000/                    | API backend root (small JSON or 404 — both OK)  |
| http://localhost:5000/api/health          | API health JSON (if route exists)               |
| http://localhost:8080/health              | `{ status: "ok" }` from the AI service          |
| http://localhost:3000/dmo                 | DMO dashboard — requires API backend live       |
| http://localhost:3000/dmo/fraud           | Fraud queue — requires API + AI both live       |

If any of these fail, check the colored CMD window for that service — it will show the exact error on the last line.

---

## 7. Troubleshooting

### 7.1 `MongoDB NOT reachable on 127.0.0.1:27017`

The launcher could not connect to Mongo. Fix one of:

- Start the Windows MongoDB service: `net start MongoDB` from an elevated terminal.
- Or start the Docker container: `docker start ehb-mongo`.
- Or install Mongo following section 2.2.

Then rerun the launcher.

### 7.2 `Error: JWT_SECRET is required`

Your `services/api/stl-replit/.env` file is missing the `JWT_SECRET` line. Open the file and copy the block from section 4.1. This is a deliberate fail-fast — do NOT delete the check in `server.js`.

### 7.3 `EADDRINUSE: port 3000 / 5000 / 8080 already in use`

Something else is using that port. Find and kill it:

```
powershell -Command "Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess"
taskkill /PID <process-id-from-above> /F
```

Or pick different ports by editing the `PORT=` line in the relevant `.env`.

### 7.4 AI service hangs during startup

**Fixed in v3 (2026-04-11).** The AI service used to call `connectDb()` before `app.listen()` — if Mongo was down, the server never started and `/health` was unreachable. Now the service binds the port first and retries Mongo in the background every 15 seconds. Hit `http://localhost:8080/health` and read the `db.connected` field to see the current state.

### 7.5 `http://localhost:3000` not responding after START-LOCAL.bat

Most common cause: you checked too early. Next.js first-compile takes **30–60 seconds** on first run, especially on a cold cache. The v3 launcher waits 35 seconds and probes `/` before opening the browser.

If after 60 seconds it still doesn't respond:

1. Look at the "EHB Frontend - Port 3000" CMD window — the error is on the last line.
2. Common errors:
   - `EADDRINUSE :3000` — another process is using port 3000. The v3 launcher kills stale processes automatically; if you started Next.js manually from another terminal, close that one.
   - `Module not found` — run `npm install` again inside `apps/web`.
   - `Error: Cannot find module '@prisma/client'` — run `npx prisma generate` inside `apps/web`.
   - Long pauses with no output — clear the Next.js cache: `npm run clean` inside `apps/web`, then retry.

### 7.6 `http://localhost:8080/health` not responding

**Fixed in v3 (2026-04-11).** Root cause was the AI service crashing when Mongo was unreachable (it called `await connectDb()` before `app.listen()`). The service now starts the port first. If `/health` still doesn't respond, check the "EHB AI Backend - Port 8080" CMD window — a dependency or syntax error will be on the last line.

### 7.5 Next.js build / Prisma errors

Run once from `apps/web`:

```
npx prisma generate
```

Then retry `npm run dev`. The Prisma client is regenerated automatically by the launcher, but if you ran Next.js manually you need this step yourself.

### 7.6 CORS errors in the browser console

Check `ALLOWED_ORIGINS` in `services/api/stl-replit/.env` — it must contain `http://localhost:3000`. Restart the API backend after editing.

---

## 8. Running the test suite while the stack is live

The STL regression safety net is independent of the running stack. You can run it at any time:

```
cd "D:\EHB DEVELOPMENT 2026\services\api\stl-replit"
npm run test:stl
```

Expected output: `58 pass, 0 fail`. Anything else means someone accidentally broke the STL formula and needs to answer for it before merging.

Full Jest suite (requires `npm install --save-dev jest` once):

```
npm run test:jest
```

---

## 9. Stopping everything

- **Services:** close the three colored CMD windows, or press `Ctrl+C` in each.
- **MongoDB (Windows service):** `net stop MongoDB` (optional — it is harmless to leave running).
- **MongoDB (Docker):** `docker stop ehb-mongo`.
- **Data:** nothing is deleted on stop. The database on disk stays exactly as it was.

To completely reset the local database (destructive):

```
docker rm -f ehb-mongo
docker run -d -p 27017:27017 --name ehb-mongo mongo:7
```

Or from Mongo shell:

```
use ehb_dev
db.dropDatabase()
use ehb_ai_memory
db.dropDatabase()
```

---

## 10. What changed in this launch setup

As part of the 2026-04-11 launch-prep pass, the following files were updated (backups are in `backup/pre-launch-fixes-2026-04-11/`):

| File                                              | Change                                                    |
|---------------------------------------------------|-----------------------------------------------------------|
| `infrastructure/scripts/START-LOCAL.bat`          | v3 — port kill pre-flight, Mongo check softened to warning, 35s wait + 3× service health probes before opening browser |
| `services/api/stl-replit/.env`                    | Replaced placeholder values with working local-dev values |
| `services/api/stl-replit/config/db.js`            | No more `process.exit(1)` on Mongo fail — exports shared `dbState`, retries every 15s, keeps server alive in degraded mode |
| `services/api/stl-replit/server.js`               | Added `/api/health` route exposing `dbState`; imports `dbState` from `./config/db.js` |
| `services/ai/server.js`                           | `app.listen()` now runs BEFORE Mongo connect. `/health` exposes Mongo state. Background retry every 15s |
| `services/ai/ai-system/memory/memoryStore.js`     | Added `serverSelectionTimeoutMS: 3000` so Mongo failures surface in 3s instead of hanging |
| `services/ai/.env`                                | Added `MONGODB_URI`, `OPENAI_API_KEY` placeholder, rate-limit vars |
| `docs/LAUNCH_GUIDE.md`                            | This file |

**The key mental model after v3:** MongoDB is an **optional** dependency for local dev. All three services will start, bind their ports, and respond to `/health` endpoints with or without Mongo. Routes that need database access will return an error with `db.connected: false`; routes that don't will work normally. This means you can demo the frontend, STL formula tests, and most AI endpoints before even installing Mongo.

No business logic, no Mongoose models, and no routes were touched. Everything is reversible by restoring from the backup folder.

---

## 11. Closing note

Phase 1 ka foundation ready hai, Phase 1 ka system hardening in place hai, aur ab yeh guide aap ko stack ko zero-friction chalaney ka clean path deta hai. MongoDB chalao, `START-LOCAL.bat` double-click karo, browser khul jaye ga — bas.

— EHB Technologies (PVT LTD), Engineering
