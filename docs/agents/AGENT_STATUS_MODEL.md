# EHB Agent Status Model

This file defines the shared lifecycle states for EHB agents.

## Standard statuses

- `idle`
- `reading-context`
- `planning`
- `waiting-for-input`
- `working`
- `verifying`
- `blocked`
- `failed`
- `completed`

## Meaning

### `idle`
No active work.

### `reading-context`
The agent is collecting files, docs, or code context.

### `planning`
The agent is deciding how to handle the task.

### `waiting-for-input`
The agent needs a user answer or approval.

### `working`
The agent is actively producing output or implementation.

### `verifying`
The agent is checking correctness, build status, routes, or validation rules.

### `blocked`
The agent cannot continue because of a dependency, conflict, or missing resource.

### `failed`
The task failed and needs retry or manual intervention.

### `completed`
The task reached its expected outcome and verification is done.
