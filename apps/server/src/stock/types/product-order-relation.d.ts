import { Prisma } from "@prisma/client";
import { ContactSelect } from "../../contact/types/contact-select";

type AOrderSelect = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;
type OrderRelation = Omit <
  AOrderSelect,
  'contact_aorder_customer_idTocontact' |
  'contact_aorder_supplier_idTocontact'
> & {
  contact_aorder_customer_idTocontact: ContactSelect,
  contact_aorder_supplier_idTocontact: ContactSelect,
};
type ProductOrderSelect = Prisma.product_orderGetPayload<Record<'select', Prisma.product_orderSelect>>;
export type ProductOrderRelation = Omit<
  ProductOrderSelect,
  'aorder'
> & {
  aorder: OrderRelation
};
