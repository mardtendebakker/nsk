import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductStatusService } from './product-status.service';
import { ProductStatusRepository } from './product-status.repository';
import { ProductStatusController } from './product-status.controller';

@Module({
  providers: [ProductStatusService, ProductStatusRepository],
  controllers: [ProductStatusController],
  imports: [PrismaModule]
})
export class ProductStatusModule {}
