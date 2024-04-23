import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoService } from '../auth/cognito/cognito.service';
import { UserAuthenticationRequestDto } from '../auth/cognito/dto/user-authentication-request.dto';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';

@Injectable()
export class UserService {
  private userPool: CognitoUserPool;

  constructor(
    private readonly congigService: ConfigService,
    private readonly cognitoService: CognitoService,
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
      emailOrUsername,
      password: oldPassword,
    };

    const cognitoUSerSession = await this.cognitoService.authenticateUser(userAuthenticationRequestDto);

    const user = new CognitoUser(userData);
    user.setSignInUserSession(cognitoUSerSession);

    return new Promise((resolve, reject) => user.changePassword(
      oldPassword,
      newPassword,
      (err, result) => {
        if (err) {
          reject(new BadRequestException(err.message));
        } else {
          resolve(result);
        }
      },
    ));
  }
}
