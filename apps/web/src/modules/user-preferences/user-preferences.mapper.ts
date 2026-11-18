import { UserPreference } from '@/generated/prisma';
import { UserPreferenceResponseDTO } from './dto/user-preferences.dto';

export function toUserPreferenceResponseDTO(userPreference: UserPreference): UserPreferenceResponseDTO {
  return {
    workMode: userPreference.workMode,
    workStartTime: userPreference.workStartTime,
    workEndTime: userPreference.workEndTime,
    workingDays: userPreference.workingDays,
    timezone: userPreference.timezone,
    breakRhythm: userPreference.breakRhythm,
    focusDurationMinutes: userPreference.focusDurationMinutes,
    shortBreakDurationMinutes: userPreference.shortBreakDurationMinutes,
    longBreakDurationMinutes: userPreference.longBreakDurationMinutes,
    longBreakAfterSessions: userPreference.longBreakAfterSessions,
    eyeRestIntervalMinutes: userPreference.eyeRestIntervalMinutes,
    stretchIntervalMinutes: userPreference.stretchIntervalMinutes,
    reminderStyle: userPreference.reminderStyle,
    dailySummaryEnabled: userPreference.dailySummaryEnabled,
    theme: userPreference.theme,
    source: userPreference.source,
    createdAt: userPreference.createdAt.toISOString(),
    updatedAt: userPreference.updatedAt.toISOString(),
  };
}
