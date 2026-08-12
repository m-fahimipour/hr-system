import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '~/src/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@Module({
  imports: [
    // config for loading env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
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
          synchronize: Boolean(configService.get('DB_SYNC')) ?? false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
