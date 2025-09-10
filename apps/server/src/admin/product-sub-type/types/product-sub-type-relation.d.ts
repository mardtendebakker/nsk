import { Prisma } from '@prisma/client';

type ProductSubTypeGetPayload = Prisma.product_typeGetPayload<Record<'select', Prisma.product_sub_typeSelect>>;

export type ProductSubTypeRelation = Omit<
ProductSubTypeGetPayload,
'product_type'
>;
