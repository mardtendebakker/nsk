import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseRepository } from './purchase.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';

@Module({
  providers: [PurchaseService, PurchaseRepository, PrintService],
  controllers: [PurchaseController],
  imports: [PrismaModule],
  exports: [PurchaseService]
})
export class PurchaseModule {}
