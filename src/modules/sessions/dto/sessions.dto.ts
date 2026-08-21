import { z } from 'zod';

// Schema
export const RevokedReasonEnum = z.enum([
  'LOGOUT',
  'LOGOUT_ALL',
  'ADMIN_REVOKED',
  'PASSWORD_CHANGED',
  'ACCOUNT_DISABLED',
  'REFRESH_TOKEN_REUSE',
  'SECURITY_POLICY',
]);

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  lastSeenAt: z.date(),
  expiresAt: z.date(),
  revokedAt: z.date().nullable(),
  revokedReason: RevokedReasonEnum,
});

export const CreateSessionSchema = SessionSchema.pick({
  userId: true,
  ipAddress: true,
  userAgent: true,
});
