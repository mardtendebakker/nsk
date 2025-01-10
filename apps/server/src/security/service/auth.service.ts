import {
  BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';
import bcrypt = require('bcrypt');
import { SignInRequestDto } from '../dto/sign-in-request.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { UserService } from '../../user/user.service';
import { SignUpRequestDto } from '../dto/sign-up-request.dto';
import { ConfirmSignUpRequestDto } from '../dto/confirm-sign-up-request.dto';
import { EmailOrUsernameDto } from '../dto/email-or-username.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { UserModel } from '../../user/model/user.model';
import { ConfirmPasswordRequestDto } from '../dto/confirm-password-request.dto';
import { ConnectedUserType } from '../decorator/connected-user.decorator';
import { SecuritySystem } from '../security.system';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
  }

  async signIn({ password, emailOrUsername }: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.userService.findOneByEmailOrUsername(emailOrUsername);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    return this.signInResponse(user);
  }

  async signUp({ password, ...param }: SignUpRequestDto) {
    const user = await this.userService.create({
      ...param,
      refreshToken: crypto.randomBytes(20).toString('hex'),
      password: bcrypt.hashSync(password, 12),
      emailConfirmationCode: Math.floor(1000 + Math.random() * 9000).toString(),
    });

    // Should be removed when mailing used
    await this.userService.update(user.id, { emailVerified: true, emailConfirmationCode: null });
    Logger.log(`Send sign up email to ${param.email}`);
  }

  async confirmSignUp(param: ConfirmSignUpRequestDto) {
    const user = await this.userService.findOneByEmailOrUsername(param.email);
    if (user.emailConfirmationCode != param.code) {
      throw new BadRequestException('Invalid email and code');
    }

    this.userService.update(user.id as number, { emailVerified: true });
  }

  async resendConfirmationCode(param: EmailOrUsernameDto) {
    const user = await this.userService.findOneByEmailOrUsername(param.emailOrUsername);
    if (!user) {
      throw new NotFoundException(`No user found with the given email or username: ${param.emailOrUsername}`);
    }

    // Should be removed when mailing used
    Logger.log(`Send sign up email to ${user.email}`);
  }

  async refreshToken(param: RefreshTokenRequestDto): Promise<SignInResponseDto> {
    const user = await this.userService.findOneByRefreshToken(param.token);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }
    return this.signInResponse(user);
  }

  async forgotPassword(param: EmailOrUsernameDto) {
    const user = await this.userService.findOneByEmailOrUsername(param.emailOrUsername);
    if (!user) {
      throw new NotFoundException(`No user found with the given email or username: ${param.emailOrUsername}`);
    }

    // Should be removed when mailing used
    Logger.log(`Send forgot password up email to ${user.email}`);
  }

  async confirmPassword(param: ConfirmPasswordRequestDto) {
    const user = await this.userService.findOneByEmailOrUsername(param.emailOrUsername);
    if (user.passwordVerificationCode != param.verificationCode) {
      throw new BadRequestException('Invalid email and code');
    }

    this.userService.update(user.id as number, { password: bcrypt.hashSync(param.newPassword, 12), passwordVerificationCode: null });
  }

  async changePassword({ user, oldPassword, newPassword }:{ user: ConnectedUserType, oldPassword: string, newPassword: string }) {
    const result = await this.userService.findOneById(user.id);

    if (!result) {
      throw new NotFoundException(`No user found with the given id: ${user.id}`);
    }
    if (!bcrypt.compareSync(oldPassword, result.password)) {
      throw new BadRequestException('Invalid old password');
    }

    return this.userService.update(user.id as number, { password: bcrypt.hashSync(newPassword, 12) });
  }

  private signInResponse(user:UserModel): SignInResponseDto {
    return {
      username: user.username,
      refreshToken: user.refreshToken,
      email: user.email,
      accessToken: this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        groups: user.groups,
        emailVerified: user.emailVerified,
      }),
      emailVerified: user.emailVerified,
      groups: user.groups,
      securitySystem: SecuritySystem.JWT,
    };
  }
}
