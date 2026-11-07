import { BreakRhythm, ReminderStyle, Weekday, WellnessGoal, WorkMode, WorkStyle } from '@/generated/prisma';
import { z } from 'zod';

// "09:00" OK, "9:00" not OK, "24:00" not OK
const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

// Intl throws if the timezone name doesn't exist (e.g. "Asia/Nowhere")
function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

// Removes duplicates: ["MON","MON","TUE"] -> ["MON","TUE"]
const unique = <T>(items: T[]) => [...new Set(items)];

export const onboardingResponsesSchema = z
  .object({
    workMode: z.enum(WorkMode, { error: 'Please choose where you usually work.' }),

    workStartTime: z.string().regex(TIME_HH_MM, 'Start time must look like 09:00.'),
    workEndTime: z.string().regex(TIME_HH_MM, 'End time must look like 17:00.'),
    workingDays: z
      .array(z.enum(Weekday, { error: 'Unknown working day.' }))
      .min(1, 'Pick at least one working day.')
      .transform(unique),
    timezone: z.string().trim().refine(isValidTimeZone, 'Please choose a valid timezone.'),

    workStyle: z.enum(WorkStyle, { error: 'Please choose your main type of work.' }),

    // optional: missing means "skipped"
    wellnessGoals: z
      .array(z.enum(WellnessGoal, { error: 'Unknown wellness goal.' }))
      .default([])
      .transform(unique),

    breakRhythm: z.enum(BreakRhythm, { error: 'Please choose a break rhythm.' }),
    customFocusMinutes: z.number().int().min(15).max(120).optional(),
    customBreakMinutes: z.number().int().min(5).max(30).optional(),

    reminderStyle: z.enum(ReminderStyle, { error: 'Please choose how you want to be reminded.' }),
  })
  // Decision 1: a shift may cross midnight (22:00 -> 06:00), but start and end can't be equal
  .refine((data) => data.workStartTime !== data.workEndTime, {
    message: 'Start and end time cannot be the same.',
    path: ['workEndTime'],
  })
  // "Custom" needs both numbers
  .superRefine((data, ctx) => {
    if (data.breakRhythm !== BreakRhythm.CUSTOM) return;

    if (data.customFocusMinutes === undefined) {
      ctx.addIssue({ code: 'custom', message: 'Choose how long you want to focus.', path: ['customFocusMinutes'] });
    }
    if (data.customBreakMinutes === undefined) {
      ctx.addIssue({ code: 'custom', message: 'Choose how long your break should be.', path: ['customBreakMinutes'] });
    }
  })
  // Not "Custom"? Then throw away any custom numbers the client sent, and store null
  .transform(({ customFocusMinutes, customBreakMinutes, ...rest }) => {
    const isCustom = rest.breakRhythm === BreakRhythm.CUSTOM;

    return {
      ...rest,
      customFocusMinutes: isCustom ? (customFocusMinutes ?? null) : null,
      customBreakMinutes: isCustom ? (customBreakMinutes ?? null) : null,
    };
  });

export type OnboardingResponseInput = z.infer<typeof onboardingResponsesSchema>;
