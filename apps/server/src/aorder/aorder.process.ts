import { AOrderDiscrimination } from "./types/aorder-discrimination.enum";
import { AServiceStatus } from "../aservice/enum/aservice-status.enum";
import { AOrderPayload } from "./types/aorder-payload";
import { ContactSelect } from "../contact/types/contact-select";
import { company } from "@prisma/client";

type TotalPerProductReturn = Record<string, number>;
type AaOrderCompany = {
  company_id: number,
  company_name: string,
};
type ContactProcessed = Omit<
  ContactSelect,
  'company_contact_company_idTocompany' |
  'contact'
> & AaOrderCompany & {
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
      contact_aorder_customer_idTocontact,
      contact_aorder_supplier_idTocontact,
      ...restAOrder
    } = this.aorder;
    const {
      company_contact_company_idTocompany: company_customer,
      ...rest_customer
    } = contact_aorder_customer_idTocontact || {};
    const {
      company: partner_company_customer,
      ...rest_company_customer
    } = company_customer || {};
    const {
      companyContacts: partner_contacts_customer,
      ...rest_partner_company_customer
    } = partner_company_customer || {};
    const partner_main_contact_customer = partner_contacts_customer?.find(c => c.is_main);

    const {
      company_contact_company_idTocompany: company_supplier,
      ...rest_supplier
    } = contact_aorder_supplier_idTocontact || {};
    const {
      company: partner_company_supplier,
      ...rest_company_supplier
    } = company_supplier || {};
    const {
      companyContacts: partner_contacts_supplier,
      ...rest_partner_company_supplier
    } = partner_company_supplier || {};
    const partner_main_contact_supplier = partner_contacts_supplier?.find(c => c.is_main);
    this.totalPrice = this.calculateTotalPrice();
    this.totalPerProductType = this.calculateTotalPerProductType();

    return {
      ...restAOrder,
      ...(company_customer && {
        contact_aorder_customer_idTocontact: {
          ...rest_customer,
          ...this.companyFieldsMapper(rest_company_customer),
          ...(partner_company_customer && {
            contact: {
              ...partner_main_contact_customer,
              ...this.companyFieldsMapper(rest_partner_company_customer),
            },
          }),
        },
      }),
      ...(company_supplier && {
        contact_aorder_supplier_idTocontact: {
          ...rest_supplier,
          ...this.companyFieldsMapper(rest_company_supplier),
          ...(partner_company_supplier && {
            contact: {
              ...partner_main_contact_supplier,
              ...this.companyFieldsMapper(rest_partner_company_supplier),
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

  private companyFieldsMapper(company: company): AaOrderCompany {
    return {
      ...(company && {
        company_id: company.id,
        company_name: company.name,
      }),
    };
  }
}
