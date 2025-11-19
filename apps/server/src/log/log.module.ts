import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../user/user.repository';
import { EmailLogService } from './email-log.service';
import { EmailLogController } from './email-log.controller';
import { EmailLogRepository } from './email-log.repository';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLogRepository } from './activity-log.repository';
import { AorderLogService } from './aorder-log.service';
import { AorderLogController } from './aorder-log.controller';
import { AorderLogRepository } from './aorder-log.repository';
import { ProductLogService } from './product-log.service';
import { ProductLogController } from './product-log.controller';
import { ProductLogRepository } from './product-log.repository';

@Global()
@Module({
  providers: [
    EmailLogService,
    EmailLogRepository,
    ActivityLogService,
    ActivityLogRepository,
    AorderLogService,
    AorderLogRepository,
    ProductLogService,
    ProductLogRepository,
    UserRepository,
  ],
  exports: [
    EmailLogService,
    ActivityLogService,
    AorderLogService,
    ProductLogService,
  ],
  controllers: [EmailLogController, ActivityLogController, AorderLogController, ProductLogController],
  imports: [PrismaModule],
})
export class LogModule {}
