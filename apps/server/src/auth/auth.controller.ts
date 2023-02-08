import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfirmationRegistrationRequestDto } from './dto/confirmation-registration-request.dto';
import { RefreshSesionRequestDto } from './dto/refresh-session-request.dto';
import { UserAuthenticationRequestDto } from './dto/user-authentication-request.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBadRequestResponse(({ description: 'Invalid email address format.'}))
  signUp(@Body() userRegistration: UserRegisterRequestDto) {
    return this.authService.signUp(userRegistration);
  }

  @Post('confirm')
  @ApiBadRequestResponse(({ description: 'Invalid verification code provided, please try again.'}))
  @ApiCreatedResponse({description: 'SUCCESS'})
  confirmRegistration(@Body() confirmatinRegistration: ConfirmationRegistrationRequestDto) {
    return this.authService.confirmRegistration(confirmatinRegistration);
  }

  @Post('login')
  @ApiUnauthorizedResponse(({ description: 'Password attempts exceeded'}))
  authenticateUser(@Body() userAuthentication: UserAuthenticationRequestDto) {
    return this.authService.authenticateUser(userAuthentication);
  }

  @Post('refresh')
  @ApiUnauthorizedResponse(({ description: 'Invalid Refresh Token'}))
  refreshSession(@Body() refreshSession: RefreshSesionRequestDto) {
    return this.authService.refreshSession(refreshSession);
  }
}
