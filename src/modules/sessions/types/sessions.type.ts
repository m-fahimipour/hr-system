import { z } from 'zod';
import {
  CreateSessionSchema,
  RevokedReasonEnum,
  SessionSchema,
} from '~/src/modules/sessions/dto/sessions.dto';

export type TSession = z.infer<typeof SessionSchema>;
export type TRevokedReason = z.infer<typeof RevokedReasonEnum>;

export type TCreateSession = z.infer<typeof CreateSessionSchema>;
