export interface User {
  id:string,
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface CognitoUserListItem {
  Username:string,
  Enabled:string,
  UserCreateDate:string,
  UserLastModifiedDate:string,
  UserStatus:string,
}

export enum Group {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  LOGISTICS = 'logistics',
  LOCAL = 'local',
  PARTNER_SALE_UPLOADER = 'partner_sale_uploader',
  STORE_PUBLISHER = 'store_publisher',
  PARTNER = 'partner',
}

export const Groups: Group[] = [
  Group.SUPER_ADMIN,
  Group.ADMIN,
  Group.MANAGER,
  Group.LOGISTICS,
  Group.LOCAL,
  Group.PARTNER_SALE_UPLOADER,
  Group.STORE_PUBLISHER,
  Group.PARTNER,
];

export interface UserListItem {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  gender?: Gender;
  enabled: boolean;
  emailVerified: boolean;
  groups: Group[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CognitoGroup {
  group:string,
  assign:boolean,
}
