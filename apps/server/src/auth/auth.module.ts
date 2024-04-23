import { Module } from '@nestjs/common';
import { CognitoModule } from '@nestjs-cognito/core';
import { LocalModule } from './local/local.module';

@Module({
  imports: [
    CognitoModule,
    LocalModule,
  ],
})
export class AuthModule {}
