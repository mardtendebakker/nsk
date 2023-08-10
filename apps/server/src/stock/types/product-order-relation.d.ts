import { Prisma } from "@prisma/client";

export type ProductOrderRelation = Prisma.product_orderGetPayload<Record<'select', Prisma.product_orderSelect>>;
