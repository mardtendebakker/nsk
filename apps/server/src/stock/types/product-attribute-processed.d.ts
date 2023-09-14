import { AttributeGetPayload } from "../../attribute/types/attribute-get-payload";
import { AttributeOptionGetPayload } from "../../attribute/types/attribute-option-get-payload";
import { ProductAttributeIncludeAttribute } from "./product-attribute-include-attribute"
import { ProductRelation } from "./product-relation";

export type ProductAttributeProcessed = Omit<ProductAttributeIncludeAttribute, 'attribute'> & {
  attribute: AttributeGetPayload
  selectedOption?: AttributeOptionGetPayload
  valueProduct?: ProductRelation
  totalStandardPrice?: number
};
