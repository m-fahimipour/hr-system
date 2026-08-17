import { z } from 'zod';
import { UserRoleSchema } from '~/src/modules/users/dto/user.dto';

export interface IAccessPayload {
  userId: string;
  role: z.infer<typeof UserRoleSchema>;
}
