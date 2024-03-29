import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AOrderProcessed } from '../aorder/aorder.process';
import { AOrderProcess } from './aorder.process';
import { PrintProcess } from './print.process';
import { ProductProcess } from './product.process';
import { ProcessedStock } from '../stock/dto/processed-stock.dto';
import { ProductRelationAttributeProcessed } from '../stock/types/product-relation-attribute-processed';

@Injectable()
export class PrintService {
  constructor() {
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

  async printAOrders(orders: AOrderProcessed[]): Promise<Buffer> {
    const templatePath = join(process.cwd(), 'apps/server/src/assets/templates/order.hbs');
    const source = readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);

    const data = await Promise.all(orders.map(async order => {
      const orderProcess = new AOrderProcess(order);
      return orderProcess.run();
    }));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    try {
      const page = await browser.newPage();
      const result = template(data);
      await page.setContent(result);

      const pdfStream = await page.pdf({format: 'A4', margin: {
        top: 45,
        bottom: 45,
        left: 30,
        right: 30,
      }});

      return pdfStream;
    } finally {
      if (browser) {
        browser.close();
      }
    }
  }

  async printBarcodes(barcodes: string[]): Promise<Buffer> {
    const templatePath = join(process.cwd(), 'apps/server/src/assets/templates/barcode.hbs');
    const source = readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    try {
      const printProcess = new PrintProcess();
      const htmls: string[] = [];
      for (const barcode of barcodes) {
        const data = {
          barcode_value: barcode,
          barcode_image: await printProcess.getBarcode({
            text: barcode,
            scale: 1.2,
            height: 6,
          }),
        }
        htmls.push(template(data));
      }

      const page = await browser.newPage();
      await page.setContent(htmls.join('<br>'));

      const customWidth = '54mm';
      const customHeight = '25mm';
      const pdfStream: Buffer = await page.pdf({
        width: customWidth,
        height: customHeight,
        margin: {
          top: 1,
          bottom: 0,
          left: 3,
          right: 3,
        },
      });

      return pdfStream;
    } finally {
      if (browser) {
        browser.close();
      }
    }
  }

  async printChecklists(products: ProcessedStock[]): Promise<Buffer> {
    const templatePath = join(process.cwd(), 'apps/server/src/assets/templates/checklist.hbs');
    const source = readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const productProcess = new ProductProcess();

    const data = await Promise.all(products.map(async product => {
      return productProcess.checklist(product);
    }));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      const result = template(data);
      await page.setContent(result);

      const pdfStream: Buffer = await page.pdf({
        format: 'A4',
        margin: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      });

      return pdfStream;
    } finally {
      if (browser) {
        browser.close();
      }
    }
  }

  async printPriceCards(products: ProductRelationAttributeProcessed[]): Promise<Buffer> {
    const templatePath = join(process.cwd(), 'apps/server/src/assets/templates/pricecard.hbs');
    const source = readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const productProcess = new ProductProcess();

    const data = await Promise.all(products.map(async product => {
      return productProcess.pricecard(product);
    }));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      const result = template(data);
      await page.setContent(result);

      const pdfStream: Buffer = await page.pdf({
        format: 'A6',
        margin: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });

      return pdfStream;
    } finally {
      if (browser) {
        browser.close();
      }
    }
  }
}
