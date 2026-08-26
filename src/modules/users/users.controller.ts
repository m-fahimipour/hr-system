import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { CreateUserDto } from '~/src/modules/users/dto/user.dto';
import { UsersService } from '~/src/modules/users/users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    throw new BadRequestException({
      message: 'test',
      code: 'test',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  @Get(':id')
  async findOne(@Param('id') userId: string) {}
}
