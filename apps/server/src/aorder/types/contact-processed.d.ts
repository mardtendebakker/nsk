import { VatCode } from '../../company/const/vat-code';
import { ContactRelation } from '../../contact/types/contact-relation';
import { AOrderContact } from './aorder-contact';

type AaOrderCompany = {
  company_id: number,
  company_name: string,
  company_kvk_nr: number | null,
  vat: VatCode
};
export type ContactProcessed = Omit<
ContactRelation,
'id' |
'name' |
'email' |
'phone' |
'street' |
'street_extra' |
'city' |
'zip' |
'state' |
'country' |
'external_id' |
'phone2' |
'street2' |
'street_extra2' |
'city2' |
'country2' |
'state2' |
'zip2' |
'is_main' |
'company_contact_company_idTocompany' |
'contact' |
'status_id' |
'customer_id' |
'supplier_id' |
'customerOrders' |
'supplierOrders' |
'_count'
> & AaOrderCompany & AOrderContact & {
  contact?: ContactProcessed
};
