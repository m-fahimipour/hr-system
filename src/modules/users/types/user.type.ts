// @Third Party
import { z } from 'zod';

// @Schema
import { UserRoleSchema, UserSchema } from '~/src/modules/users/dto/user.dto';

export type TUser = z.infer<typeof UserSchema>;
export type TUserRole = z.infer<typeof UserRoleSchema>;
