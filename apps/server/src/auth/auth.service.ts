import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { ConfirmPasswordRequestDto } from './dto/confirm-password-request.dto';
import { ConfirmRegistrationRequestDto } from './dto/confirmation-registration-request.dto';
import { EmailOrUsernameDto } from './dto/email-or-username.dto';
import { RefreshSesionRequestDto } from './dto/refresh-session-request.dto';
import { UserAuthenticationRequestDto } from './dto/user-authentication-request.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { AdminUserService } from '../admin/user/user.service';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly congigService: ConfigService,
    private readonly adminUserService: AdminUserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  async authenticateUser(user: UserAuthenticationRequestDto): Promise<CognitoUserSession> {
    const { password } = user;
    let username: string;
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(user.emailOrUsername)) {
      username = await this.adminUserService.findUsernameByEmail({
        email: user.emailOrUsername,
      }) ?? user.emailOrUsername;
    } else {
      username = user.emailOrUsername;
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(new UnauthorizedException(err.message));
        },
        newPasswordRequired: async () => {
          await this.adminUserService.setUserPassword({
            username: username,
            password: password,
            permanent: true
          });
          await this.adminUserService.verifyEmail({
            username: username,
          });
          // reAuthenticateUser
          return newUser.authenticateUser(authenticationDetails, {
            onSuccess: result => {
              resolve(result);
            },
            onFailure: err => {
              reject(new UnauthorizedException(err.message));
            },
          });
        },
      });
    });
  }

  signUp(registerRequest: UserRegisterRequestDto) {
    const { username, email, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  confirmRegistration(confirmationRegistrationRequest: ConfirmRegistrationRequestDto) {
    const { emailOrUsername, code } = confirmationRegistrationRequest;
    if (!emailOrUsername.toLowerCase().endsWith("@copiatek.nl")) {
      throw new UnprocessableEntityException('to activate your user, please contact copiatek.nl');
    }
    
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };
    
    const user = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return user.confirmRegistration(
        code,
        true,
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  resendConfirmationCode(emailOrUsernameDto: EmailOrUsernameDto) {
    const { emailOrUsername } = emailOrUsernameDto;

    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };
    
    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return user.resendConfirmationCode(
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  refreshSession(refreshSessionRequest: RefreshSesionRequestDto) {
    const { emailOrUsername, token } = refreshSessionRequest;
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };
    
    const user = new CognitoUser(userData);
    
    return new Promise((resolve, reject) => {
      return user.refreshSession(
        new CognitoRefreshToken({ RefreshToken: token }),
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  forgotPassword(emailOrUsernameDto: EmailOrUsernameDto) {
    const { emailOrUsername } = emailOrUsernameDto;

    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };
    
    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return user.forgotPassword({
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(new BadRequestException(err.message));
        },
      });
    });
  }

  confirmPassword(confirmPasswordRequestDto: ConfirmPasswordRequestDto) {
    const { emailOrUsername, verificationCode, newPassword } = confirmPasswordRequestDto;

    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };
    
    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return user.confirmPassword(verificationCode, newPassword, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(new BadRequestException(err.message));
        },
      });
    });
  }
}
