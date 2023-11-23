import { AOrderDiscrimination } from "./types/aorder-discrimination.enum";
import { AServiceStatus } from "../aservice/enum/aservice-status.enum";
import { AOrderPayload } from "./types/aorder-payload";
import { ContactSelect } from "../contact/types/contact-select";

type TotalPerProductReturn = Record<string, number>;
type ContactProcessed = Omit<
  ContactSelect,
  'company_contact_company_idTocompany' |
  'contact'
> & {
  company_id: number,
  company_name: string,
  company_kvk_nr: number,
  contact: ContactProcessed
}
export type AOrderProcessed = Omit<
  AOrderPayload,
  'contact_aorder_supplier_idTocontact' | 
  'contact_aorder_customer_idTocontact'
> & {
  totalPrice: number,
  totalPerProductType: TotalPerProductReturn,
  contact_aorder_supplier_idTocontact?: ContactProcessed,
  contact_aorder_customer_idTocontact?: ContactProcessed,
};

export class AOrderProcess {
  private totalPrice: number;
  private totalPerProductType: TotalPerProductReturn;

  constructor( private readonly aorder: AOrderPayload ) {}

  public run(): AOrderProcessed {
    const {
      contact_aorder_supplier_idTocontact,
      contact_aorder_customer_idTocontact,
      ...restAOrder
    } = this.aorder;
    const {
      company_contact_company_idTocompany: company_supplier,
      contact: contact_supplier,
      ...rest_supplier
    } = contact_aorder_supplier_idTocontact || {};
    const {
      company_contact_company_idTocompany: partner_company_supplier,
      ...rest_partner_supplier
    } = contact_supplier || {};

    const {
      company_contact_company_idTocompany: company_customer,
      contact: contact_customer,
      ...rest_customer
    } = contact_aorder_customer_idTocontact || {};
    const {
      company_contact_company_idTocompany: partner_company_customer,
      ...rest_partner_customer
    } = contact_customer || {};

    this.totalPrice = this.calculateTotalPrice();
    this.totalPerProductType = this.calculateTotalPerProductType();

    return {
      ...restAOrder,
      ...(company_supplier && {
        contact_aorder_supplier_idTocontact: {
          ...rest_supplier,
          ...(company_supplier && {
            company_id: company_supplier.id,
            company_name: company_supplier.name,
            company_kvk_nr: company_supplier.kvk_nr,
          }),
          ...(partner_company_supplier && {
            contact: {
              ...rest_partner_supplier,
              ...(partner_company_supplier && {
                company_id: partner_company_supplier.id,
                company_name: partner_company_supplier.name,
                company_kvk_nr: partner_company_supplier.kvk_nr,
              }),
            },
          }),
        },
      }),
      ...(company_customer && {
        contact_aorder_customer_idTocontact: {
          ...rest_customer,
          ...(company_customer && {
            company_id: company_customer.id,
            company_name: company_customer.name,
            company_kvk_nr: company_customer.kvk_nr,
          }),
          ...(partner_company_customer && {
            contact: {
              ...rest_partner_customer,
              ...(partner_company_customer && {
                company_id: partner_company_customer.id,
                company_name: partner_company_customer.name,
                company_kvk_nr: partner_company_customer.kvk_nr,
              }),
            },
          }),
        },
      }),
      totalPrice: this.totalPrice,
      totalPerProductType: this.totalPerProductType,
    };
  }

  private calculateTotalPrice(): number {
    let price = 0;

    if (this.aorder.is_gift) {
      return price;
    }

    for (let i = 0; i < this.aorder?.product_order?.length; i++) {
      const pOrder = this.aorder?.product_order?.[i];
      price += (pOrder?.price ?? 0) * (pOrder?.quantity || 1);

      for (let j = 0; j < pOrder?.['aservice']?.length; j++) {
        const service = pOrder?.['aservice']?.[j];

        if (this.aorder.discr === AOrderDiscrimination.SALE && service.status !== AServiceStatus.STATUS_CANCEL) {
          price += service.price ?? 0;
        }
      }
    }

    if (this.aorder.discount > 0) {
      price -= this.aorder.discount;
    }

    if (this.aorder.transport > 0) {
      price += this.aorder.transport;
    }

    return price;
  }

  private calculateTotalPerProductType(): TotalPerProductReturn {
    const result: TotalPerProductReturn = {};

    const productOrders = this.aorder?.product_order || [];

    for (const pOrder of productOrders) {
      const productType = pOrder?.['product']?.product_type?.name || '(unknown)';
      const quantity = pOrder?.quantity || 1;
  
      if (!(productType in result)) {
        result[productType] = 0;
      }
  
      result[productType] += quantity;
    }

    return result;
  }
}
