import { Prisma } from '@prisma/client';

export type CompanyGetPayload = Prisma.companyGetPayload<Record<'select', Prisma.companySelect>>;
