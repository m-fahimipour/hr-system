import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '~/src/modules/users/entities/user.entity';
import { UsersController } from '~/src/modules/users/users.controller';
import { UsersService } from '~/src/modules/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
