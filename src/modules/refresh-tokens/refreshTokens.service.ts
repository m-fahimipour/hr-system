import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '~/src/modules/refresh-tokens/entities/refreshTokens.entity';
import { v4 as uuidV4 } from 'uuid';

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
      expiresAt: new Date(),
    });

    return await this.refreshTokenRepo.save(refreshTokenRow);
  }

  async revoke(jti: string) {
    const refreshUpdated = await this.refreshTokenRepo.update(
      { id: jti },
      {
        revokedAt: new Date(),
      },
    );

    if (refreshUpdated.affected === 0) {
      throw new UnauthorizedException('Unauthorize Error');
    }

    return true;
  }
}
