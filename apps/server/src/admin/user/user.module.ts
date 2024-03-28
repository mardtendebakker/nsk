import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { AdminUserController } from './user.controller';

@Module({
  providers: [AdminUserService],
  controllers: [AdminUserController],
  exports: [AdminUserService],
})
export class AdminUserModule {}
