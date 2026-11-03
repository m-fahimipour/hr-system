import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '~/src/modules/sessions/sessions.service';
import { TUser } from '~/src/modules/users/types/user.type';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  @Get('/')
  async findAll(@Req() req: Request) {
    return await this.sessionsService.findAll((req.user as TUser).id);
  }
}
