import {
  Body, Controller, Get, Param, Put, Query,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiBody, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { AdminUserService } from './user.service';
import { ListUserDto } from './dto/list-user.dto';
import { ListUserResponseDto } from './dto/list-user-response.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { Group, MANAGER_GROUPS, SUPER_ADMIN_GROUPS } from '../../user/model/group.enum';
import { Authorization } from '../../security/decorator/authorization.decorator';

@ApiTags('admin-users')
@Controller('admin/users')
@ApiBearerAuth()
@Authorization(MANAGER_GROUPS)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('')
  @ApiResponse({ type: ListUserResponseDto })
  listUsers(@Query() query: ListUserDto) {
    return this.adminUserService.getUsers(query);
  }

  @Get('groups/:username')
  @ApiResponse({ type: [UpdateUserGroupDto] })
  listGroupsForUser(@Param('username') username: string) {
    return this.adminUserService.listGroupsForUser(username);
  }

  @Put('groups/:username')
  @Authorization(SUPER_ADMIN_GROUPS)
  @ApiResponse({ type: [UpdateUserGroupDto] })
  @ApiBody({
    type: [UpdateUserGroupDto],
    examples: {
      all_possible_group: {
        value: Object.values(Group).map((group, i) => ({
          group,
          assign: i % 2 === 0,
        })),
      },
    },
  })
  updateGroup(@Param('username') username: string, @Body() updateUserGroupDto: UpdateUserGroupDto[]) {
    return this.adminUserService.manageUserGroup(username, updateUserGroupDto);
  }
}
