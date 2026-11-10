import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { AccessTokenPayloadDto } from '~/src/modules/auth/dto/token.dto';
import { SessionsService } from '~/src/modules/sessions/sessions.service';
import { TUser } from '~/src/modules/users/types/user.type';
import { UsersService } from '~/src/modules/users/users.service';

@Injectable()
export class AccessJWTStrategy extends PassportStrategy(
  Strategy,
  'access-token-jwt',
) {
  constructor(private readonly usersService: UsersService, private readonly sessionsService:SessionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      algorithms: [
        process.env.JWT_ALGORITHM,
      ] as StrategyOptionsWithoutRequest['algorithms'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<TUser> {
    const user = await this.usersService.findOne(payload.sub);

    const session = await this.sessionsService.findOne(payload.sid);

    if (session.revokedAt) throw new UnauthorizedException('Revoked Access!');

    return user;
  }
}
