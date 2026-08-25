import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RefreshToken } from '~/src/modules/refresh-tokens/entities/refreshTokens.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async create(jti: string, sessionId: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(RefreshToken)
      : this.refreshTokenRepo;

    const refreshTokenRow = repo.create({
      id: jti,
      session: {
        id: sessionId,
      },
      expiresAt: new Date(
        Date.now() + Number(process.env.JWT_REFRESH_EXP || 0),
      ),
    });

    return await repo.save(refreshTokenRow);
  }

  async revoke(jti: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(RefreshToken)
      : this.refreshTokenRepo;

    const refreshTokenRow = await repo.findOneBy({ id: jti });

    if (!refreshTokenRow) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenRow.expiresAt < new Date() || refreshTokenRow.revokedAt) {
      throw new UnauthorizedException('expired refresh token');
    }

    await repo.update(
      { id: jti },
      {
        revokedAt: new Date(),
      },
    );

    return true;
  }
}
