# EHB AI System Backend

Persistent AI Memory + ChatGPT bridge foundation for EHB Technologies Limited.

## What this backend does

- Stores project context in MongoDB as persistent memory
- Retrieves relevant memory before every AI response
- Sends context + user prompt to OpenAI
- Returns AI response and saves meaningful updates automatically
- Supports role-based AI modes:
  - `product_manager`
  - `uiux_designer`
  - `backend_engineer`
  - `blockchain_architect`

## Folder Structure

```txt
ai-system-backend/
  ai-system/
    memory/
      memoryModel.js
      memoryStore.js
      contextRetriever.js
    openai/
      openaiClient.js
      promptBuilder.js
    agents/
      plannerAgent.js
      devAgent.js
    utils/
      relevanceEngine.js
  src/
    controllers/
      aiController.js
    routes/
      aiRoutes.js
  server.js
  .env.example
  package.json
```

Implementation note:

- Keep backend AI models, memory logic, prompt builders, and agent orchestration inside `ai-system/`.
- Keep HTTP controllers and route wiring inside `src/`.
- When adding new AI capabilities, extend the relevant folder under `ai-system/` instead of creating a parallel top-level models folder.

## Setup Guide (Replit, step-by-step)

1. Create a new **Node.js Repl**
2. Upload this `ai-system-backend` folder
3. Open shell and run:
   - `npm install`
4. Create `.env` file (copy from `.env.example`)
5. Add your values:
   - `MONGODB_URI` (MongoDB Atlas or local)
   - `OPENAI_API_KEY`
6. Run the server:
   - `npm run start`
7. Test health endpoint:
   - `GET /health`
8. Start using AI APIs (`/ai/chat`, `/ai/memory`, `/ai/memory/update`)

## API Endpoints

### 1) POST `/ai/chat`

Request:

```json
{
  "message": "EHB ecosystem ke liye trust dashboard roadmap banao",
  "mode": "product_manager"
}
```

Response (example):

```json
{
  "mode": "product_manager",
  "response": "Here is a phased roadmap for trust dashboard...",
  "plannerHints": [
    "Add unit + API integration tests before production rollout."
  ],
  "memorySaved": 2,
  "memoryContextUsed": 7
}
```

### 2) GET `/ai/memory?limit=50`

Response:

```json
{
  "count": 2,
  "items": [{ "...": "..." }]
}
```

### 3) POST `/ai/memory/update`

Request:

```json
{
  "key": "ehb_project_vision",
  "category": "vision",
  "value": {
    "mission": "Build unified multi-industry trust ecosystem",
    "platforms": ["PSS", "EDR", "EMO", "GoSellr", "Franchise"]
  },
  "tags": ["ehb", "vision"],
  "importance": 5,
  "source": "manual"
}
```

## Example Stored Memory (EHB Context)

```json
[
  {
    "key": "ehb_project_vision",
    "category": "vision",
    "value": {
      "mission": "Create complete EHB trust ecosystem",
      "departments": ["PSS", "EDR", "EMO", "GoSellr", "Franchise"]
    },
    "tags": ["ehb", "ecosystem", "vision"],
    "importance": 5
  },
  {
    "key": "ui_structure_main_dashboard",
    "category": "uiux",
    "value": {
      "sections": ["Trust Radar", "Approvals", "Audit Trail", "Department KPIs"]
    },
    "tags": ["ui", "dashboard"],
    "importance": 4
  }
]
```

## Security Notes

- Keep API keys only in `.env`
- Rate limiting is enabled globally
- `helmet` is enabled for common HTTP security headers
- Do not store passwords or secret tokens in memory entries
