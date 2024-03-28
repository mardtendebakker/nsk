import { ProductOrderRelationProduct } from '../../stock/types/product-order-relation-product';
import { AOrderPayload } from './aorder-payload';

type PickupPayload = Prisma.pickupGetPayload<Record<'select', Prisma.pickupGetPayload>>;
export type AOrderPayloadRelation = Omit<AOrderPayload, 'pickup' | 'product_order'> & {
  pickup: PickupPayload;
  product_order: ProductOrderRelationProduct[];
};
