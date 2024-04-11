import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseRepository } from './purchase.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { ContactModule } from '../contact/contact.module';
import { PrintModule } from '../print/print.module';

@Module({
  providers: [PurchaseService, PurchaseRepository],
  controllers: [PurchaseController],
  imports: [PrismaModule, FileModule, ContactModule, PrintModule],
  exports: [PurchaseService],
})
export class PurchaseModule {}
