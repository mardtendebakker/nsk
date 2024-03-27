import { AOrderPayload } from './aorder-payload';

type PickupPayload = Prisma.pickupGetPayload<Record<'select', Prisma.pickupGetPayload>>;
export type AOrderPayloadRelation = Omit<AOrderPayload, 'pickup'> & {
  pickup: PickupPayload;
};
