import { Prisma } from "@prisma/client";

export type ProductRelation = Prisma.productGetPayload<Record<'select', Prisma.productSelect>>;
