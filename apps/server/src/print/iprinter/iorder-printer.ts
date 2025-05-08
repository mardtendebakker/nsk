import { IPrinter } from './iprinter';
import { PrintableOrderData } from '../types/printable-order';
import { DeliveryType } from '../../aorder/types/delivery-type.enum';
import { DataDestruction } from '../../calendar/pickup/types/destruction.enum';

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
        return 'No Data Carrier';
      case DataDestruction.DATADESTRUCTION_FORMAT:
        return 'Format';
      case DataDestruction.DATADESTRUCTION_STATEMENT:
        return 'Statement';
      case DataDestruction.DATADESTRUCTION_DEGAUSS:
        return 'Degauss by EMP';
      case DataDestruction.DATADESTRUCTION_ERASEDATA:
        return 'Erase Data Certified';
      default:
        return 'Unknown';
    }
  }
}
