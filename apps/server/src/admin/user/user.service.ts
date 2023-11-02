import {
  AdminCreateUserCommandInput,
  AdminGetUserCommandInput,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProvider,
  DescribeUserPoolCommandInput,
  ListUsersCommandInput,
  AdminAddUserToGroupCommandInput,
  AdminRemoveUserFromGroupCommandInput,
  AdminListGroupsForUserCommandInput
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminUsernameDto } from './dto/admin-username.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminSetUserPasswordDto } from './dto/admin-set-user-pasword.dto';
import { ListUserDto } from './dto/list-user.dto';
import { AdminEmailDto } from './dto/admin-email.dto';
import { CognitoGroups } from '../../common/types/cognito-groups.enum';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

@Injectable()
export class AdminUserService {
  private userPoolId: string;
  private cognitoClient: CognitoIdentityProvider;

  constructor(
    private readonly congigService: ConfigService,
  ) {
    this.userPoolId = this.congigService.get<string>('COGNITO_USER_POOL_ID');
    this.cognitoClient = new CognitoIdentityProvider({
      region: this.congigService.get<string>('MAIN_REGION'),
    });
  }

  async getUsers(listUserDto: ListUserDto) {
    const userList = await this.listUsers(listUserDto);
    const userPoolDetail = await this.describeUserPool();

    return {
      data: userList.Users,
      count: userPoolDetail.UserPool.EstimatedNumberOfUsers,
      pageToken: userList.PaginationToken,
    }
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
      PaginationToken: listUserDto.pageToken
    };

    return this.cognitoClient.listUsers(listUsersCommandInput);
  }

  async findUsernameByEmail(adminEmailDto: AdminEmailDto) {
    const results = await this.listUsers({
      filter: `email="${adminEmailDto.email}"`,
    });

    return results?.Users?.[0]?.Username;
  }

  describeUserPool() {
    const describeUserPoolCommandInput: DescribeUserPoolCommandInput = {
      UserPoolId: this.userPoolId,
    }

    return this.cognitoClient.describeUserPool(describeUserPoolCommandInput);
  }

  async manageUserGroup(username: string, updateUserGroupDto: UpdateUserGroupDto[]): Promise<UpdateUserGroupDto[]> {

    for (let i = 0; i < updateUserGroupDto?.length; i++) {
      if (updateUserGroupDto[i].assign === true) {
        await this.addUserToGroup(username, updateUserGroupDto[i].group);
      } else if (updateUserGroupDto[i].assign === false) {
        await this.removeUserFromGroup(username, updateUserGroupDto[i].group);
      }
    }

    return this.listGroupsForUser(username);
  }

  async listGroupsForUser(username: string): Promise<UpdateUserGroupDto[]> {
    const adminRemoveUserFromGroupCommandInput: AdminListGroupsForUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: username,
      Limit: 60
    };

    const listGroupsOutput = await this.cognitoClient.adminListGroupsForUser(adminRemoveUserFromGroupCommandInput);

    const allGroups = Object.values(CognitoGroups);
    const userGroups = listGroupsOutput.Groups.map(group => group.GroupName);
    const result: UpdateUserGroupDto[] = [];

    for (let i = 0; i < allGroups.length; i++) {
      let found = false;

      for (let j = 0; j < userGroups.length; j++) {
        if (allGroups[i] === userGroups[j]) {
          found = true;
          break;
        }
      }

      result.push({
        group: allGroups[i],
        assign: found
      });
    }

    return result;
  }

  private addUserToGroup(username: string, groupname: CognitoGroups) {
    const adminAddUserToGroupCommandInput: AdminAddUserToGroupCommandInput = {
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: groupname,
    };

    return this.cognitoClient.adminAddUserToGroup(adminAddUserToGroupCommandInput);
  }

  private removeUserFromGroup(username: string, groupname: CognitoGroups) {
    const adminRemoveUserFromGroupCommandInput: AdminRemoveUserFromGroupCommandInput = {
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: groupname,
    };

    return this.cognitoClient.adminRemoveUserFromGroup(adminRemoveUserFromGroupCommandInput);
  }
}
