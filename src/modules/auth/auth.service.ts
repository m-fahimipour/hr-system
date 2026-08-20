// @NestJS
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '~/src/modules/auth/dto/register.dto';
import { UsersService } from '~/src/modules/users/users.service';

// @Third-Party
import bcrypt from 'bcryptjs';
import { LoginUserDto } from '~/src/modules/auth/dto/login.dto';
import { TUser } from '~/src/modules/users/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    // Create User
    const { passwordHash: _, ...user } =
      await this.usersService.create(registerUserDto);

    const accessToken = this.generateAccessToken(user);

    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login({ mobile, password }: LoginUserDto) {
    const { passwordHash, ...user } =
      await this.usersService.findByMobile(mobile);
    const matchPassword = await bcrypt.compare(password, passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException('مشخصات وارد شده اشتباه است!');
    }

    const accessToken = this.generateAccessToken(user);

    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(user: TUser) {
    const { passwordHash: _, ...otherInfo } = user;

    const accessToken = this.generateAccessToken(otherInfo);

    // for refresh rotating
    const refreshToken = this.generateRefreshToken(otherInfo.id);

    return {
      accessToken,
      refreshToken,
      user: otherInfo,
    };
  }

  private generateAccessToken(user: Omit<TUser, 'passwordHash' | 'password'>) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      algorithm: process.env.JWT_ALGORITHM as JwtSignOptions['algorithm'],
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXP) / 1000 || '15m', // number value should be in second
    });

    return accessToken;
  }

  private generateRefreshToken(userId: string) {
    const payload = {
      sub: userId,
    };

    const refreshToken = this.jwtService.sign(payload, {
      algorithm: process.env.JWT_ALGORITHM as JwtSignOptions['algorithm'],
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXP) / 1000 || '30d', // number value should be in second
    });

    return refreshToken;
  }
}
