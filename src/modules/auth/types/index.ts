import { UserResponseDto } from '~/src/modules/users/dto/user.dto';
import { TUser } from '~/src/modules/users/types/user.type';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
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
