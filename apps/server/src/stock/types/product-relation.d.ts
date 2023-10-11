import { Prisma } from "@prisma/client";

export type ProductRelation = Partial<Prisma.productGetPayload<Record<'select', Prisma.productSelect>>>;
