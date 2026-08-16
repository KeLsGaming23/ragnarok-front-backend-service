/**
 * Authentication Input Validation Schemas (Zod)
 */
import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(4, 'Username must be at least 4 characters')
    .max(23, 'Username cannot exceed 23 characters (rAthena limit)')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .max(50, 'Email cannot exceed 50 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(32, 'Password cannot exceed 32 characters'),
  confirmPassword: z
    .string({ required_error: 'Confirm password is required' }),
  sex: z
    .enum(['M', 'F'], { invalid_type_error: 'Gender must be M or F' })
    .default('M')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(1, 'Username is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});
