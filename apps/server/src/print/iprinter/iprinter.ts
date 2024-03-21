import { ITransformable } from '../../common/abstract/itransform';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer, { PDFOptions } from "puppeteer";
import * as Handlebars from 'handlebars';
import { PrintTemplateName } from '../types/print-types.enum';
import { PrintableData } from '../types/printable';

export abstract class IPrinter extends ITransformable {
  protected abstract transform(data: PrintableData): Promise<unknown[]>;

  constructor(protected readonly templateName: PrintTemplateName) {
    super();
  }

  async print({
    data,
    pdfOptions
  }: {
    data: PrintableData,
    pdfOptions: PDFOptions
  }): Promise<Buffer> {
    const templatePath = join(process.cwd(), `apps/server/src/assets/templates/${this.templateName}.hbs`);
    const source = readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);

    const transformed = await this.transform(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      const result = template(transformed);
      await page.setContent(result);

      const pdfStream: Buffer = await page.pdf(pdfOptions);

      return pdfStream;
    } finally {
      if (browser) {
        browser.close();
      }
    }
  }
}
