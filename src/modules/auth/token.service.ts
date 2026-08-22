import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { classToPlainObject } from '~/src/helpers';
import {
  AccessTokenPayloadDto,
  RefreshTokenPayloadDto,
} from '~/src/modules/auth/dto/token.dto';

@Injectable()
export class TokenService {
  accessTokenConfig = {
    algorithm: process.env.JWT_ALGORITHM as JwtSignOptions['algorithm'],
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: (Number(process.env.JWT_ACCESS_EXP) / 1000 ||
      '15m') as JwtSignOptions['expiresIn'], // number value should be in second
  };

  refreshTokenConfig = {
    algorithm: process.env.JWT_ALGORITHM as JwtSignOptions['algorithm'],
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: (Number(process.env.JWT_REFRESH_EXP) / 1000 ||
      '30d') as JwtSignOptions['expiresIn'], // number value should be in second
  };

  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AccessTokenPayloadDto) {
    const accessToken = this.jwtService.sign(
      classToPlainObject(payload),
      this.accessTokenConfig,
    );

    return accessToken;
  }

  generateRefreshToken(payload: RefreshTokenPayloadDto) {
    const refreshToken = this.jwtService.sign(
      classToPlainObject(payload),
      this.refreshTokenConfig,
    );

    return refreshToken;
  }
}
