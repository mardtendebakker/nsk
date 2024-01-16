import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseRepository } from './purchase.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [PurchaseService, PurchaseRepository, PrintService],
  controllers: [PurchaseController],
  imports: [PrismaModule, FileModule, ContactModule],
  exports: [PurchaseService]
})
export class PurchaseModule {}
