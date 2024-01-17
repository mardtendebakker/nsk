import { Prisma } from "@prisma/client";

export type ContactPayload = Prisma.contactGetPayload<Record<'select', Prisma.contactSelect>>;
export type ContactSelect = ContactPayload & {
  contact?: ContactPayload
};
