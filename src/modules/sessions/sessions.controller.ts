import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '~/src/modules/sessions/sessions.service';
import type { TRevokedReason } from '~/src/modules/sessions/types/sessions.type';
import { TUser } from '~/src/modules/users/types/user.type';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  @Get('/')
  async findAll(@Req() req: Request) {
    return await this.sessionsService.findAll((req.user as TUser).id);
  }

  @Post(':id')
  @HttpCode(200)
  async revokeOne(
    @Param('id') sessionId: string,
    @Query('revokedReason') revokedReason: TRevokedReason,
  ) {
    return await this.sessionsService.revokeOne({
      id: sessionId,
      revokedReason,
    });
  }
}
