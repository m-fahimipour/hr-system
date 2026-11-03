import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import { SessionsController } from '~/src/modules/sessions/sessions.controller';
import { SessionsService } from '~/src/modules/sessions/sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
