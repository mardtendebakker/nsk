import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';
import { ConfirmationRegistrationRequestDto } from './dto/confirmation-registration-request.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@Authentication()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiResponse({type: UserInfoDto})
  @ApiUnauthorizedResponse(({ description: '{}'}))
  userInfo(@CognitoUser(Object.keys(new UserInfoDto)) me: UserInfoDto) {
    return me;
  }

  @Post('confirmcode')
  @ApiBadRequestResponse(({ description: 'Invalid verification code provided, please try again.'}))
  @ApiCreatedResponse({description: 'SUCCESS'})
  confirmRegistration(@Body() confirmatinRegistration: ConfirmationRegistrationRequestDto) {
    return this.userService.confirmRegistration(confirmatinRegistration);
  }

  @Post('resendcode')
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException'}))
  @ApiCreatedResponse(({ description: '{}'}))
  resendConfirmationCode(@CognitoUser("username") username: string,) {
    return this.userService.resendConfirmationCode(username);
  }

  @Post('changepassword')
  @ApiUnauthorizedResponse(({ description: 'Incorrect username or password.'}))
  @ApiCreatedResponse({description: 'SUCCESS'})
  changePassword(
    @CognitoUser("username") username: string,
    @Body() channgePasswordRequestDto: ChanngePasswordRequestDto
  ) {
    return this.userService.changePassword(username, channgePasswordRequestDto);
  }
}
