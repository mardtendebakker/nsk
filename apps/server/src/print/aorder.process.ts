
import { AOrderProcessed } from "../aorder/aorder.process";
import { DeliveryType } from "../aorder/types/delivery-type.enum";
import { DataDestruction } from "../aorder/types/data-destruction.enum";
import { format } from 'date-fns';
import { PrintProcess } from "./print.process";
export class AOrderProcess extends PrintProcess {
  private currencyFormat: Intl.NumberFormat;

  constructor (private readonly aorder: AOrderProcessed) {
    super();
    this.currencyFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
  }

  async run() {
    return {
      order_barcode: await this.getBarcode({text: this.aorder.order_nr}),
      order_nr: this.aorder.order_nr,
      order_date: this.aorder.order_date ? format(this.aorder.order_date, 'dd-MM-yyyy') : 'Unknown',
      remarks: this.aorder.remarks ?? 'None',
      totalPrice: this.aorder.totalPrice ? this.currencyFormat.format(this.aorder.totalPrice) : '€ 0.00',
      transport: this.aorder.transport ? this.currencyFormat.format(this.aorder.transport) : '€ 0.00',
      discount: this.aorder.discount ? this.currencyFormat.format(this.aorder.discount) : '€ 0.00',
      isGift: this.aorder.is_gift ? 'YES' : 'NO',
      delivery_date: this.aorder.delivery_date ? format(this.aorder.delivery_date, 'dd-MM-yyyy') : 'Unknown',
      delivery_type:
        this.aorder.delivery_type ? this.aorder.delivery_type == DeliveryType.DELIVERYTYPE_PICKUP ? 
        'Pickup' : this.aorder.delivery_type == DeliveryType.DELIVERYTYPE_DELIVERY ?
        'Delivery' : this.aorder.delivery_type == DeliveryType.DELIVERYTYPE_SHIP ?
        'Shipping' : 'Unknown' : 'Unknown',
      delivery_instructions: this.aorder.delivery_instructions ?? 'None',
      ...(this.aorder.pickup && {
        pickup: {
          real_pickup_date: this.aorder.pickup.real_pickup_date ? format(this.aorder.pickup.real_pickup_date, 'dd-MM-yyyy') : 'Unknown',
          description: this.aorder.pickup.description ?? 'None',
          data_destruction: this.aorder.pickup.data_destruction ? this.aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_NONE ? 
          'None' : this.aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_FORMAT ?
          'Format' : this.aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_STATEMENT ? 
          'Statement' : this.aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_SHRED ?
          'elseShred' : this.aorder.pickup.data_destruction == DataDestruction.DATADESTRUCTION_KILLDISK ?
          'Killdisk' : 'Unknown' : 'Unknown',
          agreement: {
            original_client_filename: this.aorder.pickup?.['afile']?.original_client_filename ?? 'None',
          },
          images: this.aorder.pickup?.['afile']?.length > 0 ? 'Yes' : 'No',
        },
      }),
      order_status: {
        name: this.aorder.order_status?.name ?? 'Unknown',
      },
      ...(this.aorder.contact_aorder_customer_idTocontact && {
        customer: {
          ...this.aorder.contact_aorder_customer_idTocontact,
        },
      }),
      ...(this.aorder.contact_aorder_supplier_idTocontact && {
        supplier: {
          ...this.aorder.contact_aorder_supplier_idTocontact,
          barcode: await this.getBarcode({
            text: this.aorder.contact_aorder_supplier_idTocontact.name.substring(
              0,
              25
            ),
          }),
        },
      }),
      product_order: {
        ...this.aorder.product_order,
        ...(this.aorder.product_order.map(product_order => ({
          ...product_order,
          price: product_order.price ? this.currencyFormat.format(product_order.price) : '€ 0.00',
        })))
      },
    }
  }
}
