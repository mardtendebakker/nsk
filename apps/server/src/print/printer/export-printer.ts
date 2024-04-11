import { Injectable } from '@nestjs/common';
import { PrintTemplateName } from '../types/print-types.enum';
import { IOrderPrinter } from '../iprinter/iorder-printer';
import { AOrderProcessed } from '../../aorder/types/aorder-processed';

@Injectable()
export class ExportPrinter extends IOrderPrinter {
  constructor() {
    super(PrintTemplateName.EXPORT);
  }

  async transform(data: AOrderProcessed[]) {
    return Promise.all(data.map(async (aorder) => ({
      product_order: {
        ...aorder.product_order,
        ...(aorder.product_order
          .sort((a, b) => (a.product.sku < b.product.sku ? -1 : 0))
          .map((productOrder) => ({
            ...productOrder,
            product: {
              ...productOrder.product,
              brand: productOrder.product.product_attribute_product_attribute_product_idToproduct?.find(
                (pa) => pa?.attribute.name === 'Merk',
              )?.attribute.attribute_option.find(
                (ao) => ao.id === Number(productOrder.product.product_attribute_product_attribute_product_idToproduct?.find(
                  (pa) => pa?.attribute.name === 'Merk',
                )?.value),
              )?.name,
              type: productOrder.product.product_type.name,
            },
          }))
        ),
      },
    })));
  }
}
