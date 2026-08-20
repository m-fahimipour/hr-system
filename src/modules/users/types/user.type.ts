// @Third Party
import { z } from 'zod';

// @Schema
import { UserRoleSchema, UserSchema } from '~/src/modules/users/dto/user.dto';

export type TUser = Omit<z.infer<typeof UserSchema>, 'password'> &
  Partial<Pick<z.infer<typeof UserSchema>, 'password'>>;

export type TUserRole = z.infer<typeof UserRoleSchema>;
