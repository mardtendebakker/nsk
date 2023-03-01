import { Module } from '@nestjs/common';
import { purchaseService } from './purchase.service';
import { purchaseController } from './purchase.controller';
import { purchaseRepository } from './purchase.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [purchaseService, purchaseRepository],
  controllers: [purchaseController],
  imports: [PrismaModule]
})
export class purchaseModule {}
