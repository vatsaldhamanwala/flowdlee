import { BreakRhythm, ReminderStyle, ThemePreference, UserPreference, UserPreferenceSource, Weekday, WorkMode } from '@/generated/prisma';

// what api response will send back
export type UserPreferenceResponseDTO = Omit<UserPreference, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

// set of preferences -> which create if not and update if already exist
export interface UpsertUserPreferenceInputDTO {
  workMode: WorkMode;
  workStartTime: string;
  workEndTime: string;
  workingDays: Weekday[];
  timezone: string;
  breakRhythm: BreakRhythm;
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakAfterSessions: number;
  eyeRestIntervalMinutes: number | null;
  stretchIntervalMinutes: number | null;
  reminderStyle: ReminderStyle;
  dailySummaryEnabled: boolean;
  theme: ThemePreference;
  source: UserPreferenceSource;
}

// user change there preferences in settings
// no 'source' filed here because user cannot update to source preference to ->  'RECOMMEND' it has to be 'USER' by itself when updated
export type UpdateUserPreferenceInputDTO = Partial<Omit<UpsertUserPreferenceInputDTO, 'source'>>;
