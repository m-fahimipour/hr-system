// @NestJS
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '~/src/modules/auth/dto/register.dto';
import { UsersService } from '~/src/modules/users/users.service';

// @Third-Party
import bcrypt from 'bcryptjs';
import { LoginUserDto } from '~/src/modules/auth/dto/login.dto';
import { TUser } from '~/src/modules/users/types/user.type';
import { SessionsService } from '~/src/modules/sessions/sessions.service';
import {
  AccessTokenPayloadDto,
  RefreshTokenPayloadDto,
} from '~/src/modules/auth/dto/token.dto';

import { v4 as uuidV4 } from 'uuid';
import { TokenService } from '~/src/modules/auth/token.service';
import { RefreshTokensService } from '~/src/modules/refresh-tokens/refreshTokens.service';
import { Request } from 'express';
import { UserResponseDto } from '~/src/modules/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly sessionsService: SessionsService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async register(registerUserDto: RegisterUserDto, request: Request) {
    const jti = uuidV4();

    // Create User
    const user = await this.usersService.create(registerUserDto);

    const session = await this.sessionsService.create({
      userId: user.id,
      userAgent: request.headers['user-agent'] || null,
      ipAddress: '',
    });

    const accessToken = this.tokenService.generateAccessToken(
      new AccessTokenPayloadDto(user, session.id),
    );

    const refreshToken = this.tokenService.generateRefreshToken(
      new RefreshTokenPayloadDto(user.id, session.id, jti),
    );

    await this.refreshTokensService.create(jti, session.id);

    return {
      accessToken,
      refreshToken,
      user: new UserResponseDto(user),
    };
  }

  async login({ mobile, password }: LoginUserDto, request: Request) {
    const jti = uuidV4();

    const user = await this.usersService.findByMobile(mobile);
    const matchPassword = await bcrypt.compare(password, user.passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException('مشخصات وارد شده اشتباه است!');
    }

    const session = await this.sessionsService.create({
      userId: user.id,
      userAgent: request.headers['user-agent'] || null,
      ipAddress: '',
    });

    const accessToken = this.tokenService.generateAccessToken(
      new AccessTokenPayloadDto(user, session.id),
    );

    const refreshToken = this.tokenService.generateRefreshToken(
      new RefreshTokenPayloadDto(user.id, session.id, jti),
    );

    await this.refreshTokensService.create(jti, session.id);

    return {
      accessToken,
      refreshToken,
      user: new UserResponseDto(user),
    };
  }

  async refresh(props: { userInfo: TUser; sid: string; jti: string }) {
    const newJti = uuidV4();

    const accessToken = this.tokenService.generateAccessToken(
      new AccessTokenPayloadDto(props.userInfo, props.sid),
    );

    // for refresh rotating
    const refreshToken = this.tokenService.generateRefreshToken(
      new RefreshTokenPayloadDto(props.userInfo.id, props.sid, newJti),
    );

    await this.refreshTokensService.revoke(props.jti);
    await this.refreshTokensService.create(newJti, props.sid);

    return {
      accessToken,
      refreshToken,
      user: new UserResponseDto(props.userInfo),
    };
  }
}
