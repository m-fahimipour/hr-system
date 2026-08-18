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
    const { password, ...restRegisterUserDto } = registerUserDto;
    const generatedPasswordHash = await this.hash(password, 12);

    // Create User
    const { passwordHash, ...user } = await this.usersService.create({
      ...restRegisterUserDto,
      passwordHash: generatedPasswordHash,
    });

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

  private generateAccessToken(user: Omit<TUser, 'passwordHash'>) {
    const payload = {
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      algorithm:
        (process.env.JWT_ALGORITHM as JwtSignOptions['algorithm']) ?? 'HS512',
      secret: process.env.JWT_ACCESS_SECRET,
      subject: user.id,
      expiresIn: Number(process.env.JWT_ACCESS_EXP || 900_000),
    });

    return accessToken;
  }

  private generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      {},
      {
        algorithm:
          (process.env.JWT_ALGORITHM as JwtSignOptions['algorithm']) ?? 'HS512',
        secret: process.env.JWT_REFRESH_SECRET,
        subject: userId,
        expiresIn: Number(process.env.JWT_REFRESH_EXP || 2_592_000_000),
      },
    );

    return refreshToken;
  }

  private async hash(password: string, salt: number) {
    return await bcrypt.hash(password, salt);
  }
}
