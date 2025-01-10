import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoModule } from '@nestjs-cognito/core';
import { SecurityController } from './security.controller';
import { SecurityService } from './service/security.service';
import { CognitoService } from './service/cognito.service';
import { AdminUserService } from '../admin/user/user.service';
import { AuthService } from './service/auth.service';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get('COGNITO_USER_POOL_ID'),
          clientId: configService.get('COGNITO_CLIENT_ID'),
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    CognitoService,
    AdminUserService,
    AuthService,
    UserService,
    UserRepository,
    ModuleService,
    ModuleRepository,
    PrismaService,
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
