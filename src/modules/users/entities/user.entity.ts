// @TypeORM
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// @Schema
import { UserRoleSchema } from '~/src/modules/users/dto/user.dto';

// @Third-Party
import * as bcrypt from 'bcryptjs';

// @Types
import type { TUserRole, TUser } from '~/src/modules/users/types/user.type';
import { Session } from '~/src/modules/sessions/entities/sessions.entity';

@Entity()
export class User implements TUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 256,
  })
  email: string;

  @Column({ unique: true, type: 'varchar', length: 256 })
  mobile: string;

  @Column({
    type: 'varchar',
    length: 256,
    select: false,
  })
  passwordHash: string;

  // this is not column, it is used for generating passwordHash
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRoleSchema.enum,
    default: UserRoleSchema.enum.HR_ADMIN,
  })
  role: TUserRole;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @CreateDateColumn({ utc: true })
  createdAt: Date;

  @UpdateDateColumn({ utc: true })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      return;
    }

    this.passwordHash = await bcrypt.hash(this.password, 12);

    this.password = undefined;
  }
}
