import { Prisma } from '@prisma/client';

export type ContactGetPayload = Prisma.contactGetPayload<Record<'include', Prisma.contactInclude>>;
