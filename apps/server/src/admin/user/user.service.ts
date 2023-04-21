import { AdminCreateUserCommandInput, AdminGetUserCommandInput, AdminSetUserPasswordCommandInput, AdminUpdateUserAttributesCommandInput, CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminUsernameDto } from './dto/admin-get-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminSetUserPasswordDto } from './dto/admin-set-user-pasword.dto';

@Injectable()
export class AdminUserService {
  private userPoolId: string;
  private cognitoClient: CognitoIdentityProvider;

  constructor(
    private readonly congigService: ConfigService,
  ) {
    this.userPoolId = this.congigService.get<string>('COGNITO_USER_POOL_ID');
    this.cognitoClient = new CognitoIdentityProvider({
      region: this.congigService.get<string>('COGNITO_REGION'),
    });
  }

  getUser(adminGetUserDto: AdminUsernameDto) {
    const adminCreateUserCommandInput: AdminGetUserCommandInput = {
      Username: adminGetUserDto.username,
      UserPoolId: this.userPoolId,
    };

    return this.cognitoClient.adminGetUser(adminCreateUserCommandInput)
  }

  createUser(adminCreateUserDto: AdminCreateUserDto) {
    const adminCreateUserCommandInput: AdminCreateUserCommandInput = {
      Username: adminCreateUserDto.username,
      UserPoolId: this.userPoolId,
      UserAttributes: [{
        Name: 'email',
        Value: adminCreateUserDto.email
      }],
    };

    return this.cognitoClient.adminCreateUser(adminCreateUserCommandInput);
  }

  setUserPassword(adminSetUserPasswordDto: AdminSetUserPasswordDto) {
    const adminSetUserPasswordCommandInput: AdminSetUserPasswordCommandInput = {
      Username: adminSetUserPasswordDto.username,
      UserPoolId: this.userPoolId,
      Password: adminSetUserPasswordDto.password,
      Permanent: adminSetUserPasswordDto.permanent,
    }

    return this.cognitoClient.adminSetUserPassword(adminSetUserPasswordCommandInput);
  }

  verifyEmail(adminUsernameDto: AdminUsernameDto) {
    const adminUpdateUserAttributesCommandInput: AdminUpdateUserAttributesCommandInput = {
      Username: adminUsernameDto.username,
      UserPoolId: this.userPoolId,
      UserAttributes: [{
        Name: 'email_verified',
        Value: 'True'
      }],
    }

    return this.cognitoClient.adminUpdateUserAttributes(adminUpdateUserAttributesCommandInput);
  }
}
