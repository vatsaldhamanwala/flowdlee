# Flowdlee

Flowdlee is a calm, AI-ready workday planner and smart break reminder platform for IT professionals.

## Tagline

Plan your day. Protect your focus.

## Problem

Developers and IT professionals often get deeply involved in work and forget to take healthy breaks. This can lead to stress, fatigue, eye strain, back discomfort, and reduced productivity.

## Solution

Flowdlee helps users:

- Plan their workday
- Create daily tasks
- Run focus sessions
- Take healthier breaks
- Receive smart reminders
- Review productivity and wellness analytics
- Use AI to generate a realistic daily plan

## Core Rhythm

Plan → Focus → Pause → Reflect

## Tech Stack

### Web + Backend

- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- Route Handlers
- Server Actions where useful

### Database

- PostgreSQL
- Prisma

### Background Jobs

- Redis
- BullMQ
- Separate worker app

### AI

- AI Daily Plan Generator
- AI Daily Summary later

### Billing

- Free and Pro plans
- Paddle integration later

## Monorepo Structure

```text
flowdlee/
  apps/
    web/
      public/
      src/
        app/
        components/
        constants/
        lib/
        modules/
        server/
        scripts/
        middleware.ts
    worker/
  packages/
    shared/
  docs/
```

## Current Status

Day 6 setup in progress.

## Roadmap

1. Monorepo setup
2. Next.js app setup
3. Backend route structure
4. Authentication
5. Onboarding
6. Preferences
7. Daily planner
8. Focus sessions
9. Break sessions
10. Notifications
11. Redis + BullMQ
12. Analytics
13. AI Daily Plan Generator
14. Pricing and billing
15. Demo mode
16. Deployment
