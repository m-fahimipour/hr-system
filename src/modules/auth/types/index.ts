import { TUser, TUserRole } from '~/src/modules/users/types/user.type';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

export interface IReserveClaim {
  iat: number;
  exp: number;
  sub: string;
}

export interface IRefreshProps {
  userInfo: TUser;
  sid: string;
  jti: string;
}

export interface IRefreshTokenPayload extends IReserveClaim {
  sid: string;
  jti: string;
}

export interface IAccessTokenPayload extends IReserveClaim {
  sid: string;
  role: TUserRole;
}
