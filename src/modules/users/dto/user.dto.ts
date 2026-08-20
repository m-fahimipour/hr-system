import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

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

export const UserRoleSchema = z.enum(
  ['HR_ADMIN', 'MANAGER'],
  'نقش ارسال شده اشتباه است.',
);

export const UserSchema = z.object({
  id: z.string(),
  name: z
    .string('نام باید رشته باشد')
    .min(3, {
      error: (issue) => `نام باید حداقل ${issue.minimum} کاراکتر داشته باشد.`,
    })
    .max(20, {
      error: (issue) => `نام باید حداکثر ${issue.maximum} کاراکتر داشته باشد.`,
    })
    .meta({
      example: 'Mostafa Fahimipour',
    }),
  passwordHash: z.string(),
  password: PasswordSchema,
  email: z.email('فرمت ایمیل نادرست است.').meta({
    example: 'example@gmail.com',
    description: 'User Email Address',
  }),
  mobile: z
    .string('شماره تلفن همراه باید رشته باشد')
    .regex(/^09\d{9}$/, 'فرمت شماره تلفن همراه اشتباه است.')
    .meta({
      example: '09363460041',
      description: 'User Phone Number',
    }),
  role: UserRoleSchema.optional().meta({
    example: UserRoleSchema.enum.HR_ADMIN,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.pick({
  email: true,
  name: true,
  mobile: true,
  password: true,
});

// Dto
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
