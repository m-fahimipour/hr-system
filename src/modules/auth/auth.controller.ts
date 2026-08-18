// @NestJS
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

// @Dto
import { LoginUserDto } from '~/src/modules/auth/dto/login.dto';
import { RegisterUserDto } from '~/src/modules/auth/dto/register.dto';
import { AuthService } from '~/src/modules/auth/auth.service';
import { PublicRoute } from '~/src/decorators/public-route.decorator';

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Post('refresh')
  refresh() {}
}
