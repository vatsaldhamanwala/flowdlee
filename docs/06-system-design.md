# System Design

Flowdlee uses Next.js as a full-stack application.

Architecture:

Browser
↓
Next.js App Router
↓
Route Handlers / Server Services
↓
PostgreSQL with Prisma

For background reminders:

Next.js Server
↓
BullMQ Queue
↓
Redis
↓
Separate Worker App
↓
PostgreSQL / Notifications / Analytics
