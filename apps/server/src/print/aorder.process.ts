import * as bwipjs from 'bwip-js';
import { AOrderProcessed } from "../aorder/aorder.process";
import { DeliveryType } from "../aorder/types/delivery-type.enum";
import { DataDestruction } from "../aorder/types/data-destruction.enum";
import { format } from 'date-fns';
export class AOrderProcess {
  private currencyFormat: Intl.NumberFormat;

  constructor (private readonly aorder: AOrderProcessed) {
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
      order_barcode: await this.getBarcode(this.aorder.order_nr),
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
        name: this.aorder.order_status.name ?? 'Unknown',
      },
      ...(this.aorder.acompany_aorder_customer_idToacompany && {
        customer: {
          ...this.aorder.acompany_aorder_customer_idToacompany,
        },
      }),
      ...(this.aorder.acompany_aorder_supplier_idToacompany && {
        supplier: {
          ...this.aorder.acompany_aorder_supplier_idToacompany,
          barcode: await this.getBarcode(this.aorder.acompany_aorder_supplier_idToacompany.name.substring(0,20)),
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
