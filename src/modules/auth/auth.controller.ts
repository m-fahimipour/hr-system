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
import { IAuthResponse, IRefreshProps } from '~/src/modules/auth/types';
import { AuthInterceptor } from '~/src/interceptors/auth.interceptor';
import type { Request } from 'express';
import { RefreshJWTGuard } from '~/src/modules/auth/guards/refresh-jwt.guard';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserSerializeDto } from '~/src/modules/users/dto/user.dto';

@UseInterceptors(AuthInterceptor)
@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ZodSerializerDto(UserSerializeDto)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() request: Request,
  ): Promise<IAuthResponse> {
    return await this.authService.login(loginUserDto, request);
  }

  @Post('register')
  @HttpCode(201)
  @ZodSerializerDto(UserSerializeDto)
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Req() request: Request,
  ): Promise<IAuthResponse> {
    return await this.authService.register(registerUserDto, request);
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<IAuthResponse> {
    return await this.authService.refresh(req.user as IRefreshProps);
  }

  @UseGuards(RefreshJWTGuard)
  @Post('logout')
  async logout(@Req() res: Request) {
    return await this.authService.logout(res.user as IRefreshProps);
  }
}
