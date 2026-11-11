/*
  Warnings:

  - You are about to drop the column `notificationType` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `soundEnabled` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to alter the column `workStartTime` on the `user_preferences` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `workEndTime` on the `user_preferences` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - The `workingDays` column on the `user_preferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `reminderStyle` to the `user_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserPreferenceSource" AS ENUM ('RECOMMENDED', 'USER');

-- AlterTable
ALTER TABLE "user_preferences" DROP COLUMN "notificationType",
DROP COLUMN "soundEnabled",
ADD COLUMN     "breakRhythm" "BreakRhythm" NOT NULL DEFAULT 'SMART',
ADD COLUMN     "reminderStyle" "ReminderStyle" NOT NULL,
ADD COLUMN     "source" "UserPreferenceSource" NOT NULL DEFAULT 'RECOMMENDED',
ALTER COLUMN "workStartTime" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "workEndTime" SET DATA TYPE VARCHAR(5),
DROP COLUMN "workingDays",
ADD COLUMN     "workingDays" "Weekday"[],
ALTER COLUMN "eyeRestIntervalMinutes" DROP NOT NULL,
ALTER COLUMN "stretchIntervalMinutes" DROP NOT NULL;
