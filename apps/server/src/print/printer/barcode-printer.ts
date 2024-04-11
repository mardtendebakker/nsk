import { Injectable } from '@nestjs/common';
import { PrintUtil } from '../print-util';
import { IPrinter } from '../iprinter/iprinter';
import { PrintTemplateName } from '../types/print-types.enum';

@Injectable()
export class BarcodePrinter extends IPrinter {
  constructor() {
    super(PrintTemplateName.BARCODE);
  }

  transform(data: string[]) {
    return Promise.all(data.map(async (barcode) => ({
      barcode_value: barcode,
      barcode_image: await PrintUtil.getBarcode({
        text: barcode,
        scale: 1.2,
        height: 6,
      }),
    })));
  }
}
