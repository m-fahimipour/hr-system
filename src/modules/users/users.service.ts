import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '~/src/modules/users/dto/user.dto';
import { User } from '~/src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userObject = this.userRepository.create(createUserDto);

    return await this.userRepository.save(userObject);
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('کابری با این مشخصات یافت نشد!');
    }

    return user;
  }

  async findByMobile(mobile: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.mobile = :mobile', { mobile })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('مشخصات وارد شده اشتباه است!');
    }

    return user;
  }
}
