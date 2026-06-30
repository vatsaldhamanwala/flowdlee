-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'OFFICE', 'HYBRID', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkStyle" AS ENUM ('CODING', 'DEEP_FOCUS', 'MEETINGS_HEAVY', 'CREATIVE', 'MIXED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FocusSessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('SHORT', 'LONG', 'EYE_REST', 'STRETCH', 'HYDRATION', 'WALK', 'BREATHING');

-- CreateEnum
CREATE TYPE "BreakSessionStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'TAKEN', 'SKIPPED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BREAK_REMINDER', 'EYE_REST', 'STRETCH', 'DAILY_SUMMARY', 'FOCUS_COMPLETE', 'AI_SUMMARY_READY', 'SUBSCRIPTION_UPDATE');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "DailyPlanStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatarUrl" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_responses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workMode" "WorkMode" NOT NULL,
    "workStyle" "WorkStyle" NOT NULL,
    "wellnessGoals" TEXT[],
    "breakPreference" TEXT NOT NULL,
    "notificationPreference" TEXT NOT NULL,
    "workingDays" TEXT[],
    "workStartTime" TEXT NOT NULL,
    "workEndTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workMode" "WorkMode" NOT NULL,
    "workStartTime" TEXT NOT NULL,
    "workEndTime" TEXT NOT NULL,
    "workingDays" TEXT[],
    "timezone" TEXT NOT NULL,
    "focusDurationMinutes" INTEGER NOT NULL DEFAULT 50,
    "shortBreakDurationMinutes" INTEGER NOT NULL DEFAULT 10,
    "longBreakDurationMinutes" INTEGER NOT NULL DEFAULT 20,
    "longBreakAfterSessions" INTEGER NOT NULL DEFAULT 4,
    "eyeRestIntervalMinutes" INTEGER NOT NULL DEFAULT 25,
    "stretchIntervalMinutes" INTEGER NOT NULL DEFAULT 90,
    "notificationType" TEXT NOT NULL,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dailySummaryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "theme" "ThemePreference" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planDate" TIMESTAMP(3) NOT NULL,
    "status" "DailyPlanStatus" NOT NULL DEFAULT 'PLANNED',
    "totalPlannedMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalCompletedMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyPlanId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "estimatedMinutes" INTEGER,
    "actualMinutes" INTEGER,
    "dueTime" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "useForAiPlanning" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "dailyPlanId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "totalPausedSeconds" INTEGER NOT NULL DEFAULT 0,
    "plannedDurationMinutes" INTEGER NOT NULL,
    "actualDurationMinutes" INTEGER,
    "status" "FocusSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "moodBefore" TEXT,
    "moodAfter" TEXT,
    "distractionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "break_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "focusSessionId" TEXT,
    "breakType" "BreakType" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "plannedDurationMinutes" INTEGER NOT NULL,
    "actualDurationMinutes" INTEGER,
    "status" "BreakSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "suggestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "break_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalFocusMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalBreakMinutes" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "tasksSkipped" INTEGER NOT NULL DEFAULT 0,
    "breaksTaken" INTEGER NOT NULL DEFAULT 0,
    "breaksSkipped" INTEGER NOT NULL DEFAULT 0,
    "averageFocusSessionMinutes" INTEGER NOT NULL DEFAULT 0,
    "productivityScore" INTEGER NOT NULL DEFAULT 0,
    "breakHealthScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_responses_userId_key" ON "onboarding_responses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "daily_plans_userId_idx" ON "daily_plans"("userId");

-- CreateIndex
CREATE INDEX "daily_plans_planDate_idx" ON "daily_plans"("planDate");

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_userId_planDate_key" ON "daily_plans"("userId", "planDate");

-- CreateIndex
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

-- CreateIndex
CREATE INDEX "tasks_dailyPlanId_idx" ON "tasks"("dailyPlanId");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "focus_sessions_userId_idx" ON "focus_sessions"("userId");

-- CreateIndex
CREATE INDEX "focus_sessions_taskId_idx" ON "focus_sessions"("taskId");

-- CreateIndex
CREATE INDEX "focus_sessions_status_idx" ON "focus_sessions"("status");

-- CreateIndex
CREATE INDEX "focus_sessions_startedAt_idx" ON "focus_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "break_sessions_userId_idx" ON "break_sessions"("userId");

-- CreateIndex
CREATE INDEX "break_sessions_focusSessionId_idx" ON "break_sessions"("focusSessionId");

-- CreateIndex
CREATE INDEX "break_sessions_status_idx" ON "break_sessions"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_scheduledAt_idx" ON "notifications"("scheduledAt");

-- CreateIndex
CREATE INDEX "daily_analytics_userId_idx" ON "daily_analytics"("userId");

-- CreateIndex
CREATE INDEX "daily_analytics_date_idx" ON "daily_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_analytics_userId_date_key" ON "daily_analytics"("userId", "date");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_dailyPlanId_fkey" FOREIGN KEY ("dailyPlanId") REFERENCES "daily_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_dailyPlanId_fkey" FOREIGN KEY ("dailyPlanId") REFERENCES "daily_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "break_sessions" ADD CONSTRAINT "break_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "break_sessions" ADD CONSTRAINT "break_sessions_focusSessionId_fkey" FOREIGN KEY ("focusSessionId") REFERENCES "focus_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_analytics" ADD CONSTRAINT "daily_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
