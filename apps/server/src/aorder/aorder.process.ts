import { AOrderDiscrimination } from './types/aorder-discrimination.enum';
import { AServiceStatus } from '../aservice/enum/aservice-status.enum';
import { AOrderPayloadRelation } from './types/aorder-payload-relation';
import { CompanyRelation } from '../company/types/company-relation';
import { AOrderProcessed, TotalPerProductReturn } from './types/aorder-processed';
import { AaOrderCompany, ContactProcessed } from './types/contact-processed';
import { VAT_CODES } from '../company/const/vat-code';

type CompanyWithoutCompany = Omit<CompanyRelation, 'company'>;
type CompanyWithoutCompanyContacts = Omit<CompanyRelation, 'companyContacts'>;

export class AOrderProcess {

  private totalPerProductType: TotalPerProductReturn;

  constructor(private readonly aorder: AOrderPayloadRelation) {}

  public run(): AOrderProcessed {
    const {
      contact_aorder_customer_idTocontact: contactAOrderCustomerIdTocontact,
      contact_aorder_supplier_idTocontact: contactAOrderSupplierIdTocontact,
      ...restAOrder
    } = this.aorder;
    const {
      company_contact_company_idTocompany: companyCustomer,
      ...restCustomer
    } = contactAOrderCustomerIdTocontact || {};
    const {
      company: partnerCompanyCustomer,
      ...restCompanyCustomer
    } = companyCustomer || {};
    const {
      companyContacts: partnerContactsCustomer,
      ...restPartnerCompanyCustomer
    } = partnerCompanyCustomer || {};
    const partnerMainContactCustomer = partnerContactsCustomer?.find((c) => c.is_main);

    const {
      company_contact_company_idTocompany: companySupplier,
      ...restSupplier
    } = contactAOrderSupplierIdTocontact || {};
    const {
      company: partnerCompanySupplier,
      ...restCompanySupplier
    } = companySupplier || {};
    const {
      companyContacts: partnerContactsSupplier,
      ...restPartnerCompanySupplier
    } = partnerCompanySupplier || {};
    const partnerMainContactSupplier = partnerContactsSupplier?.find((c) => c.is_main);
    this.totalPerProductType = this.calculateTotalPerProductType();

    const customerProcessed: ContactProcessed = {
      ...restCustomer,
      ...(restCompanyCustomer
        && this.companyFieldsMapper(<CompanyWithoutCompany>restCompanyCustomer)
      ),
      ...(partnerCompanyCustomer && {
        contact: {
          ...partnerMainContactCustomer,
          ...(restPartnerCompanyCustomer
            && this.companyFieldsMapper(<CompanyWithoutCompanyContacts>restPartnerCompanyCustomer)
          ),
        },
      }),
    };

    const supplierProcessed: ContactProcessed = {
      ...restSupplier,
      ...(restCompanySupplier
        && this.companyFieldsMapper(<CompanyWithoutCompany>restCompanySupplier)
      ),
      ...(partnerCompanySupplier && {
        contact: {
          ...partnerMainContactSupplier,
          ...(restPartnerCompanySupplier
            && this.companyFieldsMapper(<CompanyWithoutCompanyContacts>restPartnerCompanySupplier)
          ),
        },
      }),
    };

    return {
      ...restAOrder,
      ...(companyCustomer && {
        contact_aorder_customer_idTocontact: customerProcessed,
      }),
      ...(companySupplier && {
        contact_aorder_supplier_idTocontact: supplierProcessed,
      }),
      totalPerProductType: this.totalPerProductType,
      ...this.calculateTotalPrice(customerProcessed?.vat?.value || 0)
    };
  }

  private calculateTotalPrice(vat: number): {
    subtotal: number;
    subtotalAfterDiscount: number;
    totalPriceExtVat: number;
    vatValue: number
    totalPrice: number,
  } {
    let subtotal = 0;

    for (let i = 0; i < this.aorder?.product_order?.length; i += 1) {
      const pOrder = this.aorder?.product_order?.[i];
      subtotal += (pOrder?.price ?? 0) * (pOrder?.quantity || 1);

      for (let j = 0; j < pOrder?.aservice?.length; j += 1) {
        const service = pOrder?.aservice?.[j];

        if (this.aorder.discr === AOrderDiscrimination.SALE
          && service.status !== AServiceStatus.STATUS_CANCEL) {
          subtotal += service.price ?? 0;
        }
      }
    }

    const discount = this.aorder.discount > 0 ? this.aorder.discount : 0;
    const transport = this.aorder.transport > 0 ? this.aorder.transport : 0;

    const subtotalAfterDiscount = subtotal - discount;
    const totalPriceExtVat = subtotalAfterDiscount + transport;
    const vatValue = totalPriceExtVat * (vat / 100);
    const totalPrice = this.aorder.is_gift ? 0 : totalPriceExtVat + vatValue;

    return {
      subtotal,
      subtotalAfterDiscount,
      totalPriceExtVat,
      vatValue,
      totalPrice
    };
  }

  private calculateTotalPerProductType(): TotalPerProductReturn {
    const result: TotalPerProductReturn = {};

    const productOrders = this.aorder?.product_order || [];

    productOrders.forEach((pOrder) => {
      const productType = pOrder?.product?.product_type?.name || '(unknown)';
      const quantity = pOrder?.quantity || 1;

      if (!(productType in result)) {
        result[productType] = 0;
      }

      result[productType] += quantity;
    });

    return result;
  }

  private companyFieldsMapper(
    company: CompanyWithoutCompany | CompanyWithoutCompanyContacts,
  ): AaOrderCompany {
    return {
      company_id: company.id,
      company_name: company.name,
      ...(company.kvk_nr && { company_kvk_nr: company.kvk_nr}),
      vat: VAT_CODES.find(({ code }) => code == company.vat_code),
    };
  }
}
