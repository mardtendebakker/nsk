import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private initProductMiddlewares() {
    /*
      product.price
    */
    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        ['create', 'update'].includes(params.action) &&
        params.args.data?.price
      ) {
        params.args.data.price *= 100;
        return await next(params);
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        ['findFirst', 'findUnique'].includes(params.action) &&
        (params.args.select?.price || params.args.include?.price)
      ) {
        const product = await next(params);
        return {
          ...product,
          ...{ price: (product.price || 0) / 100 },
        };
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        params.action == 'findMany' &&
        (params.args.select?.price || params.args.include?.price)
      ) {
        const products = await next(params);
        return products.map((product) => ({
          ...product,
          ...{ price: (product.price || 0) / 100 },
        }));
      }
      return next(params);
    });
  }

  private initProductProductOrderMiddlewares() {
    /*
      product.product_order.price
    */
    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        ['create', 'update'].includes(params.action) &&
        params.args.data.product_order
      ) {
        for (let i = 0; i < params.args.data.product_order.length; i++) {
          const pOrder = params.args.data.product_order[i];
          if (pOrder.price) {
            params.args.data.product_order[i].price *= 100;
          }
        }
        return await next(params);
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        params.action == 'findMany' &&
        (params.args.select?.product_order?.select?.price ||
          params.args.select?.product_order?.include?.price ||
          params.args.include?.product_order?.select?.price ||
          params.args.include?.product_order?.include?.price)
      ) {
        const products = await next(params);
        return products.map((product) => ({
          ...product,
          ...(product.product_order && {
            product_order: product.product_order.map((pOrder) => {
              return {
                ...pOrder,
                ...{ price: (pOrder.price ?? 0) / 100 },
              };
            }),
          }),
        }));
      }
      return next(params);
    });
  }

  private initProductProductOrderAServiceMiddlewares() {
    /*
      product.product_order.aservice.price
    */
    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        ['create', 'update'].includes(params.action) &&
        params.args.data.product_order
      ) {
        for (let i = 0; i < params.args.data.product_order.length; i++) {
          const pOrder = params.args.data.product_order[i];
          for (let j = 0; j < pOrder?.aservice.length; j++) {
            const service = pOrder.aservice[j];
            if (service.price) {
              params.args.data.product_order[i].aservice[j].price *= 100;
            }
          }
        }
        return await next(params);
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (
        params.model == 'product' &&
        params.action == 'findMany' &&
        (params.args.select?.product_order?.select?.aservice?.select?.price ||
          params.args.select?.product_order?.select?.aservice?.include?.price ||
          params.args.select?.product_order?.include?.aservice?.select?.price ||
          params.args.select?.product_order?.include?.aservice?.include
            ?.price ||
          params.args.include?.product_order?.select?.aservice?.select?.price ||
          params.args.include?.product_order?.select?.aservice?.include
            ?.price ||
          params.args.include?.product_order?.include?.aservice?.select
            ?.price ||
          params.args.include?.product_order?.include?.aservice?.include?.price)
      ) {
        const products = await next(params);
        return products.map((product) => ({
          ...product,
          ...(product.product_order && {
            product_order: product.product_order.map((pOrder) => ({
              ...pOrder,
              ...(pOrder.aservice && {
                aservice: pOrder.aservice.map((service) => ({
                  ...service,
                  ...{ price: (service.price ?? 0) / 100 },
                })),
              }),
            })),
          }),
        }));
      }
      return next(params);
    });
  }

  private initAOrderProductOrderMiddlewares() {
    /**
     * aorder.product_order.price
     */
    this.$use(async (params, next) => {
      if (
        params.model == 'aorder' &&
        params.action == 'findMany' &&
        (params.args.select?.product_order?.select?.price ||
          params.args.select?.product_order?.include?.price ||
          params.args.include?.product_order?.select?.price ||
          params.args.include?.product_order?.include?.price)
      ) {
        const aorders = await next(params);
        return aorders.map((aorder) => ({
          ...aorder,
          ...(aorder.product_order && {
            product_order: aorder.product_order.map((pOrder) => {
              return {
                ...pOrder,
                ...{ price: (pOrder.price ?? 0) / 100 },
              };
            }),
          }),
        }));
      }
      return next(params);
    });
  }

  private initAOrderProductOrderProductMiddlewares() {
    /*
      aorder.product_order.product.price
    */
    this.$use(async (params, next) => {
      if (
        params.model == 'aorder' &&
        params.action == 'findMany' &&
        (params.args.select?.product_order?.select?.product?.select?.price ||
          params.args.select?.product_order?.select?.product?.include?.price ||
          params.args.select?.product_order?.include?.product?.select?.price ||
          params.args.select?.product_order?.include?.product?.include?.price ||
          params.args.include?.product_order?.select?.product?.select?.price ||
          params.args.include?.product_order?.select?.product?.include?.price ||
          params.args.include?.product_order?.include?.product?.select?.price ||
          params.args.include?.product_order?.include?.product?.include?.price)
      ) {
        const aorders = await next(params);
        return aorders.map((aorder) => ({
          ...aorder,
          ...(aorder.product_order && {
            product_order: aorder.product_order.map((pOrder) => {
              return {
                ...pOrder,
                ...(pOrder.product && {
                  product: {
                    ...pOrder.product,
                    ...{ price: (pOrder.product.price ?? 0) / 100 },
                  },
                }),
              };
            }),
          }),
        }));
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (
        params.model == 'aorder' &&
        ['findFirst', 'findUnique'].includes(params.action) &&
        (params.args.select?.product_order?.select?.product?.select?.price ||
          params.args.select?.product_order?.select?.product?.include?.price ||
          params.args.select?.product_order?.include?.product?.select?.price ||
          params.args.select?.product_order?.include?.product?.include?.price ||
          params.args.include?.product_order?.select?.product?.select?.price ||
          params.args.include?.product_order?.select?.product?.include?.price ||
          params.args.include?.product_order?.include?.product?.select?.price ||
          params.args.include?.product_order?.include?.product?.include?.price)
      ) {
        const aorder = await next(params);

        return {
          ...aorder,
          ...(aorder.product_order && {
            product_order: aorder.product_order.map((pOrder) => {
              return {
                ...pOrder,
                ...(pOrder.product && {
                  product: {
                    ...pOrder.product,
                    ...{ price: (pOrder.product.price ?? 0) / 100 },
                  },
                }),
              };
            }),
          }),
        };
      }
      return next(params);
    });
  }

  constructor() {
    super();
    // TODO: prisma middleware for updateAt
    /*
      Solves the Do not know how to serialize a BigInt issue
    */
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };

    this.initProductMiddlewares();
    this.initProductProductOrderMiddlewares();
    this.initProductProductOrderAServiceMiddlewares();
    this.initAOrderProductOrderMiddlewares();
    this.initAOrderProductOrderProductMiddlewares();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
