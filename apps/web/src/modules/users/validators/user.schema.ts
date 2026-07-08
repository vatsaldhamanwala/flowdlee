import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name must be at most 20 characters'),

  avatarUrl: z.string().url('Avatar URL must be valid').optional(),
});

export type updateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
