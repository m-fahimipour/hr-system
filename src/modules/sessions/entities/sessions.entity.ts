import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from '~/src/modules/refresh-tokens/entities/refreshTokens.entity';
import { RevokedReasonEnum } from '~/src/modules/sessions/dto/sessions.dto';
import type {
  TRevokedReason,
  TSession,
} from '~/src/modules/sessions/types/sessions.type';
import { User } from '~/src/modules/users/entities/user.entity';

@Entity()
export class Session implements TSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onUpdate: 'RESTRICT',
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.session)
  refreshTokens: RefreshToken[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'datetime' })
  lastSeenAt: Date;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', default: null })
  revokedAt: Date | null;

  @Column({
    type: 'enum',
    enum: RevokedReasonEnum.enum,
    nullable: true,
    default: null,
  })
  revokedReason: TRevokedReason;
}
