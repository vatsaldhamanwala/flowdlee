# Non-Functional Requirements

## Performance

- Dashboard should load quickly.
- Common queries should use database indexes.
- History APIs should support pagination.
- Daily analytics should be precomputed later.

## Reliability

- Active focus sessions should recover after page refresh.
- Background reminders should not depend only on frontend timers.
- Duplicate actions should be handled safely.

## Security

- Passwords must be hashed.
- APIs must be protected.
- Input should be validated.
- AI should not receive sensitive user data.
- Billing webhooks should be verified.

## Scalability

- Next.js handles web UI and API routes.
- A separate worker handles BullMQ background jobs.
- Backend APIs should be reusable by a future mobile app.

## Maintainability

- Route handlers should stay thin.
- Business logic should live in server services.
- Database logic should live in repositories.
