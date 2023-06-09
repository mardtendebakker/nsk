import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { UserAuthenticationRequestDto } from '../auth/dto/user-authentication-request.dto';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';

@Injectable()
export class UserService {
  private userPool: CognitoUserPool;

  constructor(
    private readonly congigService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  async changePassword(emailOrUsername: string, channgePasswordRequestDto: ChanngePasswordRequestDto) {
    const { oldPassword, newPassword } = channgePasswordRequestDto;
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const userAuthenticationRequestDto: UserAuthenticationRequestDto = {
      emailOrUsername: emailOrUsername,
      password: oldPassword
    };

    const cognitoUSerSession = await this.authService.authenticateUser(userAuthenticationRequestDto);

    const user = new CognitoUser(userData);
    user.setSignInUserSession(cognitoUSerSession);

    return new Promise((resolve, reject) => {
      return user.changePassword(
        oldPassword,
        newPassword,
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
}
