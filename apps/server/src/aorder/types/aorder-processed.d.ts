import { ProductOrderRelationProduct } from '../../stock/types/product-order-relation-product';
import { AOrderPayloadRelation, PickupPayload } from './aorder-payload-relation';
import { ContactProcessed } from './contact-processed';

export type TotalPerProductReturn = Record<string, number>;

export type AOrderProcessed = Omit<
AOrderPayloadRelation,
'product_order' |
'contact_aorder_supplier_idTocontact' |
'contact_aorder_customer_idTocontact' |
'pickup'
> & {
  totalPrice: number;
  vatValue: number;
  totalPriceExtVat: number;
  totalPerProductType: TotalPerProductReturn;
  product_order: ProductOrderRelationProduct[];
  contact_aorder_supplier_idTocontact?: ContactProcessed;
  contact_aorder_customer_idTocontact?: ContactProcessed;
  pickup?: PickupPayload
};
