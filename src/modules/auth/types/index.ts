import { z } from 'zod';
import { UserRoleSchema, UserSchema } from '~/src/modules/users/dto/user.dto';

export interface IReserveClaim {
  iat: number;
  exp: number;
  sub: string;
}
export interface IAccessPayload extends IReserveClaim {
  role: z.infer<typeof UserRoleSchema>;
}

export interface IRefreshPayload extends IReserveClaim {}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Partial<Omit<z.infer<typeof UserSchema>, 'passwordHash'>>;
}
