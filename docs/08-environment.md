# Environment Variables Configuration

## Local Setup

1. Copy `.env.example` to `.env`
2. Add your local secrets.

## Rules

- Never import `process.env` directly in your code.
- Always import `env` from `@/server/config/env`.
- If you add a new key to `.env`, update the validation schema inside `src/server/config/env.ts`.
