import {
  Body,
  Controller, Get, Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SecurityService } from './service/security.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { ConfirmSignUpRequestDto } from './dto/confirm-sign-up-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { EmailOrUsernameDto } from './dto/email-or-username.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { ConfirmPasswordRequestDto } from './dto/confirm-password-request.dto';
import { ConnectedUser, ConnectedUserType } from './decorator/connected-user.decorator';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';
import { Authorization } from './decorator/authorization.decorator';
import { ModuleService } from '../module/module.service';
import { UserInfoDto } from './dto/user-info.dto';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(
    private securityService: SecurityService,
    private moduleService: ModuleService,
  ) {}

  @Get('info')
  @ApiResponse({ type: UserInfoDto })
  @Authorization()
  @ApiUnauthorizedResponse(({ description: '{}' }))
  async userInfo(@ConnectedUser() { username }: ConnectedUserType) {
    const modules = await this.moduleService.findAll();

    const {
      password, refreshToken, passwordVerificationCode, emailConfirmationCode, ...me
    } = await this.securityService.findOneByUsername(username);

    return {
      ...me,
      modules,
    };
  }

  @Post('sign-in')
  @ApiBadRequestResponse(({ description: 'Password attempts exceeded' }))
  @ApiUnauthorizedResponse(({ description: 'Incorrect username or password.' }))
  @ApiOkResponse({ type: SignInResponseDto })
  signIn(@Body() body: SignInRequestDto) {
    return this.securityService.signIn(body);
  }

  @Post('sign-up')
  @ApiBadRequestResponse(({ description: 'Invalid email address format.' }))
  signUp(@Body() body: SignUpRequestDto) {
    return this.securityService.signUp(body);
  }

  @Post('confirm-sign-up')
  @ApiBadRequestResponse(({ description: 'Attempt limit exceeded, please try after some time.<br>Invalid verification code provided, please try again.' }))
  confirmSignUp(@Body() body: ConfirmSignUpRequestDto) {
    return this.securityService.confirmSignUp(body);
  }

  @Post('resend-confirmation-code')
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException' }))
  resendConfirmationCode(@Body() body: EmailOrUsernameDto) {
    return this.securityService.resendConfirmationCode(body);
  }

  @Post('refresh-token')
  @ApiBadRequestResponse(({ description: 'Invalid Refresh Token' }))
  refreshSession(@Body() body: RefreshTokenRequestDto) {
    return this.securityService.refreshToken(body);
  }

  @Post('forgot-password')
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException' }))
  @ApiOkResponse(({ description: '{}' }))
  forgotPassword(@Body() body: EmailOrUsernameDto) {
    return this.securityService.forgotPassword(body);
  }

  @Post('confirm-password')
  @ApiBadRequestResponse(({ description: 'Attempt limit exceeded, please try after some time.<br>Invalid verification code provided, please try again.' }))
  @ApiOkResponse(({ description: 'SUCCESS' }))
  confirmPassword(@Body() body: ConfirmPasswordRequestDto) {
    return this.securityService.confirmPassword(body);
  }

  @Post('change-password')
  @Authorization()
  @ApiUnauthorizedResponse(({ description: 'Incorrect username or password.' }))
  @ApiOkResponse({ description: 'SUCCESS' })
  async changePassword(
  @ConnectedUser() user: ConnectedUserType,
    @Body() channgePasswordRequestDto: ChanngePasswordRequestDto,
  ) {
    return this.securityService.changePassword({ user, ...channgePasswordRequestDto });
  }
}
