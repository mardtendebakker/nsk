import { Prisma } from '@prisma/client';
import { AttributeIncludeOption } from './attribute-include-option';

type ProductAttributeInclude =
Prisma.product_attributeGetPayload<Record<'include', Prisma.product_attributeInclude>>;

export type ProductAttributeIncludeAttribute = Omit<ProductAttributeInclude, 'attribute'> & {
  attribute: AttributeIncludeOption;
};

export type PartialProductAttributeIncludeAttribute = Partial<ProductAttributeIncludeAttribute>;
