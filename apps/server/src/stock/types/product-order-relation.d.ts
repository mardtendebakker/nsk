import { Prisma } from '@prisma/client';
import { ContactRelation } from '../../contact/types/contact-relation';

type AOrderSelect = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;
type OrderRelation = Omit <
AOrderSelect,
'contact_aorder_customer_idTocontact' |
'contact_aorder_supplier_idTocontact'
> & {
  contact_aorder_customer_idTocontact: ContactRelation,
  contact_aorder_supplier_idTocontact: ContactRelation,
};
type ProductOrderSelect = Prisma.product_orderGetPayload<Record<'select', Prisma.product_orderSelect>>;
export type ProductOrderRelation = Omit<
ProductOrderSelect,
'aorder'
> & {
  aorder: OrderRelation;
};
