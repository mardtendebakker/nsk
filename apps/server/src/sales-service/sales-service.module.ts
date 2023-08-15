import { Module } from '@nestjs/common';
import { SalesServiceService } from './sales-service.service';

@Module({
  providers: [SalesServiceService],
  exports: [SalesServiceService]
})
export class SalesServiceModule {}
