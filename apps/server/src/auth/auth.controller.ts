import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from './auth.service';
import { ConfirmationRegistrationRequestDto } from './dto/confirmation-registration-request.dto';
import { RefreshSesionRequestDto } from './dto/refresh-session-request.dto';
import { UserAuthenticationRequestDto } from './dto/user-authentication-request.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { UserUsernameDto } from './dto/user-username.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiUnauthorizedResponse(({ description: 'Password attempts exceeded'}))
  @ApiOkResponse({type: CognitoUserSession})
  authenticateUser(@Body() userAuthentication: UserAuthenticationRequestDto) {
    return this.authService.authenticateUser(userAuthentication);
  }

  @Post('signup')
  @ApiBadRequestResponse(({ description: 'Invalid email address format.'}))
  @ApiCreatedResponse({type: CognitoUser})
  signUp(@Body() userRegistration: UserRegisterRequestDto) {
    return this.authService.signUp(userRegistration);
  }

  @Post('confirm')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'Invalid verification code provided, please try again.'}))
  @ApiOkResponse({description: 'SUCCESS'})
  confirmRegistration(@Body() confirmatinRegistration: ConfirmationRegistrationRequestDto) {
    return this.authService.confirmRegistration(confirmatinRegistration);
  }

  @Post('resend')
  @HttpCode(200)
  @ApiBadRequestResponse(({ description: 'CodeDeliveryFailureException'}))
  @ApiOkResponse(({ description: '{}'}))
  resendConfirmationCode(@Body() userUsernameDto: UserUsernameDto) {
    return this.authService.resendConfirmationCode(userUsernameDto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiUnauthorizedResponse(({ description: 'Invalid Refresh Token'}))
  refreshSession(@Body() refreshSession: RefreshSesionRequestDto) {
    return this.authService.refreshSession(refreshSession);
  }
}
