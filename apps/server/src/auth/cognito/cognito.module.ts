import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { CognitoController } from './cognito.controller';
import { AdminUserService } from '../../admin/user/user.service';

@Module({
  providers: [CognitoService, AdminUserService],
  controllers: [CognitoController],
  exports: [CognitoService],
})
export class CognitoModule {}
