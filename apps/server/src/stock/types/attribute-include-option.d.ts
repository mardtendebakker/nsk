import { Prisma } from "@prisma/client";

export type AttributeIncludeOption = Prisma.attributeGetPayload<Record<'include', Prisma.attributeInclude<'attribute_option'>>>;
