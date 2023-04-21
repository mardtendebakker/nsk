import { 
  AdminCreateUserCommandInput,
  AdminGetUserCommandInput,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProvider,
  ListUsersCommandInput
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminUsernameDto } from './dto/admin-username.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminSetUserPasswordDto } from './dto/admin-set-user-pasword.dto';
import { ListUserDto } from './dto/list-user.dto';
import { AdminEmailDto } from './dto/admin-email.dto';

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
      UserPoolId: this.userPoolId,
      Username: adminGetUserDto.username,
    };

    return this.cognitoClient.adminGetUser(adminCreateUserCommandInput)
  }

  createUser(adminCreateUserDto: AdminCreateUserDto) {
    const adminCreateUserCommandInput: AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: adminCreateUserDto.username,
      UserAttributes: [{
        Name: 'email',
        Value: adminCreateUserDto.email
      }],
    };

    return this.cognitoClient.adminCreateUser(adminCreateUserCommandInput);
  }

  setUserPassword(adminSetUserPasswordDto: AdminSetUserPasswordDto) {
    const adminSetUserPasswordCommandInput: AdminSetUserPasswordCommandInput = {
      UserPoolId: this.userPoolId,
      Username: adminSetUserPasswordDto.username,
      Password: adminSetUserPasswordDto.password,
      Permanent: adminSetUserPasswordDto.permanent,
    }

    return this.cognitoClient.adminSetUserPassword(adminSetUserPasswordCommandInput);
  }

  verifyEmail(adminUsernameDto: AdminUsernameDto) {
    const adminUpdateUserAttributesCommandInput: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: this.userPoolId,
      Username: adminUsernameDto.username,
      UserAttributes: [{
        Name: 'email_verified',
        Value: 'True'
      }],
    }

    return this.cognitoClient.adminUpdateUserAttributes(adminUpdateUserAttributesCommandInput);
  }

  listUsers(listUserDto: ListUserDto) {
    const listUsersCommandInput: ListUsersCommandInput = {
      UserPoolId: this.userPoolId,
      Filter: listUserDto.filter,
      AttributesToGet: listUserDto.attributes,
      Limit: listUserDto.limit,
      PaginationToken: listUserDto.pagetoken
    };

    return this.cognitoClient.listUsers(listUsersCommandInput);
  }

  async findUsernameByEmail(adminEmailDto: AdminEmailDto) {
    const results = await this.listUsers({
      filter: `email="${adminEmailDto.email}"`,
    });
    
    return results?.Users?.[0]?.Username;
  }
}
