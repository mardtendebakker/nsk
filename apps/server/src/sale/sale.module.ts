import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';

@Module({
  providers: [SaleService, SaleRepository, PrintService],
  controllers: [SaleController],
  imports: [PrismaModule, FileModule],
  exports: [SaleService],
})
export class SaleModule {}
