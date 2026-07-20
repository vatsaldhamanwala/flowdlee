import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userRegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.email('Please enter a valid email address').trim().toLowerCase(),
    password: z.string().regex(PASSWORD_REGEX, 'Password must contain uppercase, lowercase, number and special character.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const userLoginSchema = z.object({
  email: z.email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// export const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
// });

// export const resetPasswordSchema = z
//   .object({
//     password: z.string().min(8, 'Password must be at least 8 characters').max(20, 'Password must be at most 20 characters'),
//     confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters').max(20, 'Confirm Password must be at most 20 characters'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   });

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
// export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
// export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
