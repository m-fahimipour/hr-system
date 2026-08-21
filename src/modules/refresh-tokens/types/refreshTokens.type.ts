import { z } from 'zod';
import { RefreshTokenSchema } from '~/src/modules/refresh-tokens/dto/refreshTokens.dto';

export type TRefreshToken = z.infer<typeof RefreshTokenSchema>;
