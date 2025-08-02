import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../user/user.repository';
import { EmailLogService } from './email-log.service';
import { EmailLogController } from './email-log.controller';
import { EmailLogRepository } from './email-log.repository';

@Module({
  providers: [EmailLogService, UserRepository, EmailLogRepository],
  exports: [EmailLogService],
  controllers: [EmailLogController],
  imports: [PrismaModule],
})
export class LogModule {}
