import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { IRefreshPayload } from '~/src/modules/auth/types';
import { TUser } from '~/src/modules/users/types/user.type';
import { UsersService } from '~/src/modules/users/users.service';

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  'refresh-token-jwt',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJWTStrategy.ExtractJWTFromCookie,
      ]),
      algorithms: [
        process.env.JWT_ALGORITHM,
      ] as StrategyOptionsWithoutRequest['algorithms'],
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: IRefreshPayload): Promise<TUser> {
    const user = await this.usersService.findOne(payload.sub);

    return user;
  }

  private static ExtractJWTFromCookie(request: Request) {
    const refreshToken = request.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new ForbiddenException('unAuthorize!!!');
    }

    return refreshToken;
  }
}
