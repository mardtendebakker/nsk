import {
  BadRequestException, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { AdminUserService } from '../../admin/user/user.service';
import { SignInRequestDto } from '../dto/sign-in-request.dto';
import { SignUpRequestDto } from '../dto/sign-up-request.dto';
import { ConfirmSignUpRequestDto } from '../dto/confirm-sign-up-request.dto';
import { EmailOrUsernameDto } from '../dto/email-or-username.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { ConfirmPasswordRequestDto } from '../dto/confirm-password-request.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { UserModel } from '../../user/model/user.model';
import { ConnectedUserType } from '../decorator/connected-user.decorator';
import { SecuritySystem } from '../security.system';
import { Group } from '../../user/model/group.enum';

@Injectable()
export class CognitoService {
  private userPool: CognitoUserPool;

  constructor(
    private congigService: ConfigService,
    private adminUserService: AdminUserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.congigService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.congigService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  private async authenticate(
    { password, emailOrUsername }: SignInRequestDto,
    responseTransformer: (result: CognitoUserSession) => any = (r: CognitoUserSession) => r,
  ): Promise<object> {
    let username: string;
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(emailOrUsername)) {
      username = await this.adminUserService.findUsernameByEmail({
        email: emailOrUsername,
      }) ?? emailOrUsername;
    } else {
      username = emailOrUsername;
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
      newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(responseTransformer(result));
        },
        onFailure: (err) => {
          reject(new UnauthorizedException(err.message));
        },
        newPasswordRequired: async () => {
          await this.adminUserService.setUserPassword({
            username,
            password,
            permanent: true,
          });
          await this.adminUserService.verifyEmail({
            username,
          });
          // reAuthenticateUser
          return newUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
              resolve(responseTransformer(result));
            },
            onFailure: (err) => {
              reject(new UnauthorizedException(err.message));
            },
          });
        },
      });
    });
  }

  signIn(param: SignInRequestDto): Promise<SignInResponseDto> {
    return this.authenticate(param, (result: CognitoUserSession) : SignInResponseDto => this.signInResponse(result)) as Promise<SignInResponseDto>;
  }

  signUp({ username, email, password }: SignUpRequestDto) {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
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

  async confirmSignUp({ email, code }: ConfirmSignUpRequestDto) {
    const username = await this.adminUserService.findUsernameByEmail({ email });
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      user.confirmRegistration(
        code,
        true,
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  resendConfirmationCode({ emailOrUsername }: EmailOrUsernameDto) {
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      user.resendConfirmationCode(
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  refreshToken({ emailOrUsername, token }: RefreshTokenRequestDto): Promise<SignInResponseDto> {
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      user.refreshSession(
        new CognitoRefreshToken({ RefreshToken: token }),
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(this.signInResponse(result));
          }
        },
      );
    });
  }

  forgotPassword({ emailOrUsername }: EmailOrUsernameDto) {
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      user.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(new BadRequestException(err.message));
        },
      });
    });
  }

  confirmPassword({ emailOrUsername, verificationCode, newPassword }: ConfirmPasswordRequestDto) {
    const userData = {
      Username: emailOrUsername,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(new BadRequestException(err.message));
        },
      });
    });
  }

  async findOneByUsername(username: string): Promise<UserModel | null> {
    const user = await this.adminUserService.getUser({ username });
    const groups = await this.adminUserService.listGroupsForUser(username);

    return {
      id: user.UserAttributes.find(({ Name }) => Name == 'sub').Value,
      username: user.Username,
      email: user.UserAttributes.find(({ Name }) => Name == 'email').Value,
      enabled: user.Enabled,
      refreshToken: '',
      emailVerified: user.UserAttributes.find(({ Name }) => Name == 'email_verified').Value === 'True',
      password: '',
      groups: groups.filter(({ assign }) => assign).map(({ group }) => group) as unknown as Group[],
      createdAt: user.UserCreateDate,
      updatedAt: user.UserLastModifiedDate,
      securitySystem: SecuritySystem.COGNITO,
    };
  }

  async changePassword(body:{ user: ConnectedUserType, oldPassword: string, newPassword: string }) {
    const { user: { username }, oldPassword, newPassword } = body;
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const userAuthenticationRequestDto = {
      emailOrUsername: username,
      password: oldPassword,
    };

    const cognitoUSerSession = (await this.authenticate(userAuthenticationRequestDto)) as CognitoUserSession;

    const u = new CognitoUser(userData);
    u.setSignInUserSession(cognitoUSerSession);

    return new Promise((resolve, reject) => {
      u.changePassword(
        oldPassword,
        newPassword,
        (err, result) => {
          if (err) {
            reject(new BadRequestException(err.message));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  private signInResponse(user: CognitoUserSession): SignInResponseDto {
    const idToken = user.getIdToken();

    return {
      username: idToken.payload['cognito:username'],
      email: idToken.payload.email,
      accessToken: idToken.getJwtToken(),
      refreshToken: user.getRefreshToken().getToken(),
      emailVerified: idToken.payload.email_verified,
      groups: idToken.payload['cognito:groups'] || [],
      securitySystem: SecuritySystem.COGNITO,
    };
  }
}
