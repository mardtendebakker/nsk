import { format } from 'date-fns';
import { PrintProcess } from './print.process';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { ProcessedStock } from '../stock/dto/processed-stock.dto';
import { ProductRelation } from '../stock/types/product-relation';
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
      product_tasks: product.tasks.map((task) => {
        return {
          name: task?.name ?? '',
          description: task?.description ?? '',
          status: task?.status,
        };
      }),
    };
  }

  async pricecard(product: ProductRelation) {
    return {
      product: {
        barcode: await this.getBarcode({ text: product.sku }),
        sku: product.sku,
        name: product.name,
        price: product.price,
      },
      attributeRelations: {
        ...product.product_attribute_product_attribute_product_idToproduct.map(
          (item, i) => ({
            ...item,
            selectedOption: item?.['attribute']?.['attribute_option']?.find(option => option.id === Number(item.value)),
            valueProduct: item['product_product_attribute_value_product_idToproduct'],
            even: i % 2 !== 0,
          })
        ),
      },
    };
  }
}
