import { ProductRelationGetPayload } from "../stock.process";

export type FindOneCustomResponse = Omit<
  ProductRelationGetPayload,
  'product_attribute_product_attribute_product_idToproduct'
> & {
  product_attributes: ProductRelationGetPayload['product_attribute_product_attribute_product_idToproduct'];
};
