import { format } from 'date-fns';
import { PrintProcess } from './print.process';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { ProcessedStock } from '../stock/dto/processed-stock.dto';
export class ProductProcess extends PrintProcess {
  constructor(private readonly product: ProcessedStock) {
    super();
  }

  async run() {
    const purchaseOrder = this.product?.product_orders?.find(
      (pOrder) => pOrder?.order?.discr === AOrderDiscrimination.PURCHASE
    ).order;

    return {
      order_barcode: await this.getBarcode({ text: purchaseOrder?.order_nr, height: 20 }),
      order_nr: purchaseOrder?.order_nr,
      order_date: purchaseOrder?.order_date
        ? format(purchaseOrder?.order_date, 'dd-MM-yyyy')
        : 'Unknown',
      order_status: {
        name: purchaseOrder?.status ?? 'Unknown',
      },
      product_barcode: await this.getBarcode({ text: this.product.sku, height: 20 }),
      product_sku: this.product.sku,
      product_name: this.product.name,
      product_status: this.product?.status ?? 'Unknown',
      product_location: this.product?.location ?? 'Unknown',
      product_tasks: this.product.tasks.map((task) => {
        return {
          name: task?.name ?? '',
          description: task?.description ?? '',
          status: task?.status,
        }
      }),
    };
  }
}
