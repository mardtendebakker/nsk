import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OrderTotalPrice } from '../order/order.process';
import { OrderProcess } from './order.process';

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

  async printOrders(orders: OrderTotalPrice[]): Promise<Buffer> {
    const source = readFileSync(join(process.cwd(), 'apps/server/src/print/templates/sale.hbs'), 'utf8');
    const template = Handlebars.compile(source);

    const data = await Promise.all(orders.map(async order => {
      const orderPRocess = new OrderProcess(order);
      return orderPRocess.run();
    }));

    let browser: Browser;
    let pdfStream: Buffer;
    try {
      browser = await puppeteer.launch({headless: 'new'});
      const page = await browser.newPage();
      const result = template(data);
      await page.setContent(result);
      pdfStream = await page.pdf({format: 'A4', margin: {
        top: 45,
        bottom: 45,
        left: 30,
        right: 30,
      }});
      browser.close();
    } finally {
      browser.close();
    }
    
    return Promise.resolve(pdfStream);
  }
}
