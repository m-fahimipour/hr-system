import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { IAccessPayload } from '~/src/modules/auth/types';
import { TUser } from '~/src/modules/users/types/user.type';
import { UsersService } from '~/src/modules/users/users.service';

@Injectable()
export class AccessJWTStrategy extends PassportStrategy(
  Strategy,
  'access-token-jwt',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      algorithms: [
        process.env.JWT_ALGORITHM,
      ] as StrategyOptionsWithoutRequest['algorithms'],
    });
  }

  async validate(payload: IAccessPayload): Promise<TUser> {
    const user = await this.usersService.findOne(payload.sub);

    return user;
  }
}
