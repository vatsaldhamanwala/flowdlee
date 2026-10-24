import { z } from 'zod';
import { ValidationError } from './validation-error';

// method 1 -> for validating request--------
// export async function validateRequest<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
//   const body = await request.json();

//   const result = schema.safeParse(body);

//   if (!result.success) {
//     throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request.', 400);
//   }

//   return result.data;
// }

export async function validateRequest<S extends z.ZodType>(request: Request, schema: S): Promise<z.output<S>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError('Request body must be valid JSON.', 400);
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.map(String).join('.'),
      message: issue.message,
    }));

    throw new ValidationError(details[0]?.message ?? 'Invalid request.', 400, details);
  }

  return result.data;
}
