import { Prisma } from '@prisma/client';
import { ProductTypeTaskGetPayload } from './product-type-task-get-payload';

type ProductTypeGetPayload = Prisma.product_typeGetPayload<Record<'select', Prisma.product_typeSelect>>;

export type ProductTypeRelation = Omit<
ProductTypeGetPayload,
'product_type_task'
> & {
  product_type_task: ProductTypeTaskGetPayload[];
};
