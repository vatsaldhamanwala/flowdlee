import { ZodError } from 'zod';
import { errorResponse } from './api-response';
import { ERROR, VALIDATION } from '@/constants/api-response-error-messages';
import { ApiError } from 'next/dist/server/api-utils';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse(VALIDATION.FAILED, StatusCodes.BAD_REQUEST, error.issues.map((issue) => issue.message).join(', '));
  }

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.stack || null);
  }

  if (error instanceof Error) {
    return errorResponse(error.message || ERROR.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR, error.stack || null);
  }

  return errorResponse(ERROR.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occurred');
}
