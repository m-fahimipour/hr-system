import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '~/src/modules/refresh-tokens/entities/refreshTokens.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async create(jti: string, sessionId: string) {
    const refreshTokenRow = this.refreshTokenRepo.create({
      id: jti,
      session: {
        id: sessionId,
      },
      expiresAt: new Date(
        Date.now() + Number(process.env.JWT_REFRESH_EXP || 0),
      ),
    });

    return await this.refreshTokenRepo.save(refreshTokenRow);
  }

  async revoke(jti: string) {
    const refreshTokenRow = await this.refreshTokenRepo.findOneBy({ id: jti });

    if (!refreshTokenRow) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenRow.expiresAt < new Date() || refreshTokenRow.revokedAt) {
      throw new UnauthorizedException('expired refresh token');
    }

    await this.refreshTokenRepo.update(
      { id: jti },
      {
        revokedAt: new Date(),
      },
    );

    return true;
  }
}
