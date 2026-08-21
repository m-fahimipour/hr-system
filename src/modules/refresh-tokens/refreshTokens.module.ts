import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '~/src/modules/refresh-tokens/entities/refreshTokens.entity';
import { RefreshTokensService } from '~/src/modules/refresh-tokens/refreshTokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
