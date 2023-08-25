import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AOrderProcessed } from '../aorder/aorder.process';
import { AOrderProcess } from './aorder.process';
import { PrintProcess } from './print.process';

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
      const orderPRocess = new AOrderProcess(order);
      return orderPRocess.run();
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

      const customWidth = '54mm';   // Adjust as needed
      const customHeight = '25mm';  // Adjust as needed
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
}
