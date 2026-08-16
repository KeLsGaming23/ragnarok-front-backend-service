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

export const deleteItemSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be an integer')
    .min(1, 'Amount must be at least 1')
    .optional()
    .default(1)
});

export const sendItemMailSchema = z.object({
  recipientName: z
    .string({ required_error: 'Recipient character name is required' })
    .min(1, 'Recipient character name is required')
    .max(24, 'Character name cannot exceed 24 characters'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be an integer')
    .min(1, 'Amount must be at least 1')
    .optional()
    .default(1),
  title: z
    .string()
    .max(45, 'Title cannot exceed 45 characters')
    .optional(),
  message: z
    .string()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
});
