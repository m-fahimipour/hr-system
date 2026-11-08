import { Controller, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RevokedReasonEnum } from '~/src/modules/sessions/dto/sessions.dto';
import { SessionsService } from '~/src/modules/sessions/sessions.service';
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
  async revokeOne(@Param('id') sessionId: string) {
    return await this.sessionsService.revokeOne({
      id: sessionId,
      revokedReason: 'USER_REVOKED',
    });
  }
}
