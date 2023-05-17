import { Module } from '@nestjs/common';
import { PrintService } from './print.service';

@Module({
  providers: [PrintService],
  exports: [PrintService]
})
export class PrintModule {}
