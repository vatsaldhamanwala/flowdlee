import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userRegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.email('Please enter a valid email address').trim().trim().toLowerCase().max(254, 'Email must be less than 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
      .regex(PASSWORD_REGEX, 'Password must contain uppercase, lowercase, number and special character.'),
  })
  .strict(); // prevent unknown or unexpected fields (e.g. someone sending isEmailVerified: true)

export const userLoginSchema = z.object({
  email: z.email('Please enter a valid email address').trim().trim().toLowerCase().max(254, 'Email must be less than 255 characters'),
  password: z.string().min(1, 'Password is required'),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
