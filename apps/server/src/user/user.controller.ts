import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import {
  Body, Controller, Get, HttpCode, Post,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserService } from './user.service';
import { ModuleService } from '../module/module.service';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@Authentication()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly moduleService: ModuleService,
  ) {}

  @Get('info')
  @ApiResponse({ type: UserInfoDto })
  @ApiUnauthorizedResponse(({ description: '{}' }))
  async userInfo(@CognitoUser(Object.keys(new UserInfoDto())) me: UserInfoDto) {
    const modules = await this.moduleService.findAll();

    return {
      ...me,
      modules,
    };
  }

  @Post('changepassword')
  @HttpCode(200)
  @ApiUnauthorizedResponse(({ description: 'Incorrect username or password.' }))
  @ApiOkResponse({ description: 'SUCCESS' })
  changePassword(
  @CognitoUser('username') username: string,
    @Body() channgePasswordRequestDto: ChanngePasswordRequestDto,
  ) {
    return this.userService.changePassword(username, channgePasswordRequestDto);
  }
}
