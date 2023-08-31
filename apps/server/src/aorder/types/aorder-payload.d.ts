import { Prisma } from "@prisma/client";

export type AOrderPayload = Prisma.aorderGetPayload<Record<'select', Prisma.aorderSelect>>;
