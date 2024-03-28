import { AttributeGetPayload } from '../../attribute/types/attribute-get-payload';
import { AttributeOptionGetPayload } from '../../attribute/types/attribute-option-get-payload';
import { PartialProductAttributeIncludeAttribute } from './product-attribute-include-attribute';
import { PartialProductRelation } from './product-relation';

export type ProductAttributeProcessed = Omit<PartialProductAttributeIncludeAttribute, 'attribute'> & {
  attribute: AttributeGetPayload
  selectedOption?: AttributeOptionGetPayload
  valueProduct?: PartialProductRelation
  totalStandardPrice?: number
};
