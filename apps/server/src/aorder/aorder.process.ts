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
  private totalPrice: number;

  private vatValue: number;

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

    const { totalPrice, vatValue } = this.calculateTotalPrice(customerProcessed?.vat?.value || VAT_CODES.find(({ code }) => code == 2).value);
    this.totalPrice = totalPrice;
    this.vatValue = vatValue;

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
      totalPrice: this.totalPrice,
      vatValue: this.vatValue,
      totalPriceExtVat: this.totalPrice - this.vatValue,
      totalPerProductType: this.totalPerProductType,
    };
  }

  private calculateTotalPrice(vat: number): { totalPrice: number, vatValue: number } {
    let price = 0;

    if (this.aorder.is_gift) {
      return {
        totalPrice: 0,
        vatValue: 0,
      };
    }

    for (let i = 0; i < this.aorder?.product_order?.length; i += 1) {
      const pOrder = this.aorder?.product_order?.[i];
      price += (pOrder?.price ?? 0) * (pOrder?.quantity || 1);

      for (let j = 0; j < pOrder?.aservice?.length; j += 1) {
        const service = pOrder?.aservice?.[j];

        if (this.aorder.discr === AOrderDiscrimination.SALE
          && service.status !== AServiceStatus.STATUS_CANCEL) {
          price += service.price ?? 0;
        }
      }
    }

    if (this.aorder.transport > 0) {
      price += this.aorder.transport;
    }

    let totalPrice = price * (1 + vat / 100);
    if (this.aorder.discount > 0) {
      totalPrice -= this.aorder.discount;
    }

    return {
      totalPrice,
      vatValue: totalPrice - price,
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
      vat: VAT_CODES.find(({ code }) => code == company.vat_code),
    };
  }
}
