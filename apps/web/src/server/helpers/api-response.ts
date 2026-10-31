import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/server/types/api-response.type';
import type { ValidationIssue } from './validation-error';

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    status,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(message = 'Something went wrong', status = 500, error: string | ValidationIssue[] | null = null) {
  const response: ApiResponse<null> = {
    success: false,
    message,
    status,
    data: null,
    error,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}
