import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensModule } from '~/src/modules/refresh-tokens/refreshTokens.module';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import { SessionsController } from '~/src/modules/sessions/sessions.controller';
import { SessionsService } from '~/src/modules/sessions/sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), RefreshTokensModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
