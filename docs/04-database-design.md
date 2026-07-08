# Database Design

Flowdlee uses PostgreSQL with Prisma ORM.

## Main Database Entities

- User
- RefreshToken
- OnboardingResponse
- UserPreference
- DailyPlan
- Task
- FocusSession
- BreakSession
- Notification
- DailyAnalytics
- JobAuditLog
- Plan
- Subscription
- PaymentEvent
- FeatureLimit
- UsageCounter
- AiRequest
- AiOutput
- AiUserSetting

## Current MVP Tables

For the first MVP, we will focus on:

1. users
2. refresh_tokens
3. onboarding_responses
4. user_preferences
5. daily_plans
6. tasks
7. focus_sessions
8. break_sessions
9. notifications
10. daily_analytics

## Relationship Overview

User has many daily plans.

User has many tasks.

DailyPlan has many tasks.

Task can have many focus sessions.

FocusSession can have many break sessions.

User has many notifications.

User has one onboarding response.

User has one preference record.

## Development Approach

During early development, we will use:

```bash
pnpm prisma db push
```

This helps us quickly update tables while the schema is changing.

Later, when schema becomes stable, we will switch to migrations:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

## Important Indexes

Common indexes:

users.email
tasks.userId
tasks.dailyPlanId
tasks.status
focus_sessions.userId
focus_sessions.status
break_sessions.userId
break_sessions.status
notifications.userId
notifications.status
daily_analytics.userId
daily_analytics.date

NOTES:-
The frontend timer is not the source of truth.

Focus and break sessions should always be saved and validated from the backend.
