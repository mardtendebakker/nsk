import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { CognitoService } from './cognito.service';
import { ConfirmPasswordRequestDto } from './dto/confirm-password-request.dto';
import { ConfirmRegistrationRequestDto } from './dto/confirmation-registration-request.dto';
import { EmailOrUsernameDto } from './dto/email-or-username.dto';
import { RefreshSesionRequestDto } from './dto/refresh-session-request.dto';
import { UserAuthenticationRequestDto } from './dto/user-authentication-request.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';

@ApiTags('auth-cognito')
@Controller('auth/cognito')
export class CognitoController {
  constructor(private readonly cognitoService: CognitoService) {}

  @Post('login')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'Password attempts exceeded'}))
  @ApiUnauthorizedResponse(({ description: 'Incorrect username or password.'}))
  @ApiOkResponse({type: CognitoUserSession})
  authenticateUser(@Body() userAuthentication: UserAuthenticationRequestDto) {
    return this.cognitoService.authenticateUser(userAuthentication);
  }

  @Post('signup')
  @ApiBadRequestResponse(({ description: 'Invalid email address format.'}))
  @ApiCreatedResponse({type: CognitoUser})
  signUp(@Body() userRegistration: UserRegisterRequestDto) {
    return this.cognitoService.signUp(userRegistration);
  }

  @Post('confirm')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'Attempt limit exceeded, please try after some time.<br>Invalid verification code provided, please try again.'}))
  @ApiOkResponse({description: 'SUCCESS'})
  confirmRegistration(@Body() confirmatinRegistration: ConfirmRegistrationRequestDto) {
    return this.cognitoService.confirmRegistration(confirmatinRegistration);
  }

  @Post('resend')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException'}))
  @ApiOkResponse(({ description: '{}'}))
  resendConfirmationCode(@Body() emailOrUsernameDto: EmailOrUsernameDto) {
    return this.cognitoService.resendConfirmationCode(emailOrUsernameDto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'Invalid Refresh Token'}))
  refreshSession(@Body() refreshSession: RefreshSesionRequestDto) {
    return this.cognitoService.refreshSession(refreshSession);
  }

  @Post('forgot')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException'}))
  @ApiOkResponse(({ description: '{}'}))
  forgotPassword(@Body() emailOrUsernameDto: EmailOrUsernameDto) {
    return this.cognitoService.forgotPassword(emailOrUsernameDto);
  }

  @Post('confirmpassword')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'Attempt limit exceeded, please try after some time.<br>Invalid verification code provided, please try again.'}))
  @ApiOkResponse(({ description: 'SUCCESS'}))
  confirmPassword(@Body() confirmPasswordRequestDto: ConfirmPasswordRequestDto) {
    return this.cognitoService.confirmPassword(confirmPasswordRequestDto);
  }
}
