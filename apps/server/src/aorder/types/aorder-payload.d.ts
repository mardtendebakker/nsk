import { Prisma } from '@prisma/client';
import { ContactRelation } from '../../contact/types/contact-relation';

type AOrderSelect = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;
type ContactWithoutAOrder = Omit <
ContactRelation,
'supplierOrders' |
'customerOrders'
>;
export type AOrderPayload = Omit <
AOrderSelect,
'contact_aorder_customer_idTocontact' |
'contact_aorder_supplier_idTocontact' |
'discr'
> & {
  contact_aorder_customer_idTocontact: ContactWithoutAOrder,
  contact_aorder_supplier_idTocontact: ContactWithoutAOrder,
  discr: string,
};
