// import { ZodError } from 'zod';
// import { errorResponse } from './api-response';
// import { ERROR, VALIDATION } from '@/constants/api-response-error-messages';
// import { ApiError } from './api-error';
// import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
// import { ValidationError } from './validation-error';

// export function handleApiError(error: unknown) {
//   if (error instanceof ZodError) {
//     return errorResponse(VALIDATION.FAILED, StatusCodes.BAD_REQUEST, error.issues.map((issue) => issue.message).join(', '));
//   }

//   if (error instanceof ValidationError) {
//     return errorResponse(error.message, error.statusCode, error.stack || null);
//   }

//   if (error instanceof ApiError) {
//     return errorResponse(error.message, error.statusCode, error.stack || null);
//   }

//   if (error instanceof Error) {
//     return errorResponse(error.message || ERROR.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR, error.stack || null);
//   }

//   return errorResponse(ERROR.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occurred');
// }

import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { errorResponse } from './api-response';
import { ERROR, VALIDATION } from '@/constants/api-response-error-messages';
import { ApiError } from './api-error';
import { ValidationError } from './validation-error';

// Stack traces are only for local debugging, never for real clients.
const stackInDev = (error: Error) => (process.env.NODE_ENV === 'development' ? (error.stack ?? null) : null);

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.map(String).join('.'),
      message: issue.message,
    }));
    return errorResponse(VALIDATION.FAILED, StatusCodes.BAD_REQUEST, details);
  }

  if (error instanceof ValidationError) {
    return errorResponse(error.message, error.statusCode, error.details ?? null);
  }

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, stackInDev(error));
  }

  // Anything else is unexpected: log everything, tell the client nothing specific.
  console.error('[api] unexpected error:', error);

  return errorResponse(ERROR.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR, error instanceof Error ? stackInDev(error) : null);
}
