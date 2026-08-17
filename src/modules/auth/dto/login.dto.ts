// @Third-Party
import { createZodDto } from 'nestjs-zod';

// @Dto
import { RegisterSchema } from '~/src/modules/auth/dto/register.dto';

// Schema
const LoginSchema = RegisterSchema.pick({ mobile: true, password: true });

// Dto
export class LoginUserDto extends createZodDto(LoginSchema) {}
