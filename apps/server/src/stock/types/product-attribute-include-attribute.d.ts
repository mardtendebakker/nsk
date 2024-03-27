import { Prisma } from '@prisma/client';

export type ProductAttributeIncludeAttribute =
Partial<Prisma.product_attributeGetPayload<Record<'include', Prisma.product_attributeInclude>>>;
