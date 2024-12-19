import { Gender } from '@prisma/client';
import { Group } from './group.enum';
import { SecuritySystem } from '../../security/security.system';

export class UserModel {
  id: string | number;

  firstName?: string;

  lastName?: string;

  username: string;

  email: string;

  gender?: Gender;

  enabled: boolean;

  emailVerified: boolean;

  emailConfirmationCode?: string;

  passwordVerificationCode?: string;

  password: string;

  refreshToken: string;

  groups: Group[];

  createdAt: Date;

  updatedAt: Date;

  securitySystem: SecuritySystem;
}
