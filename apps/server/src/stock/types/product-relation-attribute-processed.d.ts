import { ProductAttributeProcessed } from './product-attribute-processed';
import { ProductRelation } from './product-relation';

export type ProductRelationAttributeProcessed = Omit<
  ProductRelation,
  'product_attribute_product_attribute_product_idToproduct'
> & {
  product_attributes: ProductAttributeProcessed[];
};
