import { IPrinter } from './iprinter';
import { PrintableProductData } from '../types/printable-product';

export abstract class IProductPrinter extends IPrinter {
  protected abstract transform(data: PrintableProductData): Promise<unknown[]>;
}
