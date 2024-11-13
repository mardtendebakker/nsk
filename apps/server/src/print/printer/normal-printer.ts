import { format } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { PrintUtil } from '../print-util';
import { PrintTemplateName } from '../types/print-types.enum';
import { IOrderPrinter } from '../iprinter/iorder-printer';
import { AOrderProcessed } from '../../aorder/types/aorder-processed';

@Injectable()
export class NormalPrinter extends IOrderPrinter {
  private currencyFormat: Intl.NumberFormat;

  constructor() {
    super(PrintTemplateName.NORMAL);
    this.currencyFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
  }

  async transform(data: AOrderProcessed[]) {
    return Promise.all(data.map(async (aorder) => ({
      order_barcode: await PrintUtil.getBarcode({ text: aorder.order_nr }),
      order_nr: aorder.order_nr,
      order_date: aorder.order_date ? format(aorder.order_date, 'dd-MM-yyyy') : 'Unknown',
      remarks: aorder.remarks ?? 'None',
      totalPrice: aorder.totalPrice ? this.currencyFormat.format(aorder.totalPrice) : '€ 0.00',
      transport: aorder.transport ? this.currencyFormat.format(aorder.transport) : '€ 0.00',
      discount: aorder.discount ? this.currencyFormat.format(aorder.discount) : '€ 0.00',
      isGift: aorder.is_gift ? 'YES' : 'NO',
      delivery_date: aorder.delivery?.date ? format(aorder.delivery.date, 'dd-MM-yyyy') : 'Unknown',
      delivery_type: this.getDeliveryTypeLabel(aorder.delivery?.type),
      delivery_instructions: aorder.delivery?.instructions ?? 'None',
      ...(aorder.pickup && {
        pickup: {
          real_pickup_date: aorder.pickup.real_pickup_date ? format(aorder.pickup.real_pickup_date, 'dd-MM-yyyy') : 'Unknown',
          description: aorder.pickup.description ?? 'None',
          data_destruction: this.getDataDestructionLabel(aorder.pickup.data_destruction),
          agreement: {
            original_client_filename: aorder.pickup?.afile?.original_client_filename ?? 'None',
          },
          images: aorder.pickup?.afile?.length > 0 ? 'Yes' : 'No',
        },
      }),
      order_status: {
        name: aorder.order_status?.name ?? 'Unknown',
      },
      ...(aorder.contact_aorder_customer_idTocontact && {
        customer: {
          ...aorder.contact_aorder_customer_idTocontact,
        },
      }),
      ...(aorder.contact_aorder_supplier_idTocontact && {
        supplier: {
          ...aorder.contact_aorder_supplier_idTocontact,
          barcode: await PrintUtil.getBarcode({
            text: aorder.contact_aorder_supplier_idTocontact.company_name.substring(
              0,
              25,
            ),
          }),
        },
      }),
      product_order: {
        ...aorder.product_order,
        ...(aorder.product_order.map((productOrder) => ({
          ...productOrder,
          price: productOrder.price ? this.currencyFormat.format(productOrder.price) : '€ 0.00',
        }))),
      },
    })));
  }
}
