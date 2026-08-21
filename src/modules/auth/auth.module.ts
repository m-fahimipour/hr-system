// @NestJS
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

// @Controller
import { AuthController } from '~/src/modules/auth/auth.controller';

// @Service
import { AuthService } from '~/src/modules/auth/auth.service';
import { AccessJWTStrategy } from '~/src/modules/auth/strategies/access-jwt.strategy';
import { RefreshJWTStrategy } from '~/src/modules/auth/strategies/refresh-jwt.strategy';
import { TokenService } from '~/src/modules/auth/token.service';
import { RefreshTokensModule } from '~/src/modules/refresh-tokens/refreshTokens.module';
import { SessionsModule } from '~/src/modules/sessions/sessions.module';
import { UserModule } from '~/src/modules/users/users.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    UserModule,
    SessionsModule,
    RefreshTokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    TokenService,
    AccessJWTStrategy,
    RefreshJWTStrategy,
  ],
})
export class AuthModule {}
