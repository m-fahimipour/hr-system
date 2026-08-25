import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import { TCreateSession } from '~/src/modules/sessions/types/sessions.type';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async create(
    { userId, ...otherCreateSessionInfo }: TCreateSession,
    manager?: EntityManager,
  ) {
    const repo = manager ? manager.getRepository(Session) : this.sessionRepo;

    const session = repo.create({
      user: {
        id: userId,
      },
      ...otherCreateSessionInfo,
      lastSeenAt: new Date(),
      expiresAt: new Date(
        Date.now() + Number(process.env.JWT_REFRESH_EXP || 0),
      ),
    });

    return await repo.save(session);
  }
}
