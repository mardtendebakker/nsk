import { PrintUtil } from "../print-util";
import { IPrinter } from "../iprinter/iprinter";
import { PrintTemplateName } from "../types/print-types.enum";
import { Injectable } from "@nestjs/common";
@Injectable()
export class BarcodePrinter extends IPrinter {
  constructor() {
    super(PrintTemplateName.BARCODE);
  }

  transform(data: string[]) {
    return Promise.all(data.map(async barcode => {
      return {
        barcode_value: barcode,
        barcode_image: await PrintUtil.getBarcode({
          text: barcode,
          scale: 1.2,
          height: 6,
        }),
      };
    }));
  }
}
