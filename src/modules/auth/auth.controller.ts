// @NestJS
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// @Dto
import { LoginUserDto } from '~/src/modules/auth/dto/login.dto';
import { RegisterUserDto } from '~/src/modules/auth/dto/register.dto';
import { AuthService } from '~/src/modules/auth/auth.service';
import { PublicRoute } from '~/src/decorators/public-route.decorator';
import { IAuthResponse } from '~/src/modules/auth/types';
import { AuthInterceptor } from '~/src/interceptors/auth.interceptor';
import type { Request } from 'express';
import { TUser } from '~/src/modules/users/types/user.type';
import { RefreshJWTGuard } from '~/src/modules/auth/guards/refresh-jwt.guard';

@UseInterceptors(AuthInterceptor)
@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() request: Request,
  ): Promise<IAuthResponse> {
    return await this.authService.login(loginUserDto, request);
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Req() request: Request,
  ): Promise<IAuthResponse> {
    return await this.authService.register(registerUserDto, request);
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<IAuthResponse> {
    return await this.authService.refresh(
      req.user as {
        userInfo: TUser;
        sid: string;
        jti: string;
      },
    );
  }
}
