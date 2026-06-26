import { APP } from '@/constants/api-response-error-messages';
import { appConfig } from '@/server/config/app.config';
import { successResponse } from '@/server/helpers/api-response';

export async function GET() {
  return successResponse(
    {
      app: appConfig.name,
      status: 'healthy',
      environment: appConfig.env,
      uptime: process.uptime(),
    },
    APP.RUNNING,
  );
}
