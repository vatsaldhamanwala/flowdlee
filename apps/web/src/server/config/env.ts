import { z } from 'zod';

const envSchema = z.object({
  // database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),

  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default('Flowdlee'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  // Authentication
  JWT_ACCESS_SECRET: z.string().min(32, 'Access secret should be at least 32 characters for security'),
  JWT_REFRESH_SECRET: z.string().min(32, 'Refresh secret should be at least 32 characters for security'),

  // Third-Party Services (Optional for now so the app boots without them)

  // Node Environment

  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

// Run the validation
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));

  // Crash the app immediately if environment variables are missing/wrong
  process.exit(1);
}

export const env = parsed.data;
