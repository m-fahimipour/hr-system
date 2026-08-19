// @Third-Party
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// @Dto
import { CreateUserSchema } from '~/src/modules/users/dto/user.dto';

// Schema
export const PasswordSchema = z
  .string('رمز عبور باید رشته باشد')
  .min(6, {
    error: (issue) =>
      `رمز عبور باید حداقل ${issue.minimum} کاراکتر داشته باشد.`,
  })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
    'رمز عبور باید شامل حروف کوچک، بزرگ، اعداد و کاراکترهای خاص باشد.',
  )
  .meta({
    example: 'Password@123',
  });

export const RegisterSchema = CreateUserSchema.omit({
  passwordHash: true,
}).extend({
  password: PasswordSchema,
});

// Dto
export class RegisterUserDto extends createZodDto(RegisterSchema) {}
