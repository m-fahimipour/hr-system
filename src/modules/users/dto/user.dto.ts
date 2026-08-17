import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema
export const UserRoleSchema = z.enum(
  ['HR_ADMIN', 'MANAGER'],
  'سمت ارسال شده اشتباه است.',
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

// Dto
export class CreateUserDto extends createZodDto(
  UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
) {}
