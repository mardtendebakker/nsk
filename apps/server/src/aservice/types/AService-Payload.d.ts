import { Prisma } from '@prisma/client';

export type AServicePayload = Prisma.aserviceGetPayload<Record<'include', Prisma.aserviceInclude>>;
