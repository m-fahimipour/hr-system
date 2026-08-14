// @TypeORM
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleSchema } from '~/src/modules/users/dto/user.dto';

// @Types
import type { TUserRole, TUser } from '~/src/modules/users/types/user.type';

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
    type: 'enum',
    enum: UserRoleSchema.enum,
    default: UserRoleSchema.enum.USER,
  })
  role: TUserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
