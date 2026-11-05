import { OnboardingResponse } from '@/generated/prisma';
import { OnboardingResponseDTO } from './dto/onboarding-responses.dto';

export function toOnboardingResponseDTO(onboardingResponse: OnboardingResponse): OnboardingResponseDTO {
  return {
    workMode: onboardingResponse.workMode,
    workStartTime: onboardingResponse.workStartTime,
    workEndTime: onboardingResponse.workEndTime,
    workingDays: onboardingResponse.workingDays,
    timezone: onboardingResponse.timezone,
    workStyle: onboardingResponse.workStyle,
    wellnessGoals: onboardingResponse.wellnessGoals,
    breakRhythm: onboardingResponse.breakRhythm,
    customFocusMinutes: onboardingResponse.customFocusMinutes,
    customBreakMinutes: onboardingResponse.customBreakMinutes,
    reminderStyle: onboardingResponse.reminderStyle,
    createdAt: onboardingResponse.createdAt,
    updatedAt: onboardingResponse.updatedAt,
  };
}
