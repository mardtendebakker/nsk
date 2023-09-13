import { ProductRelationAttributeProcessed } from "./product-relation-attribute-processed"

export type ProductRelationAttributeOrderProcessed = ProductRelationAttributeProcessed & {
  product_orders?: ProductOrderDto
}
