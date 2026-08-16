/**
 * Account Management Validation Schemas (Zod)
 */
import { z } from 'zod';

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, 'New password must be at least 6 characters')
    .max(32, 'New password cannot exceed 32 characters'),
  confirmNewPassword: z
    .string({ required_error: 'Please confirm your new password' })
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword']
});
