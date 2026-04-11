# EHB Technologies API Flow

## Purpose

This document explains how data should move through the backend API in a clean and scalable way.

## Standard Flow

The recommended request flow is:

1. Frontend sends a request
2. Express route receives the request
3. Controller reads request data
4. Service performs business logic
5. Model talks to MongoDB
6. Controller sends the final response

## Example Flow For User Creation

1. Frontend sends `POST /api/users`
2. `user.routes.js` maps the request to the controller
3. `user.controller.js` reads `name`, `email`, and `password`
4. `user.service.js` checks if the user already exists
5. `user.model.js` saves the user in MongoDB
6. API returns a success message and user data

## AI Integration Flow

When the project needs AI features, keep the flow clean:

1. Controller receives the AI-related request
2. Service prepares the prompt and payload
3. Utility file such as `utils/claude.js` sends the request to the AI provider
4. Service formats the result
5. Controller returns a safe response to the frontend

## Security Rules

For production-ready APIs:

- keep secrets in environment variables
- validate user input before processing
- do not return raw internal errors to the client
- keep business logic out of routes
- keep database logic out of controllers

## Response Format Recommendation

Use consistent JSON responses:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {}
}
```

This makes frontend integration simpler and more predictable.

## EHB landing-2026 (Next.js App Router)

The live app uses route handlers under `EHB landing-2026/app/api/`. Example: **`GET /api/stl/meta`** returns `{ "success": true, "data": { ... } }` for the **EHB-STL-LEVEL** reference (levels, formula, cross-module tables) with `Cache-Control` suitable for CDN caching — see [`INDEX.md`](INDEX.md) (EHB-STL-LEVEL section) and [`app/api/stl/meta/route.ts`](../EHB%20landing-2026/app/api/stl/meta/route.ts).
