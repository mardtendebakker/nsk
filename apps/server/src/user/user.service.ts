import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';

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
