import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';

@Module({
  providers: [AdminUserService],
  exports: [AdminUserService]
})
export class AdminUserModule {}
