import { AServicePayload } from '../../aservice/types/AService-Payload';
import { PartialProductRelation } from './product-relation';

export type ProductOrderRelationProduct = {
  id: number;
  product: PartialProductRelation;
  quantity: number;
  price: number;
  aservice?: AServicePayload[];
};
