import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminUserService } from '../admin/user/user.service';

@Module({
  providers: [AuthService, AdminUserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
