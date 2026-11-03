import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import {
  TCreateSession,
  TRevokeSession,
} from '~/src/modules/sessions/types/sessions.type';

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

  async revokeOne(
    { id, revokedReason }: TRevokeSession,
    manager?: EntityManager,
  ) {
    const repo = manager ? manager.getRepository(Session) : this.sessionRepo;

    await repo.update({ id }, { revokedAt: new Date(), revokedReason });
  }

  async findAll(userId: string) {
    // const queryBuilder = this.sessionRepo.createQueryBuilder('session');
    // const sessions = await queryBuilder
    //   .leftJoinAndSelect('session.user', 'user')
    //   .where('session.userId = :userId', { userId })
    //   .getMany();
    const sessions = await this.sessionRepo.find({
      where: {
        userId,
      },
      relations: {
        user: true,
      },
    });
    return sessions;
  }
}
