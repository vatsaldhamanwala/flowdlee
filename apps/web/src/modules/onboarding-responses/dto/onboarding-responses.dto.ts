import { OnboardingResponse, WorkMode } from '@/generated/prisma';
import { Weekday, WorkStyle, WellnessGoal, BreakRhythm, ReminderStyle } from '@/generated/prisma';

// omitting id and userId because it already knows who the logged-in user is
export type OnboardingResponseDTO = Omit<OnboardingResponse, 'id' | 'userId'>;

// upsert onboarding responses
// What the repository needs to save onboarding answers
export interface UpsertOnboardingResponseInputDTO {
  workMode: WorkMode;
  workStartTime: string;
  workEndTime: string;
  workingDays: Weekday[];
  timezone: string;
  workStyle: WorkStyle;
  wellnessGoals: WellnessGoal[];
  breakRhythm: BreakRhythm;
  customFocusMinutes: number | null;
  customBreakMinutes: number | null;
  reminderStyle: ReminderStyle;
}
