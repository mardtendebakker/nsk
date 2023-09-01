import { Prisma } from "@prisma/client";

export type ProductTypeRelation = Prisma.product_typeGetPayload<Record<'select', Prisma.product_typeSelect>>;
