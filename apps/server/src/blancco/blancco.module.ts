import { Module } from '@nestjs/common';
import { BlanccoService } from './blancco.service';
import { HttpModule } from '@nestjs/axios';
import { PurchaseModule } from '../purchase/purchase.module';
import { BlanccoRepository } from './blancco.repository';

@Module({
  providers: [BlanccoService, BlanccoRepository],
  imports: [
    HttpModule,
    PurchaseModule,
  ],
  exports: [BlanccoService],
})
export class BlanccoModule {}
