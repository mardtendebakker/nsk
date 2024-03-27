import { Prisma } from '@prisma/client';

export type AttributeGetPayload = Partial<Prisma.attributeGetPayload<Record<'select', Prisma.attributeSelect>>>;
