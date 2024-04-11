import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlanccoService } from './blancco.service';
import { PurchaseModule } from '../purchase/purchase.module';
import { BlanccoRepository } from './blancco.repository';
import { BlanccoController } from './blancco.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  controllers: [BlanccoController],
  providers: [BlanccoService, BlanccoRepository, ModuleService, ModuleRepository],
  imports: [
    PrismaModule,
    HttpModule,
    PurchaseModule,
  ],
  exports: [BlanccoService],
})
export class BlanccoModule {}
