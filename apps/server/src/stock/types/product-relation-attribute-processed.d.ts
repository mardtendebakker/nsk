import { ProductAttributeProcessed } from './product-attribute-processed';
import { PartialProductRelation } from './product-relation';

export type ProductRelationAttributeProcessed = Omit<
PartialProductRelation,
'product_attribute_product_attribute_product_idToproduct'
> & {
  product_attributes: ProductAttributeProcessed[]
};
