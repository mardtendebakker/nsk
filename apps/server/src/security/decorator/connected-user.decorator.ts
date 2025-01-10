import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Group } from '../../user/model/group.enum';

export type ConnectedUserType = {
  id: string | number
  username: string
  email: string
  groups: Group[]
  email_verified: boolean
};

export const ConnectedUser = createParamDecorator(
  (data, ctx: ExecutionContext): ConnectedUserType => {
    const { user } = ctx.switchToHttp().getRequest();

    if (!user) {
      throw new Error('Authorization decorator should be used in order to use ConnectedUser');
    }

    return user;
  },
);
