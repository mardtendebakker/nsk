
import { AOrderProcessed } from "../../aorder/aorder.process";
import { DeliveryType } from "../../aorder/types/delivery-type.enum";
import { DataDestruction } from "../../aorder/types/data-destruction.enum";
import { format } from 'date-fns';
import { PrintUtil } from "../print-util";
import { PrintTemplateName } from "../types/print-types.enum";
import { Injectable } from "@nestjs/common";
import { IOrderPrinter } from "../iprinter/iorder-printer";
@Injectable()
export class NormalPrinter extends IOrderPrinter {
  private currencyFormat: Intl.NumberFormat;

  constructor() {
    super(PrintTemplateName.NORMAL);
    this.currencyFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
  }

  async transform(data: AOrderProcessed[]) {
    return Promise.all(data.map(async aorder => {
      return {
        order_barcode: await PrintUtil.getBarcode({text: aorder.order_nr}),
        order_nr: aorder.order_nr,
        order_date: aorder.order_date ? format(aorder.order_date, 'dd-MM-yyyy') : 'Unknown',
        remarks: aorder.remarks ?? 'None',
        totalPrice: aorder.totalPrice ? this.currencyFormat.format(aorder.totalPrice) : '€ 0.00',
        transport: aorder.transport ? this.currencyFormat.format(aorder.transport) : '€ 0.00',
        discount: aorder.discount ? this.currencyFormat.format(aorder.discount) : '€ 0.00',
        isGift: aorder.is_gift ? 'YES' : 'NO',
        delivery_date: aorder.delivery_date ? format(aorder.delivery_date, 'dd-MM-yyyy') : 'Unknown',
        delivery_type:
          aorder.delivery_type ? aorder.delivery_type == DeliveryType.DELIVERYTYPE_PICKUP ? 
          'Pickup' : aorder.delivery_type == DeliveryType.DELIVERYTYPE_DELIVERY ?
          'Delivery' : aorder.delivery_type == DeliveryType.DELIVERYTYPE_SHIP ?
          'Shipping' : 'Unknown' : 'Unknown',
        delivery_instructions: aorder.delivery_instructions ?? 'None',
        ...(aorder.pickup && {
          pickup: {
            real_pickup_date: aorder.pickup.real_pickup_date ? format(aorder.pickup.real_pickup_date, 'dd-MM-yyyy') : 'Unknown',
            description: aorder.pickup.description ?? 'None',
            data_destruction: aorder.pickup.data_destruction ? aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_NONE ? 
            'None' : aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_FORMAT ?
            'Format' : aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_STATEMENT ? 
            'Statement' : aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_SHRED ?
            'elseShred' : aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_KILLDISK ?
            'Killdisk' : 'Unknown' : 'Unknown',
            agreement: {
              original_client_filename: aorder.pickup?.['afile']?.original_client_filename ?? 'None',
            },
            images: aorder.pickup?.['afile']?.length > 0 ? 'Yes' : 'No',
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
                25
              ),
            }),
          },
        }),
        product_order: {
          ...aorder.product_order,
          ...(aorder.product_order.map(product_order => ({
            ...product_order,
            price: product_order.price ? this.currencyFormat.format(product_order.price) : '€ 0.00',
          })))
        },
      }
    }));
  }
}
