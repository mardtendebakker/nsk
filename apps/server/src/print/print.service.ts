import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { ProcessedStock } from '../stock/dto/processed-stock.dto';
import { ProductRelationAttributeProcessed } from '../stock/types/product-relation-attribute-processed';
import { NormalPrinter } from './printer/normal-printer';
import { BarcodePrinter } from './printer/barcode-printer';
import { ChecklistPrinter } from './printer/checklist-printer';
import { PriceCardPrinter } from './printer/price-card-printer';
import { LabelPrinter } from './printer/label-printer';
import { ProductLabelPrint } from './types/product-label-print';
import { ExportPrinter } from './printer/export-printer';
import { AOrderProcessed } from '../aorder/types/aorder-processed';

@Injectable()
export class PrintService {
  constructor(
    private readonly normalPrinter: NormalPrinter,
    private readonly barcodePrinter: BarcodePrinter,
    private readonly checklistPrinter: ChecklistPrinter,
    private readonly priceCardPrinter: PriceCardPrinter,
    private readonly labelPrinter: LabelPrinter,
    private readonly exportPrinter: ExportPrinter,
  ) {
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });
  }

  async printAOrders(data: AOrderProcessed[]): Promise<Buffer> {
    return this.normalPrinter.print({
      data,
      pdfOptions: {
        format: 'A4',
        margin: {
          top: 45, bottom: 45, left: 30, right: 30,
        },
      },
    });
  }

  async printExport(data: AOrderProcessed[]): Promise<Buffer> {
    return this.exportPrinter.print({
      data,
      pdfOptions: {
        format: 'A4',
        margin: {
          top: 45, bottom: 45, left: 30, right: 30,
        },
      },
    });
  }

  async printBarcodes(data: string[]): Promise<Buffer> {
    return this.barcodePrinter.print({
      data,
      pdfOptions: {
        width: '54mm',
        height: '25mm',
        margin: {
          top: 1, bottom: 0, left: 3, right: 3,
        },
      },
    });
  }

  async printChecklists(data: ProcessedStock[]): Promise<Buffer> {
    return this.checklistPrinter.print({
      data,
      pdfOptions: {
        format: 'A4',
        margin: {
          top: 10, bottom: 10, left: 10, right: 10,
        },
      },
    });
  }

  async printPriceCards(data: ProductRelationAttributeProcessed[]): Promise<Buffer> {
    return this.priceCardPrinter.print({
      data,
      pdfOptions: {
        format: 'A6',

        margin: {
          top: 0, bottom: 0, left: 0, right: 0,
        },
      },
    });
  }

  async printLabels(data: ProductLabelPrint[]): Promise<Buffer> {
    return this.labelPrinter.print({
      data,
      pdfOptions: {
        width: '40mm',
        height: '60mm',
        margin: {
          top: 0, bottom: 0, left: 0, right: 0,
        },
      },
    });
  }
}
