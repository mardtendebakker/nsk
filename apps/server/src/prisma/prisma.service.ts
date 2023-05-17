import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    // TODO: prisma middleware for updateAt
    /**
     * product price
    */
    this.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'create' && params.args.data?.price) {
        params.args.data.price *= 100;
        return await next(params);
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (params.model == 'product' && ['findFirst', 'findUnique'].includes(params.action) && 
      (params.args.select?.price || params.args.include?.price)) {
        const product = await next(params);
        return {
          ...product,
          ...{price: ((product.price || 0) / 100)},
        };
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'findMany' &&
      (params.args.select?.price || params.args.include?.price) ) {
        const products = await next(params);
        return products.map(product => ({
          ...product,
          ...{price: ((product.price || 0) / 100)},
        }));
      }
      return next(params);
    });

    /**
     * product_order price
    */
    this.$use(async (params, next) => {
      if (params.model == 'aorder' && params.action == 'findMany' &&
      (
        params.args.select?.product_order?.select?.price
        || params.args.select?.product_order?.include?.price
        || params.args.include?.product_order?.select?.price
        || params.args.include?.product_order?.include?.price
      ) ) {
        const aorders = await next(params);
        return aorders.map(aorder => ({
          ...aorder,
          ...(aorder.product_order && {
            product_order: aorder.product_order.map(pOrder => {
              return {
                ...pOrder,
                ...{price: ((pOrder.price ?? 0) / 100)},
              }
            })
          })
        }));
      }
      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
