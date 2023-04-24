import { Prisma } from "@prisma/client";
import { AttributeType } from "../attribute/enum/attribute-type.enum";

export type ProductPayload = Prisma.productGetPayload<Record<'select', Prisma.productSelect>>;
export type AttributePayload = Prisma.attributeGetPayload<Record<'select', Prisma.attributeSelect>>;
export type ProductAttributePayload = Prisma.product_attributeGetPayload<Record<'select', Prisma.product_attributeSelect>>;
export type ProductTypePayload = Prisma.product_typeGetPayload<Record<'select', Prisma.product_typeSelect>>;
export type ProductTypeAttributePayload = Prisma.product_type_attributeGetPayload<Record<'select', Prisma.product_type_attributeSelect>>;
export type LocationPayload = Prisma.locationGetPayload<Record<'select', Prisma.locationSelect>>;
export type ProductStatusPayload = Prisma.product_statusGetPayload<Record<'select', Prisma.product_statusSelect>>;

export type ProcessedAttributePayload = AttributePayload & {
  value?: string,
  valueProduct?: number,
};
export type ProcessedLocation = LocationPayload & {
  value?: string,
};


export class FindStockProcess {
  private product_type: ProductTypePayload;
  private product_type_attributes: ProductTypeAttributePayload[];
  private product_attributes: ProductAttributePayload[];

  constructor(
    private readonly product: ProductPayload,
    private readonly locations: LocationPayload[],
    private readonly product_statuses: ProductStatusPayload[],
    private readonly product_types: ProductTypePayload[],
  ) {
    this.product_attributes = product.product_attribute_product_attribute_product_idToproduct;
    this.product_type = product.product_type;
    this.product_type_attributes = this.product_type.product_type_attribute;
  }

  public run() {
    if (!this.product.product_type) {
      return;
    }

    const { 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      product_attribute_product_attribute_product_idToproduct,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      product_type,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      location,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      product_status,
      ...rest 
    } = this.product;

    return {
      ...rest,
      attributes: this.processAttribute(),
      listPrice: this.getListPrice(),
      locations: {
        ...this.locations,
        value: this.product.location.id
      },
      product_statuses: {
        ...this.product_statuses,
        value: this.product.product_status.id
      },
      product_types: {
        ...this.product_types,
        value: this.product.product_type.id
      }
    };
  }

  private processAttribute(): ProcessedAttributePayload[] {
    const processedAttributes: ProcessedAttributePayload[] = [];
    
    for (let i = 0; i < this.product_type_attributes.length; i++) {
      const attribute = <AttributePayload>this.product_type_attributes[i].attribute;
      
      const processedAttribute: ProcessedAttributePayload = {
        ...attribute,
      };

      for (let j = 0; j < this.product_attributes.length; j++) {
        const product_attribute = this.product_attributes[j];

        if (attribute.id === product_attribute.attribute_id) {
          switch (attribute.type) {
            case AttributeType.TYPE_SELECT:
              processedAttribute.value = product_attribute.value;
              break;
            case AttributeType.TYPE_TEXT:
              processedAttribute.value = product_attribute.value;
              break;
            case AttributeType.TYPE_PRODUCT:
              processedAttribute.valueProduct = product_attribute.value_product_id;
              break;
          }
        }
      }
      
      processedAttributes.push(processedAttribute);
    }

    return processedAttributes;
  }

  private getListPrice(): number {
    const listPrice = this.product_attributes.reduce((acc, product_attribute) => {
      return acc += this.getTotalStandardPrice(product_attribute);
    }, 0) || 0;
    return (listPrice / 100);
  }

  private getTotalStandardPrice(product_attribute: ProductAttributePayload) {
    let price = 0;
    for (let i = 0; i < this.product_type_attributes.length; i++) {
      const attribute = <AttributePayload>this.product_type_attributes[i].attribute;
      if (attribute.id === product_attribute.attribute_id) {
        switch (attribute.type) {
          case AttributeType.TYPE_SELECT: {
            const option = attribute.attribute_option.find(option => option.id === Number(product_attribute.value));
            price = option ? option.price : 0;
            break;
          }
          case AttributeType.TYPE_PRODUCT:
            price = this.product ? this.product.price * product_attribute.quantity : 0;
            break;
          default:
            price = product_attribute.value ? attribute.price : 0;
            break;
        }
      }
    }

    return price;
  }
}
