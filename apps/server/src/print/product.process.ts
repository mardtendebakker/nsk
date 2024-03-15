import { format } from 'date-fns';
import { PrintProcess } from './print.process';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { ProcessedStock } from '../stock/dto/processed-stock.dto';
import { ProductRelationAttributeProcessed } from '../stock/types/product-relation-attribute-processed';
export class ProductProcess extends PrintProcess {
  async checklist(product: ProcessedStock) {
    const purchaseOrder = product?.product_orders?.find(
      (pOrder) => pOrder?.order?.discr === AOrderDiscrimination.PURCHASE
    )?.order;

    return {
      order_barcode:
        purchaseOrder?.order_nr &&
        (await this.getBarcode({ text: purchaseOrder.order_nr, height: 20 })),
      order_nr: purchaseOrder?.order_nr,
      order_date: purchaseOrder?.order_date
        ? format(purchaseOrder?.order_date, 'dd-MM-yyyy')
        : 'Unknown',
      order_status: {
        name: purchaseOrder?.status ?? 'Unknown',
      },
      product_barcode: await this.getBarcode({ text: product.sku, height: 20 }),
      product_sku: product.sku,
      product_name: product.name,
      product_status: product?.status ?? 'Unknown',
      product_location: product?.location ?? 'Unknown',
      product_tasks: product.tasks.sort((a, b) => a.pindex > b.pindex ? 1 : -1).map((task) => {
        return {
          name: task?.name ?? '',
          description: task?.description ?? '',
          status: task?.status,
        };
      }),
    };
  }

  async pricecard(product: ProductRelationAttributeProcessed) {
    return {
      product: {
        barcode: await this.getBarcode({ text: product.sku }),
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
    };
  }
}
