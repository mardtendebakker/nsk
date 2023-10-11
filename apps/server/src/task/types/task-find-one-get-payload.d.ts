import { Prisma } from "@prisma/client";

export type TaskFindOneGetPayload = Partial<Prisma.taskGetPayload<Record<'select', Prisma.taskSelect>>>;
