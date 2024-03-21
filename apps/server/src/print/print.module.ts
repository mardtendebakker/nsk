import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { AOrderPrinter } from './printer/aorder-printer';
import { BarcodePrinter } from './printer/barcode-printer';
import { ChecklistPrinter } from './printer/checklist-printer';
import { LabelPrinter } from './printer/label-printer';
import { PriceCardPrinter } from './printer/price-card-printer';

@Module({
  providers: [
    PrintService,
    AOrderPrinter,
    BarcodePrinter,
    ChecklistPrinter,
    LabelPrinter,
    PriceCardPrinter,
  ],
  exports: [PrintService]
})
export class PrintModule {}
