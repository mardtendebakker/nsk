import { PrintableBarcodeData } from "./printable-barcode";
import { PrintableOrderData } from "./printable-order";
import { PrintableProductData } from "./printable-product";

export type PrintableData = PrintableProductData | PrintableOrderData | PrintableBarcodeData;
