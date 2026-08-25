import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { UserModule } from '~/src/modules/users/users.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from '~/src/modules/auth/auth.module';
import { AccessJwtGuard } from '~/src/modules/auth/guards/access-jwt.guard';
import { SessionsModule } from '~/src/modules/sessions/sessions.module';
import { RefreshTokensModule } from '~/src/modules/refresh-tokens/refreshTokens.module';

@Module({
  imports: [
    // config for loading env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),

    // connect to database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST') ?? 'localhost',
          port: Number(configService.get('DB_POST')) ?? 3306,
          username: configService.get('DB_USERNAME') ?? 'root',
          password: configService.get('DB_PASSWORD') ?? '',
          database: configService.get('DB_Name') ?? 'hr',
          entities: [path.resolve(__dirname + '/**/entities/*.entity.{js,ts}')],
          timezone:"Z",
          synchronize: Boolean(configService.get('DB_SYNC')) ?? false,
        };
      },
    }),

    // Product Modules
    AuthModule,
    UserModule,
    SessionsModule,
    RefreshTokensModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard,
    },
  ],
})
export class AppModule {}
