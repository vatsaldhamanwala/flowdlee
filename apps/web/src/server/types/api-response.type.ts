import type { ValidationIssue } from '../helpers/validation-error';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  status: number;
  data: T | null;
  error: string | ValidationIssue[] | null;
  timestamp: string;
};
