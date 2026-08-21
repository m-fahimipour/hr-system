import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import { TCreateSession } from '~/src/modules/sessions/types/sessions.type';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async create({ userId, ...otherCreateSessionInfo }: TCreateSession) {
    const session = this.sessionRepo.create({
      user: {
        id: userId,
      },
      ...otherCreateSessionInfo,
      lastSeenAt: new Date(),
      expiresAt: new Date(Date.now() + 2_562_000_000),
    });

    return await this.sessionRepo.save(session);
  }
}
