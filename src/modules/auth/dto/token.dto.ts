import { IReserveClaim } from '~/src/modules/auth/types';
import { TUser, TUserRole } from '~/src/modules/users/types/user.type';

export class AccessTokenPayloadDto implements Partial<IReserveClaim> {
  sub: string;
  sid: string;
  role?: TUserRole;

  constructor(user: TUser, sessionId: string) {
    this.sub = user.id;
    this.sid = sessionId;
    this.role = user.role;
  }
}
