import { IPrinter } from './iprinter';
import { PrintableOrderData } from '../types/printable-order';
import { DeliveryType } from '../../aorder/types/delivery-type.enum';
import { DataDestruction } from '../../aorder/types/data-destruction.enum';

export abstract class IOrderPrinter extends IPrinter {
  protected abstract transform(data: PrintableOrderData): Promise<unknown[]>;

  protected getDeliveryTypeLabel(deliveryType: DeliveryType) {
    switch (deliveryType) {
      case DeliveryType.DELIVERYTYPE_PICKUP:
        return 'Pickup';
      case DeliveryType.DELIVERYTYPE_DELIVERY:
        return 'Delivery';
      case DeliveryType.DELIVERYTYPE_SHIP:
        return 'Shipping';
      default:
        return 'Unknown';
    }
  }

  protected getDataDestructionLabel(dataDestruction: DataDestruction) {
    switch (dataDestruction) {
      case DataDestruction.DATADESTRUCTION_NONE:
        return 'None';
      case DataDestruction.DATADESTRUCTION_FORMAT:
        return 'Format';
      case DataDestruction.DATADESTRUCTION_STATEMENT:
        return 'Statement';
      case DataDestruction.DATADESTRUCTION_SHRED:
        return 'Shred';
      case DataDestruction.DATADESTRUCTION_KILLDISK:
        return 'Killdisk';
      default:
        return 'Unknown';
    }
  }
}
