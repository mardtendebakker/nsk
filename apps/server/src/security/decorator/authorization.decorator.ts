import { UseGuards } from '@nestjs/common';
import { Group } from '../../user/model/group.enum';
import { SecurityGuard } from '../guard/security.guard';
import { GroupsGuard } from '../guard/groups.guard';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Authorization(groups: Group[] = []): MethodDecorator & ClassDecorator {
  return UseGuards(SecurityGuard, new GroupsGuard(groups));
}
