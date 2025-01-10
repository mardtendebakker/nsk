import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignInRequestDto } from '../dto/sign-in-request.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { SignUpRequestDto } from '../dto/sign-up-request.dto';
import { ConfirmSignUpRequestDto } from '../dto/confirm-sign-up-request.dto';
import { EmailOrUsernameDto } from '../dto/email-or-username.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { ConfirmPasswordRequestDto } from '../dto/confirm-password-request.dto';
import { SecuritySystem } from '../security.system';
import { SECURITY_SYSTEM } from '../const';
import { CognitoService } from './cognito.service';
import { AuthService } from './auth.service';
import { UserModel } from '../../user/model/user.model';
import { UserService } from '../../user/user.service';
import { ConnectedUserType } from '../decorator/connected-user.decorator';

@Injectable()
export class SecurityService {
  constructor(
    private congnitoService: CognitoService,
    private authService: AuthService,
    private configService: ConfigService,
    private userService: UserService,
  ) {

  }

  private isCognito(): boolean {
    return this.configService.get(SECURITY_SYSTEM) == SecuritySystem.COGNITO;
  }

  signIn(body: SignInRequestDto): Promise<SignInResponseDto> {
    return this.isCognito() ? this.congnitoService.signIn(body) : this.authService.signIn(body);
  }

  signUp(body: SignUpRequestDto) {
    if (!body.email.toLowerCase().endsWith('@copiatek.nl')) {
      throw new UnprocessableEntityException('to register a user, please contact copiatek.nl');
    }

    return this.isCognito() ? this.congnitoService.signUp(body) : this.authService.signUp(body);
  }

  confirmSignUp(body: ConfirmSignUpRequestDto) {
    return this.isCognito() ? this.congnitoService.confirmSignUp(body) : this.authService.confirmSignUp(body);
  }

  resendConfirmationCode(body: EmailOrUsernameDto) {
    return this.isCognito() ? this.congnitoService.resendConfirmationCode(body) : this.authService.resendConfirmationCode(body);
  }

  refreshToken(body: RefreshTokenRequestDto): Promise<{ accessToken: string }> {
    return this.isCognito() ? this.congnitoService.refreshToken(body) : this.authService.refreshToken(body);
  }

  forgotPassword(body: EmailOrUsernameDto) {
    return this.isCognito() ? this.congnitoService.forgotPassword(body) : this.authService.forgotPassword(body);
  }

  confirmPassword(body: ConfirmPasswordRequestDto) {
    return this.isCognito() ? this.congnitoService.confirmPassword(body) : this.authService.confirmPassword(body);
  }

  findOneByUsername(username: string): Promise<UserModel | null> {
    return this.isCognito() ? this.congnitoService.findOneByUsername(username) : this.userService.findOneByUsername(username);
  }

  changePassword(body:{ user: ConnectedUserType, oldPassword: string, newPassword: string }) {
    return this.isCognito() ? this.congnitoService.changePassword(body) : this.authService.changePassword(body);
  }
}
