# Project Code Conventions

To keep the codebase maintainable, we strictly enforce these rules:

## 1. No Magic Strings or Numbers

Never write inline status numbers or raw string variables. Use the centralized tracking configurations:

- HTTP Codes: http-status-codes package -> `StatusCodes.OK`, `StatusCodes.BAD_REQUEST`, etc.
- Auth configurations: `AUTH.BEARER_PREFIX`

## 2. Structured Logging

Do not use `console.log`. Use our centralized wrapper interface:

```ts
logger.info('User logged in successfully', { userId: user.id });
logger.error('Database sync failed', error);
```
