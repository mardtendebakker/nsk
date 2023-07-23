import { Authorization } from '@nestjs-cognito/auth';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from './user.service';
import { ListUserDto } from './dto/list-user.dto';
import { ListUserResponseDto } from './dto/list-user-response.dto';
import { CognitoGroups } from '../../common/types/groups.enum';

@ApiTags('admin/users')
@Controller('admin/users')
@ApiBearerAuth()
@Authorization([
  CognitoGroups.SUPER_ADMIN,
  CognitoGroups.MANAGER,
  CognitoGroups.ADMIN
])
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('')
  @ApiResponse({ type: ListUserResponseDto })
  listUsers(@Query() query: ListUserDto) {
    return this.adminUserService.getUsers(query);
  }
}
