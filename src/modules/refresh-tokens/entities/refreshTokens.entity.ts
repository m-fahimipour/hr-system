import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TRefreshToken } from '~/src/modules/refresh-tokens/types/refreshTokens.type';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';

@Entity()
export class RefreshToken implements TRefreshToken {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.refreshTokens)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column({ type: 'datetime', utc: true })
  expiresAt: Date;

  @Column({ type: 'datetime', utc: true, nullable: true })
  revokedAt: Date | null;
}
