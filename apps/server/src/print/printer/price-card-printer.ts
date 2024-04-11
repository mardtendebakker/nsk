import { Injectable } from '@nestjs/common';
import { ProductRelationAttributeProcessed } from '../../stock/types/product-relation-attribute-processed';
import { PrintUtil } from '../print-util';
import { IProductPrinter } from '../iprinter/iproduct-printer';
import { PrintTemplateName } from '../types/print-types.enum';

@Injectable()
export class PriceCardPrinter extends IProductPrinter {
  constructor() {
    super(PrintTemplateName.PRICECARD);
  }

  transform(data: ProductRelationAttributeProcessed[]) {
    return Promise.all(data.map(async (product) => ({
      product: {
        barcode: await PrintUtil.getBarcode({ text: product.sku }),
        sku: product.sku,
        name: product.name,
        price: product.price,
      },
      product_attributes: {
        ...product.product_attributes
          .filter((item) => item.attribute.type !== 2 && item.value)
          .map((item, i) => ({
            ...item,
            even: i % 2 !== 0,
          })),
      },
    })));
  }
}
