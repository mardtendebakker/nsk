import { PrintUtil } from "../print-util";
import { IProductPrinter } from "../iprinter/iproduct-printer";
import { PrintTemplateName } from "../types/print-types.enum";
import { ProductLabelPrint } from "../types/product-label-print";
import { Injectable } from "@nestjs/common";
@Injectable()
export class LabelPrinter extends IProductPrinter {
  constructor() {
    super(PrintTemplateName.LABEL);
  }

  transform(data: ProductLabelPrint[]) {
    return Promise.all(data.map(async product => {
      return {
        product: {
          barcode: await PrintUtil.getBarcode({ text: product.sku }),
          sku: product.sku,
          name: product.name,
        },
        specifications: [
          {
            name: "Sku",
            value: product.sku,
          },
          {
            name: "Name",
            value: product.name,
          },
          {
            name: "Serienummer",
            value: product.product_attributes?.find(
              (pa) => pa.attribute.name === "Serienummer"
            )?.value,
          },
          {
            name: "Company",
            value: product.company_name,
          },
          {
            name: "Address",
            value: product.address,
          },
          {
            name: "Email",
            value: product.email,
          },
          {
            name: "Telephone",
            value: product.phone,
          },
          {
            name: "Test datum",
            value: product.created_at?.toISOString()?.split('T')?.[0],
          },
          {
            name: "Test by",
            value: `${product.gender === 'male' ? 'Dhr.' : 'Mevr.'} ${product.family_name}`,
          },
          {
            name: "Uitslag test",
            value: 'OK.',
          },
        ],
      };
    }));
  }
}
