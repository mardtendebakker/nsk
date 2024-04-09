import { AServicePayload } from '../../aservice/types/AService-Payload';
import { ProductRelationWithoutProductOrder } from './product-relation';

export type ProductOrderRelationProduct = {
  id: number;
  product: ProductRelationWithoutProductOrder;
  quantity: number;
  price: number;
  aservice?: AServicePayload[];
};
