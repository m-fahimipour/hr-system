import { UserResponseDto } from '~/src/modules/users/dto/user.dto';

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