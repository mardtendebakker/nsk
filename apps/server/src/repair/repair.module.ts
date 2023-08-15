import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { RepairRepository } from './repair.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { ToRepairModule } from '../to-repair/to-repair.module';
import { SalesServiceModule } from '../sales-service/sales-service.module';

@Module({
  providers: [RepairService, RepairRepository, PrintService],
  controllers: [RepairController],
  imports: [PrismaModule, FileModule, OrderStatusModule, ToRepairModule, SalesServiceModule],
  exports: [RepairService]
})
export class RepairModule {}
