import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseRepository } from './purchase.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [PurchaseService, PurchaseRepository],
  controllers: [PurchaseController],
  imports: [PrismaModule]
})
export class PurchaseModule {}
