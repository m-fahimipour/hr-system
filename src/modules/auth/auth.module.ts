// @NestJS
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

// @Controller
import { AuthController } from '~/src/modules/auth/auth.controller';

// @Service
import { AuthService } from '~/src/modules/auth/auth.service';
import { AccessJWTStrategy } from '~/src/modules/auth/strategies/access-jwt.strategy';
import { UserModule } from '~/src/modules/users/users.module';

@Module({
  imports: [JwtModule.register({ global: true }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AccessJWTStrategy],
})
export class AuthModule {}
