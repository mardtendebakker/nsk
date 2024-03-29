import { Module } from '@nestjs/common';
import { BlanccoService } from './blancco.service';
import { HttpModule } from '@nestjs/axios';
import { PurchaseModule } from '../purchase/purchase.module';
import { BlanccoRepository } from './blancco.repository';
import { BlanccoController } from './blancco.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BlanccoController],
  providers: [BlanccoService, BlanccoRepository],
  imports: [
    PrismaModule,
    HttpModule,
    PurchaseModule,
  ],
  exports: [BlanccoService],
})
export class BlanccoModule {}
