// @Third-Party
import { createZodDto } from 'nestjs-zod';

// @Dto
import { CreateUserSchema } from '~/src/modules/users/dto/user.dto';

// Schema
export const RegisterSchema = CreateUserSchema;

// Dto
export class RegisterUserDto extends createZodDto(RegisterSchema) {}
