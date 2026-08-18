// @NestJS
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';

// @Dto
import { LoginUserDto } from '~/src/modules/auth/dto/login.dto';
import { RegisterUserDto } from '~/src/modules/auth/dto/register.dto';
import { AuthService } from '~/src/modules/auth/auth.service';
import { PublicRoute } from '~/src/decorators/public-route.decorator';
import { IAuthResponse } from '~/src/modules/auth/types';
import { AuthInterceptor } from '~/src/interceptors/auth.interceptor';

@UseInterceptors(AuthInterceptor)
@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<IAuthResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<IAuthResponse> {
    return await this.authService.register(registerUserDto);
  }

  @Post('refresh')
  async refresh(): Promise<IAuthResponse> {
    return new Promise(() => {});
  }
}
