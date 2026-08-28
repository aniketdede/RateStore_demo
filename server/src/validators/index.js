import { z } from 'zod';

// Shared validation — used by both server (express) and client (React forms)
// Mirrors DB CHECK constraints so validation holds at all layers.

export const nameSchema = z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters');

export const emailSchema = z.string().email('Invalid email format').min(3).max(255);

export const addressSchema = z.string().max(400, 'Address must be at most 400 characters');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const ratingValueSchema = z.number().int().min(1).max(5, 'Rating must be between 1 and 5');

export const userCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'USER', 'OWNER']).optional().default('USER'),
});

export const storeCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().uuid().optional().nullable(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});
