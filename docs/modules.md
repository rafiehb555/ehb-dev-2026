# EHB Technologies Modules

## Purpose

This document lists the main module structure for EHB Technologies so the system stays organized as it grows.

## Current Starter Module

### User Module

The starter backend module created in this setup is:

- `user`

Its files are:

- `user.model.js` for MongoDB schema and data structure
- `user.service.js` for business logic
- `user.controller.js` for request and response handling
- `user.routes.js` for Express endpoints

## Recommended Future Modules

As the EHB platform grows, new modules should be added inside `backend/src/modules/`.

Suggested modules:

- `auth` for login, register, token, and access control
- `marketplace` for product and service listings
- `orders` for purchases and checkout logic
- `payments` for payment integration
- `blockchain` for blockchain verification and logs
- `ai` for AI requests, prompts, and model integrations
- `notifications` for system alerts and user messaging
- `analytics` for reports and usage tracking

## Module Rules

Each module should follow the same pattern whenever possible:

- model
- service
- controller
- routes

Optional extra files can be added later when needed:

- validator
- repository
- constants
- helper

## Why This Matters

Using modules makes the project easier to:

- understand
- maintain
- test
- scale

It also works well with AI-assisted development because the AI can focus on one module at a time without changing unrelated parts of the system.
