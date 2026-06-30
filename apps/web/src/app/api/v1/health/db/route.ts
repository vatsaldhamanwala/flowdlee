import { successResponse, errorResponse } from '@/server/helpers/api-response';
import { prisma } from '@/server/db/prisma';
import { APP } from '@/constants/api-response-error-messages';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return successResponse({ database: 'connected' }, APP.DB_HEALTH);
  } catch (error) {
    return errorResponse(APP.DB_NOT_HEALTH, 500, error instanceof Error ? error.message : 'Unknown error');
  }
}
