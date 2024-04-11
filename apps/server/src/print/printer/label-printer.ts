import { Injectable } from '@nestjs/common';
import { PrintUtil } from '../print-util';
import { IProductPrinter } from '../iprinter/iproduct-printer';
import { PrintTemplateName } from '../types/print-types.enum';
import { ProductLabelPrint } from '../types/product-label-print';

@Injectable()
export class LabelPrinter extends IProductPrinter {
  constructor() {
    super(PrintTemplateName.LABEL);
  }

  transform(data: ProductLabelPrint[]) {
    return Promise.all(data.map(async (product) => ({
      product: {
        barcode: await PrintUtil.getBarcode({ text: product.sku, scale: 1, height: 6 }),
        sku: product.sku,
      },
      specifications: [
        {
          name: 'Name',
          value: product.name,
        },
        {
          name: 'Type',
          value: product.product_type.name,
        },
        {
          name: 'Modelnummer',
          value: product.product_attributes?.find(
            (pa) => pa.attribute.name === 'Modelnummer',
          )?.value,
        },
        {
          name: 'Serienummer',
          value: product.product_attributes?.find(
            (pa) => pa.attribute.name === 'Serienummer',
          )?.value,
        },
        {
          name: 'Productiejaar',
          value: '',
        },
        {
          name: 'Bedrijfsnaam',
          value: product.company_name,
        },
        {
          name: 'Adres',
          value: product.address,
        },
        {
          name: 'E-mail',
          value: product.email,
        },
        {
          name: 'Test datum',
          value: product.updated_at.toISOString().slice(0, 10),
        },
        {
          name: 'Test door',
          value: `${product.gender === 'male' ? 'Dhr.' : 'Mevr.'} ${product.family_name}`,
        },
        {
          name: 'Testtype',
          value: 'Functionaliteit',
        },
        {
          name: 'Uitslag test',
          value: 'OK',
        },
      ],
    })));
  }
}
