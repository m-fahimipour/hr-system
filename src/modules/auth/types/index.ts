import { TUser } from '~/src/modules/users/types/user.type';

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
