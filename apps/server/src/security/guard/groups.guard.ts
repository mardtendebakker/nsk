import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { intersection } from 'lodash';

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private groups: string[]) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.groups.length == 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return user && intersection(user.groups, [...this.groups, 'super_admin']).length > 0;
  }
}
