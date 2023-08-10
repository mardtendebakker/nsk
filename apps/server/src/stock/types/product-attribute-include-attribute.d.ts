import { Prisma } from "@prisma/client";

export type ProductAttributeIncludeAttribute = Prisma.product_attributeGetPayload<Record<'include', Prisma.product_attributeInclude>>;
