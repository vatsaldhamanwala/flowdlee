import { z } from 'zod';

export const userRegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be less than 80 characters').optional(),
    email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(20, 'Password must be at most 20 characters'),
    confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters').max(20, 'Confirm Password must be at most 20 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
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

export type userRegisterInput = z.infer<typeof userRegisterSchema>;
export type userLoginInput = z.infer<typeof userLoginSchema>;
// export type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
// export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
