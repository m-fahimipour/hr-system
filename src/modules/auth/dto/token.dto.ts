import { IReserveClaim } from '~/src/modules/auth/types';
import { TUser, TUserRole } from '~/src/modules/users/types/user.type';

export class AccessTokenPayloadDto implements Partial<IReserveClaim> {
  sub: string;
  sid: string;
  role?: TUserRole;

  constructor(
    private user: TUser,
    private sessionId: string,
  ) {
    this.sub = user.id;
    this.sid = sessionId;
    this.role = user.role;
  }
}

export class RefreshTokenPayloadDto implements Partial<IReserveClaim> {
  sub: string;
  sid: string;
  jti: string;

  constructor(
    private userId: string,
    private sessionId: string,
    private jwtId: string,
  ) {
    this.sub = userId;
    this.sid = sessionId;
    this.jti = jwtId;
  }
}
