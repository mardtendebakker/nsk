import {
  Body, Controller, Get, Param, Patch, Query,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Authorization } from '../security/decorator/authorization.decorator';
import { UserService } from './user.service';
import { ADMINS_GROUPS } from './model/group.enum';
import { FindManyDto } from './dto/find-many.dto';
import { PatchDto } from './dto/patch.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @ApiResponse({ type: UserResponseDto, isArray: true })
  @Authorization(ADMINS_GROUPS)
  @ApiUnauthorizedResponse(({ description: '{}' }))
  getAll(@Query() query: FindManyDto) {
    return this.userService.findAll(query);
  }

  @Patch('/:id')
  @Authorization(ADMINS_GROUPS)
  @ApiUnauthorizedResponse(({ description: '{}' }))
  async patch(@Param('id') id: number, @Body() body: PatchDto) {
    await this.userService.update(id, { groups: body.groups });
  }
}
