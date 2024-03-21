import { format } from "date-fns";
import { AOrderDiscrimination } from "../../aorder/types/aorder-discrimination.enum";
import { IProductPrinter } from "../iprinter/iproduct-printer";
import { PrintUtil } from "../print-util";
import { ProcessedStock } from "../../stock/dto/processed-stock.dto";
import { PrintTemplateName } from "../types/print-types.enum";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ChecklistPrinter extends IProductPrinter {
  constructor() {
    super(PrintTemplateName.CHECKLIST);
  }

  transform(data: ProcessedStock[]) {
    return Promise.all(data.map(async product => {
      const purchaseOrder = product?.product_orders?.find(
        (pOrder) => pOrder?.order?.discr === AOrderDiscrimination.PURCHASE
      )?.order;
  
      return {
        order_barcode:
          purchaseOrder?.order_nr &&
          (await PrintUtil.getBarcode({ text: purchaseOrder.order_nr, height: 20 })),
        order_nr: purchaseOrder?.order_nr,
        order_date: purchaseOrder?.order_date
          ? format(purchaseOrder?.order_date, 'dd-MM-yyyy')
          : 'Unknown',
        order_status: {
          name: purchaseOrder?.status ?? 'Unknown',
        },
        product_barcode: await PrintUtil.getBarcode({ text: product.sku, height: 20 }),
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
    }));
  }
}
