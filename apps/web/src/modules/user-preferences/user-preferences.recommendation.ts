import { BreakRhythm, ReminderStyle, ThemePreference, Weekday, WellnessGoal, WorkMode, WorkStyle } from '@/generated/prisma';
import { UpsertUserPreferenceInputDTO } from './dto/user-preferences.dto';

// ----------------------------------------------------------------
// INPUT: the onboarding answers this function needs.
// Both a database row and the validated request body fit this shape.
// ----------------------------------------------------------------
export interface UserPreferenceRecommendationInput {
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

// OUTPUT: a full set of preferences (the service adds `source`)
export type RecommendedPreferences = Omit<UpsertUserPreferenceInputDTO, 'source'>;

// will used this interface using map
interface Rhythm {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
}

// ----------------------------------------------------------------
// RULE TABLES: change the numbers here, the logic below stays the same
// ----------------------------------------------------------------
const PRESET_RHYTHMS: Record<'FOCUS_25' | 'FOCUS_45' | 'FOCUS_60', Rhythm> = {
  FOCUS_25: { focusDurationMinutes: 25, shortBreakDurationMinutes: 5 },
  FOCUS_45: { focusDurationMinutes: 45, shortBreakDurationMinutes: 10 },
  FOCUS_60: { focusDurationMinutes: 60, shortBreakDurationMinutes: 15 },
};

const SMART_RHYTHM_BY_WORK_STYLE: Record<WorkStyle, Rhythm> = {
  CODING: { focusDurationMinutes: 50, shortBreakDurationMinutes: 10 },
  DEEP_FOCUS: { focusDurationMinutes: 60, shortBreakDurationMinutes: 15 },
  MEETINGS_HEAVY: { focusDurationMinutes: 25, shortBreakDurationMinutes: 5 },
  CREATIVE: { focusDurationMinutes: 45, shortBreakDurationMinutes: 10 },
  MIXED: { focusDurationMinutes: 45, shortBreakDurationMinutes: 10 },
};

// here see numbers as minutes----
const STRETCH_INTERVAL_BY_WORK_MODE: Record<WorkMode, number> = {
  REMOTE: 60,
  FREELANCE: 60,
  HYBRID: 75,
  OFFICE: 90,
};

const DEFAULT_RHYTHM: Rhythm = { focusDurationMinutes: 50, shortBreakDurationMinutes: 10 };

const EYE_REST_SCREEN_HEAVY = 25;
const EYE_REST_DEFAULT = 40;
const STRETCH_POSTURE_BONUS = 30;
const STRETCH_MINIMUM = 45;

// keep a number between min and max
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// ----------------------------------------------------------------
// RULE 1: to get focus + short break from given cases
// ----------------------------------------------------------------
function pickRhythm(answers: UserPreferenceRecommendationInput): Rhythm {
  switch (answers.breakRhythm) {
    case BreakRhythm.FOCUS_25:
    case BreakRhythm.FOCUS_45:
    case BreakRhythm.FOCUS_60:
      return PRESET_RHYTHMS[answers.breakRhythm]; // eg. -> if user pick case FOCUS_25 -> return -> {25 , 5 }

    case BreakRhythm.SMART:
      return SMART_RHYTHM_BY_WORK_STYLE[answers.workStyle];

    case BreakRhythm.CUSTOM:
      // Zod validates that CUSTOM should always have both numbers focus and break -> so DEFAULT_RHYTHM are for backup safety
      return {
        focusDurationMinutes: answers.customFocusMinutes ?? DEFAULT_RHYTHM.focusDurationMinutes,
        shortBreakDurationMinutes: answers.customBreakMinutes ?? DEFAULT_RHYTHM.shortBreakDurationMinutes,
      };

    default: {
      // if a new BreakRhythm is ever added and not handled above -> typeScript gives errors here
      const unhandled: never = answers.breakRhythm;
      throw new Error(`Unhandled break rhythm: ${unhandled}`);
    }
  }
}

// ----------------------------------------------------------------
// THE MAIN FUNCTION to store user choices and return the output
// ----------------------------------------------------------------
export function recommendPreferences(answers: UserPreferenceRecommendationInput): RecommendedPreferences {
  const wellnessGoals = new Set(answers.wellnessGoals);
  const rhythm = pickRhythm(answers);

  // RULE 2: long break = short break x 2, between 15 and 30
  const longBreakDurationMinutes = clamp(rhythm.shortBreakDurationMinutes * 2, 15, 30);

  // RULE 3: long break after 4 sessions (3 for long focus), one sooner when stress is a goal
  let longBreakAfterSessions = rhythm.focusDurationMinutes >= 60 ? 3 : 4;
  if (wellnessGoals.has(WellnessGoal.STRESS_LEVEL)) {
    longBreakAfterSessions = Math.max(2, longBreakAfterSessions - 1);
  }

  // RULE 4: eye rest; off if the regular break would come first anyway
  const isScreenHeavy = wellnessGoals.has(WellnessGoal.EYE_COMFORT) || answers.workStyle === WorkStyle.CODING;
  const eyeRest = isScreenHeavy ? EYE_REST_SCREEN_HEAVY : EYE_REST_DEFAULT;

  // eg1:- eye rest 25, focus 50 → 25 is less than 50 → 25 (keep it)
  // eg2:- eye rest 40, focus 25 → 40 isn’t less than 25 → null (off, because the break arrives first and already rests the eyes)
  const eyeRestIntervalMinutes = eyeRest < rhythm.focusDurationMinutes ? eyeRest : null;

  // RULE 5: stretch by work mode, more often for posture or long sitting
  let stretchIntervalMinutes = STRETCH_INTERVAL_BY_WORK_MODE[answers.workMode];

  if (wellnessGoals.has(WellnessGoal.BACK_POSTURE) || wellnessGoals.has(WellnessGoal.LONG_SITTING)) {
    stretchIntervalMinutes = Math.max(STRETCH_MINIMUM, stretchIntervalMinutes - STRETCH_POSTURE_BONUS);
  }

  // RULE 6: a daily summary helps close the day on time
  const dailySummaryEnabled = wellnessGoals.has(WellnessGoal.WORK_LIFE_BALANCE);

  // RULE 7: copy what the user chose directly
  return {
    workMode: answers.workMode,
    workStartTime: answers.workStartTime,
    workEndTime: answers.workEndTime,
    workingDays: answers.workingDays,
    timezone: answers.timezone,
    breakRhythm: answers.breakRhythm,
    focusDurationMinutes: rhythm.focusDurationMinutes,
    shortBreakDurationMinutes: rhythm.shortBreakDurationMinutes,
    longBreakDurationMinutes,
    longBreakAfterSessions,
    eyeRestIntervalMinutes,
    stretchIntervalMinutes,
    reminderStyle: answers.reminderStyle,
    dailySummaryEnabled,
    theme: ThemePreference.SYSTEM,
  };
}
