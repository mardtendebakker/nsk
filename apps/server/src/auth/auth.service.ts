import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly congigService: ConfigService
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  authenticateUser(user: UserAuthenticationRequestDto): Promise<CognitoUserSession> {
    const { emailOrUsername, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: emailOrUsername,
      Password: password,
    });
    
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(new BadRequestException(err.message));
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
            console.log(err);
            reject(new BadRequestException(err.message));
          } else {
            console.log(result);
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
