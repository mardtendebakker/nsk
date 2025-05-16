import { ProductOrderRelationProduct } from '../../stock/types/product-order-relation-product';
import { AOrderPayload } from './aorder-payload';

type PickupPayload = Prisma.pickupGetPayload<Record<'select', Prisma.pickupGetPayload>>;
type DeliveryPayload = Prisma.deliveryGetPayload<Record<'select', Prisma.deliveryGetPayload>>;
export type AOrderPayloadRelation = Omit<AOrderPayload, 'pickup' | 'delivery' | 'product_order'> & {
  pickup?: PickupPayload;
  delivery?: DeliveryPayload;
  product_order: ProductOrderRelationProduct[];
};
