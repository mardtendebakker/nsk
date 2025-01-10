import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { UserModel } from './model/user.model';
import { Group, LOCAL_GROUPS } from './model/group.enum';
import { FindManyDto } from './dto/find-many.dto';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './dto/user-response.dto';
import { Gender } from './model/gender.enum';
import { SecuritySystem } from '../security/security.system';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
  ) {
  }

  async findAll(query: FindManyDto) {
    const { search } = query;
    const { count, data } = await this.userRepository.findAll({
      ...query,
      where: {
        ...(search && { username: { contains: search } }),
      },
    });

    return {
      count,
      data: data.map(this.formatDbUserForList),
    };
  }

  async findOneByEmailOrUsername(param: string): Promise<UserModel | null> {
    const result = await this.userRepository.findOne({ where: { OR: [{ email: param }, { username: param }] } });

    if (!result) {
      return null;
    }

    return this.formatDbUser(result);
  }

  create({ refreshToken, emailConfirmationCode, ...param } :{ username: string, email: string, password: string, refreshToken: string, emailConfirmationCode: string }) {
    return this.userRepository.create({
      data: {
        ...param,
        refresh_token: refreshToken,
        groups: JSON.stringify(LOCAL_GROUPS),
        email_confirmation_code: emailConfirmationCode,
        enabled: true,
      },
    });
  }

  async findOneByRefreshToken(refreshToken): Promise<UserModel | null> {
    const result = await this.userRepository.findOne({ where: { refresh_token: refreshToken } });

    if (!result) {
      return null;
    }

    return this.formatDbUser(result);
  }

  update(
    id: number,
    {
      emailVerified, password, passwordVerificationCode, emailConfirmationCode, groups,
    }:
    { emailVerified?: boolean, password?: string, passwordVerificationCode?:string, emailConfirmationCode?:string, groups?: Group[] },
  ) {
    return this.userRepository.update({
      where: { id },
      data: {
        email_verified: emailVerified,
        password,
        password_verification_code: passwordVerificationCode,
        email_confirmation_code: emailConfirmationCode,
        groups: groups ? JSON.stringify(groups) : undefined,
      },
    });
  }

  async findOneById(id: string | number): Promise<UserModel | null> {
    const result = await this.userRepository.findOne({ where: { id: id as number } });

    if (!result) {
      return null;
    }

    return this.formatDbUser(result);
  }

  async findOneByUsername(username: string): Promise<UserModel | null> {
    const result = await this.userRepository.findOne({ where: { username } });

    if (!result) {
      return null;
    }

    return this.formatDbUser(result);
  }

  private formatDbUser(u: user): UserModel {
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      username: u.username,
      email: u.email,
      gender: u.gender,
      enabled: u.enabled,
      refreshToken: u.refresh_token,
      emailVerified: u.email_verified,
      emailConfirmationCode: u.email_confirmation_code,
      passwordVerificationCode: u.password_verification_code,
      password: u.password,
      groups: JSON.parse(u.groups),
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      securitySystem: SecuritySystem.JWT,
    };
  }

  private formatDbUserForList(u: user): UserResponseDto {
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      username: u.username,
      email: u.email,
      gender: u.gender as Gender,
      enabled: u.enabled,
      emailVerified: u.email_verified,
      groups: JSON.parse(u.groups),
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    };
  }
}
