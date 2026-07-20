import { ZodSchema } from 'zod';
import { ValidationError } from './validation-error';

export async function validateRequest<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json();

  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request.', 400);
  }

  return result.data;
}
