import * as bwipjs from 'bwip-js';
import * as moment from 'moment';
import { OrderTotalPrice } from "../order/order.process";
import { DeliveryType } from "../order/types/delivery-type.enum";
import { DataDestruction } from "../order/types/data-destruction.enum";

export class OrderProcess {
  private currencyFormat: Intl.NumberFormat;

  constructor (private readonly order: OrderTotalPrice) {
    this.currencyFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
  }

  private cleanString(text) {
    const utf8 = {
      '/[áàâãªä]/u': 'a',
      '/[ÁÀÂÃÄ]/u': 'A',
      '/[ÍÌÎÏ]/u': 'I',
      '/[íìîï]/u': 'i',
      '/[éèêë]/u': 'e',
      '/[ÉÈÊË]/u': 'E',
      '/[óòôõºö]/u': 'o',
      '/[ÓÒÔÕÖ]/u': 'O',
      '/[úùûü]/u': 'u',
      '/[ÚÙÛÜ]/u': 'U',
      '/ç/': 'c',
      '/Ç/': 'C',
      '/ñ/': 'n',
      '/Ñ/': 'N',
      '/–/': '-', // UTF-8 hyphen to "normal" hyphen
      '/[’‘‹›‚]/u': ' ', // Literally a single quote
      '/[“”«»„]/u': ' ', // Double quote
      '/ /': ' ', // nonbreaking space (equiv. to 0x160)
      '/&/': 'en',
    };
    
    let replacedText: string;
    for (const key in utf8) {
      replacedText = text.replace(new RegExp(key), utf8[key]);
    }

    return replacedText;
  }

  async getBarcode(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer({
        bcid:        'code39',
        text:        this.cleanString(text).toUpperCase(),
        scale:       2,
        height:      10,
      }, function (err, png) {
        if (err) {
          reject(err);
        } else {
          const base64String = png.toString('base64');
          resolve(`data:image/png;base64,${base64String}`);
        }
      });
    })
  }

  async run() {
    return {
      order_barcode: await this.getBarcode(this.order.order_nr),
      order_nr: this.order.order_nr,
      order_date: this.order.order_date ? moment(this.order.order_date).format('DD-MM-YYYY') : 'Unknown',
      remarks: this.order.remarks ?? 'None',
      totalPrice: this.order.totalPrice ? this.currencyFormat.format(this.order.totalPrice) : '€ 0.00',
      transport: this.order.transport ? this.currencyFormat.format(this.order.transport) : '€ 0.00',
      discount: this.order.discount ? this.currencyFormat.format(this.order.discount) : '€ 0.00',
      isGift: this.order.is_gift ? 'YES' : 'NO',
      delivery_date: this.order.delivery_date ? moment(this.order.delivery_date).format('DD-MM-YYYY') : 'Unknown',
      delivery_type:
        this.order.delivery_type ? this.order.delivery_type == DeliveryType.DELIVERYTYPE_PICKUP ? 
        'Pickup' : this.order.delivery_type == DeliveryType.DELIVERYTYPE_DELIVERY ?
        'Delivery' : this.order.delivery_type == DeliveryType.DELIVERYTYPE_SHIP ?
        'Shipping' : 'Unknown' : 'Unknown',
      delivery_instructions: this.order.delivery_instructions ?? 'None',
      ...(this.order.pickup && {
        pickup: {
          real_pickup_date: this.order.pickup.real_pickup_date ? moment(this.order.pickup.real_pickup_date).format('DD-MM-YYYY') : 'Unknown',
          description: this.order.pickup.description ?? 'None',
          data_destruction: this.order.pickup.data_destruction ? this.order.pickup.data_destruction == DataDestruction.DATADESTRUCTION_NONE ? 
          'None' : this.order.pickup.data_destruction == DataDestruction.DATADESTRUCTION_FORMAT ?
          'Format' : this.order.pickup.data_destruction == DataDestruction.DATADESTRUCTION_STATEMENT ? 
          'Statement' : this.order.pickup.data_destruction == DataDestruction.DATADESTRUCTION_SHRED ?
          'elseShred' : this.order.pickup.data_destruction == DataDestruction.DATADESTRUCTION_KILLDISK ?
          'Killdisk' : 'Unknown' : 'Unknown',
          agreement: {
            original_client_filename: this.order.pickup?.['afile']?.original_client_filename ?? 'None',
          },
          images: this.order.pickup?.['afile']?.length > 0 ? 'Yes' : 'No',
        },
      }),
      order_status: {
        name: this.order.order_status.name ?? 'Unknown',
      },
      ...(this.order.acompany_aorder_customer_idToacompany && {
        customer: {
          ...this.order.acompany_aorder_customer_idToacompany,
        },
      }),
      ...(this.order.acompany_aorder_supplier_idToacompany && {
        supplier: {
          ...this.order.acompany_aorder_supplier_idToacompany,
          barcode: await this.getBarcode(this.order.acompany_aorder_supplier_idToacompany.name.substring(0,20)),
        },
      }),
      product_order: {
        ...this.order.product_order,
        ...(this.order.product_order.map(product_order => ({
          ...product_order,
          price: product_order.price ? this.currencyFormat.format(product_order.price) : '€ 0.00',
        })))
      },
    }
  }
}
