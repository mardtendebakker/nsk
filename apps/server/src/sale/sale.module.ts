import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SaleService, SaleRepository],
  controllers: [SaleController],
  imports: [PrismaModule]
})
export class SaleModule {}
