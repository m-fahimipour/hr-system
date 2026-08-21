import { z } from 'zod';

export const RefreshTokenSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  expiresAt: z.date(),
  revokedAt: z.date().nullable(),
});
