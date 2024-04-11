import { Prisma } from '@prisma/client';
import { ProductOrderRelation } from './product-order-relation';
import { ProductAttributeIncludeAttribute } from './product-attribute-include-attribute';
import { ProductTypeRelation } from '../../admin/product-type/types/product-type-relation';

type ProductGetPayload = Prisma.productGetPayload<Record<'select', Prisma.productSelect>>;

export type ProductRelationWithoutProductOrder =
Omit<
ProductGetPayload,
'product_order' |
'product_attribute_product_attribute_product_idToproduct' |
'product_type'
> & {
  product_attribute_product_attribute_product_idToproduct: ProductAttributeIncludeAttribute[];
  product_type: ProductTypeRelation;
};

export type ProductRelation =
ProductRelationWithoutProductOrder & {
  product_order: ProductOrderRelation[];
};

export type PartialProductRelation = Partial<ProductGetPayload>;
