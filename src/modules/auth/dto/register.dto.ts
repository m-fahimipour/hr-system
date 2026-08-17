// @Third-Party
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// @Dto
import { UserSchema } from '~/src/modules/users/dto/user.dto';

// Schema
export const RegisterSchema = UserSchema.pick({
  email: true,
  name: true,
  mobile: true,
}).extend({
  password: z
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
    }),
});

// Dto
export class RegisterUserDto extends createZodDto(RegisterSchema) {}
