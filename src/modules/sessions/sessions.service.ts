import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { RefreshTokensService } from '~/src/modules/refresh-tokens/refreshTokens.service';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';
import {
  TCreateSession,
  TRevokeSession,
} from '~/src/modules/sessions/types/sessions.type';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    private readonly dataSource: DataSource,
    private readonly refreshTokensService: RefreshTokensService,
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
    if (manager) {
      await manager
        .getRepository(Session)
        .update({ id }, { revokedAt: new Date(), revokedReason });
    } else {
      return await this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(Session);
        await repo.update({ id }, { revokedAt: new Date(), revokedReason });

        await this.refreshTokensService.revokeOneBySessionId(id, manager);

        return {
          message: 'Session is revoked.',
        };
      });
    }
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
