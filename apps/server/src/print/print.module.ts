import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { NormalPrinter } from './printer/normal-printer';
import { BarcodePrinter } from './printer/barcode-printer';
import { ChecklistPrinter } from './printer/checklist-printer';
import { LabelPrinter } from './printer/label-printer';
import { PriceCardPrinter } from './printer/price-card-printer';
import { PackagePrinter } from './printer/package-printer';

@Module({
  providers: [
    PrintService,
    NormalPrinter,
    BarcodePrinter,
    ChecklistPrinter,
    LabelPrinter,
    PriceCardPrinter,
    PackagePrinter,
  ],
  exports: [PrintService]
})
export class PrintModule {}
