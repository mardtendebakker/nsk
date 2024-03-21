import { IPrinter } from './iprinter';
import { PrintableOrderData } from '../types/printable-order';

export abstract class IOrderPrinter extends IPrinter {
  protected abstract transform(data: PrintableOrderData): Promise<unknown[]>;
}
