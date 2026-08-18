import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '~/src/modules/users/dto/user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }

  @Get()
  async findAll() {}

  @Get(':id')
  async findOne(@Param('id') userId: string) {}
}
