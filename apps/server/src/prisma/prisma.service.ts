import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    // TODO: prisma middleware for updateAt
    /*
      Solves the Do not know how to serialize a BigInt issue
    */
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };

    this.initPriceMiddleware();
  }

  private initPriceMiddleware() {
    this.$use(async (params, next) => {
      if (
        [
          'create',
          'createMany',
          'update',
          'updateMany',
          'upsert'
        ].includes(params.action)
      ) {
        params.args.data = this.multiplyPriceBy100(params.args.data);
        const result = await next(params);
        return this.dividePriceBy100(result);
      }

      if (
        [
          'find',
          'findMany',
          'findFirst',
          'findFirstOrThrow',
          'findUnique',
          'findUniqueOrThrow',
        ].includes(params.action)
      ) {
        const result = await next(params);
        return this.dividePriceBy100(result);
      }

      return next(params);
    });
  }

  private multiplyPriceBy100<T extends { [key: string]: any }>(obj: T): T {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (key === 'price' && Number.isFinite(value)) {
          obj[key] = (value * 100) as T[Extract<keyof T, string>];
        } else if (typeof value === 'object') {
          obj[key] = this.multiplyPriceBy100(value);
        }
      }
    }
    return obj;
  }

  private dividePriceBy100<T extends { [key: string]: any }>(obj: T): T {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (key === 'price') {
          if (Number.isFinite(value)) {
            obj[key] = (value / 100) as T[Extract<keyof T, string>];
          } else {
            obj[key] = 0 as T[Extract<keyof T, string>];
          }
        } else if (typeof value === 'object') {
          obj[key] = this.dividePriceBy100(value);
        }
      }
    }
    return obj;
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
