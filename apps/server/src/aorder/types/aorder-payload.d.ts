import { Prisma } from "@prisma/client";

export type AOrderPayload = Partial<Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>>;
