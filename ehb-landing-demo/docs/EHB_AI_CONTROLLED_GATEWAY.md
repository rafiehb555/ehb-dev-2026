# EHB AI Controlled Gateway

This gateway keeps ChatGPT as a read-only memory brain and blocks coding-generation usage.

## Goal

- ChatGPT API only for EHB knowledge/context retrieval.
- No coding or implementation generation through this endpoint.
- Cursor/dev agents remain responsible for engineering work.

## Route

- `POST /api/ai/memory/query`

### Request

```json
{
  "message": "EHB DMO approvals flow explain karo",
  "traceId": "optional-request-id"
}
```

### Success response

```json
{
  "success": true,
  "data": {
    "answer": "....",
    "meta": {
      "mode": "READ_ONLY_MEMORY",
      "model": "gpt-4.1-mini",
      "traceId": "optional-request-id"
    }
  }
}
```

### Blocked response

- Returns `403 MEMORY_QUERY_BLOCKED` when coding/security-generation style prompts are detected.

## Security controls

- RBAC via `requireSession`.
- Keyword blocklist for coding/exploit intents.
- Domain allow check for EHB-related queries.
- Locked system prompt: memory-only behavior.
- Audit logs:
  - `AI_MEMORY_QUERY_OK`
  - `AI_MEMORY_QUERY_BLOCKED`

## Required environment variables

- `EHB_MEMORY_OPENAI_KEY` (required)
- `EHB_MEMORY_MODEL` (default: `gpt-4.1-mini`)
- `EHB_MEMORY_CONTEXT` (optional static memory context)
- `EHB_MEMORY_SYSTEM_PROMPT` (optional override)

## Architecture

```text
Client/Tool -> /api/ai/memory/query -> Guardrails -> OpenAI Responses API
                                            |
                                          Audit
```

This is intentionally a controlled gateway, not a direct client-to-OpenAI path.

