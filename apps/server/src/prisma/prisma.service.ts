import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit {
  constructor() {
    super();
    // TODO: prisma middleware for updateAt
    /*
      Solves the Do not know how to serialize a BigInt issue
    */
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };
  }

  async onModuleInit() {
    await this.$connect();

    const multiplyPriceBy100 = <T extends { [key: string]: any }>(obj: T): T => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (key === 'price' && Number.isFinite(value)) {
            obj[key] = Math.floor(value * 100) as T[Extract<keyof T, string>];
          } else if (typeof value === 'object') {
            obj[key] = multiplyPriceBy100(value);
          }
        }
      }
      return obj;
    };

    const dividePriceBy100 = <T extends { [key: string]: any }>(obj: T): T => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (key === 'price') {
            if (Number.isFinite(value)) {
              obj[key] = Number((value / 100).toFixed(2)) as T[Extract<keyof T, string>];
            } else {
              obj[key] = 0 as T[Extract<keyof T, string>];
            }
          } else if (typeof value === 'object') {
            obj[key] = dividePriceBy100(value);
          }
        }
      }
      return obj;
    };

    Object.assign(
      this,
      this.$extends({
        query: {
          async $allOperations({
            model, operation, args, query,
          }) {
            if (
              [
                'create',
                'createMany',
                'update',
                'updateMany',
                'upsert',
              ].includes(operation)
            ) {
              args.data = multiplyPriceBy100(args.data);
              const result = await query(args);
              return dividePriceBy100(result);
            }

            if (
              [
                'find',
                'findMany',
                'findFirst',
                'findFirstOrThrow',
                'findUnique',
                'findUniqueOrThrow',
              ].includes(operation)
            ) {
              const result = await query(args);
              return dividePriceBy100(result);
            }

            return query(args);
          },
        },
      }),
    );
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close();
    });
  }
}
