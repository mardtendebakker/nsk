import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';
import { ConfirmationRegistrationRequestDto } from './dto/confirmation-registration-request.dto';

@Injectable()
export class UserService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly congigService: ConfigService,
    private readonly authService: AuthService
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  confirmRegistration(confirmationRegistrationRequest: ConfirmationRegistrationRequestDto) {
    const { username, code } = confirmationRegistrationRequest;
    const userData = {
      Username: username,
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

  resendConfirmationCode(username: string) {
    const userData = {
      Username: username,
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

  async changePassword(username: string, channgePasswordRequestDto: ChanngePasswordRequestDto) {
    const { oldPassword, newPassword } = channgePasswordRequestDto;
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUSerSession = await this.authService.authenticateUser({
      username: username,
      password: oldPassword
    })
    
    const user = new CognitoUser(userData);
    user.setSignInUserSession(cognitoUSerSession);

    return new Promise((resolve, reject) => {
      return user.changePassword(
        oldPassword,
        newPassword,
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
}
