import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserInfoDto } from './dto/user-info.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@Authentication()
export class UserController {
  @Get('info')
  @ApiResponse({type: UserInfoDto})
  @ApiUnauthorizedResponse(({ description: '{}'}))
  userInfo(@CognitoUser(Object.keys(new UserInfoDto)) me: UserInfoDto) {
    return me;
  }
}
