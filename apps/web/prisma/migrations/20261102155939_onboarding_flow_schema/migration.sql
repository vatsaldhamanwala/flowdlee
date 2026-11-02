/*
  Warnings:

  - You are about to drop the column `breakPreference` on the `onboarding_responses` table. All the data in the column will be lost.
  - You are about to drop the column `notificationPreference` on the `onboarding_responses` table. All the data in the column will be lost.
  - The `wellnessGoals` column on the `onboarding_responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `workingDays` column on the `onboarding_responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `workStartTime` on the `onboarding_responses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `workEndTime` on the `onboarding_responses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - Added the required column `breakRhythm` to the `onboarding_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderStyle` to the `onboarding_responses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WellnessGoal" AS ENUM ('EYE_COMFORT', 'BACK_POSTURE', 'STRESS_LEVEL', 'LONG_SITTING', 'FOCUS_CONSISTENCY', 'WORK_LIFE_BALANCE');

-- CreateEnum
CREATE TYPE "BreakRhythm" AS ENUM ('FOCUS_25', 'FOCUS_45', 'FOCUS_60', 'SMART', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReminderStyle" AS ENUM ('SILENT', 'BROWSER', 'SOUND_AND_BROWSER', 'FULLSCREEN_NUDGE');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- AlterTable
ALTER TABLE "onboarding_responses" DROP COLUMN "breakPreference",
DROP COLUMN "notificationPreference",
ADD COLUMN     "breakRhythm" "BreakRhythm" NOT NULL,
ADD COLUMN     "customBreakMinutes" INTEGER,
ADD COLUMN     "customFocusMinutes" INTEGER,
ADD COLUMN     "reminderStyle" "ReminderStyle" NOT NULL,
DROP COLUMN "wellnessGoals",
ADD COLUMN     "wellnessGoals" "WellnessGoal"[] DEFAULT ARRAY[]::"WellnessGoal"[],
DROP COLUMN "workingDays",
ADD COLUMN     "workingDays" "Weekday"[],
ALTER COLUMN "workStartTime" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "workEndTime" SET DATA TYPE VARCHAR(5);
