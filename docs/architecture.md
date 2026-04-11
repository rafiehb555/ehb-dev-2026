# EHB Technologies Architecture

## Purpose

This document explains the beginner-friendly system architecture for EHB Technologies.
The goal is to keep the project modular, scalable, and easy to grow with AI-assisted development.

## High-Level Structure

The project is split into five main root folders:

- `docs/` for system documentation and planning
- `prompts/` for reusable AI instruction files
- `tasks/` for active and completed work tracking
- `backend/` for the API, database logic, and business rules
- `frontend/` for the Next.js or React user interface

## Development Philosophy

EHB uses a two-part workflow:

1. Planning first
2. Execution second

The planning side is similar to a Claude-style workflow:

- Read the docs
- Understand the module
- Follow the rules in `prompts/`
- Decide the task clearly before coding

The execution side is similar to a Cursor-style workflow:

- Open the correct files
- Implement the task in small steps
- Keep code modular
- Update task tracking after work is complete

## Backend Architecture

The backend uses:

- Node.js
- Express
- MongoDB with Mongoose

The backend is organized by responsibility:

- `config/` for database and app configuration
- `middlewares/` for shared request handling logic
- `modules/` for feature-based business logic
- `utils/` for reusable helper functions

Each business module should stay self-contained.
For example, the `user` module contains:

- model
- service
- controller
- routes

This makes the code easier to scale because each module can grow independently.

## Frontend Architecture

The frontend folder is reserved for the UI application.
It should use a clean component-based structure with either:

- Next.js
- React

Recommended future frontend folders:

- `components/`
- `pages/` or `app/`
- `services/`
- `hooks/`
- `lib/`

## Request Flow

The normal backend request flow should be:

1. Client sends request
2. Express route receives request
3. Controller validates and handles request data
4. Service contains business logic
5. Model reads or writes MongoDB data
6. Response returns to client

## AI-Assisted Workflow

Before coding any feature:

1. Read `docs/architecture.md`
2. Read `docs/modules.md`
3. Read `docs/api-flow.md`
4. Load the correct rules from `prompts/`
5. Check `tasks/current_tasks.md`

After finishing a feature:

1. Update the code
2. Move the task from current to completed
3. Update docs if the system changed

## Scalability Rules

To keep the system production-ready:

- avoid hardcoding values
- use environment variables for secrets and URLs
- keep controllers thin
- keep services reusable
- keep modules independent
- write code that can be extended without big rewrites
