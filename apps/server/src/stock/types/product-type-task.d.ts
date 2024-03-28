import { Prisma } from '@prisma/client';

export type ProductTypeTask = Prisma.product_type_taskGetPayload<Record<'include', Prisma.product_type_taskInclude>>;
