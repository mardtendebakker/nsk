import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { UserAuthenticationRequestDto } from '../auth/dto/user-authentication-request.dto';
import { ChanngePasswordRequestDto } from './dto/change-password-request.dto';
import { AdminGetUserCommandInput, CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { AdminGetUserDto } from './dto/admin-get-user.dto';

@Injectable()
export class UserService {
  private userPool: CognitoUserPool;
  private cognitoClient: CognitoIdentityProvider;
  constructor(
    private readonly congigService: ConfigService,
    private readonly authService: AuthService
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
    this.cognitoClient = new CognitoIdentityProvider({
      region: this.congigService.get<string>('COGNITO_REGION'),
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

  adminGetUser(adminGetUserDto: AdminGetUserDto) {
    const adminCreateUserCommandInput: AdminGetUserCommandInput = {
      Username: adminGetUserDto.username,
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
    };

    return this.cognitoClient.adminGetUser(adminCreateUserCommandInput)
  }
}
