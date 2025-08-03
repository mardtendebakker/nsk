import { PrismaClient } from '@prisma/client';

// function to give us a prismaClient with extensions we want
export const customPrismaClient = (prismaClient: PrismaClient) => prismaClient;

// Our Custom Prisma Client with the client set to the customPrismaClient with extension
export class PrismaClientExtended extends PrismaClient {
  customPrismaClient: CustomPrismaClient;

  get client() {
    if (!this.customPrismaClient) this.customPrismaClient = customPrismaClient(this);

    return this.customPrismaClient;
  }
}

// Create a type to our funtion
export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;
