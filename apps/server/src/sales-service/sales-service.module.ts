import { Module } from '@nestjs/common';
import { SalesServiceService } from './sales-service.service';
import { SalesServiceController } from './sales-service.controller';
import { SalesServiceRepository } from './sales-service.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SalesServiceService, SalesServiceRepository],
  controllers: [SalesServiceController],
  imports: [PrismaModule],
  exports: [SalesServiceService],
})
export class SalesServiceModule {}
